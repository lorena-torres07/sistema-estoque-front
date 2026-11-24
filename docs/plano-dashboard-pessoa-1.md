# Plano de implementação — Pessoa 1

Escopo: estrutura visual, navegação e Dashboard do front-end Angular. As páginas de Produtos e Categorias continuam acessíveis; formulários de movimentação pertencem à Pessoa 3.

## Estado da entrega

- [x] App Angular movido para a raiz em um commit com renomeações puras, preservando o histórico de Lorena Torres.
- [x] Rota `/dashboard` como tela inicial; rotas de Produtos e Categorias mantidas.
- [x] Header, sidebar e layout responsivo.
- [x] Cards de total de produtos, soma das unidades em estoque e contagem de produtos com estoque baixo, obtidos da API.
- [x] Tabelas de alertas de estoque baixo e últimas movimentações, em modo de consulta.
- [x] Estados de carregamento, vazio, erro e tentativa de novo.
- [x] Busca do cabeçalho encaminhada à listagem de Produtos.
- [x] Build de produção executado sem erros.
- [ ] Validar no navegador com a API e PostgreSQL em execução.
- [ ] Registrar a rota e as ações de movimentação quando a Pessoa 3 entregar seus formulários.

## Critérios de implementação

| Etapa | Entrega | Critério de conclusão |
| --- | --- | --- |
| 1. Organizar rotas | Centralizar a configuração de rotas em `src/app/app.routes.ts`, adicionar `/dashboard` e fazer `/` abrir o Dashboard. Manter `/produtos` e `/categorias`; prever a entrada de `/movimentacoes` quando a Pessoa 3 entregar a página. | Navegação direta e atualização da página funcionam em cada rota existente; URLs desconhecidas têm destino definido. |
| 2. Layout principal | Separar header e sidebar em componentes de layout reutilizáveis, com área de conteúdo via `router-outlet`. Adicionar título e links de navegação com indicação da rota ativa. | Sidebar e header aparecem nas páginas atuais sem prejudicar as telas de catálogo; navegação acessível por teclado. |
| 3. Dashboard | Criar uma página própria com cards de total de produtos cadastrados, total de unidades em estoque e produtos com estoque baixo. | Cada métrica tem título e unidade claros; o estado vazio é diferente de falha ao carregar. |
| 4. Integração HTTP | Serviço próprio para consultar produtos, estoque baixo e movimentações; tratar carregamento, erro e tentativa de novo. | Indicadores vêm da API real; nenhuma quantidade é inventada a partir da contagem de produtos. |
| 5. Responsividade | Adaptar sidebar, header e cards para desktop e celular; conferir navegação e conteúdo em larguras pequenas. | Não há rolagem horizontal indevida; links, botões e indicadores continuam legíveis e utilizáveis. |
| 6. Verificação | Executar build e conferir rotas e estados do Dashboard. Testar com a API integrada quando disponível. | Build sem erros; métricas correspondem aos dados retornados pelo Spring Boot. |

## Contrato real usado pelo Dashboard

O back-end local em `sistema-estoque-backend/` foi inspecionado. Ele não faz parte deste repositório Git e é ignorado por `.gitignore`.

| Endpoint | Uso |
| --- | --- |
| `GET /api/produtos` | Total de cadastros pelo tamanho da lista e quantidade de unidades pela soma de `quantidadeEmEstoque`. O endpoint atual retorna a lista completa, sem paginação. |
| `GET /api/produtos/estoque-baixo` | Contagem e tabela de alertas. O back-end usa `quantidadeEmEstoque <= estoqueMinimo`, inclusive produtos zerados. |
| `GET /api/movimentacoes` | Cinco movimentações mais recentes. O serviço do back-end entrega a lista da mais recente para a mais antiga. |

O DTO de movimentação não informa usuário responsável; não há dados para percentuais de crescimento nem perfil de usuário. Por isso esses elementos ilustrativos da referência visual não são exibidos como dados reais. As ações de entrada e saída aguardam a tela da Pessoa 3.

O `ProdutoRequestDTO` do back-end exige `estoqueMinimo`. O formulário de Produtos foi ajustado para enviá-lo; `quantidadeEmEstoque` é controlada pelo serviço de movimentações. A resposta de erro do back-end usa o campo `mensagem`.

## Verificação

Executar `npm run build` e validar as telas com API e PostgreSQL em funcionamento. Na falta da API, o Dashboard deve mostrar um erro com opção de tentar novamente, sem números fictícios.
