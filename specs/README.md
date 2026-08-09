# Specs — transitojudicial

Esta pasta contém a especificação funcional do projeto **transitojudicial**, elaborada **exclusivamente a partir do código-fonte existente no repositório** (`index.html`, `login.html`, `home.html`, `datajud.html`, `script.js`, `styles.css`, `README.md`, `docs/cases_test.md`, `docs/first_prompt.md`, `riscos/mapa_riscos.md`).

Nenhuma funcionalidade nova foi inventada: tudo aqui documenta o comportamento que já está implementado no código, na forma de artefatos de engenharia de requisitos.

## Conteúdo

| Arquivo | Descrição |
| --- | --- |
| [`01-historias-usuario.md`](./01-historias-usuario.md) | Histórias de usuário (formato "Como... quero... para...") derivadas das telas e funções do `script.js` |
| [`02-casos-de-uso.md`](./02-casos-de-uso.md) | Casos de uso detalhados (ator, pré-condições, fluxo principal, fluxos alternativos/exceção, pós-condições) |
| [`03-criterios-aceitacao.md`](./03-criterios-aceitacao.md) | Critérios de aceitação no formato Gherkin (Dado/Quando/Então) para cada história de usuário |
| [`prototipo/prototipo-telas.html`](./prototipo/prototipo-telas.html) | Protótipo navegável (HTML/CSS estático) reproduzindo as telas de Login, Home e Consulta Datajud, reaproveitando os tokens visuais de `styles.css` |

## Rastreabilidade com o código

| Tela / Funcionalidade | Arquivo(s) fonte |
| --- | --- |
| Redirecionamento inicial | `index.html` |
| Login e expiração de sessão | `login.html`, `script.js` (`login()`, checagem de `loginTime`) |
| Home / Logout | `home.html`, `script.js` (`logout()`) |
| Consulta de processo (Datajud) | `datajud.html`, `script.js` (`searchProcess()`, `parseData()`) |
| Detecção de duplo trânsito em julgado | `script.js` (filtro `julg` sobre `movimentos`), casos reais em `docs/cases_test.md` |
| Tema claro/escuro | `script.js` (`applyTheme()`, `setupThemeToggle()`), `styles.css` |
| Riscos conhecidos e limitações | `riscos/mapa_riscos.md`, seção "Limitações" do `README.md` |

## Fora de escopo

Itens listados no README como "boas práticas recomendadas para versões futuras" (ex.: autenticação real em backend, remoção de `env.js`, rate limiting) **não** foram tratados como requisitos atuais — eles aparecem apenas como observações de risco/débito técnico nos casos de uso e no protótipo, pois ainda não estão implementados no código.
