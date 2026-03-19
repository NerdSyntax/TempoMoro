$wshell = New-Object -ComObject WScript.Shell
$shortcut = $wshell.CreateShortcut("C:\Users\joseo\Desktop\ZeroDistract.lnk")
$shortcut.TargetPath = "C:\Users\joseo\.gemini\antigravity\scratch\hardcore-pomodoro\release\ZeroDistract-win32-x64\ZeroDistract.exe"
$shortcut.WorkingDirectory = "C:\Users\joseo\.gemini\antigravity\scratch\hardcore-pomodoro\release\ZeroDistract-win32-x64"
$shortcut.Save()
