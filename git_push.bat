@echo off
echo -----------------------------------
echo GitHub Auto-Push wird gestartet...
echo -----------------------------------

:: Prüfen, ob es Änderungen gibt
git status | findstr "Changes not staged for commit" > nul
if %errorlevel%==0 (
    echo Änderungen erkannt! Dateien werden hinzugefügt...
    git add .
    git commit -m "Auto-Update vom %date% %time%"
    echo Dateien werden zu GitHub hochgeladen...
    git push
    echo -----------------------------------
    echo Push abgeschlossen! Deine Website wird bald aktualisiert!
) else (
    echo Keine Änderungen gefunden. Nichts zu pushen.
)

echo Fenster schließt in 5 Sekunden...
timeout /t 5
exit
