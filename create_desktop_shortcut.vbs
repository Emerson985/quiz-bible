Set fso = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("WScript.Shell")
desktop = shell.SpecialFolders("Desktop")

scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
exePath = fso.BuildPath(scriptDir, "release\win-unpacked\Quiz Biblique.exe")
iconPath = fso.BuildPath(scriptDir, "release\.icon-ico\icon.ico")
workingDir = fso.GetParentFolderName(exePath)
shortcutPath = fso.BuildPath(desktop, "Quiz Biblique.lnk")

If Not fso.FileExists(exePath) Then
	WScript.Echo "Executable introuvable: " & exePath
	WScript.Quit 1
End If

Set shortcut = shell.CreateShortcut(shortcutPath)
shortcut.TargetPath = exePath
shortcut.WorkingDirectory = workingDir
If fso.FileExists(iconPath) Then
	shortcut.IconLocation = iconPath & ",0"
Else
	shortcut.IconLocation = exePath & ",0"
End If
shortcut.Description = "Quiz Biblique"
shortcut.Save

WScript.Echo "Raccourci mis a jour: " & shortcutPath
