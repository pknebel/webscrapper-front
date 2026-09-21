import { useMemo } from "react";
import type { CSSProperties } from "react";

import { cores, raios } from "../styles/theme";
import type { MesConsultaAnual } from "../types/busca-anual";
import { DESCRICAO_TOTAL, calcularTotalDoMes, montarLinhasDoMes } from "../utils/categorias.util";
import {
  formatarDataISO,
  formatarMoeda,
  formatarNomeMes,
  formatarQuantidade,
} from "../utils/format.util";

interface TabelaMesProps {
  mes: MesConsultaAnual;
}

const styles = {
  cartao: {
    border: `1px solid ${cores.borda}`,
    borderRadius: raios.medio,
    background: cores.superficie,
    overflow: "hidden",
  },
  cabecalho: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "wrap",
    padding: "14px 18px",
    background: cores.destaqueFundo,
    borderBottom: `1px solid ${cores.destaqueBorda}`,
  },
  titulo: {
    margin: 0,
    fontSize: "16px",
    fontWeight: 700,
    color: cores.texto,
  },
  periodo: {
    fontSize: "13px",
    color: cores.textoSecundario,
  },
  scroll: {
    overflowX: "auto",
    width: "100%",
  },
  tabela: {
    width: "100%",
    minWidth: "460px",
    borderCollapse: "collapse",
    background: cores.superficie,
  },
  th: {
    padding: "10px 18px",
    background: cores.superficieSuave,
    color: cores.texto,
    fontSize: "13px",
    fontWeight: 700,
    textAlign: "left",
    borderBottom: `1px solid ${cores.borda}`,
    whiteSpace: "nowrap",
  },
  celulaDescricao: {
    padding: "10px 18px",
    fontSize: "14px",
    fontWeight: 400,
    color: cores.texto,
    textAlign: "left",
    borderBottom: `1px solid ${cores.superficieSuave}`,
    whiteSpace: "nowrap",
  },
  celula: {
    padding: "10px 18px",
    fontSize: "14px",
    color: cores.textoSecundario,
    borderBottom: `1px solid ${cores.superficieSuave}`,
    whiteSpace: "nowrap",
  },
  numerico: {
    textAlign: "right",
    fontVariantNumeric: "tabular-nums",
  },
  totalDescricao: {
    padding: "12px 18px",
    fontSize: "13px",
    fontWeight: 700,
    color: cores.texto,
    textAlign: "left",
    background: cores.superficieSuave,
    borderTop: `2px solid ${cores.destaqueBorda}`,
    whiteSpace: "nowrap",
  },
  totalCelula: {
    padding: "12px 18px",
    fontSize: "14px",
    fontWeight: 700,
    color: cores.texto,
    background: cores.superficieSuave,
    borderTop: `2px solid ${cores.destaqueBorda}`,
    whiteSpace: "nowrap",
  },
} satisfies Record<string, CSSProperties>;

/**
 * Tabela de um mês: categoria, quantidade e valor, na mesma ordem da planilha.
 *
 * O rodapé repete a linha "TOTAL DETALHADO NO PORTAL" do arquivo gerado pelo backend, somando
 * todas as categorias — inclusive "Servidores" — para que a conferência na tela bata com o Excel.
 */
export function TabelaMes({ mes }: TabelaMesProps) {
  const linhas = useMemo(() => montarLinhasDoMes(mes.dados), [mes.dados]);
  const total = useMemo(() => calcularTotalDoMes(linhas), [linhas]);

  const nomeMes = formatarNomeMes(mes.nomeMes);
  const idTitulo = `consulta-anual-mes-${mes.mes}`;

  return (
    <section style={styles.cartao} aria-labelledby={idTitulo}>
      <header style={styles.cabecalho}>
        <h3 id={idTitulo} style={styles.titulo}>
          {nomeMes}
        </h3>
        <span style={styles.periodo}>
          {formatarDataISO(mes.primeiroDia)} a {formatarDataISO(mes.ultimoDia)}
        </span>
      </header>

      <div
        className="ca-scroll"
        style={styles.scroll}
        tabIndex={0}
        role="region"
        aria-label={`Dados de ${nomeMes}`}
      >
        <table style={styles.tabela}>
          <thead>
            <tr>
              <th scope="col" style={styles.th}>
                Categoria
              </th>
              <th scope="col" style={{ ...styles.th, ...styles.numerico }}>
                Quantidade
              </th>
              <th scope="col" style={{ ...styles.th, ...styles.numerico }}>
                Valor
              </th>
            </tr>
          </thead>

          <tbody>
            {linhas.map((linha) => (
              <tr key={linha.campo}>
                <th scope="row" style={styles.celulaDescricao}>
                  {linha.descricao}
                </th>
                <td style={{ ...styles.celula, ...styles.numerico }}>
                  {formatarQuantidade(linha.quantidade)}
                </td>
                <td style={{ ...styles.celula, ...styles.numerico }}>{formatarMoeda(linha.valor)}</td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr>
              <th scope="row" style={styles.totalDescricao}>
                {DESCRICAO_TOTAL}
              </th>
              <td style={{ ...styles.totalCelula, ...styles.numerico }}>
                {formatarQuantidade(total.quantidade)}
              </td>
              <td style={{ ...styles.totalCelula, ...styles.numerico }}>
                {formatarMoeda(total.valor)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
