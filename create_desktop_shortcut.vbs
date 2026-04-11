Set fso = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("WScript.Shell")
desktop = shell.SpecialFolders("Desktop")

scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
exePath = fso.BuildPath(scriptDir, "release\win-unpacked\Quiz Biblique.exe")
workingDir = fso.GetParentFolderName(exePath)
shortcutPath = fso.BuildPath(desktop, "Quiz Biblique.lnk")

If Not fso.FileExists(exePath) Then
	WScript.Echo "Executable introuvable: " & exePath
	WScript.Quit 1
End If

Set shortcut = shell.CreateShortcut(shortcutPath)
shortcut.TargetPath = exePath
shortcut.WorkingDirectory = workingDir
shortcut.IconLocation = exePath & ",0"
shortcut.Description = "Quiz Biblique"
shortcut.Save

WScript.Echo "Raccourci mis a jour: " & shortcutPath
