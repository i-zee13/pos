const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('posDesktop', {
  getInfo: () => ipcRenderer.invoke('desktop:getInfo'),
  savePosUrl: (url) => ipcRenderer.invoke('desktop:savePosUrl', url),
  startLocal: () => ipcRenderer.invoke('desktop:startLocal'),
  retryBoot: () => ipcRenderer.invoke('desktop:retryBoot'),
});
