const { StringDecoder } = require('string_decoder'); //decode Buffer in string UTF-8 or UTF-16
const url = require('url');
const path = require('path');
const db = require('./db');
const { isString, notFound } = require('./response');
const { getCors, deleteUsers, getUsersId,
  pathUsersIdBody, postUsers,
  putUsersBody, recordCreateList } = require('./requset');
const { postAuth, getAuth } = require('./auth');


function server(req, res) {
  let { method, headers } = req;
  let { pathname, query } = url.parse(req.url, true);
  
  const decoder = new StringDecoder('utf-8');
  let buffer = '';
  
  getCors(res);
  
  req.on('data', (data) => {
    buffer += decoder.write(data);
  });
  
  pathname = pathname.replace(/^\/+|\/+$/g, '');
  method = method.toUpperCase();
  
  req.on('end', () => {
    buffer += decoder.end();
    
    if (!pathname) pathname = 'index.html';
    
    const payload = db.parseJsonToObject(buffer);
    const basePath = __dirname + '/../public/';
    const pathToFile = path.normalize(basePath + pathname);
    
    if (!['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) return notFound(res, `404 Method: ${ method } or path: ${ pathname } is not found`);
    
    if (pathname === 'users') {
      if (method === 'GET' && query.records && !isNaN(query.records)) { // GET	/users?records=5
        recordCreateList(res, query.records)
      } else if (method === 'GET' && query.id && !isNaN(query.id)) { // GET	/users?id=1
        getUsersId(res, query.id);
      } else if (method === 'POST') { // POST	/users
        postUsers(res);
      } else if (method === 'DELETE' && query.id && !isNaN(query.id)) { //DELETE /users?id=34
        deleteUsers(res, query.id);
      } else if (method === 'PUT' && Object.keys(payload).length
        && isString(payload.name) && isString(payload.username)
        && isString(payload.avatar) && isString(payload.email)
        && isString(payload.phone)
      ) { //PUT /users
        putUsersBody(res, payload);
      } else if (method === 'PATCH' && query.id && !isNaN(query.id) && Object.keys(payload).length
        && (isString(payload.name) || isString(payload.username)
          || isString(payload.avatar) || isString(payload.email)
          || isString(payload.phone))) { // PATCH	/users?id=34
        pathUsersIdBody(res, query.id, payload);
      } else {
        notFound(res);
      }
    } else if (pathname === 'auth') {
      if (method === 'GET' && query.email && query.password) { // GET	/auth?email=johndou@mail.ru&password=112233
        getAuth(res, query);
      } else if (method === 'POST') { // POST	/auth
        postAuth(res, payload);
      } else {
        notFound(res);
      }
    } else {
      db.getTemplate(res, pathname, pathToFile);
    }
  });
}


module.exports = server;
