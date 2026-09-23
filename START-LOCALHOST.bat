@echo off
setlocal
cd /d "%~dp0"

where py >nul 2>nul
if %errorlevel%==0 (
    py -V >nul 2>nul
    if not errorlevel 1 (
        set "PYTHON_COMMAND=py"
        goto :start_server
    )
)

where python >nul 2>nul
if %errorlevel%==0 (
    python -V >nul 2>nul
    if not errorlevel 1 (
        set "PYTHON_COMMAND=python"
        goto :start_server
    )
)

echo.
echo Python was not found. Install Python from https://www.python.org/downloads/
echo Select "Add Python to PATH" during installation, then run this file again.
pause
exit /b 1

:start_server
echo Starting Research Storefront from %CD%
echo Keep this window open while viewing the site.
start "" cmd /c "timeout /t 2 /nobreak >nul & start http://127.0.0.1:9876/"
%PYTHON_COMMAND% -m http.server 9876 --bind 127.0.0.1
echo.
echo Could not start the local server. If port 9876 is in use, close the other server and try again.
pause
