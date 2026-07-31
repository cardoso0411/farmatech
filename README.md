# Farmatech

Farmatech e um sistema web para gestão de farmacia, pensado para uso em balcão, cadastro de clientes, cadastro de produtos, controle de estoque, formas de pagamento, caixa e vendas em rede local.

O projeto esta organizado em duas partes principais:

- `frontend`: interface web feita em React, TypeScript, Vite e Material UI.
- `backend`: API REST feita em Node.js, Express, TypeScript, Prisma e MySQL.

## Objetivo do sistema

O Farmatech foi criado para centralizar a rotina de uma farmacia em um unico sistema acessado pelo navegador. A ideia e permitir que um servidor local da farmacia rode o backend e o banco de dados, enquanto os computadores do balcao, caixa e administracao acessam os mesmos dados pela rede interna.

Com isso, cadastros, vendas, estoque e relatorios ficam integrados, evitando informacoes espalhadas em planilhas ou controles manuais.

## Funcionalidades atuais

### Autenticacao e usuarios

- Tela de login no frontend.
- Autenticacao por usuario e senha de vendedor.
- Token local assinado no backend com validade de 8 horas.
- Controle de acesso por perfil:
  - `ADMIN`: acesso completo aos cadastros administrativos.
  - `MANAGER`: perfil previsto no banco para futuras permissoes gerenciais.
  - `ATTENDANT`: perfil de atendimento/balcao.
- Rotas protegidas no backend apos o login.

### Dashboard e navegacao

- Layout principal com menu lateral.
- Pagina inicial do sistema.
- Navegacao por modulos usando React Router.
- Protecao de telas administrativas no frontend para usuarios `ADMIN`.

### Clientes

- Cadastro completo de cliente pessoa fisica ou juridica.
- Campos para CPF, RG, CNPJ, inscricao estadual, telefones, endereco, email e observacoes.
- Classificacao do cliente como bom, medio ou ruim.
- Status ativo/inativo.
- Marcacoes de bloqueio, assinatura, fornecedor e atendimento apenas por convenio.
- Vinculo com tipo de cliente e vendedor.
- Listagem, consulta, edicao e exclusao de clientes pela API.

### Tipos de clientes

- Cadastro de tipos de clientes.
- Descricao opcional.
- Controle de ativo/inativo.
- Uso dos tipos no cadastro de clientes.

### Vendedores e usuarios do sistema

- Cadastro de vendedores.
- Cada vendedor pode ter usuario, senha e perfil de acesso.
- Senhas armazenadas com hash usando `scrypt`.
- Cadastro de dados pessoais e de contato.
- Ativacao e inativacao de vendedor.
- Remocao de vendedor com desvinculo dos clientes relacionados.

### Produtos

- Cadastro completo de produtos.
- Campos para codigo de barras, resumo, descricao, marca, apresentacao, referencia e principio ativo.
- Dados farmaceuticos e fiscais como SNGPC, RMS, DCB, NCM, PIS, origem, ICMS e operacao de venda.
- Controle de preco de venda, preco de custo, quantidade em estoque e estoque minimo.
- Marcacoes para produto generico, controlado, especial, fracionado e similar.
- Vinculo com categoria e grupo de produto.
- Listagem, consulta, edicao e exclusao de produtos pela API.

### Categorias e grupos de produtos

- Cadastro de categorias de produtos com codigo unico.
- Cadastro de grupos de produtos com local, grupo, SNGPC, operacao de venda, codigo e cautela.
- Uso de categorias e grupos no cadastro de produtos.

### Formas de pagamento

- Cadastro de configuracoes de formas de pagamento.
- Abreviacao unica e descricao.
- Base preparada para uso no PDV e nas vendas.

### PDV e vendas

- Tela de PDV no frontend.
- API para registrar vendas com itens e pagamentos.
- Calculo de subtotal, descontos e total.
- Validacao para impedir venda com pagamento menor que o total.
- Validacao de estoque antes de concluir a venda.
- Baixa automatica do estoque ao registrar venda.
- Registro de movimentacao de estoque vinculada a venda.
- Listagem de vendas com cliente, usuario, itens, produtos e pagamentos.

### Estoque

- Modelo de movimentacao de estoque no banco.
- Baixa de estoque integrada ao registro de venda.
- Campos de estoque atual e estoque minimo no produto.
- Tela de estoque preparada no frontend.

### Caixa e relatorios

- Modelo de sessao de caixa no banco, com abertura, fechamento, usuario e observacoes.
- Tela de caixa no frontend.
- Tela de relatorios no frontend.
- Base pronta para evoluir os fechamentos, consultas e indicadores.

## Estrutura do projeto

```
farmatech/
  backend/
    prisma/
      schema.prisma
      seed.ts
      migrations/
    src/
      app.ts
      server.ts
      config/
      lib/
      middlewares/
      modules/
  frontend/
    src/
      App.tsx
      auth/
      components/
      hooks/
      lib/
      pages/
      types/
      utils/
  docs/
```

## Backend

O backend expoe uma API REST em `/api`, usando Express e Prisma.

### Principais arquivos

- `backend/src/server.ts`: inicia o servidor.
- `backend/src/app.ts`: configura Express, CORS, JSON, rotas e tratamento de erros.
- `backend/src/routes/index.ts`: registra as rotas principais.
- `backend/src/config/env.ts`: le variaveis de ambiente.
- `backend/prisma/schema.prisma`: define o banco MySQL.
- `backend/prisma/seed.ts`: popula dados iniciais.

### Rotas principais

