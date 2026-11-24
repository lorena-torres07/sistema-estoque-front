# Gestão de Estoque — Parte 2

Front-end da Pessoa 2 do projeto de gestão de estoque. As telas Angular de **Produtos** e **Categorias** permitem listar, cadastrar, editar e excluir registros. A busca por nome aceita termos sem acento. A contagem em cada categoria abre a lista de produtos já filtrada.

## Executar o projeto

Use Node.js 20.19+ na série 20, 22.12+ na série 22 ou 24.x. Inicie o Spring Boot com o PostgreSQL da equipe. No terminal, entre na pasta deste projeto e use:

```sh
npm ci
npm start
```

Abra `http://localhost:4200/`. O arquivo `proxy.conf.json` encaminha as chamadas em `/api` para `http://127.0.0.1:8080`. Edite o destino se a API da equipe estiver em outra porta. O comando `npm run build` gera os arquivos em `dist/catalogo/browser`. Em produção, sirva o front-end e os endpoints `/api` na mesma origem, com fallback para `index.html` nas rotas Angular.

| Recurso | Listar e cadastrar | Editar e excluir |
| --- | --- | --- |
| Produtos | `GET` e `POST /api/produtos` | `PUT` e `DELETE /api/produtos/{id}` |
| Categorias | `GET` e `POST /api/categorias` | `PUT` e `DELETE /api/categorias/{id}` |

Os endpoints vêm do planejamento da equipe. Os DTOs abaixo são as suposições desta entrega e precisam ser conferidos com as Pessoas 4 e 5:

- Produto enviado: `{ "nome": "Café moído", "preco": 26.90, "categoriaId": 1, "codigoBarras": null }`. O código de barras é opcional. Quando preenchido, o formulário aceita de 8 a 14 dígitos.
- Categoria enviada: `{ "nome": "Mercearia", "descricao": "Grãos e farinhas" }`. A descrição é opcional e segue como uma string vazia se omitida.
- As listagens esperam arrays JSON com IDs numéricos. A listagem de produtos aceita tanto `categoriaId` quanto `categoria: { id }`. As operações de gravação aceitam respostas com ou sem corpo.
- A tela de categorias pede a transferência dos vínculos antes de excluir uma categoria em uso. Cabe também ao Spring Boot proteger a relação contra exclusões concorrentes.

`src/app/services/catalogo-api.ts` concentra as chamadas e o mapeamento dos produtos. Caso o contrato da equipe use campos diferentes ou paginação, ajuste o serviço e os modelos em `src/app/models`.

## Integrar no projeto da equipe

1. Copie `src/app/pages/produtos`, `src/app/pages/categorias`, `src/app/pages/shared`, `src/app/models` e `src/app/services` para os diretórios correspondentes.
2. Acrescente as duas entradas de `catalogoRoutes`, em `src/app/app.routes.ts`, à lista de rotas existente. Aponte os links do menu da equipe para `/produtos` e `/categorias`.
3. Confira se `provideHttpClient()` já está nos providers do app. Para trocar a URL base de `/api`, forneça `{ provide: CATALOGO_API_URL, useValue: 'http://localhost:8080/api' }` e configure CORS no Spring se as origens diferirem.
4. Para usar a mesma tipografia, instale `@fontsource/dm-sans` e `@fontsource/dm-serif-text` e copie os imports de fonte de `src/styles.css`. As folhas das telas já incluem fontes de sistema de reserva.

