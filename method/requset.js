const db = require('./db');
const { notFound, success } = require('./response');


const request = {};

request.getCors = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Credentials", "true");
};

request.recordCreateList = (res, count) => {
  db.generateUserJson(+count)
    .then(() => success(res, `${ count } records was created`))
    .catch(() => notFound(res, `Records not create`))
};

request.getUsersId = (res, id) => {
  db.readJson('users')
    .then((arr) => {
      const onlyOne = arr.filter(item => item.id === +id);
      
      success(res, onlyOne, true);
    })
    .catch((err) => notFound(res, err))
};

request.postUsers = (res) => {
  db.readJson('users')
    .then((arr) => success(res, arr, true))
    .catch((err) => notFound(res, err))
};

request.deleteUsers = async (res, id) => {
  let arr;
  
  try {
    arr = await db.readJson('users');
  } catch (e) {
    return notFound(res, 'No such file or directory');
  }
  
  let isExists = false;
  
  const withoutOne = await arr.filter(item => {
    if (item.id === +id) {
      isExists = true;
    }
    
    return item.id !== +id
  });
  
  if (!isExists) return notFound(res, `Record #${ id } not exists`);
  
  return db.updateJson(withoutOne, 'users')
    .then(() => success(res, `Record #${ id } was deleted`))
    .catch((err) => notFound(res, 'Could not delete'));
};

request.putUsersBody = async (res, body) => {
  let arr;
  
  try {
    arr = await db.readJson('users');
  } catch (err) {
    return notFound(res, err)
  }

  let lastId = arr[ arr.length - 1 ].id;
  
  body.id = lastId + 1;
  
  const newData = await arr.concat(body);
  
  return db.updateJson(newData, 'users')
    .then(() => success(res, 'Record was added'))
    .catch((err) => notFound(res, err));
};

request.pathUsersIdBody = async (res, id, body) => {
  let arr;
  
  try {
    arr = await db.readJson('users');
  } catch (err) {
    return notFound(res, err)
  }
  
  let indexRecord = null;
  
  arr.every((value, index) => {
    if (value.id === +id) {
      indexRecord = index;
      
      return false
    }
    
    return true;
  });
  
  if (indexRecord === null) return notFound(res, 'Record not found');
  
  const dataRecord = arr[ indexRecord ];
  
  arr[ indexRecord ] = Object.assign({}, dataRecord, body);
  
  return db.updateJson(arr, 'users')
    .then(() => success(res, 'Record was changed'))
    .catch((err) => notFound(res, err))
};


module.exports = request;
