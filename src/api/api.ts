import axios from "axios";

/**
 * URL base da API.
 *
 * Em produção vem de `VITE_API_URL`, definida nas variáveis de ambiente da Vercel.
 * Sem a variável — o caso do `npm run dev` — cai no backend local, então nada muda
 * no fluxo de desenvolvimento.
 */
const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export const api = axios.create({
  baseURL,
  /**
   * 120 s (antes 60 s) por causa do cold start do plano gratuito: o backend hiberna
   * após 15 min sem tráfego e leva de 40 a 90 s para voltar. Na primeira requisição
   * depois da hibernação, o tempo de subida da aplicação sozinho consumiria todo o
   * timeout anterior e a consulta mensal falharia sem motivo aparente.
   *
   * A consulta anual continua com o timeout próprio, maior, definido em
   * `services/busca-anual.service.ts`.
   */
  timeout: 120000,
});
