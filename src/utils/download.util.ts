/**
 * Extrai o nome do arquivo do cabeçalho `Content-Disposition`.
 *
 * O valor chega do Axios como `string`, `string[]` ou `undefined`, por isso o parâmetro é
 * `unknown` e o tipo é verificado em tempo de execução.
 */
export const extrairNomeDoArquivo = (contentDisposition: unknown): string | null => {
  const valor = Array.isArray(contentDisposition) ? contentDisposition[0] : contentDisposition;

  if (typeof valor !== "string") {
    return null;
  }

  const correspondencia = valor.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
  const nome = correspondencia?.[1]?.replace(/^['"]|['"]$/g, "").trim();

  if (!nome) {
    return null;
  }

  try {
    return decodeURIComponent(nome);
  } catch {
    // Nome já em texto simples ou com escapes inválidos: usa o valor original.
    return nome;
  }
};

/**
 * Dispara o download de um `Blob` no navegador.
 *
 * A URL temporária é liberada em um `setTimeout` e não imediatamente após o clique: alguns
 * navegadores cancelam o download quando a URL é revogada no mesmo tick.
 */
export const dispararDownload = (blob: Blob, nomeArquivo: string): void => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = nomeArquivo;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
};
