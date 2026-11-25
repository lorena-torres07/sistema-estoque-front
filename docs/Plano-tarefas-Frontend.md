# Plano do front-end — Pessoas 1, 2 e 3

Atualizado em 24/11/2026 a partir da divisão de tarefas da equipe, do código Angular e das validações relatadas pela desenvolvedora.

Este plano acompanha **todo o front-end Angular**, dividido entre as Pessoas 1, 2 e 3. As entregas Java/PostgreSQL das Pessoas 4 a 6 não são avaliadas aqui.

**Como ler o status:** “Feito” significa que a funcionalidade está no código. “Validado” indica também confirmação do fluxo em execução. “Parcial” significa que existe apenas parte da tarefa, sem completar a entrega da pessoa responsável. “Verificar” indica código existente que ainda precisa de conferência manual antes da entrega final.

## Visão geral

| Pessoa | Situação atual | Principal pendência |
| --- | --- | --- |
| 1 — Estrutura, Dashboard e complementos do front-end | Dashboard funcional; catálogo de consulta, navegação, listagem, modais e atalhos validados pela desenvolvedora | Revisão visual ampla do Dashboard permanece como tarefa separada. |
| 2 — Produtos e Categorias | Listagens, cadastros, edição, exclusão e busca validados pela desenvolvedora | A lixeira segue como ideia futura e depende de decisão com a equipe. |
| 3 — Movimentação de estoque | Consulta recente disponível somente no Dashboard | Criar página, formulários de entrada/saída e fluxo completo com a API. |

## Pessoa 1 — Estrutura e Dashboard

| Tarefa da divisão | Status | Evidência e próximo passo |
| --- | --- | --- |
| Criar e configurar o projeto Angular | Feito | App standalone Angular 21 configurado em `package.json`, `angular.json` e `src/main.ts`. A base do catálogo veio da entrega original de Lorena Torres. |
| Configurar rotas em `app.routes.ts` | Feito | `/` abre `/dashboard`; `/catalogo` é a consulta de produtos; `/produtos` e `/categorias` são as telas de gestão em [`app.routes.ts`](../src/app/app.routes.ts). |
| Criar layout principal, sidebar e header | Validado pela desenvolvedora | [`app.component.ts`](../src/app/app.component.ts) organiza o layout. A sidebar tem **Catálogo** separado do grupo **Estoque**, que contém **Produtos** e **Categorias**. Em telas pequenas, uma seta no header abre o menu sobre a página; a seta de fechar, o fundo escurecido, a navegação e Escape o fecham. A sidebar permanece fixa na rolagem da página. |
| Desenvolver a tela Dashboard | Feito | Página em `src/app/pages/dashboard` com cards, alertas, últimas movimentações e estados de carregamento, vazio e erro. |
| Mostrar total de produtos e quantidade em estoque | Feito | `GET /api/produtos`: contagem dos cadastros e soma de `quantidadeEmEstoque`. |
| Mostrar produtos com estoque baixo | Feito | `GET /api/produtos/estoque-baixo`: contagem e tabela; o back-end define baixo como `quantidadeEmEstoque <= estoqueMinimo`. |
| Consumir a API para alimentar os indicadores | Feito; integração consultada | [`dashboard-api.ts`](../src/app/services/dashboard-api.ts) usa endpoints reais. As consultas GET de produtos, categorias, estoque baixo e movimentações responderam HTTP 200 pela API e pelo proxy Angular. |
| Ajustar responsividade | Validado pela desenvolvedora | Menu sobreposto, cabeçalho móvel e cards da lista foram conferidos após os ajustes das novas imagens. |

### Complementos implementados pela Pessoa 1

Estes itens foram acrescentados ao front-end após a base original de Produtos e Categorias. Eles ficam sob responsabilidade da Pessoa 1, mesmo quando aparecem nas telas de gestão da Pessoa 2.

| Complemento | Status | Evidência e próximo passo |
| --- | --- | --- |
| Catálogo de consulta separado da gestão | Validado pela desenvolvedora | Nova rota `/catalogo` com cards, busca por nome ou código, filtro por categoria e exibição de preço e disponibilidade vindos da API. O menu Catálogo não duplica mais a página `/produtos`. Esta tela não depende da Pessoa 3, responsável por movimentações. |
| Detalhes do produto | Validado pela desenvolvedora | Modal com categoria, preço, saldo, mínimo, situação e código; ação usa ícone de olho. O novo visual foi confirmado. |
| Detalhes da categoria | Validado pela desenvolvedora | Modal com nome, descrição e total de produtos vinculados; ação usa ícone de olho. |
| Paginação de produtos e categorias | Validado pela desenvolvedora | Até 8 produtos e 5 categorias por página, com contagem, números e controles Anterior/Próximo. |
| Avisos de confirmação após ações | Validado pela desenvolvedora | Mensagens temporárias no canto inferior direito após cadastro, edição ou exclusão concluídos pela API. |
| Estoque inicial no cadastro e ajuste de saldo na edição | Validado pela desenvolvedora | Campo de quantidade inicial no cadastro e saldo atual na edição, integrados à API e ao histórico. |
| Reformulação visual e responsividade das telas de gestão | Validado pela desenvolvedora | Tabelas, cards móveis, modais de cadastro/edição/detalhes, paleta Inter/laranja e sidebar móvel sobreposta seguem as referências e foram conferidos. |
| Atalho do Dashboard para itens em atenção | Validado pela desenvolvedora | “Ver itens em atenção” abre `/produtos?estoque=baixo`; a listagem mostra apenas produtos com saldo igual ou inferior ao mínimo e oferece “Mostrar todos”. |

