@echo off
setlocal enabledelayedexpansion

:: Verificar si el archivo ospp.vbs existe
if not exist "C:\Program Files\Microsoft Office\Office16\ospp.vbs" (
    echo No se encuentra el archivo de comandos "C:\Program Files\Microsoft Office\Office16\ospp.vbs".
    exit /b 1
)

:: Cambiar al directorio donde está ospp.vbs
cd /d "C:\Program Files\Microsoft Office\Office16"

:: Iterar a través de los archivos que coinciden con el patrón y ejecutar cscript
for /f %%x in ('dir /b ..\root\Licenses16\ProPlus2021VL_KMS*.xrm-ms') do (
    cscript ospp.vbs /inslic:"..\root\Licenses16\%%x"
)

:: Ejecutar otros comandos
cscript ospp.vbs /setprt:1688
cscript ospp.vbs /unpkey:6F7TH >nul
cscript ospp.vbs /inpkey:FXYTK-NJJ8C-GB6DW-3DYQT-6F7TH
cscript ospp.vbs /sethst:e8.us.to
cscript ospp.vbs /act

:: Mostrar alerta al finalizar
powershell -Command "Add-Type -AssemblyName PresentationFramework; [System.Windows.MessageBox]::Show('Activate OfficeLTSC is correctly')"

endlocal
