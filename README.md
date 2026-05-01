# transitojudicial

Aplicação web para autenticação simples e consulta de processos judiciais diretamente na API pública do **DATAJUD/CNJ**.

## Contexto de negócio

Um importante problema quando se estuda Jurimetria é saber a razoável duração de um processo em seu trâmite. Nessa linha, é relevante compreender o marco do "Trânsito em Julgado" como ponto de finalização. No entanto, alguns processos tem características peculiares que podem necessitar de mais de um marco assim, por isso esta aplicação vem no interesse de ofertar uma visão sintética que aduz se um processo teve mais de um "Trânsito em julgado"

A consulta em tribunais é um processo demasiadamente mecânico , com cada Egrégio com seu sistema de consulta. Um importante sintoma dessa difuiculdade é ofertar aos advogados um local para consultar processos e a API do Conselho Nacional de Justiça do DATAJUD veio para facilitar este acesso.

Dessa forma nossa aplicação realiza consultas nesta API e oferta um resultado que pode indicar se um processo teve ou não "trânsito em julgado" ou se mais de um marco assim e suas datas.

Exemplo de saída interessante de nossa aplicação:



## Visão geral da Aplicação

Este projeto oferece uma interface web para:

- realizar login com credenciais autorizadas;
- alternar entre tema claro e escuro;
- consultar um processo pelo número único do processo (NUP);
- exibir informações resumidas do processo retornadas pela API do DATAJUD e consultar se ele tem a **peculiaridade de duplo "trânsito em julgado"**.

A aplicação é composta por páginas estáticas em HTML, CSS e JavaScript.

## Funcionalidades

- **Login restrito**
  - autenticação baseada em credenciais definidas em `env.js` (não é boa prática deixar credenciais expostas);
  - redirecionamento após login;
  - expiração da sessão após 30 minutos.

- **Consulta de processo**
  - pesquisa por número único do processo;
  - seleção do tribunal;
  - exibição de dados como:
    - tribunal;
    - grau;
    - data de ajuizamento;
    - última atualização;
    - nível de sigilo;
    - assuntos;
    - classe;
    - sistema;
    - formato;
    - órgão julgador;
    - primeiro e último movimento;
    - ocorrência relacionada a julgamento.
    - checagem se houve um ou mais de um "trânsitado em julgado"

- **Tema claro/escuro**
  - persistência da preferência no `localStorage`.

- **Design responsivo**
  - interface adaptada para telas menores.

## Estrutura do projeto

```bash
.
├── index.html
├── login.html
├── home.html
├── datajud.html
├── script.js
├── styles.css
├── README.md
└── .github/
```



## Informações Técnicas


A página web contém como requisitos funcionais:
    - função de formatação de datas (parseData);
    - controle de tema;
    - autenticação;
    - validação de sessão;
    - consulta à API do DATAJUD;
    - renderização dos resultados e detecção de processo com "duplo trânsitado em julgado".


## Boas práticas recomendadas para versões futuras e backlog de segurança
    [ ] mover credenciais e tokens para backend;
    [ ] remover dependência de env.js no front-end;
    [ ] validar melhor a entrada do número do processo;
    [ ] tratar cenários em que movimentos ou assuntos estejam ausentes;
    [ ] adicionar loading state mais robusto;
    [ ] incluir testes para parseData;
    [ ] adicionar tratamento de erro específico para falhas de CORS e API.
    [ ] usar autenticação real no backend;
    [ ] evitar expor token da API no navegador;
    [ ] implementar rate limiting e logs de auditoria.

## Limitações

    autenticação é apenas client-side;
    depende de env.js;
    a consulta pode falhar se o proxy CORS estiver indisponível;
    o formato dos dados depende da resposta da API do DATAJUD.

## Tecnologias utilizadas

    HTML5
    CSS3
    JavaScript
    API pública do DATAJUD/CNJ

## Licença
Apache-2.0

## Referência

Documentação oficial da API pública do DATAJUD:
https://datajud-wiki.cnj.jus.br/api-publica/endpoints

