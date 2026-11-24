# Levantamento inicial do front-end

Data do levantamento: 24/11/2026. Este documento registra o estado **antes** da implementação da Pessoa 1. Para o estado atual, veja o [plano e estado da entrega](plano-dashboard-pessoa-1.md). O aplicativo Angular foi movido para a raiz em um commit exclusivo de renomeações.

## Estrutura encontrada

- O app Angular estava em `Gestão de Estoque - Parte 2/`; agora está na raiz. O `package.json` declara Angular 21.2, TypeScript 5.9 e scripts `npm start` e `npm run build`.
- O projeto usa componentes standalone. [`src/main.ts`](../src/main.ts) inicializa o app e registra `provideHttpClient()`. O estado inicial das rotas está registrado no histórico do Git; [`src/app/app.routes.ts`](../src/app/app.routes.ts) já inclui o Dashboard.
- O componente inicial tinha cabeçalho, abas e `router-outlet`, com redirecionamento para `/produtos`. O [componente atual](../src/app/app.component.ts) usa o novo layout.
- [`src/styles.css`](../src/styles.css) contém estilos globais; as páginas de catálogo têm regras em `src/app/pages/shared/catalogo.css`.
- [`src/app/services/catalogo-api.ts`](../src/app/services/catalogo-api.ts) concentra chamadas a `/api/produtos` e `/api/categorias`. O [`proxy.conf.json`](../proxy.conf.json) aponta `/api/**` para `http://127.0.0.1:8080` durante o desenvolvimento.
- O back-end foi adicionado localmente em `sistema-estoque-backend/` e está ignorado pelo Git deste repositório. Seu contrato foi inspecionado após este levantamento inicial.

## Situação por área

| Área | Já existe no código | Ainda falta ou depende de validação |
| --- | --- | --- |
| Estrutura e Dashboard — Pessoa 1 | App Angular configurado; rotas de catálogo; cabeçalho simples; navegação por abas; estilos responsivos básicos. | Layout principal com sidebar e header adequados ao sistema completo; rota inicial `/dashboard`; Dashboard; indicadores; integração com dados de estoque; responsividade do novo layout. |
| Produtos e Categorias — Pessoa 2 | Páginas de listagem, cadastro, edição e exclusão; busca de produtos por nome; filtro por categoria; validações; estados de carregamento e erro; serviço HTTP. | Confirmar DTOs e endpoints com o back-end e validar os fluxos ponta a ponta. O modelo atual de produto não contém quantidade em estoque. |
| Movimentações — Pessoa 3 | Nenhuma página, rota, modelo ou serviço de movimentação foi encontrado. | Formulários de entrada e saída, seleção de produto, histórico, mensagens e integração com a API. |

As telas de Produtos e Categorias estão **implementadas no código**, mas não devem ser consideradas integradas ou entregues sem teste com a API real. A contagem exibida na página de Categorias representa **número de produtos por categoria**, não unidades em estoque.

## Contrato de dados conhecido

O modelo inicial de `Produto` possuía `id`, `nome`, `preco`, `categoriaId` e `codigoBarras` opcional. A versão atual está em [`src/app/models/produto.ts`](../src/app/models/produto.ts). `Categoria` possui `id`, `nome` e `descricao` opcional.

O README original do catálogo descreve os DTOs como suposições da entrega da Pessoa 2. Depois deste levantamento, o back-end local confirmou `quantidadeEmEstoque` e `estoqueMinimo` em `GET /api/produtos`, além de `GET /api/produtos/estoque-baixo`.

## Verificação deste levantamento

- Inspeção estática dos arquivos de configuração, rotas, componentes, modelos e serviços.
- Não foi executado `npm run build`: `node_modules` não está instalado neste checkout.
- Não foi feito teste com o Spring Boot ou PostgreSQL: o back-end não está neste repositório.
