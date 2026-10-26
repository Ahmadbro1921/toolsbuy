# ==============================================================================
# AI Hub — GitHub Push Helper Script
# ==============================================================================
# If Git Credential Manager prompts in your browser, simply click "Authorize".
# If you prefer to push using a GitHub Personal Access Token (PAT), run:
#   .\scripts\push-to-github.ps1 -Token "ghp_yourPersonalAccessToken"
# ==============================================================================

param(
    [string]$Token = ""
)

$git = "C:\Users\MACBOOK\AppData\Local\GitHubDesktop\app-3.6.5\resources\app\git\cmd\git.exe"
if (-not (Test-Path $git)) {
    $git = "git"
}

if ($Token) {
    Write-Host "Configuring remote with Personal Access Token..." -ForegroundColor Cyan
    & $git remote set-url origin "https://${Token}@github.com/ahmadqasimoff/ai-hub.git"
} else {
    & $git remote set-url origin "https://github.com/ahmadqasimoff/ai-hub.git"
}

Write-Host "Pushing main branch to https://github.com/ahmadqasimoff/ai-hub.git..." -ForegroundColor Green
& $git push -u origin main
