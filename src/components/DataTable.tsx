import { useState } from "react";
import { buscarDados } from "../services/scrapper.service";
import { formatMonthToApiDate } from "../utils/date.util";

export default function Home() {
  const [month, setMonth] = useState("");

  const handleBuscar = async () => {
    if (!month) return;

    const data = formatMonthToApiDate(month);

    const resultado = await buscarDados(data);

    console.log(resultado);
  };

  return (
    <>
      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      />

      <button onClick={handleBuscar}>
        Buscar
      </button>
    </>
  );
}