import { app, BrowserWindow, ipcMain } from "electron";
import { exec } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import reply from "./reply";
import { uninstallAndExit } from "./uninstall";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

const route = import.meta.env.DEV ? "" : "resources";
const routeCommands = path.join(process.cwd(), route, "commands");

if (fs.existsSync(path.join(routeCommands, "package", "config.xml"))) {
  fs.rmSync(path.join(routeCommands, "package", "config.xml"));
}

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "favicon.ico"),
    width: 600,
    height: 450,
    resizable: false,
    title: "Office LTSC",
    titleBarStyle: "hidden",
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      devTools: import.meta.env.DEV ? true : false,
    },
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

ipcMain.on("get-version", (event) => {
  reply(event, "version", app.getVersion());
});

ipcMain.on("close-app", () => {
  app.quit();
});

ipcMain.on("install", (_, command) => {
  win?.hide();

  const { apps, language } = command as { apps: string[]; language: string };

  const architecture = process.arch === "x64" ? "64" : "32";

  const allApps = ["Excel", "Word", "PowerPoint", "Teams", "Access"];

  const listExcludeApps: string[] = [];

  allApps.map((i) => {
    !apps.includes(i) && listExcludeApps.push(`<ExcludeApp ID="${i}" />`);
  });

  const xml = `
<Configuration ID="70d89742-048a-42f5-8ac4-89040751dc25">
  <Add OfficeClientEdition="${architecture}" Channel="Current" MigrateArch="TRUE">
    <Product ID="O365ProPlusRetail">
      <Language ID="${language}" />
      <Language ID="MatchPreviousMSI" />
      <ExcludeApp ID="Groove" />
      <ExcludeApp ID="Lync" />
      <ExcludeApp ID="OneDrive" />
      <ExcludeApp ID="OneNote" />
      <ExcludeApp ID="Outlook" />
      <ExcludeApp ID="Publisher" />
      ${listExcludeApps.join("\n      ")}
    </Product>
  </Add>
  <Updates Enabled="TRUE" />
  <RemoveMSI />
  <AppSettings>
    <User Key="software\\microsoft\\office\\16.0\\excel\\options" Name="defaultformat" Value="51" Type="REG_DWORD" App="excel16" Id="L_SaveExcelfilesas" />
    <User Key="software\\microsoft\\office\\16.0\\powerpoint\\options" Name="defaultformat" Value="27" Type="REG_DWORD" App="ppt16" Id="L_SavePowerPointfilesas" />
    <User Key="software\\microsoft\\office\\16.0\\word\\options" Name="defaultformat" Value="" Type="REG_SZ" App="word16" Id="L_SaveWordfilesas" />
  </AppSettings>
  <Display Level="Full" AcceptEULA="TRUE" />
</Configuration>
`;

  const routePackages = path.join(routeCommands, "packages");
  fs.writeFileSync(path.join(routePackages, "config.xml"), xml);

  const commandInstall = path.join(routePackages, "install.cmd");
  const commandActivate = path.join(
    routeCommands,
    "windows",
    `${architecture}.cmd`,
  );

  function activateOffice() {
    console.log("running activate command");
    exec(`"${commandActivate}"`, async (error, _, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        win?.show();
        return;
      }
      if (stderr) {
        console.error(`Command error output: ${stderr}`);
        win?.show();
        return;
      }
      console.log("Office activated successfully");
      import.meta.env.DEV ? app.quit() : uninstallAndExit();
    });
  }

  console.log("running install command");
  exec(
    `"${commandInstall}"`,
    {
      cwd: routePackages,
    },
    (error, _, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        win?.show();
        return;
      }
      if (stderr) {
        console.error(`Command error output: ${stderr}`);
        win?.show();
        return;
      }
      console.log("Office installed successfully");
      activateOffice();
    },
  );
});

app.whenReady().then(createWindow);
