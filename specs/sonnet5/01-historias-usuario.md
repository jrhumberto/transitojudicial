# Histórias de Usuário

> Formato: **Como** [ator], **quero** [ação], **para** [benefício].
> Cada história referencia o trecho de código que a implementa.

---

## Épico 1 — Autenticação e Sessão

### US01 — Login com credenciais autorizadas
**Como** usuário autorizado (advogado(a) ou pesquisador(a) de Jurimetria),
**quero** fazer login com usuário e senha,
**para** acessar as áreas restritas da aplicação (Home e Consulta Datajud).

> Fonte: `login.html` (campos `email`/`password`), `script.js` → `window.login()`, credenciais validadas contra `ALLOWED_USER1/PASS1` e `ALLOWED_USER2/PASS2` em `env.js`.

### US02 — Escolher destino após o login
**Como** usuário fazendo login,
**quero** escolher para onde serei redirecionado (Home ou Datajud),
**para** ir direto à tela que me interessa sem passos extras.

> Fonte: `login.html` → `<select id="redirect">` com opções `home.html` e `datajud.html` (Datajud pré-selecionado), usado por `window.login()`.

### US03 — Ver mensagem de erro em credenciais inválidas
**Como** usuário que digitou usuário/senha incorretos,
**quero** ver uma mensagem de erro clara,
**para** entender que preciso corrigir os dados e tentar novamente.

> Fonte: `script.js` → `document.getElementById("error").textContent = "❌ Credenciais inválidas."`.

### US04 — Sessão expirar automaticamente
**Como** usuário logado,
**quero** que minha sessão expire após 30 minutos de login,
**para** que o acesso à aplicação fique protegido caso eu esqueça de sair.

> Fonte: `script.js` → checagem `now - loginTime > 30 * 60 * 1000` nas páginas `home.html`, `dashboard.html`, `datajud.html`.

### US05 — Ser redirecionado ao login se não autenticado
**Como** visitante não autenticado tentando acessar Home ou Datajud diretamente,
**quero** ser automaticamente redirecionado para a tela de login,
**para** não conseguir contornar a autenticação.

> Fonte: `script.js` → `if (!isAuth || expired) { ... window.location.href = "login.html"; }`.

### US06 — Sair da aplicação (logout)
**Como** usuário logado,
**quero** clicar em "Sair",
**para** encerrar minha sessão e voltar à tela de login.

> Fonte: `home.html` (botão "🚪 Sair"), `script.js` → `window.logout()`.

### US07 — Ser redirecionado da raiz do site para o login
**Como** usuário que acessa a URL raiz da aplicação,
**quero** ser levado automaticamente para a tela de login,
**para** não precisar saber o nome exato do arquivo de login.

> Fonte: `index.html` → `<meta http-equiv="refresh" content="0; URL=login.html" />`.

---

## Épico 2 — Consulta de Processo Judicial (Datajud)

### US08 — Consultar processo pelo número único (NUP)
**Como** usuário autenticado,
**quero** digitar o número único de um processo e escolher o tribunal,
**para** consultar seus dados diretamente na API pública do DATAJUD/CNJ.

> Fonte: `datajud.html` (`input#processo`, `select#tribunal`, botão "Confirmar"), `script.js` → `window.searchProcess()`.

### US09 — Selecionar o tribunal da consulta
**Como** usuário consultando um processo,
**quero** selecionar o tribunal correto (STJ, TJCE, TJSP, TRF1–TRF6),
**para** que a consulta seja feita no endpoint correto da API do DATAJUD.

> Fonte: `datajud.html` → `<select id="tribunal">`; `script.js` monta a URL `api_publica_${trib}`.

### US10 — Ver validação ao não informar número do processo
**Como** usuário que clica em "Confirmar" sem digitar um número,
**quero** ver uma mensagem informando que preciso informar o número do processo,
**para** corrigir a entrada antes de tentar novamente.

> Fonte: `script.js` → `if (!numero) { container.innerHTML = '<p class="error">❌ Informe o número do processo.</p>'; return; }`.

