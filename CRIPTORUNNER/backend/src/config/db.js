// database.js - Sistema de gerenciamento do banco de dados
class CryptoRunnerDB {
    constructor() {
        this.dbName = 'CryptoRunnerDB';
        this.version = 1;
        this.init();
    }

    init() {
        // Verificar se o localStorage está disponível
        if (typeof(Storage) === "undefined") {
            console.error("LocalStorage não é suportado neste navegador!");
            return false;
        }

        // Inicializar estrutura do banco de dados se não existir
        if (!localStorage.getItem(this.dbName)) {
            const initialDB = {
                users: [],
                version: this.version,
                created: new Date().toISOString()
            };
            this.saveDB(initialDB);
        }

        return true;
    }

    getDB() {
        try {
            const db = localStorage.getItem(this.dbName);
            return db ? JSON.parse(db) : null;
        } catch (error) {
            console.error("Erro ao acessar o banco de dados:", error);
            this.resetDB();
            return this.getDB();
        }
    }

    saveDB(data) {
        try {
            localStorage.setItem(this.dbName, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error("Erro ao salvar no banco de dados:", error);
            return false;
        }
    }

    resetDB() {
        const initialDB = {
            users: [],
            version: this.version,
            created: new Date().toISOString()
        };
        return this.saveDB(initialDB);
    }

    // Métodos para usuários
    getUsers() {
        const db = this.getDB();
        return db ? db.users : [];
    }

    saveUsers(users) {
        const db = this.getDB();
        if (db) {
            db.users = users;
            return this.saveDB(db);
        }
        return false;
    }

    addUser(user) {
        const users = this.getUsers();
        
        // Verificar se o email já existe
        if (users.find(u => u.email === user.email)) {
            return { success: false, message: "E-mail já cadastrado!" };
        }

        // Adicionar ID e timestamp
        user.id = Date.now();
        user.dataCadastro = new Date().toISOString();
        
        users.push(user);
        
        if (this.saveUsers(users)) {
            return { success: true, user: user };
        } else {
            return { success: false, message: "Erro ao salvar usuário!" };
        }
    }

    findUserByEmail(email) {
        const users = this.getUsers();
        return users.find(u => u.email === email);
    }

    validateLogin(email, password) {
        const user = this.findUserByEmail(email);
        if (user && user.senha === password) {
            return { success: true, user: user };
        }
        return { success: false, message: "E-mail ou senha incorretos!" };
    }
}

// Criar instância global do banco de dados
const cryptoRunnerDB = new CryptoRunnerDB();