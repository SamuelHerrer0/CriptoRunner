const API_URL = `${window.location.protocol}//${window.location.hostname}:3000/api`;

// Ensure the project's main stylesheet `P.css` is present and points
// to the expected location (`/css/P.css`). If a link to `P.css` exists
// but points elsewhere (for example `/views/P.css`), update it.
function ensurePcss() {
    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    const found = links.find(l => {
        const href = l.getAttribute('href') || '';
        return href.endsWith('P.css') || href.includes('/P.css');
    });

    if (found) {
        const href = found.getAttribute('href') || '';
        // Prefer the canonical `/css/P.css` location (where your file lives).
        if (!href.includes('/css/P.css')) {
            try {
                found.setAttribute('href', '/css/P.css');
                console.log('Updated existing P.css link to /css/P.css');
            } catch (e) {
                console.warn('Could not update existing P.css link', e);
            }
        }
        return;
    }

    // If no stylesheet link found, insert one pointing to `/css/P.css`.
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/css/P.css';
    document.head.appendChild(link);
    console.log('Inserted /css/P.css stylesheet');
}

document.addEventListener('DOMContentLoaded', function() {
    ensurePcss();
    const loginForm = document.getElementById('loginForm');
    const cadastroForm = document.getElementById('cadastroForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', handleCadastro);
    }
});

async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    
    if (!email || !senha) {
        showMessage('Preencha todos os campos', 'error');
        return;
    }
    
    try {
        console.log('Tentando login...');
        const response = await fetch(`${API_URL}/usuarios/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha })
        });
        
        const data = await response.json();
        console.log('Resposta do servidor:', data);
        
        if (response.ok) {
            showMessage('Login realizado com sucesso!', 'success');
            localStorage.setItem('usuarioCriptoRunner', JSON.stringify(data.usuario));
            setTimeout(() => {
                window.location.href = '/Principal.html';
            }, 1500);
        } else {
            showMessage(data.error || 'Erro no login', 'error');
        }
        
    } catch (error) {
        console.error('Erro completo:', error);
        showMessage('Erro de conexão com o servidor', 'error');
    }
}

async function handleCadastro(event) {
    event.preventDefault();
    
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;
    
    if (!nome || !email || !senha || !confirmarSenha) {
        showMessage('Preencha todos os campos', 'error');
        return;
    }
    
    if (senha !== confirmarSenha) {
        showMessage('As senhas não coincidem', 'error');
        return;
    }
    
    try {
        console.log('Tentando cadastro...');
        const response = await fetch(`${API_URL}/usuarios/cadastrar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome, email, senha })
        });
        
        const data = await response.json();
        console.log('Resposta do servidor:', data);
        
        if (response.ok) {
            showMessage('Cadastro realizado com sucesso!', 'success');
            setTimeout(() => {
                window.location.href = '/login';
            }, 1500);
        } else {
            showMessage(data.error || 'Erro no cadastro', 'error');
        }
        
    } catch (error) {
        console.error('Erro completo:', error);
        showMessage('Erro de conexão com o servidor', 'error');
    }
}

function showMessage(message, type) {
    const messageDiv = document.getElementById('message');
    
    if (!messageDiv) {
        const newMessageDiv = document.createElement('div');
        newMessageDiv.id = 'message';
        newMessageDiv.className = `message ${type}`;
        newMessageDiv.textContent = message;
        
        const form = document.querySelector('form');
        form.parentNode.insertBefore(newMessageDiv, form);
        
        setTimeout(() => {
            newMessageDiv.remove();
        }, 5000);
        return;
    }
    
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}