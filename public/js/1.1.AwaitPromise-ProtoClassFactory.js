/*
Промисы переписать функцию для запросов к API. Вызывать последовательно через цепочку вызовов 2 4 6 записть с БД. Сделать такой же запрос но через promise.all и race.
На прототипах + модуль, классах + модуль, фабрике: Получить циклом всех четных пользователей и вывести их аватарки на экран в таблице с подписью username из БД


авэйты - переписать задание с промисами на авэйты. Последюю задачу сделать на фабрике
 */

function request(path, method, payload) {
  path = (typeof path === 'string') ? path : '/';
  method = (typeof method === 'string') && ['POST','GET','PUT','DELETE','PATCH'].includes(method.toUpperCase()) ? method.toUpperCase() : 'GET';
  payload = (typeof payload === 'object') && payload !== undefined ? JSON.stringify(payload) : null;
  
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    xhr.open(method, path, true);
    xhr.setRequestHeader("Content-type", "application/json"); //"text/html", "text/plain" etc.
    
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        const statusCode = xhr.status;
        const responseReturned = xhr.responseText;
        
        try {
          const parsedResponse = JSON.parse(responseReturned);
          resolve(parsedResponse);
        } catch (e) {
          reject(statusCode);
        }
      }
    };
    
    xhr.send(payload);
  })
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

// request('http://127.0.0.1:3000/users?records=10', 'get').then(console.log).catch(console.log);
// request('http://127.0.0.1:3000/users?id=1', 'get').then(console.log).catch(console.log);
// request('http://127.0.0.1:3000/users?id=2', 'delete').then(console.log).catch(console.log);
// request('http://127.0.0.1:3000/users', 'post').then(console.log).catch(console.log);
// request('http://127.0.0.1:3000/users?id=1', 'patch', changeUser).then(console.log).catch(console.log);
// request('http://127.0.0.1:3000/users', 'put', newUser).then(console.log).catch(console.log);


/*
request('http://127.0.0.1:3000/users?id=1', 'get')
  .then((json) => {
    console.log(json);
    
    return request('http://127.0.0.1:3000/users?id=3', 'get')
  })
  .then((json) => {
    console.log(json);
    
    return request('http://127.0.0.1:3000/users?id=5', 'get')
  })
  .then((json) => {
    console.log(json)
  })
  .catch(console.log);
  */

/*
Promise.all([
  request('http://127.0.0.1:3000/users?id=1', 'get'),
  request('http://127.0.0.1:3000/users?id=3', 'get'),
  request('http://127.0.0.1:3000/users?id=5', 'get')
  ])
  .then((json) => {
    console.log(json)
  })
  .catch(console.log);*/

/*
Promise.race([
    request('http://127.0.0.1:3000/users?id=1', 'get'),
    request('http://127.0.0.1:3000/users?id=3', 'get'),
    request('http://127.0.0.1:3000/users?id=5', 'get')
  ])
  .then((json) => {
    console.log(json)
  })
  .catch(console.log);
  */


//На прототипах + модуль, классах + модуль, фабрике: Получить циклом всех четных пользователей и вывести их аватарки на экран в таблице с подписью username из БД
const TableFromRequest = (() => {
  function _queryPath(query, id, count) {
    let allQuery = query;
    
    if (id) {
      allQuery += '?' + id;
      
      if (count) {
        allQuery += '=' + count
      }
    }
    
    return allQuery;
  }
  
  function _tableCreate(arr) {
    const body = document.getElementsByTagName("body")[ 0 ];
    const table = document.createElement("table");
    const tbody = document.createElement("tbody");
    
    table.style.cssText = 'border: 1px solid black; width: 50px;';
    
    arr.forEach((elem, index) => {
      if (!(index % 2)) {
        const tr = document.createElement("tr");
        const td1 = document.createElement("td");
        const td2 = td1.cloneNode(true);
        
        td1.appendChild(document.createTextNode(elem.username));
        td1.style.fontSize = "25px";
        tr.appendChild(td1);
        
        const newImg = td2.appendChild(document.createElement("img"));
        newImg.setAttribute("src", elem.avatar);
        tr.appendChild(td2);
        
        tbody.appendChild(tr);
      }
    });
    
    table.appendChild(tbody);
    body.appendChild(table)
  }
  
  function TableFromRequest(func, hostname) {
    this.func = func;
    this.hostname = hostname;
    
    if (new.target === TableFromRequest) { Object.freeze(this); }
  }
  
  TableFromRequest.prototype = {
    getRequest: function (method, query, id) {
      return (count) => {
        return this.func(this.hostname + '/' + _queryPath(query, id, count), method)
      };
    },
    getUsers: function (method, query, id, count) {
      const request = this.getRequest(method, query, id);
      
      request()
        .then((arr) => _tableCreate(arr))
        .catch(console.log)
        .finally(() => console.log('Users reading'));
    }
  };
  
  return TableFromRequest;
})();

