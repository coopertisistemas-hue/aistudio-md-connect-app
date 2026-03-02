# scripts/edge-smoke.ps1
# MD Connect - Edge Contract Smoke Gate
# Validates edge function response shape { ok, error }
# Usage: powershell -ExecutionPolicy Bypass -File scripts\edge-smoke.ps1
# Exit code: 0 = all checks pass, 1 = any check failed

param(
    [string]$BaseUrl = "http://127.0.0.1:54321",
    [switch]$Verbose
)

$ErrorActionPreference = "Stop"
$failed = 0

function Write-Banner($msg, $color = "Cyan") {
    Write-Host ""
    Write-Host "== $msg ==" -ForegroundColor $color
    Write-Host ""
}

function Test-Command($name) {
    return $null -ne (Get-Command $name -ErrorAction SilentlyContinue)
}

function Write-Test($msg, $color = "White") {
    Write-Host "  $msg" -ForegroundColor $color
}

function Test-ResponseShape($response, $testName, $expectedStatus, $expectOk, $expectError = $false) {
    
    Write-Test "Testing: $testName" "Cyan"
    
    try {
        $json = $response | ConvertFrom-Json
    }
    catch {
        Write-Test "  FAIL: Invalid JSON response" "Red"
        return $false
    }
    
    $pass = $true
    
    if ($response.StatusCode -ne $expectedStatus) {
        Write-Test "  FAIL: Expected status $expectedStatus, got $($response.StatusCode)" "Red"
        $pass = $false
    }
    
    if ($null -eq $json.ok) {
        Write-Test "  FAIL: Missing 'ok' field" "Red"
        $pass = $false
    }
    elseif ($json.ok -ne $expectOk) {
        Write-Test "  FAIL: Expected ok=$expectOk, got $($json.ok)" "Red"
        $pass = $false
    }
    
    if ($expectOk -and $null -eq $json.data) {
        Write-Test "  WARN: ok=true but no 'data' field" "Yellow"
    }
    
    if ($expectError -or (-not $expectOk)) {
        if ($null -eq $json.error) {
            Write-Test "  FAIL: Missing 'error' field" "Red"
            $pass = $false
        }
        elseif ($json.error.GetType().Name -eq "PSCustomObject") {
            if ($null -eq $json.error.code) {
                Write-Test "  FAIL: Missing 'error.code' field" "Red"
                $pass = $false
            }
            if ($null -eq $json.error.message) {
                Write-Test "  FAIL: Missing 'error.message' field" "Red"
                $pass = $false
            }
            if ($pass) {
                Write-Test "  PASS: error.code=$($json.error.code), error.message=$($json.error.message)" "Green"
            }
        }
    }
    else {
        if ($null -ne $json.error -and $json.error -ne $null) {
            Write-Test "  WARN: ok=true but 'error' field is present" "Yellow"
        }
    }
    
    if ($pass -and $expectOk) {
        Write-Test "  PASS: Valid success response" "Green"
    }
    
    return $pass
}

# ── Guard: Check for supabase CLI ─────────────────────────────────────────────
Write-Banner "MD Connect Edge Contract Smoke Gate"

if (-not (Test-Command "supabase")) {
    Write-Host "ERROR: supabase CLI not found." -ForegroundColor Red
    Write-Host "Install via: npm install -g supabase" -ForegroundColor Yellow
    Write-Host "Or start local Supabase: pnpm supabase:start" -ForegroundColor Yellow
    exit 1
}

# ── Check environment ─────────────────────────────────────────────────────────
Write-Banner "Environment Check"

$projectRef = ""
if (Test-Path "supabase/.temp/project-ref") {
    $projectRef = Get-Content "supabase/.temp/project-ref" -Raw
    $projectRef = $projectRef.Trim()
}

if ([string]::IsNullOrEmpty($projectRef)) {
    Write-Host "WARNING: Could not detect local Supabase project." -ForegroundColor Yellow
    Write-Host "Make sure Supabase is running: pnpm supabase:start" -ForegroundColor Yellow
    Write-Host "Using default localhost URL: $BaseUrl" -ForegroundColor Cyan
}
else {
    Write-Host "Local project detected: $projectRef" -ForegroundColor Green
}

# Check if local Supabase is reachable
try {
    $healthCheck = Invoke-RestMethod -Uri "$BaseUrl/health" -Method GET -TimeoutSec 5 -ErrorAction SilentlyContinue
    Write-Host "Local Supabase: REACHABLE" -ForegroundColor Green
}
catch {
    Write-Host "WARNING: Local Supabase not reachable at $BaseUrl" -ForegroundColor Yellow
    Write-Host "Make sure Supabase is running: pnpm supabase:start" -ForegroundColor Yellow
    Write-Host "Or update BaseUrl parameter: -BaseUrl <your-supabase-url>" -ForegroundColor Yellow
    exit 1
}

# ── Test non-destructive endpoints ────────────────────────────────────────────
Write-Banner "Edge Contract Validation"

$serviceRoleKey = ""
if (Test-Path "supabase/.temp/pooler-url") {
    $poolerUrl = Get-Content "supabase/.temp/pooler-url" -Raw
    $poolerUrl = $poolerUrl.Trim()
    # Extract key from pooler URL
    if ($poolerUrl -match "postgres://postgres\.postgresql:(.+)@") {
        $serviceRoleKey = $matches[1]
    }
}

