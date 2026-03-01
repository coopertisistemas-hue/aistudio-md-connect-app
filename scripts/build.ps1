# scripts/build.ps1
# CONNECT safe wrapper — pnpm install (if needed) then pnpm build
# Usage: powershell -ExecutionPolicy Bypass -File scripts\build.ps1
# Exit code: 0 = success, 1 = failure

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "== MD Connect — Production Build ==" -ForegroundColor Cyan
Write-Host ""

# Verify node_modules exists
if (-not (Test-Path "node_modules") -or -not (Test-Path "node_modules\.modules.yaml")) {
    Write-Host "node_modules not found or incomplete — running pnpm install..." -ForegroundColor Yellow
    pnpm install
    if ($LASTEXITCODE -ne 0) {
        Write-Error "pnpm install failed (exit $LASTEXITCODE)"
        exit 1
    }
    Write-Host "pnpm install complete." -ForegroundColor Green
}
else {
    Write-Host "node_modules present — skipping install." -ForegroundColor Green
}

Write-Host ""
Write-Host "Running pnpm build (tsc + vite)..." -ForegroundColor Cyan
Write-Host ""

pnpm build

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "BUILD PASSED — exit 0" -ForegroundColor Green
    Write-Host ""
}
else {
    Write-Host ""
    Write-Error "BUILD FAILED — exit $LASTEXITCODE"
    exit 1
}
