# Casos de Uso

Ator principal: **Usuário** (advogado(a)/pesquisador(a) autorizado(a), credenciado via `env.js`).
Ator de apoio: **API pública DATAJUD/CNJ** (via proxy CORS `corsproxy.io`).

---

## UC01 — Efetuar Login

**Atores:** Usuário
**Pré-condições:** Usuário está em `login.html`; `env.js` carregado com sucesso.
**Pós-condições (sucesso):** `localStorage.authenticated = "true"`, `localStorage.loginTime` definido; navegador redirecionado para a página escolhida.

**Fluxo principal:**
1. Usuário acessa `index.html`, que redireciona automaticamente para `login.html`.
2. Usuário informa usuário (`email`) e senha (`password`).
3. Usuário seleciona o destino pós-login em `select#redirect` (Home ou Datajud; Datajud vem pré-selecionado).
4. Usuário clica em "Entrar" (`onclick="login()"`).
5. Sistema compara as credenciais informadas com `ALLOWED_USER1/PASS1` ou `ALLOWED_USER2/PASS2` de `window.env`.
6. Credenciais válidas → sistema grava `authenticated=true` e `loginTime` no `localStorage` e redireciona para a página escolhida (`home.html` por padrão, se nenhum destino for informado).

**Fluxos alternativos / exceção:**
- **A1 – Credenciais inválidas:** sistema exibe `#error` com "❌ Credenciais inválidas." e permanece em `login.html` (passo 5).
- **A2 – `env.js` não carregado:** sistema exibe "⚠️ Erro ao carregar variáveis de ambiente." e interrompe o login (passo 5).

**Regras de negócio:**
- Apenas as duas credenciais definidas em `env.js` são aceitas (autenticação client-side, conforme limitação documentada no README).

---

## UC02 — Manter/Expirar Sessão

**Atores:** Usuário
**Pré-condições:** Usuário navega para `home.html`, `dashboard.html` ou `datajud.html`.
**Pós-condições:** Usuário permanece na página (sessão válida) ou é redirecionado a `login.html` (sessão inválida/expirada).

**Fluxo principal:**
1. Ao carregar uma dessas páginas, o script lê `localStorage.authenticated` e `localStorage.loginTime`.
2. Sistema calcula `now - loginTime`.
3. Se `authenticated === "true"` e o tempo decorrido é ≤ 30 minutos, a página é exibida normalmente.

**Fluxos alternativos / exceção:**
- **A1 – Não autenticado:** `authenticated !== "true"` → sistema limpa `localStorage` e redireciona para `login.html`.
- **A2 – Sessão expirada:** tempo decorrido > 30 minutos → sistema limpa `localStorage` e redireciona para `login.html`.

---

## UC03 — Encerrar Sessão (Logout)

**Atores:** Usuário
**Pré-condições:** Usuário autenticado em `home.html` (ou outra página com `logout()` disponível).
**Pós-condições:** `localStorage.authenticated` e `localStorage.loginTime` removidos; usuário em `login.html`.

**Fluxo principal:**
1. Usuário clica no botão "🚪 Sair" em `home.html`.
2. Sistema executa `window.logout()`, removendo `authenticated` e `loginTime` do `localStorage`.
3. Sistema redireciona o usuário para `login.html`.

---

## UC04 — Consultar Processo Judicial

**Atores:** Usuário; API pública DATAJUD/CNJ (via proxy `corsproxy.io`)
**Pré-condições:** Usuário autenticado e em `datajud.html`; sessão válida (ver UC02).
**Pós-condições (sucesso):** Dados do processo exibidos em `#result-container`.

**Fluxo principal:**
1. Usuário digita o número único do processo em `input#processo` (com ou sem pontuação — os não-dígitos são removidos via `replace(/\D/g, '')`).
2. Usuário seleciona o tribunal em `select#tribunal` (STJ é o valor padrão).
3. Usuário clica em "Confirmar" (`onclick="searchProcess()"`).
4. Sistema limpa o container de resultado e exibe "🔄 Carregando…".
5. Sistema monta a URL da API `https://api-publica.datajud.cnj.jus.br/api_publica_{tribunal}/_search`, codifica-a e a envia através do proxy `https://corsproxy.io/?url=...`.
6. Sistema faz `POST` com header `Authorization: {AUTHORIZED}` e corpo `{ query: { match: { numeroProcesso: numero } } }`.
7. API retorna resultado; sistema lê `json.hits.hits`.
8. Havendo ao menos um resultado, sistema extrai do primeiro *hit* (`_source`): tribunal, grau, datas (via `parseData`), nível de sigilo, assuntos, classe, sistema, formato, órgão julgador, primeiro/último movimento.
9. Sistema executa UC05 (detecção de trânsito em julgado) sobre a lista de movimentos.
10. Sistema renderiza o `result-card` com todos os dados e, se aplicável, o destaque de trânsito em julgado, mais o botão "🧹 Limpar".