const table = new TableFromRequest(request, 'http://127.0.0.1:3000');
table.getUsers('post', 'users');
table.some = 'test';
console.log(table.some);

/***************************************************/

const TableFromRequest = (() => {
  function _queryPath(query, id, count) {
    let allQuery = query;
    
    if (id) {
      allQuery += '?' + id;
      
      if (count) {
        allQuery += '=' + count
      }
    }
    
    return allQuery;
  }
  
  function _tableCreate(arr) {
    const body = document.getElementsByTagName("body")[ 0 ];
    const table = document.createElement("table");
    const tbody = document.createElement("tbody");
    
    table.style.cssText = 'border: 1px solid black; width: 50px;';
    
    arr.forEach((elem, index) => {
      if (!(index % 2)) {
        const tr = document.createElement("tr");
        const td1 = document.createElement("td");
        const td2 = td1.cloneNode(true);
        
        td1.appendChild(document.createTextNode(elem.username));
        td1.style.fontSize = "25px";
        tr.appendChild(td1);
        
        const newImg = td2.appendChild(document.createElement("img"));
        newImg.setAttribute("src", elem.avatar);
        tr.appendChild(td2);
        
        tbody.appendChild(tr);
      }
    });
    
    table.appendChild(tbody);
    body.appendChild(table)
  }
  
  return class {
    constructor(func, hostname) {
      this.func = func;
      this.hostname = hostname;
      
      if (new.target === TableFromRequest) {
        Object.freeze(this);
      }
    }
    
    getRequest (method, query, id) {
      return (count) => {
        return this.func(this.hostname + '/' + _queryPath(query, id, count), method)
      };
    }
    getUsers (method, query, id, count) {
      const request = this.getRequest(method, query, id);
      
      request()
        .then((arr) => _tableCreate(arr))
        .catch(console.log)
        .finally(() => console.log('Users reading'));
    }
  }
})();

const table = new TableFromRequest(request, 'http://127.0.0.1:3000');
table.getUsers('post', 'users');
table.some = 'test';
console.log(table.some);

/****************************************/

function TableFromRequest(func, hostname) {
  const _func = func;
  const _hostname = hostname;
  
  function _queryPath(query, id, count) {
    let allQuery = query;
    
    if (id) {
      allQuery += '?' + id;
      
      if (count) {
        allQuery += '=' + count
      }
    }
    
    return allQuery;
  }
  
  function _tableCreate(arr) {
    const body = document.getElementsByTagName("body")[ 0 ];
    const table = document.createElement("table");
    const tbody = document.createElement("tbody");
    
    table.style.cssText = 'border: 1px solid black; width: 50px;';
    
    arr.forEach((elem, index) => {
      if (!(index % 2)) {
        const tr = document.createElement("tr");
        const td1 = document.createElement("td");
        const td2 = td1.cloneNode(true);
        
        td1.appendChild(document.createTextNode(elem.username));
        td1.style.fontSize = "25px";
        tr.appendChild(td1);
        
        const newImg = td2.appendChild(document.createElement("img"));
        newImg.setAttribute("src", elem.avatar);
        tr.appendChild(td2);
        
        tbody.appendChild(tr);
      }
    });
    
    table.appendChild(tbody);
    body.appendChild(table)
  }
  
  return Object.freeze({
    getRequest(method, query, id) {
      return (count) => {
        return _func(_hostname + '/' + _queryPath(query, id, count), method)
      };
    },
    async getUsers(method, query, id, count) {
      const request = this.getRequest(method, query, id);
      
      try {
        const arr = await request();
        
        _tableCreate(arr);
      } catch (e) {
        _tableCreate([]);
        
        throw e;
      } finally {
        console.log('Users reading');
      }
    }
  })
}

const table = TableFromRequest(request, 'http://127.0.0.1:3000');
table.getUsers('post', 'users');
table.some = 'test';
console.log(table.some);
