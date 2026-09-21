# Publicando o frontend na Vercel

Frontend React 19 + Vite 8 + MUI, consumindo a API Spring Boot do repositório
`web-scrapper-servidores`. Hospedagem gratuita e permanente na Vercel.

> **Ordem importa:** publique o backend primeiro (veja o `DEPLOY.md` daquele
> repositório). Você precisa da URL dele para configurar este projeto, e ele
> precisa da URL daqui para liberar o CORS.

---

## O que mudou no projeto

| Arquivo | O quê |
|---|---|
| `src/api/api.ts` | `baseURL` deixou de ser fixo em `localhost:8080` e passou a ler `VITE_API_URL`; timeout global de 60 s → 120 s |
| `vercel.json` | novo — build config e *SPA fallback* |
| `.env.example` | novo — documenta a variável de ambiente |
| `.nvmrc` | novo — fixa o Node 22 no build |
| `.gitignore` | `package-lock.json` deixou de ser ignorado |

Nada disso altera o `npm run dev`: sem `VITE_API_URL` definida, o front continua
apontando para `http://localhost:8080`.

### Por que o `vercel.json`

O `App.tsx` usa `BrowserRouter` com duas rotas (`/` e `/consulta-anual`). Em um
host estático, abrir `https://seu-app.vercel.app/consulta-anual` direto na barra de
endereço — ou apertar F5 nessa tela — procura um arquivo `consulta-anual` que não
existe e devolve 404. O rewrite manda tudo para o `index.html` e deixa o React
Router resolver a rota. Arquivos que existem de fato (JS, CSS, imagens) continuam
sendo servidos normalmente, porque o sistema de arquivos tem prioridade sobre os
rewrites.

### Por que destravar o `package-lock.json`

O `.gitignore` ignorava o lockfile. Sem ele no repositório, a Vercel roda
`npm install` em vez de `npm ci` e resolve as versões na hora do build — e como
todas as dependências usam faixa `^` (React 19, MUI 9, Vite 8), uma release menor
publicada no meio do caminho entra no build de produção sem você ter testado. É a
origem clássica do "funciona na minha máquina". Com o lockfile versionado, o build
da Vercel usa exatamente as versões que você tem localmente.

Commit dele junto:

```bash
git add -f package-lock.json
git add src/api/api.ts vercel.json .env.example .nvmrc .gitignore DEPLOY.md
git commit -m "Adiciona configuracao de deploy (Vercel)"
git push
```

---

## Passo a passo

1. Conta em <https://vercel.com> com o mesmo GitHub (plano Hobby, sem cartão).
2. **Add New → Project** → selecione `webscrapper-front`.
3. A Vercel detecta Vite sozinha. Confira: Build Command `npm run build`,
   Output Directory `dist`.
4. Em **Environment Variables**, adicione — nos três ambientes
   (Production, Preview, Development):

   | Name | Value |
   |---|---|
   | `VITE_API_URL` | `https://web-scrapper-servidores-api.onrender.com` |

   Sem barra no final. Use a URL real que o Render devolveu.

5. **Deploy**. Leva 1–2 min. Sai uma URL tipo `https://webscrapper-front.vercel.app`.
6. Volte ao Render → serviço do backend → **Environment** → `APP_CORS_ORIGEM` =
   a URL da Vercel. Salve; o serviço reinicia sozinho.

> Variável de ambiente no Vite entra no bundle **em tempo de build**. Se você mudar
> `VITE_API_URL` depois, precisa de um novo deploy (**Deployments → ... → Redeploy**)
> para o valor novo valer.

---

## Checagens depois do deploy

1. Abra a URL da Vercel e faça uma consulta mensal. Se falhar, abra o DevTools →
   Console. Erro de CORS significa que o `APP_CORS_ORIGEM` no Render não bate
   exatamente com a origem da Vercel (protocolo, subdomínio, barra final).
2. Navegue até *Consulta anual* e aperte **F5**. Tem que continuar na tela — se der
   404, o `vercel.json` não foi aplicado.
3. Baixe uma planilha. Se o arquivo vier com nome `download.xlsx` em vez do nome
   correto, o backend não está expondo o header `Content-Disposition` para o
   browser; a correção é adicionar `exposedHeaders("Content-Disposition")` na
   configuração de CORS do Spring.
4. Espere 20 min sem usar e abra de novo. A primeira consulta vai demorar ~1 min
   (o backend hibernou). É esperado.

---

## O cold start e a pessoa que vai validar

Esse é o ponto que mais gera "não funciona". O plano gratuito do Render desliga o
backend após 15 min de inatividade, e a volta leva de 40 a 90 s. O timeout global
do Axios foi para 120 s justamente para absorver isso, mas a tela fica parada no
loading esse tempo todo e parece travamento.

Duas formas de resolver, da mais simples para a mais completa:

1. **Avisar.** Uma frase no e-mail: "a primeira tela do dia demora cerca de um
   minuto para responder; depois fica rápido".
2. **Manter acordado.** Cadastre a URL do backend no <https://uptimerobot.com>
   (grátis) com ping a cada 10 min. Cabe nas 750 h/mês do Render, e o cold start
   simplesmente deixa de acontecer.
3. **Mostrar na interface.** Se quiser tratar no código, o caminho é um estado de
   "acordando o servidor" no `Loading` quando a requisição passa de ~10 s. É
   alteração nos componentes, não incluída aqui.

---

## Se o portal bloquear IP estrangeiro

Risco descrito no `DEPLOY.md` do backend: o Render chama o
`transparencia.e-publica.net` a partir de um IP dos EUA. Se isso falhar, o front na
Vercel continua válido — só o backend muda de casa (Cloud Run em
`southamerica-east1`). Nesse caso basta atualizar `VITE_API_URL` na Vercel e
redeployar; nenhuma linha de código muda.