### US11 — Ver indicador de carregamento durante a consulta
**Como** usuário aguardando o retorno da API,
**quero** ver um indicador de "carregando",
**para** saber que minha consulta está em andamento.

> Fonte: `script.js` → `container.innerHTML = '<div class="result-card fade-in"><p>🔄 Carregando…</p></div>';`.

### US12 — Visualizar os dados resumidos do processo
**Como** usuário que consultou um processo encontrado,
**quero** ver tribunal, grau, data de ajuizamento, última atualização, nível de sigilo, assuntos, classe, sistema, formato, órgão julgador, primeiro e último movimento,
**para** entender rapidamente a situação do processo sem acessar o sistema do tribunal.

> Fonte: `script.js` → bloco de montagem do `result-card` dentro de `searchProcess()`.

### US13 — Identificar se o processo teve duplo (ou mais de um) trânsito em julgado
**Como** pesquisador(a) de Jurimetria,
**quero** que a aplicação destaque, entre os movimentos do processo, todas as ocorrências relacionadas a "julgado",
**para** identificar rapidamente se há mais de um marco de trânsito em julgado.

> Fonte: `script.js` → `const julg = vm.filter(a => a.nome.toLowerCase().includes('julgado'))...` renderizado em `.info-highlight`. Casos reais de teste em `docs/cases_test.md`.

### US14 — Ver mensagem quando o processo não é encontrado
**Como** usuário que consultou um número de processo inexistente,
**quero** ver uma mensagem clara de "processo não encontrado",
**para** saber que devo revisar o número digitado.

> Fonte: `script.js` → `if (hits.length === 0) { container.innerHTML = '<p class="error">❌ Processo não encontrado.</p>'; return; }`.

### US15 — Ver mensagem de erro em falha de consulta/API
**Como** usuário que tenta consultar um processo quando a API ou o proxy CORS falha,
**quero** ver uma mensagem de erro com detalhes,
**para** entender que o problema é técnico/externo e não da minha entrada.

> Fonte: `script.js` → bloco `try/catch` de `searchProcess()`, `container.innerHTML = '<p class="error">❌ Erro: ${err.message}</p>'`.

### US16 — Limpar o resultado da consulta
**Como** usuário que já visualizou o resultado de uma consulta,
**quero** clicar em "🧹 Limpar",
**para** apagar o resultado exibido e o campo de número do processo, e iniciar uma nova consulta.

> Fonte: `script.js` → botão `class="clear-btn"` dentro do `result-card`.

### US17 — Datas exibidas em formato legível (dd/mm/aaaa)
**Como** usuário lendo os dados do processo,
**quero** que datas em formatos técnicos (ISO, `yyyymmddhhmmss`) sejam convertidas para `dd/mm/aaaa` (com hora quando aplicável),
**para** entender as datas sem esforço de conversão manual.

> Fonte: `script.js` → função `parseData(str)`.

---

## Épico 3 — Preferências de Interface

### US18 — Alternar entre tema claro e escuro
**Como** usuário da aplicação,
**quero** alternar entre tema claro e escuro através de um botão do tipo switch,
**para** usar a interface no modo visual de minha preferência.

> Fonte: `login.html`, `home.html`, `datajud.html` → `.theme-toggle-wrapper` / `#theme-toggle`; `script.js` → `applyTheme()`, `setupThemeToggle()`.

### US19 — Ter minha preferência de tema lembrada
**Como** usuário que já escolheu um tema antes,
**quero** que a aplicação lembre minha preferência na próxima visita,
**para** não precisar alternar o tema toda vez que acesso o site.

> Fonte: `script.js` → `localStorage.getItem("theme")` / `localStorage.setItem("theme", newTheme)`.

### US20 — Usar a aplicação em uma tela pequena (celular)
**Como** usuário acessando pelo celular,
**quero** que os cards, títulos e botões se ajustem à largura da tela,
**para** conseguir usar a aplicação confortavelmente em qualquer dispositivo.

> Fonte: `styles.css` → `@media (max-width: 480px) { .card, .result-card { padding: 1.5rem; } ... }`.
