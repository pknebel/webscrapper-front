/**
 * Tokens visuais compartilhados pela funcionalidade de consulta anual.
 *
 * O projeto não possuía nenhum token de cor: o `App.css` é boilerplate do template do Vite e
 * referencia variáveis (`--accent`, `--border`) que nunca foram definidas. Em vez de criar um tema
 * global — o que afetaria a página mensal — os tokens ficam concentrados aqui e são aplicados
 * apenas pelos componentes novos.
 *
 * Contraste (WCAG AA, texto normal exige 4.5:1):
 * - `sobreDestaque` (#0f172a) sobre `destaque` (#87c75c) .... 8.8:1
 * - `destaqueTexto` (#4a7a2c) sobre `superficie` (#ffffff) .. 5.1:1
 * - `destaqueTexto` (#4a7a2c) sobre `destaqueFundo` ......... 4.7:1
 *
 * Texto branco sobre #87c75c atinge apenas 2.0:1 e por isso não é usado em nenhum lugar: os
 * elementos com fundo de destaque sempre usam texto escuro.
 */
export const cores = {
  /** Cor de destaque da funcionalidade. */
  destaque: "#87c75c",
  destaqueForte: "#6faa47",
  /** Verde escurecido, usado quando o verde precisa aparecer como texto sobre fundo claro. */
  destaqueTexto: "#4a7a2c",
  destaqueFundo: "#f1f8ec",
  destaqueBorda: "#cfe7ba",

  /** Texto sobre superfícies com a cor de destaque. */
  sobreDestaque: "#0f172a",

  texto: "#0f172a",
  textoSecundario: "#475569",
  textoTerciario: "#64748b",

  superficie: "#ffffff",
  superficieSuave: "#f8fafc",
  borda: "#e2e8f0",
  bordaForte: "#cbd5e1",

  erro: "#b91c1c",
  erroFundo: "#fef2f2",
  erroBorda: "#fecaca",

  alerta: "#92400e",
  alertaFundo: "#fffbeb",
  alertaBorda: "#fde68a",

  desabilitadoFundo: "#e2e8f0",
  desabilitadoTexto: "#64748b",
} as const;

export const raios = {
  pequeno: "8px",
  medio: "16px",
  grande: "24px",
  pilula: "999px",
} as const;

export const sombras = {
  cartao: "0 16px 40px rgba(15, 23, 42, 0.08)",
  suave: "0 8px 20px rgba(15, 23, 42, 0.05)",
  botao: "0 8px 20px rgba(15, 23, 42, 0.08)",
} as const;
