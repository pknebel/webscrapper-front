const LOCALE_BR = "pt-BR";

/**
 * Os formatadores são criados uma única vez no módulo. Instanciar `Intl.NumberFormat` a cada
 * célula da tabela é caro e a consulta anual pode renderizar centenas de valores.
 */
const formatadorMoeda = new Intl.NumberFormat(LOCALE_BR, {
  style: "currency",
  currency: "BRL",
});

const formatadorQuantidade = new Intl.NumberFormat(LOCALE_BR, {
  maximumFractionDigits: 0,
});

const numeroSeguro = (valor: number): number => (Number.isFinite(valor) ? valor : 0);

/** 26560356.62 → "R$ 26.560.356,62" */
export const formatarMoeda = (valor: number): string => formatadorMoeda.format(numeroSeguro(valor));

/** 4666 → "4.666" */
export const formatarQuantidade = (valor: number): string =>
  formatadorQuantidade.format(numeroSeguro(valor));

/**
 * "2026-01-31" → "31/01/2026".
 *
 * A conversão é feita sobre a string, sem passar por `Date`, porque `new Date("2026-01-31")` é
 * interpretado como UTC e exibiria o dia anterior em fusos negativos como o do Brasil.
 */
export const formatarDataISO = (dataISO: string): string => {
  if (typeof dataISO !== "string") {
    return "";
  }

  const [ano, mes, dia] = dataISO.split("-");

  return ano && mes && dia ? `${dia}/${mes}/${ano}` : dataISO;
};

/** "JANEIRO" → "Janeiro" */
export const formatarNomeMes = (nome: string): string => {
  if (!nome) {
    return "";
  }

  return nome.charAt(0).toUpperCase() + nome.slice(1).toLocaleLowerCase(LOCALE_BR);
};
