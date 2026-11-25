# Integração com o backend local — repasse às Pessoas 4, 5 e 6

Este documento descreve **os ajustes existentes no backend local usado para integrar este frontend**. Ele não substitui o repositório da equipe de backend: a pasta `sistema-estoque-backend/` é outro repositório Git e está ignorada por este repositório Angular. Portanto, fazer commit ou merge do frontend **não envia essas alterações Java**. As Pessoas 4, 5 e 6 precisam revisar, adaptar e versionar as mudanças no repositório delas antes de uma entrega integrada.

## O que o frontend precisa da API

| Ação no Angular | Requisição | Resposta ou regra necessária |
| --- | --- | --- |
| Dashboard e catálogo | `GET /api/produtos` | Array de produtos ativos com `id`, `nome`, `preco`, `categoriaId`, `codigoBarras`, `quantidadeEmEstoque` e `estoqueMinimo`. O Dashboard soma as quantidades; o catálogo mostra preço e disponibilidade. |
| Alertas e atalho do Dashboard | `GET /api/produtos/estoque-baixo` | Apenas produtos ativos com `quantidadeEmEstoque <= estoqueMinimo`, incluindo os sem estoque. Cada item também traz `categoriaNome`. |
| Listagem e formulários de categorias | `GET /api/categorias`, `POST`, `PUT` e `DELETE /api/categorias/{id}` | Categorias com `id`, `nome` e `descricao`; o backend local também devolve `quantidadeProdutos`, contando apenas produtos ativos. |
| Cadastro de produto com saldo inicial | `POST /api/produtos` | Aceita `quantidadeInicial` opcional, inteira e não negativa. Se positiva, devolve o produto com saldo atualizado e registra uma `ENTRADA` no histórico. |
| Edição/correção de saldo | `PUT /api/produtos/{id}` | Aceita `quantidadeEmEstoque` opcional como **saldo final desejado**. Registra a diferença como `ENTRADA` ou `SAIDA`; não substitui o número silenciosamente. |
| Exclusão no formulário | `DELETE /api/produtos/{id}` | Retorna `204`; o produto deixa de aparecer no catálogo e nos alertas, mas as movimentações anteriores continuam em `GET /api/movimentacoes`. |
| Últimas movimentações do Dashboard | `GET /api/movimentacoes` | Array com `id`, `produtoId`, `produtoNome`, `tipo` (`ENTRADA`/`SAIDA`), `quantidade` e `dataMovimentacao`. O frontend mostra as cinco mais recentes. |
| Erros de formulário e regras de negócio | Respostas `400`, `404` e `409` | JSON com `mensagem` legível; o Angular mostra essa mensagem no modal. O handler de erros já existe no backend. |

O Angular usa `/api` como base e o proxy de desenvolvimento encaminha para `http://127.0.0.1:8080`. As páginas de catálogo e gestão dependem das respostas acima. A tela completa de entrada/saída é tarefa futura da Pessoa 3; os endpoints de movimentação já existem no backend.

### Exemplos do contrato de produto

No cadastro, o frontend envia:

```json
{
  "nome": "Arroz integral 1 kg",
  "preco": 8.99,
  "categoriaId": 1,
  "codigoBarras": "12345678",
  "estoqueMinimo": 5,
  "quantidadeInicial": 20
}
```

Na edição, envia os mesmos dados cadastrais e **`quantidadeEmEstoque` no lugar de `quantidadeInicial`**:

```json
{
  "nome": "Arroz integral 1 kg",
  "preco": 8.99,
  "categoriaId": 1,
  "codigoBarras": "12345678",
  "estoqueMinimo": 5,
  "quantidadeEmEstoque": 12
}
```

Nesse exemplo, se o saldo anterior era 20, a API deve registrar uma `SAIDA` de 8 e passar a devolver saldo 12. Se o campo de saldo for omitido no `PUT`, o saldo não deve mudar. Se `quantidadeInicial` for omitido ou zero no `POST`, o produto começa com saldo zero e não há movimentação de entrada. O código de barras é opcional; o formulário Angular aceita de 8 a 14 dígitos quando preenchido. O frontend exige nome, categoria, preço e estoque mínimo não negativo.

