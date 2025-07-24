import { app } from "electron";
import { exec } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export async function uninstallAndExit() {
  const appExe = app.getPath("exe");
  const appDir = path.dirname(appExe);
  const uninstallExe = path.join(appDir, "Uninstall OfficeLTSC.exe");

  // Crea un script .cmd temporal
  const cmdScript = `
    timeout /t 2 >nul
    start "" "${uninstallExe}" /S
  `;

  const tmpPath = path.join(os.tmpdir(), "auto_uninstall.cmd");
  fs.writeFileSync(tmpPath, cmdScript, "utf8");

  exec(`start "" "${tmpPath}"`, (error) => {
    if (error) {
      console.error("❌ Error lanzando auto-uninstall:", error);
    }
  });

  setTimeout(() => {
    fs.unlink(tmpPath, () => {});
  }, 10000);

  app.quit();
}
