import type { CSSProperties } from "react";

import { cores, raios } from "../styles/theme";

interface LoadingProps {
  mensagem?: string;
  descricao?: string;
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    padding: "48px 24px",
    borderRadius: raios.medio,
    border: `1px solid ${cores.destaqueBorda}`,
    background: cores.destaqueFundo,
    textAlign: "center",
  },
  spinner: {
    width: "36px",
    height: "36px",
    borderRadius: raios.pilula,
    border: `4px solid ${cores.destaqueBorda}`,
    borderTopColor: cores.destaqueTexto,
    display: "block",
  },
  mensagem: {
    margin: 0,
    fontSize: "16px",
    fontWeight: 600,
    color: cores.texto,
  },
  descricao: {
    margin: 0,
    fontSize: "14px",
    color: cores.textoSecundario,
    maxWidth: "460px",
  },
} satisfies Record<string, CSSProperties>;

/**
 * Indicador de carregamento.
 *
 * Usa `role="status"` + `aria-live="polite"` para que leitores de tela anunciem a mudança sem
 * interromper o usuário. O estado não é comunicado apenas pela animação: há sempre texto.
 */
export function Loading({ mensagem = "Carregando...", descricao }: LoadingProps) {
  return (
    <div role="status" aria-live="polite" style={styles.container}>
      <span className="ca-spinner" aria-hidden="true" style={styles.spinner} />
      <p style={styles.mensagem}>{mensagem}</p>
      {descricao ? <p style={styles.descricao}>{descricao}</p> : null}
    </div>
  );
}
