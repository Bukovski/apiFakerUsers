const db = require('./db');
const { notFound, success } = require('./response');


const request = {};

request.recordCreateList = function(res, count) {
  const createRecords = db.generateUserJson(+count);
  
  if (createRecords) return notFound(res, `Records not create`);
  
  success(res, `${ count } records was created`);
};

request.getUsersId = function(res, id) {
  db.readJson((err, arr) => {
    if (err) return notFound(res, err);
    
    const onlyOne = arr.filter(item => item.id === +id);
    
    success(res, onlyOne, true);
  });
};

request.postUsers = function(res) {
  db.readJson((err, arr) => {
    if (err) return notFound(res, err);
    
    success(res, arr, true);
  });
};

request.deleteUsers = function(res, id) {
  db.readJson((err, arr) => {
    if (err) return notFound(res, err);
    
    let isExists = false;
    
    const withoutOne = arr.filter(item => {
      if (item.id === +id) {
        isExists = true;
      }
      
      return item.id !== +id
    });
    
    db.updateJson(withoutOne, (err) => {
      if (err) return notFound(res, err);
      if (!isExists) return notFound(res, `Record #${ id } not exists`);
      
      success(res, `Record #${ id } was deleted`);
    })
  });
};

request.putUsersBody = function(res, body) {
  db.readJson((err, arr) => {
    if (err) return notFound(res, err);
    
    let lastId = arr[ arr.length - 1 ].id;
    body.id = lastId + 1;
    
    const newData = arr.concat(body);
    
    db.updateJson(newData, (err) => {
      if (err) return notFound(res, err);
      
      success(res, 'Record was added');
    })
  });
};

request.pathUsersIdBody = function(res, id, body) {
  db.readJson((err, arr) => {
    if (err) return notFound(res, err);
    
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
      if (err) return notFound(res, err);
      
      success(res, 'Record was changed');
    });
  });
};


module.exports = request;
