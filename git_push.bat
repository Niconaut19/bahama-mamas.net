@echo off
echo -----------------------------------
echo GitHub Auto-Push wird gestartet...
echo -----------------------------------

git add .
git commit -m "Auto-Update vom %date% %time%"
git push

echo -----------------------------------
echo Push abgeschlossen!
echo Fenster schließt in 5 Sekunden...
timeout /t 5
exit
