import { useEffect, useState } from "react";

export default function Footer() {
  const [version, setVersion] = useState("");

  useEffect(() => {
    window.ipcRenderer.send("get-version");
    window.ipcRenderer.on("reply-version", (_, value) => {
      setVersion(value);
    });
  }, []);

  return (
    <footer className="w-full flex items-center justify-between text-xs text-gray-400/50">
      <p>
        ®{new Date().getFullYear()} Microsoft Corporation. All rights reserved.
      </p>
      <p>v{version}</p>
    </footer>
  );
}