- `GET /api`: informacoes da API.
- `GET /api/health`: verificacao de saude.
- `POST /api/auth/login`: login.
- `/api/customer-types`: tipos de clientes.
- `/api/sellers`: vendedores e usuarios.
- `/api/customers`: clientes.
- `/api/product-categories`: categorias de produtos.
- `/api/product-groups`: grupos de produtos.
- `/api/payment-method-configs`: formas de pagamento.
- `/api/products`: produtos.
- `/api/sales`: vendas.

As rotas de negocio ficam protegidas por autenticacao. Apenas `/api`, `/api/health` e `/api/auth/login` ficam publicas.

### Variaveis de ambiente

Crie um arquivo `backend/.env` com as configuracoes do banco e da aplicacao:

```env
PORT=3333
DATABASE_URL="mysql://usuario:senha@localhost:3306/farmatech"
CORS_ORIGIN="http://localhost:5173"
AUTH_SECRET="troque-esta-chave-em-producao"
```

Tambem e aceito montar a conexao por variaveis legadas:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=usuario
DB_PASSWORD=senha
DB_NAME=farmatech
```

### Scripts do backend

Execute os comandos dentro da pasta `backend`:

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Scripts disponiveis:

- `npm run dev`: inicia a API em modo desenvolvimento.
- `npm run build`: compila o TypeScript.
- `npm start`: executa a versao compilada.
- `npm run prisma:generate`: gera o Prisma Client.
- `npm run prisma:migrate`: aplica migrations no banco.
- `npm run prisma:studio`: abre o Prisma Studio.
- `npm run prisma:seed`: cria dados iniciais.

## Frontend

O frontend e uma aplicacao React com Vite, Material UI, React Router, React Query, Axios, React Hook Form e Zod.

### Principais arquivos

- `frontend/src/App.tsx`: define as rotas e a protecao das paginas.
- `frontend/src/auth/AuthContext.tsx`: guarda a sessao do usuario no navegador.
- `frontend/src/lib/api.ts`: configura o Axios.
- `frontend/src/components/layout/DashboardLayout.tsx`: layout principal.
- `frontend/src/pages/`: telas do sistema.

### Telas atuais

- `/`: inicio.
- `/pdv`: ponto de venda.
- `/clientes`: cadastro de cliente.
- `/clientes/consultar`: consulta de clientes.
- `/cadastros/tipos-clientes`: tipos de clientes.
- `/cadastros/vendedores`: vendedores e usuarios.
- `/produtos`: cadastro de produto.
- `/produtos/consultar`: consulta de produtos.
- `/produtos/categorias`: categorias.
- `/produtos/grupos`: grupos.
- `/produtos/formas-de-pagamento`: formas de pagamento.
- `/caixa`: caixa.
- `/estoque`: estoque.
- `/relatorios`: relatorios.

### Scripts do frontend

Execute os comandos dentro da pasta `frontend`:

```bash
npm install
npm run dev
```

Scripts disponiveis:

- `npm run dev`: inicia o Vite em desenvolvimento.
- `npm run build`: compila TypeScript e gera o build.
- `npm run preview`: abre uma previa do build.

## Como rodar em desenvolvimento

1. Crie o banco MySQL `farmatech`.
2. Configure `backend/.env`.
3. Instale as dependencias do backend:

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

4. Em outro terminal, instale e rode o frontend:

```bash
cd frontend
npm install
npm run dev
```

5. Acesse o frontend em `http://localhost:5173`.

Observacao: no codigo atual, o backend usa `PORT=3333` por padrao, enquanto o frontend esta configurado em `frontend/src/lib/api.ts` para chamar `http://localhost:3000/api`. Ajuste a porta do backend para `3000` ou altere o `baseURL` do frontend para `http://localhost:3333/api`.

## Banco de dados

O banco atual possui modelos para:

- usuarios internos;
- clientes;
- tipos de clientes;
- vendedores;
- produtos;
- categorias de produtos;
- grupos de produtos;
- configuracoes de formas de pagamento;
- vendas;
- itens de venda;
- pagamentos;
- sessoes de caixa;
- movimentacoes de estoque.

O Prisma é responsavel por manter o schema, gerar o client e aplicar migrations no MySQL.

## Regras importantes ja implementadas

- Uma venda só é registrada se todos os produtos existirem.
- Uma venda só é registrada se houver estoque suficiente.
- O total pago não pode ser menor que o total da venda.
- Ao concluir uma venda, o estoque dos produtos é reduzido automaticamente.
- Cada baixa de venda gera uma movimentação de estoque.
- Produtos e clientes vinculados a outros registros não podem ser excluídos diretamente.
- Rotas administrativas no frontend são bloqueadas para usuarios que não são `ADMIN`.

## Atualizações futuras

As proximas evoluções sugeridas para o Farmatech são:

- Alinhar configuração de porta da API entre backend e frontend.
- Finalizar fluxo completo do PDV com busca rapida por codigo de barras, carrinho, desconto, troco e impressao.
- Implementar abertura, fechamento e conferencia de caixa.
- Criar relatorios de vendas por periodo, vendedor, produto, forma de pagamento e cliente.
- Criar tela de movimentações de estoque com entrada manual, ajuste, perda, devolução e historico.
- Adicionar alerta de estoque minimo.
- Adicionar recuperação ou troca de senha.
- Configurar backup automatico do banco MySQL.
- Preparar instalação em servidor local da farmacia.
- Adicionar testes automatizados para regras de venda, estoque e autenticação.
- Melhorar responsividade e experiencia de uso em telas menores.
- Adicionar integrações futuras com leitor de codigo de barras, impressora não fiscal e emissão fiscal, caso necessario.

## Status do projeto

O sistema já possui uma base funcional com frontend, backend, banco, autenticação, cadastros principais e registro de venda com baixa de estoque. Ainda existem telas e fluxos que podem ser aprofundados para uso real em produção, principalmente PDV, caixa, relatorios, permissões e rotinas de instalacão.
