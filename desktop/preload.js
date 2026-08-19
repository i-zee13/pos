const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('posDesktop', {
  getInfo: () => ipcRenderer.invoke('desktop:getInfo'),
  savePosUrl: (urlOrOpts) => ipcRenderer.invoke('desktop:savePosUrl', urlOrOpts),
  completeShopSetup: (opts) => ipcRenderer.invoke('desktop:completeShopSetup', opts),
  setForceLocal: (force) => ipcRenderer.invoke('desktop:setForceLocal', force),
  startLocal: () => ipcRenderer.invoke('desktop:startLocal'),
  retryBoot: () => ipcRenderer.invoke('desktop:retryBoot'),
  backupLocalDb: () => ipcRenderer.invoke('desktop:backupLocalDb'),
  openBackupsPage: () => ipcRenderer.invoke('desktop:openBackupsPage'),
});
