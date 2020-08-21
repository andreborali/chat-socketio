const express  = require('express');   // gerenciador de rotas
const path     = require('path');      // gerenciador de path dos diretórios
const http     = require('http');      // server http 
const socketio = require('socket.io'); // engine socket io
const ejs      = require('ejs');       // renderizador html

// criando rotas express
const app = express();

// configurando server http e socket
const server = http.createServer(app);
const io = socketio(server);

// definindo acesso direto do http para diretório public
app.use(express.static(path.join(__dirname, 'public')));
// configurando pasta padrão para views html
app.set('views', path.join(__dirname, 'public'));
// configurando engine html
app.engine('html', ejs.renderFile);
// configurando padrão de render para o html
app.set('view engine', 'html');

// definindo rota padrão "/"
app.use('/', (req, res) => {
    // renderizando arquivo
    res.render('index.html');
} );

// banco de mensagens local
let messages = [];

// ouvindo evento para novas conexões
io.on('connection', socket => {
    // printa no console ID da conexão
    console.log(`Socket conectado: ${socket.id}`);

    // emite para esta nova conexão o histórico das mensages
    socket.emit('previusMessage', messages);

    // ouvindo evento de novas mensagens enviada pelo usuário
    socket.on('sendMessage', data => {
        // cadastra a mensagem no banco de mensagem
        messages.push(data);
        // dispara para todos os demais a mensagem enviada
        socket.broadcast.emit('receivedMessage', data)
    });
})

// iniciando servidor na porta 3000
server.listen(3000);