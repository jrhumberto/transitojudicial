# Casos de Uso

## UC01: Realizar Login no Sistema
**Ator Principal:** Usuário Autorizado
**Pré-condições:** O usuário deve possuir credenciais válidas (definidas no env.js).
**Fluxo Principal:**
1. O usuário acessa a página inicial (index.html) e é redirecionado para a tela de login.
2. O usuário insere seu e-mail e senha.
3. O usuário seleciona a página de destino (Home ou Datajud) no menu suspenso.
4. O usuário clica no botão "Entrar".
5. O sistema valida as credenciais comparando-as com as variáveis de ambiente.
6. O sistema armazena o estado de autenticação e o horário de login no `localStorage`.
7. O sistema redireciona o usuário para a página selecionada.
**Fluxo de Exceção (Credenciais Inválidas):** Se as credenciais não coincidirem, o sistema exibe a mensagem "❌ Credenciais inválidas." e não redireciona.

## UC02: Alternar Tema (Claro/Escuro)
**Ator Principal:** Usuário
**Pré-condições:** Estar em qualquer página do sistema.
**Fluxo Principal:**
1. O usuário clica no interruptor de tema localizado no canto superior direito.
2. O sistema altera a classe do `body` para 'dark' ou 'light'.
3. O sistema salva a preferência no `localStorage` sob a chave "theme".
4. A preferência é aplicada automaticamente em carregamentos de página futuros.

## UC03: Consultar Processo na API do DATAJUD
**Ator Principal:** Usuário Logado
**Pré-condições:** Estar autenticado e na página `datajud.html`.
**Fluxo Principal:**
1. O usuário digita o Número Único do Processo (NUP).
2. O usuário seleciona o tribunal desejado (ex: STJ, TJSP).
3. O usuário clica em "Confirmar".
4. O sistema remove caracteres não numéricos do NUP.
5. O sistema exibe um indicador de carregamento ("🔄 Carregando…").
6. O sistema envia a requisição para a API do DATAJUD através do proxy CORS.
7. O sistema recebe os dados, formata as datas (usando a função `parseData`) e exibe as informações resumidas na tela (Tribunal, Grau, Assuntos, Movimentos, etc.).
**Fluxo de Exceção (Processo não encontrado):** O sistema exibe "❌ Processo não encontrado."
**Fluxo de Exceção (Erro de API/CORS):** O sistema exibe a mensagem de erro técnico retornado.

## UC04: Destaque para Trânsito em Julgado
**Ator Principal:** Sistema (como extensão do UC03)
**Fluxo Principal:**
1. Ao receber os movimentos processuais, o sistema filtra aqueles cujo nome contém a palavra "julgado".
2. Se houver ocorrências, o sistema gera uma caixa de destaque visual (`info-highlight`).
3. O sistema lista todas as ocorrências de julgamento com seus respectivos códigos (ocultos, revelados ao passar o mouse) e datas formatadas.
4. Se houver mais de uma data, o pesquisador identifica visualmente o "duplo trânsito em julgado".

## UC05: Encerrar Sessão (Logout)
**Ator Principal:** Usuário Logado
**Fluxo Principal:**
1. O usuário clica no botão "Sair" (presente na Home).
2. O sistema remove as chaves "authenticated" e "loginTime" do `localStorage`.
3. O sistema redireciona o usuário para a tela de login.