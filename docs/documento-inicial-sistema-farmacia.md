# Documento Inicial — Sistema Web para Farmácia

## 1. Objetivo do projeto

Criar um sistema web para a farmácia usando o sistema antigo apenas como referência funcional, sem copiar a interface de forma literal.

O foco é:

- modernizar a experiência de uso;
- simplificar a operação do atendente;
- reduzir excesso de informação na tela;
- manter as funções realmente importantes do dia a dia;
- preparar o sistema para futuro empacotamento e instalação no PC da farmácia.

---

## 2. Visão do produto

O sistema será usado principalmente no balcão da farmácia, então ele precisa ser:

- rápido;
- fácil de aprender;
- visualmente limpo;
- confiável em tarefas repetitivas;
- preparado para crescer com novos módulos.

O sistema antigo mostra que a operação principal gira em torno de:

- atendimento ao cliente;
- lançamento de produtos;
- fechamento da venda;
- controle de pagamentos;
- acesso a cadastros e rotinas administrativas.

---

## 3. Direção do projeto

Em vez de reproduzir a tela antiga, vamos:

- aproveitar a lógica de negócio que já faz sentido;
- reorganizar o fluxo para a web;
- esconder complexidade desnecessária;
- separar melhor funções operacionais de funções administrativas.

Princípio central:

> a tela principal deve ajudar o usuário a vender rápido, com poucos cliques e pouca confusão.

---

## 4. MVP da primeira versão

O MVP deve entregar o essencial para a farmácia operar no dia a dia.

### 4.1 Funcionalidades principais do MVP

- login de usuário;
- tela principal de venda (PDV);
- cadastro de clientes;
- cadastro de produtos;
- busca de produto por nome e código de barras;
- adição e remoção de itens na venda;
- cálculo automático de subtotal, desconto, total e troco;
- múltiplas formas de pagamento;
- fechamento da venda;
- histórico simples de vendas;
- controle básico de estoque;
- abertura e fechamento de caixa.

### 4.2 O que pode ficar para depois

- relatórios avançados;
- estatísticas detalhadas;
- contas a pagar;
- integrações externas complexas;
- regras especiais de convênio mais avançadas;
- permissões muito detalhadas por perfil;
- emissão de documentos fiscais, caso exista necessidade futura.

---

## 5. Módulos do sistema

### 5.1 PDV / Vendas

Responsável pelo fluxo principal de atendimento no balcão.

Deve permitir:

- iniciar nova venda;
- identificar cliente;
- pesquisar ou bipar produto;
- alterar quantidade;
- aplicar desconto;
- visualizar resumo da compra;
- informar pagamento;
- concluir venda.

### 5.2 Clientes

Cadastro e consulta de clientes.

Campos iniciais sugeridos:

- nome;
- CPF/CNPJ;
- telefone;
- data de nascimento;
- convênio;
- observações.

### 5.3 Produtos

Cadastro e manutenção dos itens vendidos.

Campos iniciais sugeridos:

- nome do produto;
- código interno;
- código de barras;
- categoria;
- unidade;
- preço de venda;
- custo;
- estoque atual;
- estoque mínimo;
- ativo/inativo.

### 5.4 Estoque

Controle operacional dos produtos.

Deve permitir:

- entrada de mercadoria;
- ajuste manual;
- baixa por venda;
- alerta de estoque baixo;
- consulta rápida de saldo.

### 5.5 Caixa

Controle financeiro do turno ou do dia.

Deve permitir:

- abertura de caixa;
- registro das vendas;
- fechamento de caixa;
- conferência por forma de pagamento.

### 5.6 Convênios

Módulo para clientes e vendas com convênio.

Pode começar simples:

- vincular convênio ao cliente;
- aplicar convênio na venda;
- registrar valores vinculados.

### 5.7 Relatórios

Módulo gerencial para fases seguintes.

Relatórios sugeridos:

- vendas por período;
- produtos mais vendidos;
- estoque baixo;
- fechamento de caixa;
- vendas por forma de pagamento.

### 5.8 Configurações

Área para parâmetros do sistema.

Exemplos:

- dados da farmácia;
- usuários;
- permissões;
- impressora;
- preferências do PDV.

---

## 6. Proposta da nova tela principal de venda

### 6.1 Objetivo da tela

A nova tela deve priorizar velocidade, clareza e segurança operacional.

### 6.2 Estrutura recomendada

#### Bloco 1 — Cabeçalho

- nome da farmácia;
- operador logado;
- número da venda;
- data e hora;
- botão de nova venda.

#### Bloco 2 — Cliente

- busca rápida por nome, CPF ou telefone;
- opção de venda sem cliente identificado;
- exibição resumida do cliente selecionado;
- destaque para convênio, quando existir.

#### Bloco 3 — Itens da venda

