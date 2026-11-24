# Mercatto — Gestão de Estoque

Front-end Angular do projeto de residência. O aplicativo está na raiz deste repositório.

## Executar

Requer Node.js compatível com Angular 21, além da API Spring Boot e do PostgreSQL da equipe para exibir dados reais.

```sh
npm ci
npm start
```

Abra `http://localhost:4200/`. O proxy de desenvolvimento encaminha `/api` para `http://127.0.0.1:8080`. Use `npm run build` para gerar a versão de produção.

## Páginas

- `/dashboard`: indicadores de produtos, unidades em estoque, alertas e últimas movimentações.
- `/produtos` e `/categorias`: telas de cadastro desenvolvidas originalmente por Lorena Torres. O [README original do catálogo](docs/README-catalogo-original.md) foi preservado com seu histórico no Git.

O Dashboard lê `GET /api/produtos`, `GET /api/produtos/estoque-baixo` e `GET /api/movimentacoes`. A busca do cabeçalho abre a listagem de produtos. O back-end usado localmente para integração fica em `sistema-estoque-backend/` e está ignorado pelo Git deste repositório.

## Documentação

- [Levantamento do front-end](docs/levantamento-frontend.md)
- [Plano e estado da entrega da Pessoa 1](docs/plano-dashboard-pessoa-1.md)
