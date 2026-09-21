import type { CSSProperties } from "react";

import { cores, raios } from "../styles/theme";
import type { FalhaConsultaAnual, MesConsultaAnual } from "../types/busca-anual";
import { formatarNomeMes } from "../utils/format.util";

interface PeriodoConsultadoProps {
  meses: MesConsultaAnual[];
  falhas: FalhaConsultaAnual[];
}

const styles = {
  subtitulo: {
    margin: "0 0 10px",
    fontSize: "13px",
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    color: cores.textoTerciario,
  },
  lista: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  chip: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 14px",
    borderRadius: raios.pilula,
    fontSize: "13px",
    fontWeight: 600,
    border: `1px solid ${cores.destaqueBorda}`,
    background: cores.destaqueFundo,
    color: cores.destaqueTexto,
  },
  chipFalha: {
    border: `1px solid ${cores.alertaBorda}`,
    background: cores.alertaFundo,
    color: cores.alerta,
  },
  vazio: {
    margin: 0,
    fontSize: "14px",
    color: cores.textoSecundario,
  },
} satisfies Record<string, CSSProperties>;

/**
 * Meses efetivamente processados pelo backend.
 *
 * A quantidade nunca é assumida: a lista vem inteiramente da resposta, já que é o backend que
 * determina dinamicamente quais meses do ano estão completos.
 *
 * Sucesso e falha se distinguem por ícone e por texto, e não apenas pela cor.
 */
export function PeriodoConsultado({ meses, falhas }: PeriodoConsultadoProps) {
  const vazio = meses.length === 0 && falhas.length === 0;

  return (
    <div>
      <h3 style={styles.subtitulo}>Período consultado</h3>

      {vazio ? (
        <p style={styles.vazio}>Nenhum mês completo no ano corrente.</p>
      ) : (
        <ul style={styles.lista}>
          {meses.map((mes) => (
            <li key={`ok-${mes.mes}`} style={styles.chip}>
              <span aria-hidden="true">✓</span>
              {formatarNomeMes(mes.nomeMes)}
            </li>
          ))}

          {falhas.map((falha) => (
            <li key={`falha-${falha.mes}`} style={{ ...styles.chip, ...styles.chipFalha }}>
              <span aria-hidden="true">⚠</span>
              {formatarNomeMes(falha.nomeMes)} (falhou)
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
