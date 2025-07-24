import data from "@databases/configuration.data.json";
import Footer from "@navigation/Footer";
import IMG from "@services/images";
import { GoogleIcon } from "google-icon-react";
import { useState } from "react";

let listAppsInstall: string[] = [];

export default function Configuration() {
  const [appInstall, setAppInstall] = useState<string[]>([]);
  const [language, setLanguage] = useState<string>("es-mx");

  function renderImage(img: string) {
    const image = Object.entries(IMG.pkg).find(([k]) => k === img);
    if (!image) return "";
    return image.pop();
  }

  return (
    <>
      <section className="w-full h-full flex flex-col gap-5">
        <img
          src={IMG.logo}
          alt="logo"
          className="w-28 translate-y-0 opacity-100 transition-all duration-500 starting:translate-y-5 starting:opacity-0"
        />
        <section className="flex flex-col gap-2">
          <label
            htmlFor="language-select"
            className="flex items-center gap-1.5 text-sm text-gray-400"
          >
            <GoogleIcon icon="translate" />
            Selecciona el idioma de las aplicaciones
          </label>
          <select
            defaultValue="es-mx"
            id="language-select"
            className="w-48 h-10 rounded-sm border border-gray-200 bg-white text-gray-700 px-1.5 text-sm font-medium"
            onChange={(e) => {
              setLanguage(e.target.value);
            }}
          >
            <option value="en-us">Ingles (USA)</option>
            <option value="es-mx">Español (México)</option>
            <option value="es-es">Español (España)</option>
          </select>
        </section>
        <section className="flex flex-col gap-2">
          <h2 className="flex items-center gap-1.5 text-sm text-gray-400">
            <GoogleIcon icon="info" />
            Selecciona las aplicaciones a instalar
          </h2>
          <ul className="grid grid-cols-5 gap-2 w-full">
            {data.map((item) => (
              <li key={item.label}>
                <button
                  className="relative w-full h-full flex items-center justify-center transition-all opacity-100 starting:opacity-0 starting:translate-y-5 translate-y-0 border border-gray-100 overflow-hidden rounded-sm duration-500"
                  id="select-app"
                  aria-label={`seleccionar aplicación ${item.label}`}
                  onLoad={(e) => {
                    e.currentTarget.style.setProperty(
                      "--color-render",
                      item.color,
                    );
                  }}
                  onClick={(e) => {
                    const bt = e.currentTarget;
                    const value = bt.textContent?.trim();

                    if (!value) return;

                    if (bt.classList.contains("selected")) {
                      const indexValue = listAppsInstall.indexOf(value);
                      if (indexValue !== -1) {
                        listAppsInstall.splice(indexValue, 1);
                      }
                      bt.classList.remove("selected");
                    } else {
                      listAppsInstall.push(value);
                      bt.classList.add("selected");
                    }

                    setAppInstall([...listAppsInstall]);
                  }}
                >
                  <div
                    className="absolute w-8 h-8 blur-lg -z-10"
                    style={{ backgroundColor: `rgb(${item.color})` }}
                  ></div>
                  <article
                    className="flex flex-col items-center py-5 text-xs font-medium gap-1.5 w-full bg-white/50 transition-colors duration-500"
                    style={{ color: `rgb(${item.color})` }}
                  >
                    <img
                      src={renderImage(item.img)}
                      alt={`imagen de ${item.label}`}
                      className="w-8 h-8"
                    />
                    {item.label}
                  </article>
                </button>
              </li>
            ))}
          </ul>
        </section>
        {appInstall.length > 0 && (
          <div className="flex items-end h-full justify-end w-full">
            <button
              className="bg-blue-500 flex text-sm gap-1.5 items-center py-1 px-3 text-white rounded-sm"
              onClick={() => {
                window.ipcRenderer.send("install", {
                  apps: appInstall,
                  language,
                });
              }}
            >
              Instalar
              <GoogleIcon icon="download" className="text-base font-light" />
            </button>
          </div>
        )}
      </section>
      <Footer />
    </>
  );
}
