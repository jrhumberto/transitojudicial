# Critérios de Aceitação

## Feature: Login e Segurança de Sessão
- **Cenário 1:** Login bem-sucedido
  - **Dado** que o usuário está na página de login
  - **Quando** insere credenciais válidas (ex: teste/teste) e clica em "Entrar"
  - **Então** o sistema deve redirecioná-lo para a página selecionada (Home ou Datajud) e armazenar "true" na chave `authenticated` do localStorage.
- **Cenário 2:** Login inválido
  - **Dado** que o usuário está na página de login
  - **Quando** insere credenciais inválidas e clica em "Entrar"
  - **Então** o sistema deve exibir a mensagem "❌ Credenciais inválidas." e permanecer na página de login.
- **Cenário 3:** Expiração de Sessão
  - **Dado** que o usuário está logado há mais de 30 minutos
  - **Quando** tenta acessar ou interagir com as páginas restritas (home.html, datajud.html)
  - **Então** o sistema deve limpar a sessão do localStorage e redirecionar forçadamente para `login.html`.

## Feature: Alternância de Tema
- **Cenário 1:** Salvar preferência de tema
  - **Dado** que o usuário está em qualquer página
  - **Quando** clica no botão de alternância de tema (interruptor)
  - **Então** a interface deve mudar imediatamente para o tema oposto e a escolha deve ser salva no `localStorage` para persistir em futuras visitas.

## Feature: Consulta e Exibição de Processo (Datajud)
- **Cenário 1:** Consulta de processo existente
  - **Dado** que o usuário está autenticado na página Datajud
  - **Quando** digita um NUP válido e seleciona um tribunal (ex: STJ)
  - **Então** o sistema deve exibir um card de resultado contendo: Tribunal, Grau, Data de Ajuizamento, Última Atualização, Nível de Sigilo, Assuntos, Classe, Sistema, Formato, Órgão Julgador, Primeiro e Último Movimento.
- **Cenário 2:** Formatação de datas
  - **Dado** que a API retorna datas em formatos variados (ISO 8601, yyyymmddhhmmss, etc)
  - **Quando** os dados são exibidos na tela
  - **Então** todas as datas devem aparecer no formato dd/mm/aaaa ou dd/mm/aaaa hh:mm:ss. Se a data for inválida ou ausente, deve exibir "**/**/****".
- **Cenário 3:** Campo de processo vazio
  - **Dado** que o usuário está na página Datajud
  - **Quando** clica em "Confirmar" sem digitar o número do processo
  - **Então** o sistema deve exibir "❌ Informe o número do processo." e não fazer a requisição à API.

## Feature: Destaque de Trânsito em Julgado
- **Cenário 1:** Processo com Trânsito em Julgado
  - **Dado** que o processo consultado possui movimentos com a palavra "julgado"
  - **Quando** o resultado é renderizado
  - **Então** deve aparecer uma caixa de destaque no rodapé do resultado listando o código e a data de cada ocorrência encontrada.
- **Cenário 2:** Processo sem Trânsito em Julgado
  - **Dado** que o processo consultado não possui movimentos com a palavra "julgado"
  - **Quando** o resultado é renderizado
  - **Então** a caixa de destaque não deve ser exibida.