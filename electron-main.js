const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const path = require("path");
const http = require("http");

let mainWindow = null;
let backendProcess = null;

const PORT = 3000;
const APP_URL = `http://127.0.0.1:${PORT}/login.html`;

function getBackendDir() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, "backend");
  }

  return path.join(__dirname, "backend");
}

function startBackend() {
  const backendDir = getBackendDir();
  const serverFile = path.join(backendDir, "server.js");

  backendProcess = spawn(process.execPath, [serverFile], {
    cwd: backendDir,
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: "1"
    },
    stdio: "ignore",
    windowsHide: true
  });

  backendProcess.on("exit", () => {
    backendProcess = null;
  });
}

function waitForBackend(timeoutMs = 20000) {
  return new Promise((resolve, reject) => {
    const startedAt = Date.now();

    function check() {
      const req = http.get(
        `http://127.0.0.1:${PORT}/login.html`,
        res => {
          res.resume();

          if (res.statusCode >= 200 && res.statusCode < 500) {
            resolve();
          } else {
            retry();
          }
        }
      );

      req.on("error", retry);

      req.setTimeout(1000, () => {
        req.destroy();
        retry();
      });
    }

    function retry() {
      if (Date.now() - startedAt >= timeoutMs) {
        reject(new Error("FLOWLY backend did not start in time."));
        return;
      }

      setTimeout(check, 400);
    }

    check();
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    backgroundColor: "#080808",
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadURL(APP_URL);

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function stopBackend() {
  if (backendProcess && !backendProcess.killed) {
    backendProcess.kill();
    backendProcess = null;
  }
}

app.whenReady().then(async () => {
  try {
    startBackend();
    await waitForBackend();
    createWindow();
  } catch (error) {
    console.error(error);
    app.quit();
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("before-quit", () => {
  stopBackend();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});