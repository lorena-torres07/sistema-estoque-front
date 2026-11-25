# Style Guide — Sistema Mercatto

## 1. Tipografia

A fonte utilizada em todo o projeto é **Inter**, carregada pelo Google Fonts.

```css
font-family: "Inter", sans-serif;
```

### Pesos disponíveis

- **400 — Regular:** textos de apoio e descrições
- **500 — Medium:** itens de navegação e rótulos
- **600 — Semi Bold:** botões, títulos de cards e cabeçalhos
- **700 — Bold:** indicadores, números e informações importantes
- **800 — Extra Bold:** pequenos destaques e labels em caixa alta

### Hierarquia tipográfica

| Uso | Tamanho aproximado | Peso |
|---|---:|---:|
| Título principal da página | 18–23px | 600 |
| Título do login | 27px | 600–700 |
| Título de seção/card | 14–17px | 600 |
| Número de KPI | 27px | 700 |
| Texto padrão | 12–14px | 400–500 |
| Botões | 10–12px | 600 |
| Labels e cabeçalhos de tabela | 9–10px | 600–700 |
| Textos auxiliares | 8–10px | 400–500 |

---

## 2. Paleta principal

### Laranja Solar

Cor principal da identidade visual, usada em botões, links ativos, ícones e estados de foco.

| Token | Cor | Uso |
|---|---|---|
| Primary | `#FF6B00` | Botões principais, ícones, links e indicadores ativos |
| Primary Hover | `#E05E00` | Hover de botões principais |
| Primary Soft | `#FFF7ED` | Fundo de seleções, menu ativo e avatares |
| Primary Border | `#FED7AA` | Bordas suaves de elementos laranja |
| Primary Border Strong | `#FDBA74` | Hover e destaques mais evidentes |

---

## 3. Cores neutras

| Token | Cor | Uso |
|---|---|---|
| Background | `#F9FAFB` | Fundo geral da aplicação |
| Surface | `#FFFFFF` | Sidebar, navbar, cards, tabelas e modais |
| Input Background | `#F3F4F6` | Campos de busca e superfícies secundárias |
| Main Text | `#111827` | Títulos e textos principais |
| Body Text | `#374151` | Conteúdo de campos e informações |
| Secondary Text | `#6B7280` | Descrições, rótulos e subtítulos |
| Muted Text | `#9CA3AF` | Placeholders e informações auxiliares |
| Border | `#E5E7EB` | Bordas padrão e divisores |
| Scrollbar | `#D1D5DB` | Barra de rolagem |

---

## 4. Cores semânticas

### Sucesso e entrada de estoque

- Texto e ícone: `#10B981`
- Fundo: `#D1FAE5`
- Borda suave: `#A7F3D0`

Usado em:

- Estoque normal
- Entrada de mercadoria
- Indicadores positivos

### Alerta de estoque baixo

- Ícone: `#EAB308`
- Texto: `#854D0E`
- Fundo: `#FEF9C3`
- Borda: `#FDE68A`

O alerta utiliza amarelo, evitando confusão com os botões laranja.

### Crítico e saída de estoque

- Texto e ícone: `#DC2626`
- Fundo: `#FEE2E2`
- Borda: `#FECACA`

Usado em:

- Produto sem estoque
- Saída de mercadoria
- Exclusão
- Badge de notificações
- Ícone de sair do sistema

---

## 5. Bordas e divisores

A interface utiliza bordas sutis para separar elementos sem criar excesso de peso visual.

```css
border: 1px solid #e5e7eb;
```

### Aplicações

- Cards
- Tabelas
- Inputs
- Modais
- Sidebar
- Navbar
- Divisores internos
- Botões secundários

Campos em foco utilizam a cor principal:

```css
border-color: #ff6b00;
box-shadow: 0 0 0 3px rgba(255, 107, 0, 0.1);
```

---

## 6. Raios de borda

| Elemento | Border radius |
|---|---:|
| Badges e tags pequenas | 5–6px |
| Inputs e botões | 8–9px |
| Cards e painéis | 10–12px |
| Modais | 13–14px |
| Avatar | 50% |
| Indicadores circulares | 50% |

