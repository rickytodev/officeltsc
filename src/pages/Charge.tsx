import IMG from "@services/images";
import { useEffect } from "react";
import Configuration from "./Configuration";

type Props = {
  render: (c: React.ReactNode) => void;
};

export default function Charge({ render }: Props) {
  useEffect(() => {
    const logo = document.getElementById("render-logo-microsoft");

    if (!(logo instanceof HTMLImageElement)) return;

    setTimeout(() => {
      logo.classList.add("logo-microsoft-animation");
      setTimeout(() => render(<Configuration />), 1000);
    }, 2000);
  }, []);

  return (
    <div className="w-full flex items-center justify-center h-full">
      <img
        src={IMG.logo}
        alt="logo de microsoft con texto"
        className="w-60 transition-all duration-1000 ease-in-out starting:opacity-0 starting:translate-y-5 opacity-100 translate-y-0"
        id="render-logo-microsoft"
      />
    </div>
  );
}
