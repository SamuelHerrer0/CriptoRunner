const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Servir arquivos estáticos - CORRIGIDO
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/css', express.static(path.join(__dirname, '../frontend/css')));
app.use('/js', express.static(path.join(__dirname, '../frontend/js')));
app.use('/imagens', express.static(path.join(__dirname, '../frontend/imagens')));
app.use('/views', express.static(path.join(__dirname, '../frontend/views')));

// SERVE ARQUIVOS DA PASTA RAIZ DO FRONTEND (onde está o P.css)
app.use('/static', express.static(path.join(__dirname, '../frontend')));

const dbConfig = {
    host: 'localhost',
    user: 'root', 
    password: '12345',
    database: 'PFI'
};

console.log('Tentando conectar ao MySQL...');
console.log('Configuração:', {
    host: dbConfig.host,
    user: dbConfig.user,
    database: dbConfig.database
});

const pool = mysql.createPool(dbConfig);

async function testarConexao() {
    try {
        const connection = await pool.getConnection();
        console.log(' MySQL: Conectado com sucesso');
        
        const [databases] = await connection.execute('SHOW DATABASES');
        console.log(' Bancos disponíveis:', databases.map(db => db.Database));
        
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                senha VARCHAR(255) NOT NULL,
                data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log(' Tabela usuarios pronta');
        
        connection.release();
    } catch (error) {
        console.error(' Erro MySQL:', error.message);
        console.error(' Código do erro:', error.code);
        console.error(' Número do erro:', error.errno);
    }
}

app.post('/api/usuarios/cadastrar', async (req, res) => {
    console.log(' Recebendo cadastro:', req.body);
    
    try {
        const { nome, email, senha } = req.body;
        
        if (!nome || !email || !senha) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        const [result] = await pool.execute(
            'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
            [nome, email, senha]
        );
        
        console.log(' Usuário cadastrado com ID:', result.insertId);
        
        res.status(201).json({ 
            success: true,
            message: 'Usuário criado com sucesso'
        });
        
    } catch (error) {
        console.error(' Erro no cadastro:', error.message);
        console.error(' Código do erro:', error.code);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Email já cadastrado' });
        }
        
        res.status(500).json({ error: 'Erro interno do servidor: ' + error.message });
    }
});

app.post('/api/usuarios/login', async (req, res) => {
    console.log(' Recebendo login:', req.body);
    
    try {
        const { email, senha } = req.body;
        
        if (!email || !senha) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        const [users] = await pool.execute(
            'SELECT id, nome, email FROM usuarios WHERE email = ? AND senha = ?',
            [email, senha]
        );
        
        if (users.length === 0) {
            return res.status(401).json({ error: 'Email ou senha incorretos' });
        }
        
        console.log(' Login realizado para:', email);
        
        res.json({ 
            success: true,
            message: 'Login realizado com sucesso',
            usuario: users[0]
        });
        
    } catch (error) {
        console.error(' Erro no login:', error.message);
        res.status(500).json({ error: 'Erro interno do servidor: ' + error.message });
    }
});

// Rotas para páginas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/login.html'));
});

app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/registro.html'));
});

app.get('/Principal.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/views/Principal.html'));
});

// Rota específica para servir o P.css
app.get('/P.css', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/P.css'));
});

app.listen(PORT, () => {
    console.log(` Servidor rodando na porta ${PORT}`);
    console.log(` Acesse: http://localhost:${PORT}`);
    
});

testarConexao();