## Pessoa 4 — Banco de dados e categorias

**Arquivo local alterado:** `src/main/java/com/supermercado/estoque/service/CategoriaService.java`, com apoio das consultas em `ProdutoRepository.java` (Pessoa 5).

1. `GET /api/categorias` e `GET /api/categorias/{id}` passaram a contar **somente produtos ativos** em `quantidadeProdutos`. A edição de categoria devolve a mesma contagem. Assim o número exibido representa os itens disponíveis no catálogo, não os arquivados.
2. A exclusão de categoria continua verificando **todos** os produtos vinculados, inclusive arquivados. A movimentação guarda uma referência ao produto, e o produto guarda uma referência à categoria. Excluir a categoria enquanto um produto arquivado a utiliza pode quebrar esse histórico ou gerar erro de chave estrangeira.
3. Se só houver produtos arquivados, o serviço responde `409 Conflict` com uma mensagem específica: produtos arquivados ainda utilizam a categoria no histórico. Essa regra é intencional. **Ponto para a equipe decidir:** o Angular pode mostrar `0` produtos ativos e a exclusão ainda ser recusada. Uma futura lixeira/restauração ou uma política para arquivar categorias deve ser discutida antes de mudar essa regra.
4. A nova propriedade `ativo` da entidade `Produto` exige alinhamento com o PostgreSQL. No código local ela é `Boolean` anulável, com valor inicial `true`; consultas tratam `NULL` como ativo para incluir registros anteriores à coluna. O ambiente local usa `spring.jpa.hibernate.ddl-auto=update`, mas a Pessoa 4 deve revisar a evolução do esquema e o tratamento de dados existentes no banco compartilhado antes de publicar.

## Pessoa 5 — Produtos

**Arquivos locais alterados:** `dto/ProdutoRequestDTO.java`, `model/Produto.java`, `repository/ProdutoRepository.java` e `service/ProdutoService.java`.

Antes dos ajustes, `ProdutoService` chamava métodos de busca por nome e verificação de código de barras que não existiam em `ProdutoRepository`, causando erro de compilação. A versão local substitui essas chamadas pelas consultas de produtos ativos descritas abaixo. Ao transportar a correção, serviço e repositório precisam ser atualizados juntos.

| Ajuste | Motivo e comportamento esperado |
| --- | --- |
| Campos opcionais `quantidadeInicial` e `quantidadeEmEstoque` no `ProdutoRequestDTO` | Permitir que o usuário informe saldo ao cadastrar e corrija produtos antigos ao editar. Ambos rejeitam valores negativos; `quantidadeInicial` é usado no `POST`, `quantidadeEmEstoque` no `PUT`. Omitir mantém o comportamento anterior. |
| Coluna/propriedade `ativo` em `Produto` | O `DELETE` físico causava `409` quando já existiam movimentações ligadas ao produto. O `DELETE` agora marca `ativo=false`, preservando a linha e as referências do histórico. |
| Consultas `findAtivos`, `findAtivosByNome` e `findAtivoById` | Listagem, busca e consulta por ID ignoram arquivados. A regra `(ativo IS NULL OR ativo = true)` inclui produtos antigos até a evolução dos dados. Depois de arquivado, `GET /api/produtos/{id}` devolve `404`. |
| Validação de código de barras apenas entre ativos | `countAtivosByCodigoBarras` e `countAtivosByCodigoBarrasAndIdNot` impedem duplicidade no catálogo atual e desconsideram o próprio produto na edição. Como o código não define uma constraint de unicidade no banco, a equipe deve decidir como garantir essa regra em operações concorrentes e se códigos de arquivados podem ser reutilizados. |
| Criação com saldo inicial | `ProdutoService.criar` salva o produto com zero e, se `quantidadeInicial > 0`, chama `MovimentacaoService.registrarEntrada` na mesma transação, com observação `Estoque inicial`. Assim saldo e histórico ficam coerentes. |
| Edição com correção de saldo | `ProdutoService.atualizar` calcula `saldo desejado − saldo atual`. Diferença positiva gera entrada; negativa gera saída; zero não gera movimentação. A observação local é `Ajuste no cadastro do produto`. Alterações cadastrais e de saldo ocorrem na mesma transação. |
| Estoque baixo | `findProdutosComEstoqueBaixo` exclui arquivados e aplica `quantidadeEmEstoque <= estoqueMinimo`; o Dashboard não deve contar itens removidos. |

