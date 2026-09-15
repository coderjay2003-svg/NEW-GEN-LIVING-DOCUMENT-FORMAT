@ECHO OFF
SETLOCAL
IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe" "%~dp0\ldocx.js" %*
) ELSE (
  node "%~dp0\ldocx.js" %*
)
