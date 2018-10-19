const http = require('http');
const server = require('./method/server');


http.createServer((req, res) => {
  server(req, res);
}).listen(3000);

console.log('Server started http://localhost:3000/');
