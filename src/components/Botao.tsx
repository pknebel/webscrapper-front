import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";

import { cores, raios, sombras } from "../styles/theme";

export type VarianteBotao = "primario" | "secundario";

interface BotaoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: VarianteBotao;
  children: ReactNode;
}

const styles = {
  base: {
    border: "1px solid transparent",
    borderRadius: raios.pilula,
    padding: "12px 20px",
    fontFamily: "inherit",
    fontSize: "15px",
    fontWeight: 600,
    lineHeight: 1.2,
    cursor: "pointer",
    minHeight: "48px",
    minWidth: "170px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    boxShadow: sombras.botao,
    transition: "filter 0.2s ease, transform 0.2s ease",
  },
  primario: {
    background: cores.destaque,
    color: cores.sobreDestaque,
    borderColor: cores.destaqueForte,
  },
  secundario: {
    background: cores.superficie,
    color: cores.texto,
    borderColor: cores.bordaForte,
  },
  desabilitado: {
    background: cores.desabilitadoFundo,
    color: cores.desabilitadoTexto,
    borderColor: "transparent",
    cursor: "not-allowed",
    boxShadow: "none",
  },
} satisfies Record<string, CSSProperties>;

/**
 * Botão da funcionalidade de consulta anual.
 *
 * A variante primária usa a cor de destaque (#87c75c) com texto escuro: texto branco sobre esse
 * verde atinge apenas 2.0:1 de contraste, enquanto o texto escuro chega a 8.8:1.
 *
 * Hover e foco visível ficam em `styles/consulta-anual.css`, já que pseudo-classes não são
 * expressáveis em estilos inline.
 */
export function Botao({
  variante = "primario",
  disabled = false,
  className,
  style,
  children,
  ...resto
}: BotaoProps) {
  const estilo: CSSProperties = {
    ...styles.base,
    ...(disabled ? styles.desabilitado : styles[variante]),
    ...style,
  };

  return (
    <button
      type="button"
      {...resto}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      className={className ? `ca-botao ${className}` : "ca-botao"}
      style={estilo}
    >
      {children}
    </button>
  );
}
