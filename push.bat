@echo off
title AI Hub - Git Push to GitHub
cd /d "%~dp0"

echo =======================================================
echo Pushing AI Hub code to https://github.com/ahmadqasimoff/ai-hub.git
echo =======================================================

set "GIT_CMD=C:\Users\MACBOOK\AppData\Local\GitHubDesktop\app-3.6.5\resources\app\git\cmd\git.exe"

if not exist "%GIT_CMD%" (
    set "GIT_CMD=git"
)

"%GIT_CMD%" branch -M main
"%GIT_CMD%" remote set-url origin https://github.com/ahmadqasimoff/ai-hub.git
"%GIT_CMD%" push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo =======================================================
    echo SUCCESS! All code has been pushed to GitHub.
    echo Refresh your GitHub page: https://github.com/ahmadqasimoff/ai-hub
    echo =======================================================
) else (
    echo.
    echo If a browser window opened, please click "Authorize" to complete the push.
    echo Or you can open GitHub Desktop and click "Push origin".
)

pause