Não há endpoint de lixeira ou restauração nesta alteração. Para construí-los será preciso definir o contrato de listagem de arquivados, restauração e eventual exclusão definitiva com as Pessoas 4 e 6.

## Pessoa 6 — Movimentações e estoque

**Arquivo local alterado:** `service/MovimentacaoService.java`; a Pessoa 6 também precisa revisar o uso do serviço em `ProdutoService.java` (Pessoa 5).

1. Entrada e saída passaram a procurar o produto por `findAtivoById`. Um produto arquivado não pode receber novas movimentações; para esses `POST`, a API devolve `404`. Isso evita que o saldo de um item retirado do catálogo continue mudando.
2. O histórico continua consultando o produto existente fisicamente no banco e, por isso, inclui movimentações de produtos arquivados. O Dashboard e a futura tela da Pessoa 3 dependem desse histórico. Os endpoints existentes são `GET /api/movimentacoes`, `POST /api/movimentacoes/entrada` e `POST /api/movimentacoes/saida`.
3. `ProdutoService` chama as regras de movimentação no cadastro com saldo inicial e na edição com ajuste de saldo. A Pessoa 6 deve garantir que essas chamadas permaneçam transacionais e respeitem as validações existentes: quantidade positiva e saída não superior ao saldo disponível.
4. A consulta de estoque baixo usa o filtro de ativos da Pessoa 5, para não alertar sobre produtos arquivados.

## Arquivos e verificação para transportar ao repositório do backend

O estado local contém alterações **ainda não commitadas no repositório de backend** nestes arquivos:

```text
src/main/java/com/supermercado/estoque/dto/ProdutoRequestDTO.java
src/main/java/com/supermercado/estoque/model/Produto.java
src/main/java/com/supermercado/estoque/repository/ProdutoRepository.java
src/main/java/com/supermercado/estoque/service/CategoriaService.java
src/main/java/com/supermercado/estoque/service/MovimentacaoService.java
src/main/java/com/supermercado/estoque/service/ProdutoService.java
src/test/java/com/supermercado/estoque/controller/ProdutoEstoqueInicialIntegrationTest.java
```

O teste de integração novo, também só no backend local, cobre três cenários: cadastro com saldo inicial e `ENTRADA`; edição com aumento e redução de saldo; e arquivamento com histórico preservado, categoria protegida e movimentação posterior recusada. A suíte local foi executada com **Java 21**: **17 testes, 0 falhas, 0 erros e 0 ignorados** (`mvnw.cmd test`, 24/11/2026). Ao incorporar os ajustes, a equipe deve repetir os testes e conferir os mesmos fluxos no PostgreSQL compartilhado. Os testes automatizados locais usam H2 em perfil `test`; isso não substitui a revisão da alteração de esquema no PostgreSQL.

**Sequência sugerida para a equipe:** Pessoa 4 decide a evolução da coluna `ativo` e a política de categorias; Pessoa 5 integra DTO, entidade, repositório e serviço de produtos; Pessoa 6 valida as regras de movimentação e o histórico; por fim, as três pessoas executam os testes de integração e conferem os contratos com o Angular. Nenhuma alteração do backend deve ser presumida publicada apenas porque este frontend foi mesclado.
