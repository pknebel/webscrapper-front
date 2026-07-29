export interface CategoriaScraper {
  QUANTIDADE: number;
  VALOR: number;
}

export interface ScraperResponse {
  servidores: CategoriaScraper;
  efetivos: CategoriaScraper;
  comissionados: CategoriaScraper;
  celetistas: CategoriaScraper;
  aposentados: CategoriaScraper;
  pensionistas: CategoriaScraper;
  estagiarios: CategoriaScraper;
  cedidosRecebidos: CategoriaScraper;
  temporarios: CategoriaScraper;
  agentePolitico: CategoriaScraper;
}