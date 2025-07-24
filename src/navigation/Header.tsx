import { GoogleIcon } from "google-icon-react";

export default function Header() {
  return (
    <header className="w-full flex h-7 min-h-7">
      <nav className="w-full h-full"></nav>
      <GoogleIcon
        icon="close"
        className="min-w-9 flex items-center justify-center h-full text-gray-300 transition-colors duration-200 ease-linear hover:bg-red-500 hover:text-white text-sm"
        onClick={() => window.ipcRenderer.send("close-app")}
      />
    </header>
  );
}
