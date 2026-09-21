import type { ScraperResponse } from "./scraper";

/**
 * Um mês completo consultado com sucesso pelo backend.
 *
 * O campo `dados` reutiliza {@link ScraperResponse} porque o backend devolve exatamente o mesmo
 * `BuscaDadosResponseDTO` já usado por `GET /busca-mensal`.
 */
export interface MesConsultaAnual {
  mes: number;
  nomeMes: string;
  /** Data ISO (yyyy-MM-dd). */
  primeiroDia: string;
  /** Data ISO (yyyy-MM-dd). */
  ultimoDia: string;
  dados: ScraperResponse;
}

/** Mês que o backend não conseguiu consultar. Não invalida os demais meses. */
export interface FalhaConsultaAnual {
  mes: number;
  nomeMes: string;
  motivo: string;
}

/** Resposta de `GET /busca-anual`. */
export interface BuscaAnualResponse {
  ano: number;
  meses: MesConsultaAnual[];
  falhas: FalhaConsultaAnual[];
}
