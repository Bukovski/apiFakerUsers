const { StringDecoder } = require('string_decoder'); //декодирует Buffer в строку формата UTF-8 или UTF-16
const url = require('url');
const db = require('./db');


function checkString(field) {
  return (typeof field === 'string') && field.trim().length && isNaN(field);
}

function recordCreateList(res, count) {
  res.writeHead(200, { "Content-Type": "text/plain" });
  
  const createRecords = db.generateUserJson(+count);
  
  res.end(createRecords ? `Error: Records not create` : `${ count } records was created`);
}

function getPostId(res, id) {
  res.writeHead(200, { "Content-Type": "text/json" });
  
  db.readJson((err, arr) => {
    if (err) return res.end({ 'Error': err });
    
    const onlyOne = arr.filter(item => item.id === +id);
    res.end(JSON.stringify(onlyOne));
  });
}

function postPost(res) {
  res.writeHead(200, { "Content-Type": "text/json" });
  
  db.readJson((err, arr) => {
    if (err) return res.end({ 'Error': err });
    
    res.end(JSON.stringify(arr));
  });
}

function deletePost(res, id) {
  res.writeHead(200, { "Content-Type": "text/plain" });
  
  db.readJson((err, arr) => {
    if (err) return res.end('Error:', err);
    
    let isExists = false;
    
    const withoutOne = arr.filter(item => {
      if (item.id === +id) {
        isExists = true;
      }
      
      return item.id !== +id
    });
    
    db.updateJson(withoutOne, (err) => {
      if (err) return console.log(err);
      
      if (isExists) return res.end(`Success: Record #${ id } was deleted`);
      
      res.end(`Error: Record #${ id } not exists`);
    })
  });
}

function putPostBody(res, body) {
  res.writeHead(200, { "Content-Type": "text/plain" });
  
  db.readJson((err, arr) => {
    if (err) return res.end('Error:', err);
    
    let lastId = arr[ arr.length - 1 ].id;
    body.id = lastId + 1;
    
    const newData = arr.concat(body);
    
    db.updateJson(newData, (err) => {
      if (err) return res.end('Error:', err);
      
      res.end('Success: Record was added');
    })
  });
}

function pathPostIdBody(res, id, body) {
  res.writeHead(200, { "Content-Type": "text/plain" });
  
  db.readJson((err, arr) => {
    if (err) return res.end('Error:', err);
    
    let indexRecord = 0;
    
    arr.every((value, index) => {
      if (value.id === +id) {
        indexRecord = index;
        
        return false
      }
      
      return true;
    });
    
    const dataRecord = arr[ indexRecord ];
    
    arr[ indexRecord ] = Object.assign({}, dataRecord, body);
    
    db.updateJson(arr, (err) => {
      if (err) return res.end('Error:', err);
  
      res.end('Success: Record was changed');
    });
  });
}

function notFound(res, text) {
  res.writeHead(404, { "Content-Type": "text/plain" });
  
  const textMessage = (text) ? text : "404 Data Not Found";
  res.end(textMessage);
}


const request = {};

request.server = (req, res) => {
  let { method } = req;
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
    
    if (!['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      return notFound(res, `404 Method ${ method } is not found`);
    }
    
    if (pathname === 'users') {
      if (method === 'GET' && query.records && !isNaN(query.records)) { // GET	/users?records=5
        recordCreateList(res, query.records)
      } else if (method === 'GET' && query.id && !isNaN(query.id)) { // GET	/users?id=1
        getPostId(res, query.id);
      } else if (method === 'POST') { // POST	/users
        postPost(res);
      } else if (method === 'DELETE' && query.id && !isNaN(query.id)) { //DELETE /users?id=34
        deletePost(res, query.id);
      } else if (method === 'PUT' && Object.keys(payload).length
        && checkString(payload.name) && checkString(payload.username)
        && checkString(payload.avatar) && checkString(payload.email)
        && checkString(payload.phone)
      ) { //PUT /users
        putPostBody(res, payload);
      } else if (method === 'PATCH' && query.id && !isNaN(query.id) && Object.keys(payload).length
      && (checkString(payload.name) || checkString(payload.username)
          || checkString(payload.avatar) || checkString(payload.email)
          || checkString(payload.phone))) { // PATCH	/users?id=34
        pathPostIdBody(res, query.id, payload);
      } else {
        notFound(res);
      }
    } else {
      notFound(res);
    }
  });
};


module.exports = request;
