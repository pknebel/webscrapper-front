import type { CSSProperties } from "react";
import { NavLink } from "react-router-dom";

import { cores, raios, sombras } from "../styles/theme";

const LINKS = [
  { para: "/", rotulo: "Consulta mensal" },
  { para: "/consulta-anual", rotulo: "Consulta anual" },
];

const styles = {
  barra: {
    position: "sticky",
    top: 0,
    zIndex: 10,
    background: cores.superficie,
    borderBottom: `1px solid ${cores.borda}`,
    boxShadow: sombras.suave,
  },
  nav: {
    maxWidth: "1240px",
    margin: "0 auto",
    padding: "12px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    flexWrap: "wrap",
  },
  marca: {
    fontSize: "16px",
    fontWeight: 700,
    color: cores.texto,
  },
  lista: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    listStyle: "none",
    margin: 0,
    padding: 0,
    flexWrap: "wrap",
  },
  link: {
    display: "inline-block",
    padding: "8px 16px",
    borderRadius: raios.pilula,
    border: "1px solid transparent",
    fontSize: "14px",
    fontWeight: 600,
    color: cores.textoSecundario,
    textDecoration: "none",
  },
  linkAtivo: {
    background: cores.destaqueFundo,
    borderColor: cores.destaqueBorda,
    color: cores.destaqueTexto,
  },
} satisfies Record<string, CSSProperties>;

/**
 * Navegação principal.
 *
 * O projeto não tinha roteamento — o `App` renderizava a página mensal diretamente. O
 * `react-router-dom` já estava no `package.json`, então ele foi usado em vez de criar um
 * mecanismo de navegação próprio.
 *
 * O item ativo é indicado por cor **e** por `aria-current="page"`, que o `NavLink` aplica
 * automaticamente — a informação não depende apenas da cor.
 */
export function NavBar() {
  return (
    <header style={styles.barra}>
      <nav style={styles.nav} aria-label="Navegação principal">
        <span style={styles.marca}>Quadro de Servidores</span>

        <ul style={styles.lista}>
          {LINKS.map((link) => (
            <li key={link.para}>
              <NavLink
                to={link.para}
                end
                className="ca-link"
                style={({ isActive }) => ({
                  ...styles.link,
                  ...(isActive ? styles.linkAtivo : null),
                })}
              >
                {link.rotulo}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