O raio predominante da interface é **8px**, com cards maiores usando entre **10px e 12px**.

---

## 7. Sombras

As sombras são discretas, mantendo o estilo clean.

### Cards

```css
box-shadow: 0 4px 18px rgba(15, 23, 42, 0.035);
```

### Botões principais

```css
box-shadow: 0 4px 12px rgba(255, 107, 0, 0.18);
```

### Cards em hover

```css
box-shadow: 0 12px 25px rgba(15, 23, 42, 0.08);
```

### Modais

```css
box-shadow: 0 25px 60px rgba(15, 23, 42, 0.25);
```

---

## 8. Botões

### Botão primário

- Fundo: `#FF6B00`
- Texto: `#FFFFFF`
- Hover: `#E05E00`
- Altura padrão: 36–40px
- Border radius: 8px
- Peso: 600

### Botão secundário

- Fundo: `#FFFFFF`
- Texto: `#4B5563`
- Borda: `#E5E7EB`
- Hover com texto laranja e fundo `#FFF7ED`

### Botões destrutivos

- Texto: `#DC2626`
- Fundo de hover: `#FEE2E2`
- Borda de hover: `#FECACA`

---

## 9. Campos e formulários

### Estado padrão

- Fundo: `#FFFFFF` ou `#F3F4F6`
- Texto: `#374151`
- Placeholder: `#9CA3AF`
- Borda: `#E5E7EB`
- Border radius: 8–9px
- Altura: 38–46px

### Estado de foco

- Fundo: `#FFFFFF`
- Borda: `#FF6B00`
- Anel de foco laranja translúcido

---

## 10. Cards e painéis

- Fundo: `#FFFFFF`
- Borda: `#E5E7EB`
- Border radius: 10–12px
- Sombra suave
- Espaçamento interno: aproximadamente 16–24px
- Hover com elevação discreta quando o elemento é interativo

---

## 11. Tabelas

### Cabeçalho

- Fundo: `#F9FAFB`
- Texto: `#6B7280`
- Tamanho: 9px
- Peso: 700
- Letras maiúsculas
- Espaçamento entre letras discreto

### Linhas

- Fundo: `#FFFFFF`
- Divisor: `#E5E7EB`
- Hover: `#F9FAFB`
- Altura aproximada: 61px

---

## 12. Navbar superior

- Altura: `72px`
- Fundo: `#FFFFFF`
- Borda inferior: `#E5E7EB`
- Título: `#111827`, peso 600
- Contexto: `#6B7280`, 12px
- Busca: fundo `#F3F4F6`
- Ação rápida: fundo `#FF6B00`
- Avatar: fundo `#FFF7ED`, texto `#FF6B00`

---

## 13. Sidebar

- Fundo: `#FFFFFF`
- Borda direita: `#E5E7EB`
- Texto: `#6B7280`
- Item ativo:
  - Fundo: `#FFF7ED`
  - Texto e ícone: `#FF6B00`
- Hover:
  - Fundo: `#FFF7ED`
  - Texto: `#FF6B00`
- Ação de saída:
  - Ícone: `#DC2626`
  - Hover: `#FEE2E2`

---

## 14. Espaçamento

O projeto utiliza uma escala visual baseada principalmente em múltiplos de 4px:

```text
4px, 8px, 12px, 16px, 20px, 24px, 32px
```

### Padrões principais

- Espaço entre ícone e texto: 7–12px
- Espaço entre componentes: 12–20px
- Padding de cards: 16–24px
- Padding horizontal das páginas: 16px no mobile e 34px no desktop
- Espaço entre seções: aproximadamente 20–30px

---

## Resumo da identidade

O projeto utiliza uma linguagem visual **SaaS moderna, corporativa e minimalista**, baseada em:

- Fonte **Inter**
- Laranja Solar como cor principal
- Superfícies brancas
- Fundo cinza muito claro
- Bordas discretas
- Sombras suaves
- Cantos arredondados
- Alto contraste e boa legibilidade
- Verde, amarelo e vermelho reservados para estados semânticos