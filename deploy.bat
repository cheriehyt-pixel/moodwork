@echo off
echo.
echo  Deploying MoodWork to your phone...
echo  ------------------------------------
cd /d "%~dp0"
git add .
set /p msg="  Describe your update (or press Enter to skip): "
if "%msg%"=="" set msg=Update app
git commit -m "%msg%"
git push origin main
echo.
echo  Done! Your phone app will update in about 30 seconds.
echo  ------------------------------------
pause
