# ==============================================================================
# ToolsBuy — GitHub Push Helper Script
# Target: https://github.com/Ahmadbro1921/toolsbuy.git
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
    & $git remote set-url origin "https://${Token}@github.com/Ahmadbro1921/toolsbuy.git"
} else {
    & $git remote set-url origin "https://github.com/Ahmadbro1921/toolsbuy.git"
}

Write-Host "Pushing main branch to https://github.com/Ahmadbro1921/toolsbuy.git..." -ForegroundColor Green
& $git push -u origin main
