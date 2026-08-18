; Soften locked-file / close-app failures during upgrade.
!macro customInit
  ; Kill leftover Electron / Storeeo processes so uninstall/upgrade can replace files.
  nsExec::ExecToLog 'taskkill /F /IM "Storeeo POS.exe" /T'
  nsExec::ExecToLog 'taskkill /F /IM electron.exe /T'
!macroend

!macro customUnInit
  nsExec::ExecToLog 'taskkill /F /IM "Storeeo POS.exe" /T'
  nsExec::ExecToLog 'taskkill /F /IM electron.exe /T'
!macroend
