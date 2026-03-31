# Run from repo root after creating an EMPTY repo named "portfolio" on your GitHub account.
# https://github.com/new  (no README / .gitignore from GitHub)

Set-Location (Split-Path $PSScriptRoot -Parent)
Write-Host "Pushing branch main to origin..."
git push -u origin main
if ($LASTEXITCODE -ne 0) {
  Write-Host "`nIf push failed: sign in to GitHub (browser or PAT), or fix remote:" -ForegroundColor Yellow
  Write-Host '  git remote -v' -ForegroundColor Gray
  Write-Host '  git remote set-url origin https://github.com/YOUR_USER/portfolio.git' -ForegroundColor Gray
}