**Fluxos alternativos / exceção:**
- **A1 – Número do processo vazio:** ao clicar em Confirmar sem preencher `#processo`, sistema exibe "❌ Informe o número do processo." e interrompe o fluxo (não chama a API).
- **A2 – Nenhum processo encontrado:** `hits.length === 0` → sistema exibe "❌ Processo não encontrado." (passo 7).
- **A3 – Falha de rede/HTTP:** `resp.ok === false` (ou exceção em qualquer etapa do `try`) → sistema exibe `❌ Erro: {mensagem}` (passo 5–9). Cobre falhas do proxy CORS ou da API do DATAJUD, conforme limitação documentada no README.

**Regras de negócio:**
- Apenas os tribunais listados (STJ, TJCE, TJSP, TRF1–TRF6) são suportados, conforme opções fixas em `select#tribunal`.
- Datas ausentes/malformadas são exibidas como `**/**/****` (comportamento padrão de `parseData` quando nenhum formato reconhecido).

---

## UC05 — Detectar Ocorrência(s) de Trânsito em Julgado

**Atores:** Sistema (parte do fluxo de UC04, passo 9)
**Pré-condições:** Lista de `movimentos` do processo disponível a partir da resposta da API.
**Pós-condições:** Destaque visual (`.info-highlight`) exibido quando houver ao menos um movimento correspondente; nada é exibido caso contrário.

**Fluxo principal:**
1. Sistema filtra todos os itens de `movimentos` cujo `nome` (em minúsculas) contenha o texto "julgado".
2. Para cada movimento filtrado, sistema monta uma linha com código do movimento (`.invisible-code`, revelado ao passar o mouse/foco), nome do movimento e data formatada (`parseData`).
3. Se houver um ou mais movimentos filtrados, sistema exibe um bloco `.info-highlight` com ícone "✅" e a lista de ocorrências — permitindo identificar visualmente se houve **mais de um** "trânsito em julgado" (o problema de negócio central do projeto, conforme README).

**Fluxos alternativos:**
- **A1 – Nenhum movimento com "julgado":** bloco `.info-highlight` não é renderizado (string vazia).

**Casos de teste conhecidos (`docs/cases_test.md`):**
- Processos com trânsito único: `0002213-52.2010.4.02.5103`, `0035440-04.2009.4.03.6182`, `5007797-89.2020.4.04.0000`.
- Processos com **duplo** trânsito em julgado: `0049481-77.1999.4.03.6100`, `0000506-54.2015.4.03.6135`, `5013500-16.2021.4.04.7000`, `5033119-39.2015.4.04.7000`.

---

## UC06 — Alternar Tema Claro/Escuro

**Atores:** Usuário
**Pré-condições:** Qualquer página da aplicação carregada (`login.html`, `home.html`, `datajud.html`).
**Pós-condições:** `document.body.className` atualizado (`light` ou `dark`); preferência salva em `localStorage.theme`.

**Fluxo principal:**
1. Ao carregar a página, sistema executa `applyTheme()`, lendo `localStorage.theme` (padrão: `light`) e aplicando a classe correspondente ao `<body>`.
2. Usuário clica no switch `#theme-toggle`.
3. Sistema grava o novo tema em `localStorage.theme` e reaplica `applyTheme()`.

**Fluxos alternativos:** nenhum (comportamento binário, sem estados de erro).

---

## UC07 — Limpar Resultado da Consulta

**Atores:** Usuário
**Pré-condições:** Um resultado de consulta (`.result-card`) está exibido em `datajud.html`.
**Pós-condições:** `#result-container` e `#processo` esvaziados.

**Fluxo principal:**
1. Usuário clica em "🧹 Limpar" dentro do `result-card`.
2. Sistema esvazia `#result-container.innerHTML` e `#processo.value`.
