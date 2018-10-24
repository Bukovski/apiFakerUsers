const https = require('https');
const http = require('http');
const path = require('path');
const fs = require('fs');
const server = require('./method/server');


http.createServer((req, res) => server(req, res)).listen(3000, () => {
  console.log('HTTP server started http://127.0.0.1:3000/');
});



const httpsServerOptions = {
  'key': fs.readFileSync(path.join(__dirname,'./https/key.pem')),
  'cert': fs.readFileSync(path.join(__dirname,'./https/cert.pem'))
};

https.createServer(httpsServerOptions, (req, res) => server(req, res)).listen(3001, () => {
  console.log('HTTPS server started https://127.0.0.1:3001/');
});

