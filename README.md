# EstoqueUp — Gestão de Estoque

Front-end Angular do projeto de residência para gestão de estoque de supermercado. O sistema consulta produtos e categorias, mostra indicadores no Dashboard e oferece telas de cadastro e edição. A API é feita em Java/Spring Boot com PostgreSQL e pertence a um repositório separado da equipe.

## Documentação

- [Plano de tarefas do front-end](docs/Plano-tarefas-Frontend.md): responsabilidades das Pessoas 1, 2 e 3, validações e pendências.
- [Style guide](docs/style-guide.md): tipografia, cores, componentes e espaçamento da interface.
- [Integração com o backend local](docs/Integracao-backend-local.md): mudanças locais a transportar para o repositório das Pessoas 4, 5 e 6, com motivos e contrato esperado pelo Angular.

## Situação do projeto

- **Pessoa 1:** estrutura, navegação, Dashboard, catálogo de consulta e complementos de interface implementados. Os fluxos e ajustes recentes foram validados; a revisão visual ampla do Dashboard continua registrada no [plano do front-end](docs/Plano-tarefas-Frontend.md).
- **Pessoa 2:** telas de produtos e categorias integradas e validadas. A base original dessas telas foi desenvolvida por Lorena Torres; os commits originais permanecem no histórico do Git.
- **Pessoa 3:** tela completa de movimentações, formulários de entrada/saída e histórico ainda pendentes. O Dashboard já mostra as últimas movimentações em modo de consulta.
- **Pessoas 4, 5 e 6:** alguns ajustes necessários à integração existem somente em um backend local separado. O [repasse técnico do backend](docs/Integracao-backend-local.md) descreve o que precisa ser revisado e incorporado pela equipe.

## Tecnologias e estrutura

| Camada | Tecnologia | Onde está |
| --- | --- | --- |
| Interface | Angular 21 e TypeScript | `src/` neste repositório |
| API | Java 21 e Spring Boot | Repositório da equipe de backend |
| Banco de dados | PostgreSQL | Configurado pela equipe de backend |

O Angular está na raiz deste repositório. `src/app/pages/` contém as páginas; `src/app/layout/` contém sidebar e header; `src/app/services/` concentra as chamadas HTTP; `src/app/app.routes.ts` define as rotas. A pasta local `sistema-estoque-backend/`, quando existir, é **ignorada pelo Git deste frontend** e não entra no commit ou merge daqui.

## Executar no desenvolvimento

1. Instale uma versão de Node.js compatível com Angular 21 e as dependências do projeto:

   ```sh
   npm ci
   ```

2. Inicie a API Spring Boot da equipe com PostgreSQL, ouvindo em `http://127.0.0.1:8080`. A configuração do banco e o comando de execução ficam no repositório do backend. Para reproduzir os fluxos de saldo inicial, edição de saldo e arquivamento, a API precisa incorporar as regras do [repasse técnico](docs/Integracao-backend-local.md).

3. Inicie o Angular:

   ```sh
   npm start
   ```

4. Abra `http://localhost:4200/`. O [proxy de desenvolvimento](proxy.conf.json) encaminha chamadas `/api/**` para `http://127.0.0.1:8080`. Se a API estiver desligada, as páginas mostram estados de erro e não conseguirão carregar ou salvar dados.

Para gerar e verificar o pacote de produção do frontend:

```sh
npm run build
```

O resultado fica em `dist/catalogo/`. Ao hospedar o Angular, configure fallback para `index.html` nas rotas da aplicação e encaminhe `/api` à API da equipe. O `proxy.conf.json` é usado pelo servidor de desenvolvimento, não substitui essa configuração de hospedagem.

## Páginas e navegação

| Rota | Finalidade |
| --- | --- |
| `/dashboard` | Total de produtos, unidades em estoque, alertas e últimas movimentações. “Ver itens em atenção” abre a gestão de produtos filtrada por estoque baixo. |
| `/catalogo` | Consulta de produtos com busca por nome ou código, filtro por categoria e exibição de preço e disponibilidade. Não possui ações de cadastro. |
| `/produtos` | Gestão de produtos: busca, filtro, paginação, cadastro, edição, detalhes e exclusão. No celular, a listagem aparece em cards. |
| `/categorias` | Gestão de categorias: busca, paginação, cadastro, edição, detalhes e exclusão. |

No menu, **Catálogo** abre a vitrine de consulta. **Estoque → Produtos/Categorias** abre as telas de gestão. Em telas pequenas, a sidebar abre sobre o conteúdo e pode ser fechada pela seta, pelo fundo escurecido ou pela navegação.

## Contrato com a API

O frontend usa a base relativa `/api`:

| Recurso | Endpoints utilizados |
| --- | --- |
| Produtos | `GET /api/produtos`, `POST /api/produtos`, `PUT /api/produtos/{id}`, `DELETE /api/produtos/{id}` |
| Categorias | `GET /api/categorias`, `POST /api/categorias`, `PUT /api/categorias/{id}`, `DELETE /api/categorias/{id}` |
| Dashboard | `GET /api/produtos/estoque-baixo`, `GET /api/movimentacoes` e `GET /api/produtos` |

O cadastro de produto envia `quantidadeInicial` para registrar uma entrada no histórico. A edição envia `quantidadeEmEstoque` como saldo final desejado; a API deve registrar a diferença como entrada ou saída. A exclusão arquiva o produto para preservar suas movimentações e tirá-lo do catálogo e dos indicadores. Essas regras, os exemplos de JSON, os responsáveis no backend e os pontos de atenção no banco estão detalhados em [Integração com o backend local](docs/Integracao-backend-local.md).
