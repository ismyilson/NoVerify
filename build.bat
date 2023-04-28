@echo off

set BUILD_DIR="build\"
set SRC_DIR="src\"

title Builder
set /p "browser=What browser to build for? "
echo Building for %browser%

if not exist %browser%\ (
	goto :NOEXIST
)

if exist %BUILD_DIR% (
	@RD /s /q %BUILD_DIR%
)

xcopy /s /q %SRC_DIR% %BUILD_DIR%
xcopy /s /q %browser% %BUILD_DIR%

goto :EXIT

:NOEXIST
echo %browser% is not valid
goto :EXIT

:EXIT
pause
exit