const db = require('./db');
const { notFound, success } = require('./response');


const request = {};

request.recordCreateList = (res, count) => {
  db.generateUserJson(+count)
    .then(() => success(res, `${ count } records was created`))
    .catch(() => notFound(res, `Records not create`))
};

request.getUsersId = (res, id) => {
  db.readJson()
    .then((arr) => {
      const onlyOne = arr.filter(item => item.id === +id);
      
      success(res, onlyOne, true);
    })
    .catch((err) => notFound(res, err))
};

request.postUsers = (res) => {
  db.readJson()
    .then((arr) => success(res, arr, true))
    .catch((err) => notFound(res, err))
};

request.deleteUsers = (res, id) => {
  db.readJson()
    .then((arr) => {
      let isExists = false;
      
      const withoutOne = arr.filter(item => {
        if (item.id === +id) {
          isExists = true;
        }
        
        return item.id !== +id
      });
      
      if (!isExists) return notFound(res, `Record #${ id } not exists`);
      
      db.updateJson(withoutOne)
        .then(() => {
          return success(res, `Record #${ id } was deleted`)
        })
        .catch((err) => notFound(res, err))
    })
    .catch((err) => notFound(res, err));
};

request.putUsersBody = (res, body) => {
  db.readJson((arr) => {
      let lastId = arr[ arr.length - 1 ].id;
      
      body.id = lastId + 1;
      
      const newData = arr.concat(body);
      
      db.updateJson(newData)
        .then(() => success(res, 'Record was added'))
        .catch((err) => notFound(res, err));
    })
    .catch((err) => notFound(res, err))
};

request.pathUsersIdBody = (res, id, body) => {
  db.readJson()
    .then((arr) => {
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
      
      db.updateJson(arr)
        .then(() => success(res, 'Record was changed'))
        .catch((err) => notFound(res, err))
    })
    .catch((err) => notFound(res, err))
};


module.exports = request;
