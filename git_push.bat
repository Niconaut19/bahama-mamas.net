@echo off
echo Prüfe auf Änderungen...

:: Checke ob es Änderungen gibt
git diff-index --quiet HEAD --

if %errorlevel% equ 0 (
    echo Keine Änderungen gefunden. Nichts zu pushen.
) else (
    echo Änderungen gefunden. Push wird gestartet...
    git add .
    git commit -m "Website Update"
    git push origin main --force
    echo Push abgeschlossen! Deine Website wird bald aktualisiert!
)

timeout /t 5 /nobreak > NUL
exit

