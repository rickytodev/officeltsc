import Header from "@navigation/Header";
import Charge from "@pages/Charge";
import { useEffect, useState } from "react";

function App() {
  const [component, setComponent] = useState<React.ReactNode>();

  useEffect(() => {
    setComponent(<Charge render={setComponent} />);
  }, []);

  return (
    <>
      <Header />
      <main className="w-full h-full flex flex-col p-5 gap-5">{component}</main>
    </>
  );
}

export default App;
