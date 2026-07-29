import { useState } from "react";
import { MonthPicker } from "../components/MonthPicker";
import { buscarDados, type ArquivoDownload } from "../services/scrapper.service";
import type { ScraperResponse } from "../types/scraper";
import { formatMonthToApiDate } from "../utils/date.util";

interface TabelaLinha {
  ano: string;
  descricao: string;
  quantidade: number | string;
  valor: string;
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    background: "linear-gradient(135deg, #f4f7fb 0%, #eef4ff 100%)",
  } as const,
  card: {
    width: "100%",
    maxWidth: "980px",
    padding: "32px",
    borderRadius: "24px",
    background: "#ffffff",
    boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)",
    border: "1px solid #e5ebf5",
  } as const,
  title: {
    margin: "0 0 8px",
    fontSize: "28px",
    fontWeight: 700,
    color: "#0f172a",
  } as const,
  subtitle: {
    margin: "0 0 24px",
    color: "#475569",
    fontSize: "15px",
  } as const,
  actionsRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap" as const,
  },
  inputWrap: {
    flex: "1 1 280px",
    minWidth: "240px",
  },
  buttonsRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap" as const,
  },
  button: {
    border: "none",
    borderRadius: "999px",
    padding: "12px 18px",
    fontWeight: 600,
    fontSize: "15px",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(15, 23, 42, 0.08)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease",
    minHeight: "48px",
    minWidth: "140px",
  } as const,
  buttonPrimary: {
    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    color: "#ffffff",
  } as const,
  buttonSecondary: {
    background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)",
    color: "#ffffff",
  } as const,
  buttonLoading: {
    background: "linear-gradient(135deg, #64748b 0%, #475569 100%)",
    color: "#ffffff",
    cursor: "wait",
  } as const,
  buttonDisabled: {
    background: "#e2e8f0",
    color: "#64748b",
    cursor: "not-allowed",
    boxShadow: "none",
    opacity: 0.8,
  } as const,
  error: {
    marginTop: "16px",
    color: "#b91c1c",
    fontWeight: 600,
  } as const,
  tableWrap: {
    marginTop: "24px",
    overflowX: "auto" as const,
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    background: "#ffffff",
  },
  th: {
    padding: "12px 14px",
    background: "#f8fafc",
    color: "#0f172a",
    fontSize: "14px",
    fontWeight: 700,
    textAlign: "left" as const,
    borderBottom: "1px solid #e2e8f0",
    whiteSpace: "nowrap" as const,
  },
  td: {
    padding: "12px 14px",
    fontSize: "14px",
    color: "#334155",
    borderBottom: "1px solid #f1f5f9",
    whiteSpace: "nowrap" as const,
  },
  strongRow: {
    fontWeight: 700,
    background: "#f8fafc",
  } as const,
};

const descricaoPorCampo: Record<keyof ScraperResponse, string> = {
  servidores: "Servidores",
  efetivos: "Efetivos",
  comissionados: "Comissionados",
  celetistas: "Celetistas",
  aposentados: "Aposentados",
  pensionistas: "Pensionistas",
  estagiarios: "Estagiários",
  cedidosRecebidos: "Cedidos/Recebidos",
  temporarios: "Temporários",
  agentePolitico: "Agentes Políticos",
};

const formatCurrency = (value: number) => new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
}).format(value);

const montarLinhasTabela = (dados: ScraperResponse, anoSelecionado: string): TabelaLinha[] => {
  const linhas = Object.entries(dados).map(([key, valor]) => ({
    ano: "",
    descricao: descricaoPorCampo[key as keyof ScraperResponse],
    quantidade: valor.QUANTIDADE,
    valor: formatCurrency(valor.VALOR),
    valorNumerico: valor.VALOR,
  }));

  const totalQuantidade = linhas.reduce((soma, linha) => soma + Number(linha.quantidade), 0);
  const totalValor = linhas.reduce((soma, linha) => soma + Number(linha.valorNumerico || 0), 0);

  return [
    {
      ano: anoSelecionado,
      descricao: linhas[0]?.descricao || "",
      quantidade: linhas[0]?.quantidade || 0,
      valor: linhas[0]?.valor || formatCurrency(0),
    },
    ...linhas.slice(1).map((linha) => ({
      ano: "",
      descricao: linha.descricao,
      quantidade: linha.quantidade,
      valor: linha.valor,
    })),
    {
      ano: "",
      descricao: "TOTAL DETALHADO NO PORTAL",
      quantidade: totalQuantidade,
      valor: formatCurrency(totalValor),
    },
  ];
};

