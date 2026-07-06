# Farmatech

Sistema web para farmácia com foco em operação de balcão, cadastro, estoque e vendas compartilhadas entre mais de um computador na rede local.

## Stack definida

- `frontend`: React + TypeScript + Vite + Material UI
- `backend`: Node.js + Express + TypeScript
- `banco de dados`: MySQL
- `ORM`: Prisma

## Estrutura atual

- `frontend/`: interface web moderna
- `backend/`: API, regras de negócio e acesso ao banco
- `docs/`: documentação funcional e de produto

## Como o sistema vai funcionar

O sistema foi pensado para cenário com servidor físico na farmácia e mais de um computador acessando os mesmos dados.

- o `backend` e o `MySQL` rodam no servidor da farmácia;
- os computadores da farmácia acessam o sistema pelo navegador;
- vendas, estoque, clientes e caixa ficam centralizados.

## Backend

### Arquivos principais

- `backend/src/server.ts`
- `backend/src/app.ts`
- `backend/prisma/schema.prisma`

### Scripts

- `npm run dev`
- `npm run build`
- `npm run prisma:generate`
- `npm run prisma:migrate`

### Variáveis de ambiente

Use `backend/.env.example` como base para criar seu `backend/.env`.

## Frontend

### Arquivos principais

- `frontend/src/App.tsx`
- `frontend/src/pages/PdvPage.tsx`
- `frontend/src/pages/CustomersPage.tsx`
- `frontend/src/pages/ProductsPage.tsx`

### Scripts

- `npm run dev`
- `npm run build`

## Próximos passos sugeridos

1. instalar as dependências do `backend` e do `frontend`;
2. gerar o client do Prisma;
3. criar a primeira migration do MySQL;
4. ligar os formulários do frontend à API;
5. implementar autenticação e usuários;
6. evoluir o PDV para fluxo real de venda.