**Entrega funcional da Pessoa 1:** navegação, Dashboard e catálogo de consulta ligados à API, com os complementos acima. A tabela de movimentações é somente leitura; ações de entrada/saída e a rota de movimentações serão integradas com a entrega da Pessoa 3.

## Pessoa 2 — Produtos e Categorias

| Tarefa da divisão | Status | Evidência e próximo passo |
| --- | --- | --- |
| Listagem de produtos | Validado pela desenvolvedora | Tabela com código, nome, categoria, preço, quantidade, status e ações em ícones. No celular, cada produto aparece em um card legível, com informações em duas colunas e ações abaixo. Busca, filtro, abas e botão laranja seguem a referência visual. |
| Formulário de cadastro de produtos | Validado pela desenvolvedora | O modal envia `nome`, `preco`, `categoriaId`, `codigoBarras` opcional, `estoqueMinimo` e `quantidadeInicial`. A quantidade inicial é registrada como entrada no histórico pela API. O novo visual também foi confirmado. |
| Formulário de edição de produtos | Validado pela desenvolvedora | A edição e a correção do saldo atual funcionaram em execução. A API registra a diferença como entrada ou saída. O novo visual também foi confirmado. |
| Exclusão de produtos | Validado pela desenvolvedora | A exclusão foi confirmada em execução, sem erros no console do navegador. A API retira o produto do catálogo e dos indicadores, preservando seu histórico de movimentações. |
| Listagem de categorias | Validado pela desenvolvedora | Tabela com nome, descrição, contagem de produtos e ações em ícones. Busca, abas e botão laranja seguem a referência visual. |
| Cadastro de categorias | Validado pela desenvolvedora | Modal e chamada `POST` existentes; fluxo e novo visual confirmados em execução. |
| Edição e exclusão de categorias | Validado pela desenvolvedora | A desenvolvedora confirmou edição e exclusão funcionando, inclusive após o ajuste visual do formulário. |
| Busca de produtos por nome | Validado pela desenvolvedora | A busca por nome funcionou na conferência manual. O front também aceita busca por código de barras. |
| Validação dos formulários | Validado pela desenvolvedora | Os casos de cadastro, edição e valores inválidos foram conferidos em execução. O roteiro utilizado está abaixo. |
| Integração com a API Java | Feito; cadastros validados | [`catalogo-api.ts`](../src/app/services/catalogo-api.ts) centraliza GET/POST/PUT/DELETE de produtos e categorias. Os fluxos de cadastro de ambos foram confirmados pela desenvolvedora. |

**Entrega funcional original da Pessoa 2:** cadastros, edição, exclusão, busca e validações confirmados pela desenvolvedora. Detalhes, paginação, avisos e os novos ajustes visuais são complementos da Pessoa 1, registrados acima.

**Ideia para uma etapa futura — lixeira de produtos:** como a exclusão atual arquiva o produto, é possível criar uma tela para listar os arquivados e restaurá-los. Isso exigiria endpoints de consulta e restauração no back-end e uma rota/tela no Angular. Uma exclusão definitiva precisaria de decisão da equipe sobre o histórico de movimentações. Esta ideia ainda não faz parte das tarefas implementadas.

### Como validar os formulários

Use uma categoria e um produto de teste. Em cada tentativa inválida, clique em **Salvar** e confira que o modal continua aberto, o campo mostra a mensagem correspondente e nenhum registro novo aparece na lista.

1. Em **Novo produto**, deixe o nome vazio, não escolha categoria e deixe o preço vazio; tente salvar. Corrija um campo por vez e confira que os avisos desaparecem conforme os valores ficam válidos.
2. Digite preço negativo ou com mais de duas casas decimais; depois teste letras, números negativos e valores vazios em **Estoque mínimo** e **Quantidade inicial**. Esses valores devem ser recusados. Zero é permitido nos dois campos de estoque.
3. Em **Código de barras**, digite letras ou menos de 8 dígitos; deve aparecer o aviso. Com 8 a 14 dígitos, o campo deve ser aceito. Tente cadastrar outro produto com o mesmo código para conferir a mensagem da API.
4. Em **Editar produto**, teste um saldo negativo ou com letras; deve ser recusado. Informe um saldo válido, salve e confira o novo valor em **Detalhes** e no Dashboard. Faça um aumento e uma redução para conferir as duas movimentações.
5. Em **Nova categoria**, tente salvar o nome vazio. Confira também os limites de 60 caracteres no nome e 200 na descrição. Tente cadastrar outra categoria com o mesmo nome para conferir a mensagem de duplicidade.

