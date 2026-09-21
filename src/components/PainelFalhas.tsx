import type { CSSProperties } from "react";

import { cores, raios } from "../styles/theme";
import type { FalhaConsultaAnual } from "../types/busca-anual";
import { formatarNomeMes } from "../utils/format.util";

interface PainelFalhasProps {
  falhas: FalhaConsultaAnual[];
}

const styles = {
  painel: {
    padding: "18px 22px",
    borderRadius: raios.medio,
    border: `1px solid ${cores.alertaBorda}`,
    background: cores.alertaFundo,
  },
  titulo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    margin: "0 0 10px",
    fontSize: "15px",
    fontWeight: 700,
    color: cores.alerta,
  },
  lista: {
    margin: 0,
    paddingLeft: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    fontSize: "14px",
    color: cores.textoSecundario,
    lineHeight: 1.5,
  },
  observacao: {
    margin: "10px 0 0",
    fontSize: "14px",
    color: cores.textoSecundario,
  },
} satisfies Record<string, CSSProperties>;

/**
 * Falhas parciais da consulta anual.
 *
 * Uma falha em um mês não invalida os demais: os dados válidos continuam sendo exibidos e o
 * download permanece disponível. Este painel apenas deixa explícito que a planilha sairá sem os
 * meses listados.
 */
export function PainelFalhas({ falhas }: PainelFalhasProps) {
  if (falhas.length === 0) {
    return null;
  }

  return (
    <section style={styles.painel} aria-labelledby="consulta-anual-falhas">
      <h3 id="consulta-anual-falhas" style={styles.titulo}>
        <span aria-hidden="true">⚠</span>
        {falhas.length === 1
          ? "1 mês não pôde ser consultado"
          : `${falhas.length} meses não puderam ser consultados`}
      </h3>

      <ul style={styles.lista}>
        {falhas.map((falha) => (
          <li key={falha.mes}>
            <strong>{formatarNomeMes(falha.nomeMes)}</strong> — {falha.motivo}
          </li>
        ))}
      </ul>

      <p style={styles.observacao}>
        A planilha pode ser baixada, mas ficará sem os dados desses meses.
      </p>
    </section>
  );
}
