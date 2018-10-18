const { StringDecoder } = require('string_decoder'); //decode Buffer in string UTF-8 or UTF-16
const url = require('url');
const db = require('./db');
const { isString, notFound } = require('./response');
const { deleteUsers, getUsersId,
  pathUsersIdBody, postUsers,
  putUsersBody, recordCreateList } = require('./requset');


function server(req, res) {
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
    
    if (!['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(method) || pathname !== 'users') return notFound(res, `404 Method: ${ method } or path: ${ pathname } is not found`);
    
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
  });
}


module.exports = server;
