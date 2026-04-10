Set shell = CreateObject("WScript.Shell")
Set desktop = shell.SpecialFolders("Desktop")
shortcutPath = desktop & "\Quiz Biblique.lnk"
Set shortcut = shell.CreateShortcut(shortcutPath)
shortcut.TargetPath = "C:\Users\HP\Desktop\quiz jeu video\release\win-unpacked\Quiz Biblique.exe"
shortcut.WorkingDirectory = "C:\Users\HP\Desktop\quiz jeu video\release\win-unpacked"
shortcut.IconLocation = "C:\Users\HP\Desktop\quiz jeu video\release\win-unpacked\Quiz Biblique.exe,0"
shortcut.Description = "Quiz Biblique"
shortcut.Save
