/*
Напистаь запросы к API через калбэкти, промисы, авэйты (работаеть с XMLHttpRequest).
на калбэках реализовать функцию для запросов к API чрез XMLHttpRequest, написать допольнительный класс с паттерном фасад и привести запросы к виду
req.get('records', 15, function (status, data) { console.log(status, data); });
req.get('id', 2, function (status, data) { console.log(status, data[0]); });
req.delete('id', 1, function (status, data) { console.log(status, data); });
req.put(newUser, function (status, data) { console.log(status, data); });
req.patch('id', 2, changeUser, function (status, data) { console.log(status, data); });

(Продвинутый уровень: по возможности сделать независимые параметры ввода)
http://qaru.site/questions/12865764/javascript-omit-parameters-in-functions-does-not-affect-the-function
req.get('id', 5, function (status, data) { console.log(status, data[0]); });
req.get('id', 2, { 'test': 55 }, function (status, data) { console.log(status, data[0]); });
req.get(function (status, data) { console.log(status, data[0]); });
 */

function request(path, method, payload, callback) {
  path = (typeof path === 'string') ? path : '/';
  method = (typeof method === 'string') && ['POST','GET','PUT','DELETE','PATCH'].includes(method.toUpperCase()) ? method.toUpperCase() : 'GET';
  payload = (typeof payload === 'object') && payload !== undefined ? JSON.stringify(payload) : null;
  callback = (typeof callback === 'function') ? callback : false;
  
  const xhr = new XMLHttpRequest();
  
  xhr.open(method, path, true);
  xhr.setRequestHeader("Content-type", "application/json"); //"text/html", "text/plain" etc.
  
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      const statusCode = xhr.status;
      const responseReturned = xhr.responseText;
      
      if (callback) { // Callback if requested
        try{
          const parsedResponse = JSON.parse(responseReturned);
          callback(statusCode, parsedResponse);
        } catch(e){
          callback(statusCode, false);
        }
      }
    }
  };
  
  xhr.send(payload);
}

const newUser = {
  "name": "Edyth",
  "username": "Kay49",
  "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/we_social/128.jpg",
  "email": "Madisen_Skiles50@yahoo.com",
  "phone": "(348) 415-0448"
};

const changeUser = {
  "name": "Bukovski-->"
};

// request('http://127.0.0.1:3000/users?records=10', 'get', undefined, function (status, data) {
// request('http://127.0.0.1:3000/users?id=1', 'get', undefined, function (status, data) {
// request('http://127.0.0.1:3000/users?id=1', 'delete', undefined, function (status, data) {
// request('http://127.0.0.1:3000/users?id=2', 'patch', changeUser, function (status, data) {
// request('http://127.0.0.1:3000/users', 'post', undefined, function (status, data) {
// request('http://127.0.0.1:3000/users', 'put', newUser, function (status, data) {
//   console.log(status, data);
// });


function RequestFacade(func, hostname, pathname) {
  this.func = func;
  this.hostname = hostname;
  this.pathname = pathname;
}

RequestFacade.prototype = {
  baseAddress: function () {
    return `${ this.hostname }/${ this.pathname }`;
  },
  queryPath: function(query, count) {
    let allQuery = '';
    
    if (query) {
      allQuery += '?' + query;
      
      if (count) {
        allQuery += '=' + count;
      }
    }
    
    return allQuery;
  },
  template: function (query, count, method, json, callback) {
    if (typeof query === 'function') {
      callback = query;
      query = undefined;
      count = undefined;
      json = undefined;
    } else if (typeof query === 'object' && typeof count === 'function') {
      json = query;
      callback = count;
      query = undefined;
      count = undefined;
    } else if (typeof json === 'function') {
      callback = json;
      json = undefined;
    } else if (typeof query === "string" && typeof count === 'function') {
      callback = count;
      count = undefined;
      json = undefined;
    } else if (typeof query === "string" && typeof count === 'object' && typeof json === "function") {
      json = count;
      callback = json;
      count = undefined;
      json = undefined;
    }
    
    return this.func(`${ this.baseAddress() }${ this.queryPath(query, count) }`, method, json, callback)
  },
  get: function (query, count, json, callback) {
    return this.template(query, count, 'get', json, callback);
  },
  post: function (query, count, json, callback) {
    return this.template(query, count, 'post', json, callback);
  },
  delete: function (query, count, json, callback) {
    return this.template(query, count, 'delete', json, callback);
  },
  put: function (query, count, json, callback) {
    return this.template(query, count, 'put', json, callback);
  },
  patch: function (query, count, json, callback) {
    return this.template(query, count, 'patch', json, callback);
  }
};

const req = new RequestFacade(request, 'http://127.0.0.1:3000', 'users');

function response(statusCode, data) {
  if (statusCode !== 200) throw new Error('Something wrong, status:', statusCode);
  
  const showData = (data.length === 1) ? data[0] : data;
  console.log(showData);
}

req.get('id', 5, function (status, data) { console.log(status, data[0]); });
// req.get('id', 2, { 'test': 55 }, function (status, data) { console.log(status, data[0]); });
// req.get(function (status, data) { console.log(status, data[0]); });


// req.get('records', 15, function (status, data) { console.log(status, data); });
// req.get('id', 2, function (status, data) { console.log(status, data[0]); });
// req.delete('id', 1, function (status, data) { console.log(status, data); });
// req.put(newUser, function (status, data) { console.log(status, data); });
// req.patch('id', 2, changeUser, function (status, data) { console.log(status, data); });
