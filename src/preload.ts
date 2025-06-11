import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('testAPI', {
  testAPI: (msg: string) => ipcRenderer.send('test', msg),
});
