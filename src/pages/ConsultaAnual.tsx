import { useCallback, useRef, useState } from "react";
import type { CSSProperties } from "react";

import { Botao } from "../components/Botao";
import { Loading } from "../components/Loading";
import { MensagemErro } from "../components/MensagemErro";
import { PainelFalhas } from "../components/PainelFalhas";
import { PeriodoConsultado } from "../components/PeriodoConsultado";
import { TabelaMes } from "../components/TabelaMes";
import { baixarPlanilhaAnual, consultarDadosAnuais } from "../services/busca-anual.service";
import "../styles/consulta-anual.css";
import { cores, raios, sombras } from "../styles/theme";
import type { BuscaAnualResponse } from "../types/busca-anual";
import { dispararDownload } from "../utils/download.util";

type EstadoConsulta = "idle" | "loading" | "success" | "error";

const styles = {
  pagina: {
    minHeight: "calc(100vh - 64px)",
    padding: "24px",
    background: "linear-gradient(135deg, #f4f7fb 0%, #eef4ff 100%)",
  },
  conteudo: {
    width: "100%",
    maxWidth: "1100px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  cartao: {
    padding: "28px",
    borderRadius: raios.grande,
    background: cores.superficie,
    border: `1px solid ${cores.borda}`,
    boxShadow: sombras.cartao,
  },
  titulo: {
    margin: "0 0 8px",
    fontSize: "28px",
    fontWeight: 700,
    color: cores.texto,
  },
  descricao: {
    margin: "0 0 22px",
    fontSize: "15px",
    color: cores.textoSecundario,
    lineHeight: 1.55,
    maxWidth: "620px",
  },
  acoes: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  resumo: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "16px",
  },
  resumoTitulo: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 700,
    color: cores.texto,
  },
  resumoTexto: {
    margin: 0,
    fontSize: "14px",
    color: cores.textoSecundario,
  },
  aviso: {
    margin: "0 0 18px",
    padding: "12px 16px",
    borderRadius: raios.pequeno,
    border: `1px solid ${cores.destaqueBorda}`,
    background: cores.destaqueFundo,
    fontSize: "14px",
    color: cores.texto,
    lineHeight: 1.5,
  },
  meses: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  vazio: {
    padding: "28px 24px",
    borderRadius: raios.medio,
    border: `1px dashed ${cores.bordaForte}`,
    background: cores.superficieSuave,
    textAlign: "center",
    fontSize: "14px",
    color: cores.textoSecundario,
    lineHeight: 1.6,
  },
} satisfies Record<string, CSSProperties>;

/**
 * Consulta anual.
 *
 * Fluxo: o usuário dispara a consulta, confere os dados na tela e só então baixa a planilha.
 *
 * A definição de quais meses estão completos é responsabilidade exclusiva do backend — esta página
 * apenas interpreta a resposta e nunca deduz o período por conta própria.
 */
