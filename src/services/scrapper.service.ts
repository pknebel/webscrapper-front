import { api } from "../api/api.ts";
import type { ScraperResponse } from "../types/scraper.ts";

export interface ArquivoDownload {
  blob: Blob;
  fileName: string;
  contentType: string;
}

export const buscarDados = async (
  data: string,
  gerarPlanilha = false,
): Promise<ScraperResponse | ArquivoDownload> => {
  if (gerarPlanilha) {
    const response = await api.get<Blob>("/busca-mensal", {
      params: {
        data,
        gerarPlanilha: true,
      },
      responseType: "blob",
    });

    const contentDisposition = response.headers["content-disposition"];
    const contentTypeHeader = response.headers["content-type"];

    const contentDispositionValue = typeof contentDisposition === "string"
      ? contentDisposition
      : Array.isArray(contentDisposition)
        ? contentDisposition[0]
        : undefined;

    const contentType = typeof contentTypeHeader === "string"
      ? contentTypeHeader
      : Array.isArray(contentTypeHeader)
        ? contentTypeHeader[0]
        : "application/octet-stream";

    const fileName = contentDispositionValue?.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)?.[1]?.replace(/^['"]|['"]$/g, "") || "download.xlsx";

    return {
      blob: response.data,
      fileName,
      contentType,
    };
  }

  const response = await api.get<ScraperResponse>("/busca-mensal", {
    params: {
      data,
      gerarPlanilha: false,
    },
    responseType: "json",
  });

  return response.data;
};