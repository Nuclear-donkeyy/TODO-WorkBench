// TypeScript declarations for Electron integration
// This file extends the global Window interface to include Electron APIs

import { IpcRenderer } from 'electron';

declare global {
  interface Window {
    // When nodeIntegration is enabled, require is available in the renderer process
    require?: NodeRequire;
  }

  // Declare NodeRequire to include electron module
  interface NodeRequire {
    (id: 'electron'): {
      ipcRenderer: IpcRenderer;
    };
  }
}

// Export empty object to make this a module
export {};
