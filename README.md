Para utilizar o site de criptografia, siga os passos abaixo. O projeto usa HTML, CSS e Node.js, e também precisa de um banco de dados chamado PFI para registrar logs ou informações relacionadas à criptografia (dependendo do seu projeto).


---

1. Pré-requisitos

Antes de tudo, você precisa ter instalado:

Node.js

NPM

Um banco de dados já criado com o nome: PFI


> O banco PFI deve existir antes de iniciar o sistema.
(Se você quiser, eu também faço o script SQL para criar o banco.)




---

2. Instalação

1. Baixe ou clone o projeto:



git clone <URL-DO-REPOSITORIO>
cd <NOME-DO-PROJETO>

2. Instale as dependências:



npm install


---

3. Configuração do Banco PFI

Antes de rodar, verifique se no seu arquivo de conexão (ex.: config/db.js, database.js etc.) o nome do banco está definido como:

database: "PFI"

Se o projeto usar .env, coloque:

DB_NAME=PFI


---

4. Como rodar o projeto

No terminal, dentro da pasta do projeto, execute:

nok start

Se o comando não funcionar, use:

npm start


---

 5. Como usar o site

Depois de iniciar o servidor:

1. Abra o navegador


2. Digite a URL exibida no terminal, normalmente:

http://localhost:3000


3. Na página você poderá:

Inserir um texto

Escolher um tipo de criptografia (César, Base64, AES etc.)

Informar chave/valor quando necessário

Clicar em Criptografar ou Descriptografar



4. O sistema irá:

Processar o texto via backend Node.js
