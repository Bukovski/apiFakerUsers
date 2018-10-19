const http = require('http');
const server = require('./method/server');


http.createServer((req, res) => {
  server(req, res);
}).listen(3000);

console.log('Server started http://localhost:3000/');



// const db = require('./method/db');


// db.readJson().then(console.log).catch(console.log)

//db.createJson({name: 55}).catch(console.log)
// db.createJson({"name": 55}, function (err) { console.log(err) });

// db.generateUserJson(1).catch(console.log);


