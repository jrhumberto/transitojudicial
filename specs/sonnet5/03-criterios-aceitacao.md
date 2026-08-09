# Critérios de Aceitação (Gherkin)

Numeração alinhada às histórias de usuário em `01-historias-usuario.md`.

---

## US01 / UC01 — Login com credenciais autorizadas

```gherkin
Cenário: Login com credenciais válidas
  Dado que estou na página "login.html"
  E "env.js" foi carregado com sucesso
  Quando informo um usuário e senha correspondentes a ALLOWED_USER1/ALLOWED_PASS1 ou ALLOWED_USER2/ALLOWED_PASS2
  E clico em "Entrar"
  Então "localStorage.authenticated" deve ser definido como "true"
  E "localStorage.loginTime" deve ser definido com o timestamp atual
  E devo ser redirecionado para a página selecionada em "redirect" (ou "home.html" se nenhuma for informada)

Cenário: Tentativa de login com credenciais inválidas
  Dado que estou na página "login.html"
  Quando informo um usuário ou senha que não correspondem a nenhuma das credenciais autorizadas
  E clico em "Entrar"
  Então devo ver a mensagem "❌ Credenciais inválidas."
  E devo permanecer na página "login.html"

Cenário: env.js indisponível
  Dado que estou na página "login.html"
  E a variável "window.env" não está definida
  Quando clico em "Entrar"
  Então devo ver a mensagem "⚠️ Erro ao carregar variáveis de ambiente."
```

## US02 — Escolher destino após login

```gherkin
Cenário: Selecionar "Home" como destino
  Dado que estou na página "login.html"
  Quando seleciono a opção "🏠 Home" no campo de destino
  E informo credenciais válidas e clico em "Entrar"
  Então devo ser redirecionado para "home.html"

Cenário: Selecionar "Datajud" como destino (padrão)
  Dado que estou na página "login.html"
  E a opção "⚖️ Datajud" já vem selecionada por padrão
  Quando informo credenciais válidas e clico em "Entrar" sem alterar o destino
  Então devo ser redirecionado para "datajud.html"
```

## US04 / UC02 — Expiração automática de sessão

```gherkin
Cenário: Sessão ainda válida
  Dado que fiz login há menos de 30 minutos
  Quando acesso "home.html", "dashboard.html" ou "datajud.html"
  Então a página deve ser exibida normalmente

Cenário: Sessão expirada
  Dado que fiz login há mais de 30 minutos
  Quando acesso "home.html", "dashboard.html" ou "datajud.html"
  Então "localStorage.authenticated" e "localStorage.loginTime" devem ser removidos
  E devo ser redirecionado para "login.html"
```

## US05 — Bloqueio de acesso sem autenticação

```gherkin
Cenário: Acesso direto sem login
  Dado que não estou autenticado ("localStorage.authenticated" ausente ou diferente de "true")
  Quando tento acessar "home.html" ou "datajud.html" diretamente pela URL
  Então devo ser redirecionado para "login.html"
```

## US06 / UC03 — Logout

```gherkin
Cenário: Logout a partir da Home
  Dado que estou autenticado e na página "home.html"
  Quando clico no botão "🚪 Sair"
  Então "localStorage.authenticated" e "localStorage.loginTime" devem ser removidos
  E devo ser redirecionado para "login.html"
```

## US07 — Redirecionamento da raiz

```gherkin
Cenário: Acesso à raiz do site
  Dado que acesso "index.html"
  Então devo ser redirecionado automaticamente para "login.html"
```

## US08–US09 / UC04 — Consultar processo por NUP e tribunal

```gherkin
Cenário: Consulta bem-sucedida de processo existente
  Dado que estou autenticado e na página "datajud.html"
  Quando informo um número de processo válido no campo "processo"
  E seleciono um tribunal suportado (STJ, TJCE, TJSP, TRF1–TRF6)
  E clico em "Confirmar"
  Então devo ver "🔄 Carregando…" enquanto a requisição está em andamento
  E, ao concluir, devo ver um cartão de resultado com tribunal, grau, data de ajuizamento, última atualização, nível de sigilo, assuntos, classe, sistema, formato, órgão julgador, primeiro e último movimento

Cenário: Número do processo digitado com pontuação
  Dado que estou na página "datajud.html"
  Quando informo o número do processo no formato "0002213-52.2010.4.02.5103"
  E clico em "Confirmar"
  Então a aplicação deve remover pontos e traços antes de enviar a consulta à API
```