if ([string]::IsNullOrEmpty($serviceRoleKey)) {
    Write-Host "WARNING: Could not auto-detect service_role key." -ForegroundColor Yellow
    Write-Host "Using fallback approach (public endpoints only)." -ForegroundColor Yellow
}

$headers = @{
    "Content-Type" = "application/json"
    "apikey" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlc3QtcHJvamVjdCIsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJpYXQiOjE2NDUxOTIwMDAsImV4cCI6MTk2MDc2ODAwMH0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU"
}

# Test 1: devotionals-get (latest=true - returns data or fallback)
Write-Host ""
Write-Test "Test 1: devotionals-get?latest=true" "Cyan"
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/functions/v1/devotionals-get?latest=true" -Method GET -Headers $headers -TimeoutSec 10
    $passed = Test-ResponseShape $response "devotionals-get success" 200 $true
    if (-not $passed) { $failed++ }
}
catch {
    Write-Test "  FAIL: $($_.Exception.Message)" "Red"
    $failed++
}

# Test 2: devotionals-get?invalid=true (should return error)
Write-Host ""
Write-Test "Test 2: devotionals-get?latest=invalid" "Cyan"
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/functions/v1/devotionals-get?latest=invalid" -Method GET -Headers $headers -TimeoutSec 10
    # This may return success (empty list) or error depending on logic
    Write-Test "  Response status: $($response.StatusCode)" "Yellow"
}
catch {
    Write-Test "  FAIL: $($_.Exception.Message)" "Red"
    $failed++
}

# Test 3: public-monetization-services (non-destructive public endpoint)
Write-Host ""
Write-Test "Test 3: public-monetization-services" "Cyan"
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/functions/v1/public-monetization-services" -Method GET -Headers $headers -TimeoutSec 10
    $passed = Test-ResponseShape $response "public-monetization-services" 200 $true
    if (-not $passed) { $failed++ }
}
catch {
    Write-Test "  FAIL: $($_.Exception.Message)" "Red"
    $failed++
}

# Test 4: Invalid function name (should return proper error)
Write-Host ""
Write-Test "Test 4: invalid-function (should return error)" "Cyan"
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/functions/v1/invalid-function-xyz" -Method GET -Headers $headers -TimeoutSec 10 -ErrorAction SilentlyContinue
    if ($null -ne $response) {
        Write-Test "  Got response status: $($response.StatusCode)" "Yellow"
    }
}
catch {
    Write-Test "  FAIL: $($_.Exception.Message)" "Red"
    $failed++
}

# Test 5: church-series-list (may require church context - test error shape)
Write-Host ""
Write-Test "Test 5: church-series-list (error expected - no church context)" "Cyan"
try {
    $response = Invoke-WebRequest -Uri "$BaseUrl/functions/v1/church-series-list" -Method GET -Headers $headers -TimeoutSec 10
    $passed = Test-ResponseShape $response "church-series-list error" 200 $false $true
    if (-not $passed) { $failed++ }
}
catch {
    Write-Test "  FAIL: $($_.Exception.Message)" "Red"
    $failed++
}

# Test 6: devotionals-generate-cover (validation - missing devotional_id)
Write-Host ""
Write-Test "Test 6: devotionals-generate-cover (validation error)" "Cyan"
try {
    $body = @{} | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "$BaseUrl/functions/v1/devotionals-generate-cover" -Method POST -Headers $headers -Body $body -TimeoutSec 10
    $passed = Test-ResponseShape $response "devotionals-generate-cover validation" 400 $false $true
    if (-not $passed) { $failed++ }
}
catch {
    Write-Test "  FAIL: $($_.Exception.Message)" "Red"
    $failed++
}

# Test 7: generate-verse-commentary (validation - missing fields)
Write-Host ""
Write-Test "Test 7: generate-verse-commentary (validation error)" "Cyan"
try {
    $body = @{ book_id = "gn" } | Convert    $response = Invoke-WebRequest -To-Json
Uri "$BaseUrl/functions/v1/generate-verse-commentary" -Method POST -Headers $headers -Body $body -TimeoutSec 10
    $passed = Test-ResponseShape $response "generate-verse-commentary validation" 400 $false $true
    if (-not $passed) { $failed++ }
}
catch {
    Write-Test "  FAIL: $($_.Exception.Message)" "Red"
    $failed++
}

# Test 8: generate-book-context (validation - missing book_name)
Write-Host ""
Write-Test "Test 8: generate-book-context (validation error)" "Cyan"
try {
    $body = @{} | ConvertTo-Json
    $response = Invoke-WebRequest -Uri "$BaseUrl/functions/v1/generate-book-context" -Method POST -Headers $headers -Body $body -TimeoutSec 10
    $passed = Test-ResponseShape $response "generate-book-context validation" 400 $false $true
    if (-not $passed) { $failed++ }
}
catch {
    Write-Test "  FAIL: $($_.Exception.Message)" "Red"
    $failed++
}

# ── Summary ─────────────────────────────────────────────────────────────────
Write-Banner "Smoke Summary"

if ($failed -eq 0) {
    Write-Host "ALL CONTRACT CHECKS PASSED" -ForegroundColor Green
    Write-Host "Edge functions return standardized { ok, error } shape" -ForegroundColor Green
    exit 0
}
else {
    Write-Host "$failed contract check(s) FAILED" -ForegroundColor Red
    Write-Host "Review output above for details" -ForegroundColor Yellow
    exit 1
}
