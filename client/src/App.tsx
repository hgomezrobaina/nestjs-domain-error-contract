import LanguageSwitch from "@modules/app/modules/language/components/LanguageSwitch/LanguageSwitch";
import ShipmentDesk from "@modules/shipment/components/ShipmentDesk/ShipmentDesk";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <main>
      <header>
        <h1>Dispatch</h1>
        <LanguageSwitch />
      </header>

      <ShipmentDesk />

      <Toaster />
    </main>
  );
}
