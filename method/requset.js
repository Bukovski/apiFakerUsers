const { StringDecoder } = require('string_decoder'); //декодирует Buffer в строку формата UTF-8 или UTF-16
const url = require('url');
const db = require('./db');

const request = {};

request.server = (req, res) => {
  let { method, headers } = req;
  let { pathname, query } = url.parse(req.url, true);
  
  const decoder = new StringDecoder('utf-8');
  let buffer = '';
  
  req.on('data', (data) => {
    buffer += decoder.write(data);
  });
  
  pathname = pathname.replace(/^\/+|\/+$/g, '');
  method = method.toUpperCase();
  
  
  req.on('end', () => {
    const payload = db.parseJsonToObject(buffer);
    
    if (pathname === 'users') {
      if (method === 'GET' && query.id && !isNaN(query.id)) { // GET	/posts?id=1
        res.writeHead(200, { "Content-Type": "text/json" });
      
        db.readJson((err, arr) => {
          if (err) return console.log(err);
        
          const onlyOne = arr.filter(item => item.id === +query.id);
          res.end(JSON.stringify(onlyOne));
        });
      
        // userId(res, address.query.id);
      } else if (method === 'GET' && query.records && !isNaN(query.records)) { // GET	/users?records=5
        res.writeHead(200, { "Content-Type": "text/plain" });
      
        const createRecords = db.generateUserJson(+query.records);
      
        res.end(createRecords ? `Error: Records not create` : `${ query.records } records was created`);
      
      } else if (method === 'POST') { // POST	/posts
        res.writeHead(200, { "Content-Type": "text/json" });
      
        db.readJson((err, arr) => {
          if (err) return console.log(err);
        
          res.end(JSON.stringify(arr));
        });
      } else if (method === 'DELETE' && query.id && !isNaN(query.id)) { //DELETE /users?id=34
        res.writeHead(200, { "Content-Type": "text/plain" });
      
        db.readJson((err, arr) => {
          if (err) return console.log(err);
        
          let isExists = false;
        
          const withoutOne = arr.filter(item => {
            if (item.id === +query.id) {
              isExists = true;
            }
          
            return item.id !== +query.id
          });
        
          db.updateJson(withoutOne, (err) => {
            if (err) return console.log(err);
          
            if (isExists) return res.end(`Success: Record #${ query.id } was deleted`);
          
            res.end(`Error: Record #${ query.id } not exists`);
          })
        });
      
      } else if (method === 'PUT' && payload.name) { //PUT /users
        //сделать проверку на поля json нужно больше полей чтобы запись была добавлена полноценной
        res.writeHead(200, { "Content-Type": "text/plain" });
      
        db.readJson((err, arr) => {
          if (err) return console.log(err);
          
          let lastId = arr[arr.length - 1].id;
          payload.id = lastId + 1;
          
          const newData = arr.concat(payload);
          
          db.updateJson(newData, (err) => {
            if (err) return res.end('Error:', err);
  
            res.end('Success: Record was added');
          })
        });
  
      } else if (method === 'PATCH' && query.id && !isNaN(query.id) && Object.keys(payload).length) { // PATCH	/users?id=34
        res.writeHead(200, { "Content-Type": "text/plain" });
  
        db.readJson((err, arr) => {
          if (err) return console.log(err);
  
          let indexRecord = 0;
          
          arr.every((value, index) => {
            if (value.id === +query.id) {
              indexRecord = index;
      
              return false
            }
    
            return true;
          });
          
          const dataRecord = arr[indexRecord];
  
          arr[indexRecord] = Object.assign({}, dataRecord, payload);
  
          db.updateJson(arr, (err) => {
            if (err) return res.end('Error:', err);
  
            res.end('Success: Record was changed');
          });
        });
      } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Data Not Found");
      }
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Data Not Found");
    }
  });
};




function userId(res, id) { //http://localhost:3000/user?id=2
  const inStock = db.filter((item) => {
    return item.id === +id;
  });
  
  res.end(JSON.stringify(inStock));
}




module.exports = request;


/*
GET	/posts?userId=1
POST	/posts
PUT	/posts/1
PATCH	/posts/1
DELETE	/posts/1

Когда клиенту необходимо полностью заменить существующий ресурс, они могут использовать PUT.
Когда они выполняют частичное обновление, они могут использовать HTTP PATCH.

"id": query.id,
"name": payload.name,
"username": payload.username,
"avatar": payload.avatar,
"email": payload.email,
"phone": payload.phone,
 */