export function ConsultaAnual() {
  const [estado, setEstado] = useState<EstadoConsulta>("idle");
  const [resultado, setResultado] = useState<BuscaAnualResponse | null>(null);
  const [baixando, setBaixando] = useState(false);
  const [falhouDownload, setFalhouDownload] = useState(false);

  // Refs evitam chamadas duplicadas: `setState` é assíncrono e sozinho não protegeria um
  // clique duplo disparado antes da re-renderização que desabilita o botão.
  const consultaEmAndamento = useRef(false);
  const downloadEmAndamento = useRef(false);

  const gerarConsulta = useCallback(async () => {
    if (consultaEmAndamento.current) {
      return;
    }

    consultaEmAndamento.current = true;

    setEstado("loading");
    setResultado(null);
    setFalhouDownload(false);

    try {
      const dados = await consultarDadosAnuais();

      setResultado(dados);
      setEstado("success");
    } catch (erro) {
      // O detalhe técnico fica no console; o usuário vê apenas a mensagem amigável.
      console.error("[ConsultaAnual] Falha ao consultar os dados anuais:", erro);
      setEstado("error");
    } finally {
      consultaEmAndamento.current = false;
    }
  }, []);

  const baixarPlanilha = useCallback(async () => {
    if (!resultado || downloadEmAndamento.current) {
      return;
    }

    downloadEmAndamento.current = true;

    setBaixando(true);
    setFalhouDownload(false);

    try {
      const { blob, nomeArquivo } = await baixarPlanilhaAnual(resultado.ano);

      dispararDownload(blob, nomeArquivo);
    } catch (erro) {
      console.error("[ConsultaAnual] Falha ao baixar a planilha:", erro);
      setFalhouDownload(true);
    } finally {
      downloadEmAndamento.current = false;
      setBaixando(false);
    }
  }, [resultado]);

  const carregando = estado === "loading";
  const temResultado = estado === "success" && resultado !== null;

  return (
    <main style={styles.pagina}>
      <div style={styles.conteudo}>
        <section style={styles.cartao} aria-labelledby="consulta-anual-titulo">
          <h1 id="consulta-anual-titulo" style={styles.titulo}>
            Consulta Anual
          </h1>

          <p style={styles.descricao}>
            Consulte os dados de todos os meses já encerrados do ano corrente, confira as
            informações na tela e faça o download da planilha consolidada.
          </p>

          <div style={styles.acoes}>
            {temResultado ? (
              <>
                <Botao
                  variante="secundario"
                  onClick={gerarConsulta}
                  disabled={carregando || baixando}
                >
                  Gerar novamente
                </Botao>

                <Botao
                  onClick={baixarPlanilha}
                  disabled={baixando || carregando}
                  aria-label={`Baixar planilha da consulta anual de ${resultado.ano}`}
                >
                  {baixando ? "Preparando arquivo..." : "Baixar planilha"}
                </Botao>
              </>
            ) : (
              <Botao onClick={gerarConsulta} disabled={carregando}>
                {carregando ? "Consultando..." : "Gerar planilha"}
              </Botao>
            )}
          </div>
        </section>

        {carregando ? (
          <Loading
            mensagem="Consultando dados..."
            descricao="O backend consulta um mês de cada vez no portal da transparência, então isso pode levar alguns minutos."
          />
        ) : null}

        {estado === "error" ? (
          <MensagemErro
            titulo="Não foi possível consultar os dados anuais"
            mensagem="Verifique sua conexão e se o serviço está disponível, e tente novamente."
            textoAcao="Tentar novamente"
            onAcao={gerarConsulta}
          />
        ) : null}

        {temResultado ? (
          <>
            <section style={styles.cartao} aria-labelledby="consulta-anual-resumo">
              <div style={styles.resumo}>
                <h2 id="consulta-anual-resumo" style={styles.resumoTitulo}>
                  Consulta anual — {resultado.ano}
                </h2>

                <p role="status" style={styles.resumoTexto}>
                  {resultado.meses.length === 1
                    ? "1 mês consultado"
                    : `${resultado.meses.length} meses consultados`}
                  {resultado.falhas.length > 0 ? ` · ${resultado.falhas.length} com falha` : ""}
                </p>
              </div>

              <p style={styles.aviso}>
                Estes são exatamente os dados que serão gravados na planilha. Confira antes de
                baixar o arquivo.
              </p>

              <PeriodoConsultado meses={resultado.meses} falhas={resultado.falhas} />
            </section>

            <PainelFalhas falhas={resultado.falhas} />

            {falhouDownload ? (
              <MensagemErro
                titulo="Não foi possível baixar a planilha"
                mensagem="Os dados consultados continuam disponíveis na tela. Tente baixar novamente."
                textoAcao="Tentar baixar novamente"
                onAcao={baixarPlanilha}
                acaoDesabilitada={baixando}
              />
            ) : null}

            {resultado.meses.length > 0 ? (
              <div style={styles.meses}>
                {resultado.meses.map((mes) => (
                  <TabelaMes key={mes.mes} mes={mes} />
                ))}
              </div>
            ) : (
              <p style={styles.vazio}>
                Nenhum mês do ano corrente está completo ainda, portanto não há dados para exibir.
                A planilha pode ser baixada, mas virá apenas com a estrutura e sem valores.
              </p>
            )}
          </>
        ) : null}
      </div>
    </main>
  );
}
