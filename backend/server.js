require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'farmatech',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let db;

async function initDb() {
  try {
    db = await mysql.createPool(dbConfig);
    await db.query('SELECT 1');
    console.log('Conectado ao MySQL.');
  } catch (error) {
    console.error('Erro ao conectar ao MySQL:', error.message);
    process.exit(1);
  }
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rotas básicas
app.get('/', (req, res) => {
  res.send('Bem-vindo ao sistema da Farmácia!');
});

// Rotas para clientes
app.get('/api/clientes', async (req, res) => {
  try {
    const [clientes] = await db.query(
      'SELECT id, nome, email, telefone, criado_em FROM clientes ORDER BY id DESC'
    );
    res.json({ clientes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar clientes.' });
  }
});

app.post('/api/clientes', async (req, res) => {
  const { nome, email, telefone } = req.body;
  if (!nome || !email || !telefone) {
    return res.status(400).json({ message: 'Todos os campos de cliente são obrigatórios.' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO clientes (nome, email, telefone) VALUES (?, ?, ?)',
      [nome, email, telefone]
    );

    const [rows] = await db.query(
      'SELECT id, nome, email, telefone, criado_em FROM clientes WHERE id = ?',
      [result.insertId]
    );

    res.json({ message: 'Cliente cadastrado com sucesso.', cliente: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao cadastrar cliente.' });
  }
});

// Rotas para remédios
app.get('/api/remedios', async (req, res) => {
  try {
    const [remedios] = await db.query(
      'SELECT id, nome, fabricante, preco, criado_em FROM remedios ORDER BY id DESC'
    );
    res.json({ remedios });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar remédios.' });
  }
});

app.post('/api/remedios', async (req, res) => {
  const { nome, fabricante, preco } = req.body;
  if (!nome || !fabricante || !preco) {
    return res.status(400).json({ message: 'Todos os campos de remédio são obrigatórios.' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO remedios (nome, fabricante, preco) VALUES (?, ?, ?)',
      [nome, fabricante, parseFloat(preco).toFixed(2)]
    );

    const [rows] = await db.query(
      'SELECT id, nome, fabricante, preco, criado_em FROM remedios WHERE id = ?',
      [result.insertId]
    );

    res.json({ message: 'Remédio cadastrado com sucesso.', remedio: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao cadastrar remédio.' });
  }
});

async function startServer() {
  await initDb();
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

startServer();