## US10 — Validação de campo obrigatório

```gherkin
Cenário: Confirmar sem informar o número do processo
  Dado que estou na página "datajud.html"
  E o campo "processo" está vazio
  Quando clico em "Confirmar"
  Então devo ver a mensagem "❌ Informe o número do processo."
  E nenhuma requisição deve ser enviada à API do DATAJUD
```

## US12 — Exibição dos dados do processo

```gherkin
Cenário: Dados completos exibidos após consulta
  Dado que a consulta a um processo existente foi concluída com sucesso
  Então o cartão de resultado deve exibir o número do processo, tribunal, grau, data de ajuizamento formatada, última atualização formatada, nível de sigilo, lista de assuntos, classe, sistema, formato, órgão julgador, primeiro movimento e último movimento
```

## US13 / UC05 — Detectar duplo trânsito em julgado

```gherkin
Cenário: Processo com um único trânsito em julgado
  Dado que a lista de movimentos do processo contém exatamente um movimento cujo nome inclui "julgado"
  Quando o resultado é exibido
  Então o bloco de destaque "✅" deve mostrar uma única ocorrência de trânsito em julgado

Cenário: Processo com duplo trânsito em julgado
  Dado que a lista de movimentos do processo contém dois ou mais movimentos cujo nome inclui "julgado"
  Quando o resultado é exibido
  Então o bloco de destaque "✅" deve listar todas as ocorrências, cada uma com código, nome e data
  E o usuário deve conseguir identificar visualmente que houve mais de um trânsito em julgado

Cenário: Processo sem nenhum trânsito em julgado
  Dado que nenhum movimento do processo contém "julgado" no nome
  Quando o resultado é exibido
  Então o bloco de destaque "✅" não deve ser exibido
```

## US14 — Processo não encontrado

```gherkin
Cenário: Consulta sem resultados
  Dado que envio uma consulta para um número de processo válido, porém inexistente na base do tribunal selecionado
  Quando a API retorna uma lista de resultados vazia
  Então devo ver a mensagem "❌ Processo não encontrado."
```

## US15 — Erro de consulta/API

```gherkin
Cenário: Falha na chamada à API ou ao proxy CORS
  Dado que estou na página "datajud.html" com uma consulta em andamento
  Quando a requisição falha (erro de rede, timeout, resposta HTTP não "ok" ou proxy indisponível)
  Então devo ver a mensagem "❌ Erro: {detalhe do erro}"
```

## US16 / UC07 — Limpar resultado

```gherkin
Cenário: Limpar consulta exibida
  Dado que um resultado de consulta está sendo exibido em "datajud.html"
  Quando clico em "🧹 Limpar"
  Então o cartão de resultado deve desaparecer
  E o campo "processo" deve ser esvaziado
```

## US17 — Formatação de datas

```gherkin
Cenário: Data no formato yyyymmddhhmmss
  Dado que o valor bruto da data é "20190405000000"
  Quando a aplicação formata a data
  Então o valor exibido deve ser "05/04/2019 00:00:00"

Cenário: Data em formato ISO com hora
  Dado que o valor bruto da data é "2025-07-04T22:13:38.539Z"
  Quando a aplicação formata a data
  Então o valor exibido deve conter a data e a hora no padrão "dd/mm/aaaa hh:mm:ss"

Cenário: Data ausente ou em formato não reconhecido
  Dado que o valor bruto da data é nulo, vazio ou não corresponde a nenhum formato conhecido
  Quando a aplicação formata a data
  Então o valor exibido deve ser "**/**/****"
```

## US18–US19 / UC06 — Tema claro/escuro com persistência

```gherkin
Cenário: Alternar para tema escuro
  Dado que estou em qualquer página da aplicação com o tema "light" ativo
  Quando clico no switch de tema
  Então o "<body>" deve receber a classe "dark"
  E "localStorage.theme" deve ser definido como "dark"

Cenário: Preferência de tema mantida entre visitas
  Dado que defini o tema como "dark" em uma visita anterior
  Quando recarrego ou reabro a aplicação
  Então a página deve carregar com o tema "dark" já aplicado
```

## US20 — Responsividade

```gherkin
Cenário: Uso em tela pequena
  Dado que acesso a aplicação em uma viewport com largura máxima de 480px
  Então os cartões (".card", ".result-card") devem exibir o preenchimento reduzido definido na media query
  E o título e os botões devem se ajustar à largura disponível
```
