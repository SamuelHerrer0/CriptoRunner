const express = require('express');
const router = express.Router();
const db = require('./db'); // ou sua conexão com MySQL

// ROTA DE CADASTRO
router.post('/cadastrar', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        
        // Verificar se usuário já existe
        const [existing] = await db.execute('SELECT * FROM usuarios WHERE email = ?', [email]);
        
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Usuário já existe' });
        }

        // Inserir novo usuário
        const [result] = await db.execute(
            'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
            [nome, email, senha]
        );
        
        res.status(201).json({ 
            message: 'Usuário criado com sucesso', 
            userId: result.insertId 
        });
        
    } catch (error) {
        console.error('Erro no cadastro:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// ROTA DE LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        
        // Buscar usuário
        const [users] = await db.execute('SELECT * FROM usuarios WHERE email = ? AND senha = ?', [email, senha]);
        
        if (users.length === 0) {
            return res.status(401).json({ error: 'Email ou senha incorretos' });
        }
        
        const usuario = users[0];
        res.json({ 
            message: 'Login realizado com sucesso',
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            }
        });
        
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// ROTA PARA LISTAR USUÁRIOS (opcional)
router.get('/', async (req, res) => {
    try {
        const [users] = await db.execute('SELECT id, nome, email FROM usuarios');
        res.json(users);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;