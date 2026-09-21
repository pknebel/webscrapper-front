import type { CSSProperties } from "react";

import { cores, raios } from "../styles/theme";
import { Botao } from "./Botao";

interface MensagemErroProps {
  titulo?: string;
  mensagem: string;
  textoAcao?: string;
  onAcao?: () => void;
  acaoDesabilitada?: boolean;
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "10px",
    padding: "20px 24px",
    borderRadius: raios.medio,
    border: `1px solid ${cores.erroBorda}`,
    background: cores.erroFundo,
  },
  titulo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    margin: 0,
    fontSize: "16px",
    fontWeight: 700,
    color: cores.erro,
  },
  mensagem: {
    margin: 0,
    fontSize: "14px",
    color: cores.textoSecundario,
    lineHeight: 1.5,
  },
  acao: {
    marginTop: "6px",
  },
} satisfies Record<string, CSSProperties>;

/**
 * Mensagem de erro amigável.
 *
 * O erro técnico permanece no console (registrado por quem chama); aqui o usuário vê apenas texto
 * compreensível. O estado não depende só da cor: há ícone e título explícitos.
 */
export function MensagemErro({
  titulo = "Não foi possível concluir a operação",
  mensagem,
  textoAcao,
  onAcao,
  acaoDesabilitada = false,
}: MensagemErroProps) {
  return (
    <div role="alert" style={styles.container}>
      <p style={styles.titulo}>
        <span aria-hidden="true">⚠</span>
        {titulo}
      </p>

      <p style={styles.mensagem}>{mensagem}</p>

      {textoAcao && onAcao ? (
        <Botao variante="secundario" onClick={onAcao} disabled={acaoDesabilitada} style={styles.acao}>
          {textoAcao}
        </Botao>
      ) : null}
    </div>
  );
}
