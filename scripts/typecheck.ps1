# scripts/typecheck.ps1
# CONNECT safe wrapper — TypeScript type-check without emitting files
# Usage: powershell -ExecutionPolicy Bypass -File scripts\typecheck.ps1
# Exit code: 0 = no errors, 1 = type errors found

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "== MD Connect — TypeScript Type Check ==" -ForegroundColor Cyan
Write-Host "   (tsc --noEmit — no build output produced)"
Write-Host ""

pnpm type-check

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "TYPE-CHECK PASSED — exit 0" -ForegroundColor Green
    Write-Host ""
}
else {
    Write-Host ""
    Write-Error "TYPE-CHECK FAILED — exit $LASTEXITCODE"
    exit 1
}