Os casos de validação foram conferidos pela desenvolvedora em execução.

## Pessoa 3 — Movimentação de estoque

| Tarefa da divisão | Status | Evidência e próximo passo |
| --- | --- | --- |
| Criar tela de movimentações | Pendente | Não existe rota `/movimentacoes` nem página própria em `src/app/pages`. Criar listagem/histórico acessível pelo menu. |
| Criar formulário de entrada de produtos | Pendente | Criar interface para registrar entrada com `POST /api/movimentacoes/entrada`. |
| Criar formulário de saída de produtos | Pendente | Criar interface para registrar saída com `POST /api/movimentacoes/saida`. |
| Selecionar produtos cadastrados | Pendente | Carregar `GET /api/produtos` e oferecer seleção clara do produto nos formulários. |
| Informar a quantidade movimentada | Pendente | Campo de quantidade inteira positiva e validação antes de enviar a requisição. |
| Exibir o tipo de movimentação | Parcial | O Dashboard mostra `ENTRADA`/`SAIDA` nas últimas movimentações; falta exibir na tela completa e nos formulários. |
| Exibir histórico de movimentações | Parcial | O Dashboard consulta `GET /api/movimentacoes`, mas mostra só cinco registros. Falta a página de histórico completo. |
| Exibir data e quantidade movimentada | Parcial | A tabela recente do Dashboard mostra esses campos. Repetir na página de histórico, com formatação clara. |
| Mostrar mensagens de sucesso e erro | Pendente | Incluir estados e mensagens para registrar entrada/saída, inclusive erros de validação e estoque insuficiente. |
| Integrar com a API Java | Parcial | Existe a consulta `GET /api/movimentacoes` para o Dashboard. Faltam os `POST` de entrada e saída e a atualização dos dados após salvar. |

**Entrega da Pessoa 3:** ainda pendente. A consulta de movimentações no Dashboard não substitui a página e os formulários de entrada/saída.

## Pendências para concluir a revisão do front-end

1. **Continuar a revisão visual do Dashboard.** Sidebar, catálogo, produtos, categorias, menu móvel, cards, modais, tabelas, abas e paginação foram validados pela desenvolvedora. O Dashboard e elementos adicionais do header ainda podem ser comparados com a referência; não exibir nome, percentuais ou notificações fictícias.
2. **Repetir a conferência de responsividade quando a Pessoa 3 entregar sua tela.** O layout atual foi validado pela desenvolvedora.
3. **Definir o tratamento de categorias ligadas a produtos arquivados.** A exclusão de produtos foi validada. Categorias ainda usadas por produtos arquivados permanecem vinculadas ao histórico e não podem ser removidas sem uma regra adicional.
4. **Implementar a entrega da Pessoa 3.** Criar página, formulários de entrada e saída, seleção de produtos, quantidade, histórico completo, mensagens e chamadas `POST`. Depois conectar a rota no menu, as ações do Dashboard e a atualização dos indicadores após movimentar estoque.
5. **Validar o fluxo completo de estoque.** Com uma categoria e um produto cadastrados, registrar entrada, confirmar o novo saldo e o histórico; registrar saída válida e conferir saldo; testar saída acima do estoque disponível e quantidade inválida.

## Evidências e dependências

- O build de produção Angular foi executado sem erros na branch `feat/dashboard-layout`.
- As novas páginas de produtos e categorias foram renderizadas no navegador em largura de desktop e móvel. Também foram inspecionados o menu sobreposto e os modais móveis de cadastro de produto e categoria. Os números e estados exibidos continuam vindo da API, sem dados fictícios.
- Cadastro com quantidade inicial, edição com aumento/redução de saldo e exclusão com histórico preservado foram cobertos por testes de integração. O back-end local passou em 17 testes; a desenvolvedora também confirmou a exclusão no navegador, sem erros no console.
- A API local e o proxy Angular responderam HTTP 200 nas consultas de produtos, categorias, estoque baixo e movimentações. O Dashboard não usa números de exemplo como dados reais.
- O back-end está em `sistema-estoque-backend/` apenas para integração local e é ignorado pelo Git do front-end. A correção de `ProdutoRepository`, os novos campos/ajustes de saldo e o arquivamento de produtos também estão somente nesse repositório local. A equipe responsável deve incorporar as mudanças descritas no [repasse técnico do backend](Integracao-backend-local.md) ao repositório próprio.
- O histórico dos arquivos originais de Produtos e Categorias continua atribuído a Lorena Torres no Git, após a movimentação do Angular para a raiz.