export function Home() {
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSuccessfulSearch, setHasSuccessfulSearch] = useState(false);
  const [lastSuccessfulMonth, setLastSuccessfulMonth] = useState("");
  const [linhasTabela, setLinhasTabela] = useState<TabelaLinha[]>([]);

  const canGeneratePlanilha = Boolean(hasSuccessfulSearch && month && month === lastSuccessfulMonth);

  const handleBuscar = async () => {
    if (!month) {
      setError("Selecione uma data.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setLinhasTabela([]);

      const data = formatMonthToApiDate(month);
      const resposta = await buscarDados(data, false);

      if (!resposta || typeof resposta !== "object" || "blob" in resposta) {
        setError("A resposta da busca não veio no formato esperado.");
        setHasSuccessfulSearch(false);
        setLastSuccessfulMonth("");
        return;
      }

      const dados = resposta as ScraperResponse;
      const anoSelecionado = month.split("-")[0];
      const linhas = montarLinhasTabela(dados, anoSelecionado);
      setLinhasTabela(linhas);
      setHasSuccessfulSearch(true);
      setLastSuccessfulMonth(month);
    } catch (err) {
      console.error(err);
      setError("Erro ao buscar os dados.");
      setHasSuccessfulSearch(false);
      setLastSuccessfulMonth("");
      setLinhasTabela([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGerarPlanilha = async () => {
    if (!month || !canGeneratePlanilha) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = formatMonthToApiDate(month);
      const arquivo = await buscarDados(data, true);

      if (!arquivo || typeof arquivo !== "object" || !("blob" in arquivo)) {
        setError("A resposta da geração da planilha não veio no formato esperado.");
        return;
      }

      const download = arquivo as ArquivoDownload;
      const url = window.URL.createObjectURL(download.blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = download.fileName || "planilha.xlsx";
      link.type = download.contentType || "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      setError("Erro ao gerar a planilha.");
    } finally {
      setLoading(false);
    }
  };

  const mesExtenso = month
    ? new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(new Date(`${month}-01T00:00:00`)).toUpperCase()
    : "MÊS SELECIONADO";

  return (
    <div className="container" style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Busca Automática de Dados do Quadro de Servidores</h1>
        <p style={styles.subtitle}>Selecione o mês e ano para consultar os dados e gerar a planilha.</p>

        <div style={styles.actionsRow}>
          <div style={styles.inputWrap}>
            <MonthPicker
              value={month}
              onChange={(value) => {
                setMonth(value);
                setLinhasTabela([]);
                if (lastSuccessfulMonth && value !== lastSuccessfulMonth) {
                  setHasSuccessfulSearch(false);
                  setLastSuccessfulMonth("");
                }
              }}
            />
          </div>

          <div style={styles.buttonsRow}>
            <button
              onClick={handleBuscar}
              disabled={loading}
              style={{
                ...styles.button,
                ...(loading ? styles.buttonLoading : styles.buttonPrimary),
              }}
            >
              {loading ? "Buscando..." : "Buscar"}
            </button>

            <button
              onClick={handleGerarPlanilha}
              disabled={loading || !canGeneratePlanilha}
              style={{
                ...styles.button,
                ...(loading || !canGeneratePlanilha ? styles.buttonDisabled : styles.buttonSecondary),
              }}
            >
              Gerar Planilha
            </button>
          </div>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        {linhasTabela.length > 0 && (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Ano</th>
                  <th style={styles.th}>Descrição</th>
                  <th style={styles.th}>{mesExtenso}</th>
                  <th style={styles.th}>TOTAL MENSAL</th>
                </tr>
              </thead>
              <tbody>
                {linhasTabela.map((linha, index) => (
                  <tr key={`${linha.descricao}-${index}`}>
                    <td style={{ ...styles.td, ...(index === linhasTabela.length - 1 ? styles.strongRow : undefined) }}>{linha.ano}</td>
                    <td style={{ ...styles.td, ...(index === linhasTabela.length - 1 ? styles.strongRow : undefined) }}>{linha.descricao}</td>
                    <td style={{ ...styles.td, ...(index === linhasTabela.length - 1 ? styles.strongRow : undefined) }}>{linha.quantidade}</td>
                    <td style={{ ...styles.td, ...(index === linhasTabela.length - 1 ? styles.strongRow : undefined) }}>{linha.valor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}