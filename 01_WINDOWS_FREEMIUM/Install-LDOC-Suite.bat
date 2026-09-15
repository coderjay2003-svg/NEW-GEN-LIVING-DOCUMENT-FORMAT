@echo off
setlocal enabledelayedexpansion
title LDOC Freemium Suite — Windows 1-Click Installer
echo ========================================================
echo   LDOC FREEMIUM SUITE — WINDOWS 1-CLICK INSTALLER
echo   Installs: LDOC Viewer, LDOC Editor, and LDOCX SDK
echo ========================================================
echo.

net session >nul 2>&1
if %errorlevel% == 0 (
    set "INSTALL_DIR=%ProgramFiles%\LDOC Freemium Suite"
    echo [*] Running with Administrator privileges. Target: !INSTALL_DIR!
) else (
    set "INSTALL_DIR=%ProgramFiles%\LDOC Freemium Suite"
    echo [*] NOTE: For full system-wide installation to C:\Program Files, run Setup-LDOC-Freemium-Suite.exe
    echo [*] or run this script as Administrator.
)
mkdir "%INSTALL_DIR%\Viewer" 2>nul
mkdir "%INSTALL_DIR%\Editor" 2>nul
mkdir "%INSTALL_DIR%\SDK" 2>nul

echo [*] Copying LDOC Viewer...
xcopy /s /e /y /q "%~dp0LDOC-Viewer-Windows\*" "%INSTALL_DIR%\Viewer\" >nul

echo [*] Copying LDOC Editor & Converter...
xcopy /s /e /y /q "%~dp0LDOC-Editor-Converter-Windows\*" "%INSTALL_DIR%\Editor\" >nul

echo [*] Copying LDOCX SDK...
xcopy /s /e /y /q "%~dp0LDOC-SDK-Windows\*" "%INSTALL_DIR%\SDK\" >nul

echo [*] Registering LDOCX SDK CLI tools into user PATH...
set "SDK_BIN=%INSTALL_DIR%\SDK\bin"
powershell -NoProfile -ExecutionPolicy Bypass -Command "$cur = [Environment]::GetEnvironmentVariable('Path', 'User'); if ($cur -notlike '*%SDK_BIN%*') { [Environment]::SetEnvironmentVariable('Path', $cur + ';%SDK_BIN%', 'User') }"

echo [*] Registering file associations (.ldoc and .ldocx)...
reg add "HKCU\Software\Classes\.ldoc" /ve /d "LDOC.Document" /f >nul 2>&1
reg add "HKCU\Software\Classes\.ldocx" /ve /d "LDOC.Document" /f >nul 2>&1
reg add "HKCU\Software\Classes\LDOC.Document" /ve /d "Living Document" /f >nul 2>&1
reg add "HKCU\Software\Classes\LDOC.Document\DefaultIcon" /ve /d "%INSTALL_DIR%\Viewer\app.ico" /f >nul 2>&1
reg add "HKCU\Software\Classes\LDOC.Document\shell\open\command" /ve /d ""%INSTALL_DIR%\Viewer\Launch_LDOC_Viewer.bat" "%%1"" /f >nul 2>&1
reg add "HKCU\Software\Classes\LDOC.Document\shell\edit\command" /ve /d ""%INSTALL_DIR%\Editor\Launch_LDOC_Editor.bat" "%%1"" /f >nul 2>&1

echo [*] Creating Desktop shortcuts...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ws = New-Object -ComObject WScript.Shell; $d = [Environment]::GetFolderPath('Desktop'); $s1 = $ws.CreateShortcut((Join-Path $d 'LDOC Viewer.lnk')); $s1.TargetPath = '%INSTALL_DIR%\Viewer\Launch_LDOC_Viewer.bat'; $s1.IconLocation = '%INSTALL_DIR%\Viewer\app.ico'; $s1.Save(); $s2 = $ws.CreateShortcut((Join-Path $d 'LDOC Editor & Converter.lnk')); $s2.TargetPath = '%INSTALL_DIR%\Editor\Launch_LDOC_Editor.bat'; $s2.IconLocation = '%INSTALL_DIR%\Editor\app.ico'; $s2.Save()"

echo.
echo ========================================================
echo   [OK] LDOC Freemium Suite Installed Successfully!
echo   ------------------------------------------------------
echo   1. LDOC Viewer: Desktop shortcut created
echo   2. LDOC Editor & Converter: Desktop shortcut created
echo   3. LDOCX SDK: CLI tools ('ldoc', 'ldocx') added to PATH
echo   4. Double-click any .ldocx document to view instantly!
echo ========================================================
echo.
pause
