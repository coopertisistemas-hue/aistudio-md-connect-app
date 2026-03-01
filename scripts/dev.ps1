# scripts/dev.ps1
# CONNECT safe wrapper — pnpm install (if needed) then pnpm dev
# Usage: powershell -ExecutionPolicy Bypass -File scripts\dev.ps1

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "== MD Connect — Dev Server ==" -ForegroundColor Cyan
Write-Host ""

# Verify node_modules exists and is reasonably populated
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
Write-Host "Starting Vite dev server at http://localhost:5173 ..." -ForegroundColor Cyan
Write-Host ""
pnpm dev
