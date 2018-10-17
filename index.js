const http = require('http');
const request = require('./method/requset');

http.createServer((req, res) => {
  request.server(req, res);
}).listen(3000);

console.log('Server started http://localhost:3000/');


