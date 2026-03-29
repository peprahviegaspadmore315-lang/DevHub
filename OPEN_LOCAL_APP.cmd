@echo off
setlocal
title Open Local App Launcher

echo Starting Learning Platform launcher...
echo.

where pwsh >nul 2>nul
if %errorlevel%==0 (
  pwsh -NoProfile -ExecutionPolicy Bypass -File "%~dp0OPEN_LOCAL_APP.ps1"
) else (
  powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0OPEN_LOCAL_APP.ps1"
)

set "EXIT_CODE=%errorlevel%"

if not "%EXIT_CODE%"=="0" (
  echo.
  echo The launcher stopped with exit code %EXIT_CODE%.
  echo If you clicked this file inside VS Code, that only opens the file and does not run it.
  echo To actually launch the app, double-click this file in Windows File Explorer
  echo or run the "Open Local App" profile from VS Code Run and Debug.
  echo.
  pause
)

endlocal & exit /b %EXIT_CODE%
