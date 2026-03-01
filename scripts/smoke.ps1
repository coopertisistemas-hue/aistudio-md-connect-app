# scripts/smoke.ps1
# MD Connect — Full smoke gate (type-check + build)
# Usage: powershell -ExecutionPolicy Bypass -File scripts\smoke.ps1
# Exit code: 0 = all gates pass, 1 = any gate failed

param(
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

# ── Guard: pnpm must exist ──────────────────────────────────────────────────
Write-Banner "MD Connect — Smoke Gate"

if (-not (Test-Command "pnpm")) {
    Write-Host "ERROR: pnpm not found. Install via: npm install -g pnpm@10.30.3" -ForegroundColor Red
    exit 1
}

$pnpmVersion = (pnpm -v)
Write-Host "pnpm  : $pnpmVersion" -ForegroundColor Green
Write-Host "node  : $(node -v)" -ForegroundColor Green

# ── Gate 1: pnpm type-check ─────────────────────────────────────────────────
Write-Banner "Gate 1: pnpm type-check (tsc -b --noEmit)"

pnpm type-check
$tcExit = $LASTEXITCODE

if ($tcExit -eq 0) {
    Write-Host "TYPE-CHECK PASSED" -ForegroundColor Green
}
else {
    Write-Host "TYPE-CHECK FAILED (exit $tcExit)" -ForegroundColor Red
    $failed++
}

# ── Gate 2: pnpm build ──────────────────────────────────────────────────────
Write-Banner "Gate 2: pnpm build (tsc -b + vite)"

pnpm build
$buildExit = $LASTEXITCODE

if ($buildExit -eq 0) {
    Write-Host "BUILD PASSED" -ForegroundColor Green
}
else {
    Write-Host "BUILD FAILED (exit $buildExit)" -ForegroundColor Red
    $failed++
}

# ── Summary ─────────────────────────────────────────────────────────────────
Write-Banner "Smoke Summary"

if ($failed -eq 0) {
    Write-Host "ALL GATES PASSED — safe to commit" -ForegroundColor Green
    exit 0
}
else {
    Write-Host "$failed gate(s) FAILED — do NOT commit" -ForegroundColor Red
    exit 1
}