- campo grande para código de barras;
- busca por nome do produto;
- tabela de itens;
- edição rápida de quantidade;
- remoção de item;
- visualização clara de preço, desconto e total.

#### Bloco 4 — Resumo e pagamento

- subtotal;
- desconto;
- total final;
- forma de pagamento;
- valor recebido;
- troco;
- botão de finalizar venda.

#### Bloco 5 — Ações secundárias

Essas ações não devem competir com a venda.

Mover para menu lateral ou topo:

- clientes;
- produtos;
- estoque;
- caixa;
- relatórios;
- convênios.

---

## 7. Campos do sistema antigo que podem ser reaproveitados

Do print analisado, faz sentido manter conceitualmente:

- cliente;
- CPF/CNPJ;
- convênio;
- código do produto;
- código de barras;
- produto;
- quantidade;
- unidade;
- valor unitário;
- desconto;
- subtotal;
- total;
- formas de pagamento;
- troco;
- observação;
- data da venda;
- número da venda.

---

## 8. Campos que podem ser simplificados ou escondidos

Esses itens podem virar campos internos, avançados ou contextuais:

- códigos técnicos;
- campos RMS/CRM;
- identificadores operacionais pouco usados;
- integrações específicas;
- informações que só fazem sentido para administrador.

A ideia é:

- mostrar apenas o necessário para a maioria dos atendimentos;
- deixar informações técnicas acessíveis sem poluir a tela.

---

## 9. Fluxo ideal da venda

### Fluxo base

1. operador inicia uma nova venda;
2. identifica o cliente, se necessário;
3. adiciona produtos por código de barras ou busca;
4. ajusta quantidade ou desconto;
5. sistema calcula os totais automaticamente;
6. operador seleciona forma de pagamento;
7. sistema calcula troco, quando aplicável;
8. venda é finalizada;
9. estoque e caixa são atualizados.

---

## 10. Regras de UX que vamos seguir

- priorizar leitura rápida;
- reduzir campos visíveis ao essencial;
- evitar excesso de botões na mesma tela;
- destacar ações principais;
- manter navegação consistente;
- permitir uso eficiente com teclado;
- criar interface amigável para operador com pouca familiaridade técnica.

---

## 11. Requisitos técnicos iniciais

### Frontend

- interface web responsiva;
- foco em desktop, com adaptação mínima para tablet;
- componentes simples e reutilizáveis;
- fluxo otimizado para teclado e leitura rápida.

### Backend

- API para clientes, produtos, vendas, caixa e estoque;
- autenticação de usuários;
- persistência confiável dos dados.

### Banco de dados

Sugestão inicial:

- PostgreSQL, se quisermos uma base robusta e relacional;
- MySQL, se preferirmos um caminho mais tradicional;
- SQLite apenas se quisermos uma primeira versão extremamente simples e local.

### Empacotamento futuro

Como o plano é instalar no PC da farmácia depois, o sistema pode seguir dois caminhos:

- rodar como sistema web local com backend e frontend no computador da farmácia;
- ou ser empacotado depois com Electron para parecer um programa desktop.

---

## 12. Priorização recomendada

### Fase 1 — Base operacional

- autenticação;
- cadastro de clientes;
- cadastro de produtos;
- tela de venda;
- pagamento;
- gravação de vendas;
- estoque básico;
- caixa básico.

### Fase 2 — Gestão

- convênios;
- relatórios;
- consultas de vendas;
- melhorias de usabilidade;
- permissões de usuário.

### Fase 3 — Expansão

- integrações externas;
- impressões específicas;
- dashboards;
- recursos administrativos avançados.

---

## 13. Decisões iniciais sugeridas

Para manter o projeto controlado, estas são boas decisões iniciais:

- tratar o sistema antigo como referência funcional, não visual;
- começar pela tela de PDV;
- separar módulos administrativos da venda;
- construir um MVP enxuto antes de integrações complexas;
- validar com prints e feedback do usuário real da farmácia.

---

## 14. Próximos passos

### Próximo passo recomendado 1

Criar o levantamento detalhado da **tela de PDV**, definindo:

- layout;
- campos;
- ações;
- atalhos;
- regras de negócio.

### Próximo passo recomendado 2

Montar a lista de entidades do sistema:

- usuário;
- cliente;
- produto;
- venda;
- item da venda;
- pagamento;
- caixa;
- movimentação de estoque;
- convênio.

### Próximo passo recomendado 3

Desenhar a estrutura inicial do projeto:

- frontend;
- backend;
- banco de dados;
- rotas principais;
- páginas iniciais.

---

## 15. Resumo executivo

Este projeto deve transformar um sistema antigo de farmácia em uma solução web mais moderna, simples e prática, priorizando o fluxo de venda no balcão e reduzindo a complexidade visual para o usuário final.

O MVP deve começar pelo essencial para operar a farmácia com segurança e rapidez, deixando integrações e módulos mais avançados para fases posteriores.
