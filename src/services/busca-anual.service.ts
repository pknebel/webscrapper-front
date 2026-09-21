import { api } from "../api/api";
import type { BuscaAnualResponse } from "../types/busca-anual";
import { extrairNomeDoArquivo } from "../utils/download.util";

/**
 * Timeout aplicado **apenas** às chamadas da consulta anual.
 *
 * A instância global do Axios usa 60 s, suficiente para a consulta mensal. A consulta anual
 * percorre até 11 meses de forma sequencial no backend, cada um com 10 chamadas paralelas ao
 * serviço externo, então 60 s é insuficiente. Em vez de elevar o timeout global — o que afrouxaria
 * também a consulta mensal — o valor é passado no config de cada requisição.
 */
export const TIMEOUT_CONSULTA_ANUAL_MS = 5 * 60 * 1000;

export interface PlanilhaAnual {
  blob: Blob;
  nomeArquivo: string;
}

/** `GET /busca-anual` — dados consolidados dos meses completos do ano corrente. */
export const consultarDadosAnuais = async (): Promise<BuscaAnualResponse> => {
  const resposta = await api.get<BuscaAnualResponse>("/busca-anual", {
    timeout: TIMEOUT_CONSULTA_ANUAL_MS,
  });

  return resposta.data;
};

/**
 * `GET /busca-anual/planilha` — arquivo pronto para download.
 *
 * O mesmo timeout ampliado é usado porque, com o cache do backend expirado, este endpoint refaz a
 * consulta anual inteira antes de gerar o arquivo.
 *
 * @param ano usado apenas para o nome de fallback, caso o `Content-Disposition` não venha.
 */
export const baixarPlanilhaAnual = async (ano: number): Promise<PlanilhaAnual> => {
  const resposta = await api.get<Blob>("/busca-anual/planilha", {
    responseType: "blob",
    timeout: TIMEOUT_CONSULTA_ANUAL_MS,
  });

  return {
    blob: resposta.data,
    nomeArquivo:
      extrairNomeDoArquivo(resposta.headers["content-disposition"]) ?? `consulta-anual-${ano}.xlsx`,
  };
};
