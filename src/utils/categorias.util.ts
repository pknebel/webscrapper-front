import type { CategoriaScraper, ScraperResponse } from "../types/scraper";

export interface CategoriaPlanilha {
  campo: keyof ScraperResponse;
  descricao: string;
}

/**
 * Categorias na mesma ordem e com os mesmos rótulos da planilha gerada pelo backend
 * (`PlanilhaAnualService`).
 *
 * A ordem difere da usada na tela mensal — ali "Comissionados" vem antes de "Celetistas", seguindo
 * a ordem do DTO. Como esta tela é a conferência do arquivo que será baixado, ela precisa bater
 * linha a linha com o Excel.
 */
export const CATEGORIAS_PLANILHA: readonly CategoriaPlanilha[] = [
  { campo: "servidores", descricao: "Servidores" },
  { campo: "efetivos", descricao: "Efetivos" },
  { campo: "celetistas", descricao: "Celetistas" },
  { campo: "comissionados", descricao: "Comissionados" },
  { campo: "aposentados", descricao: "Aposentados" },
  { campo: "pensionistas", descricao: "Pensionistas" },
  { campo: "estagiarios", descricao: "Estagiários" },
  { campo: "cedidosRecebidos", descricao: "Cedidos/Recebidos" },
  { campo: "temporarios", descricao: "Temporários" },
  { campo: "agentePolitico", descricao: "Agentes Políticos" },
];

export const DESCRICAO_TOTAL = "TOTAL DETALHADO NO PORTAL";

export interface LinhaCategoria {
  campo: keyof ScraperResponse;
  descricao: string;
  quantidade: number;
  valor: number;
}

export interface TotalMes {
  quantidade: number;
  valor: number;
}

const valorNumerico = (valor: number | undefined): number =>
  typeof valor === "number" && Number.isFinite(valor) ? valor : 0;

/** Monta as linhas de um mês na ordem da planilha, tolerando categorias ausentes na resposta. */
export const montarLinhasDoMes = (dados: ScraperResponse): LinhaCategoria[] =>
  CATEGORIAS_PLANILHA.map(({ campo, descricao }) => {
    const categoria: CategoriaScraper | undefined = dados?.[campo];

    return {
      campo,
      descricao,
      quantidade: valorNumerico(categoria?.QUANTIDADE),
      valor: valorNumerico(categoria?.VALOR),
    };
  });

/**
 * Total do mês.
 *
 * Soma todas as categorias, **incluindo "Servidores"**, exatamente como a linha
 * "TOTAL DETALHADO NO PORTAL" da planilha gerada pelo backend.
 */
export const calcularTotalDoMes = (linhas: LinhaCategoria[]): TotalMes =>
  linhas.reduce<TotalMes>(
    (total, linha) => ({
      quantidade: total.quantidade + linha.quantidade,
      valor: total.valor + linha.valor,
    }),
    { quantidade: 0, valor: 0 },
  );
