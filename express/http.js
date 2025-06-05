const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('¡Hola Mundo!\n');
});

server.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});