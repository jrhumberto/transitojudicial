| Backlog | ID | Risco | Probabilidade | Impacto | Resposta | Plano de Mitigação |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TRUE | R01 | Exposição de credenciais/tokens no front-end | Alta | Crítico | Evitar | Mover credenciais para backend, evitar exposição no navegador. |
| TRUE | R02 | Vazamento de variáveis de ambiente (env.js) | Média | Alto | Mitigar | Remover dependência de env.js no front-end, usar variáveis de build seguras. |
| TRUE | R03 | Injeção ou dados malformados no número do processo | Média | Alto | Mitigar | Validar rigorosamente a entrada do número do processo (regex/sanitização). |
| TRUE | R04 | Quebra de UI/dados por movimentos/assuntos ausentes | Alta | Médio | Mitigar | Tratar cenários nulos/vazios para movimentos e assuntos no parseData. |
| TRUE | R05 | Má experiência do usuário (UX) por falta de feedback | Média | Médio | Mitigar | Adicionar loading state mais robusto durante chamadas assíncronas. |
| TRUE | R06 | Regressão funcional no parser de dados | Baixa | Alto | Mitigar | Incluir testes unitários e de integração específicos para parseData. |
| TRUE | R07 | Falhas silenciosas ou bloqueio por CORS/API | Média | Alto | Mitigar | Adicionar tratamento de erro específico para falhas de CORS e erros de API. |
| TRUE | R08 | Acesso não autorizado ao backend | Alta | Crítico | Evitar | Implementar autenticação real no backend (não apenas front-end). |
| TRUE | R09 | Abuso de API e falta de rastreabilidade | Média | Alto | Mitigar | Implementar rate limiting e logs de auditoria para monitoramento. |
| FALSE | R10 | Não conformidade com normas de proteção de dados (LGPD/GDPR) | Baixa | Alto | Mitigar | Consultoria jurídica, revisão de compliance e documentação adequada. |
| FALSE | R11 | Interface confusa ou pouco intuitiva | Média | Médio | Mitigar | Testes de usabilidade, protótipos e feedback de usuários reais. |
| FALSE | R12 | Perda de conhecimento técnico (Bus Factor) | Baixa | Médio | Mitigar | Documentação clara, pair programming e compartilhamento de conhecimento. |

