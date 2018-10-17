const path = require('path');
const fs = require('fs');
const faker = require('../libs/faker.min.js');


const db = {};
const dataDir = path.join(__dirname, '../.data/users.json');

function generateData(id) {
  const userObj = {
    id: id
  };
  
  return Object.assign({}, userObj, faker.helpers.contextualCard());
}

db.parseJsonToObject = (str) => { //просто парсит JSON или вернет пустой обьект
  try {
    const obj = JSON.parse(str);
    
    return obj;
  } catch(e) {
    return {};
  }
};

db.createJson = (data, callback) => {
  fs.open(dataDir, 'wx', (err, fileDescriptor) => {
    if (err && !fileDescriptor) return callback('Could not create new file, it may already exist');
    const stringData = JSON.stringify(data, undefined, 2);
    
    fs.writeFile(fileDescriptor, stringData, (err) => {
      if (err) return callback('Error writing to new file');
      
      fs.close(fileDescriptor, (err) => {
        if (err) return callback('Error closing new file');
        
        callback(false);
      });
    });
  });
};

db.updateJson = (data, callback) => {
  fs.open(dataDir, 'r+', (err, fileDescriptor) => {
    if (err && !fileDescriptor) return callback('Could not open file for updating, it may not exist yet');
    const stringData = JSON.stringify(data, undefined, 2);
    
    fs.ftruncate(fileDescriptor, (err) => {
      if (err) return callback('Error truncating file');
      
      fs.writeFile(fileDescriptor, stringData, (err) => {
        if (err) return callback('Error writing to existing file');
        
        fs.close(fileDescriptor, (err) => {
          if (err) return callback('Error closing existing file');
          
          callback(false);
        });
      });
    });
  });
};

db.readJson = (callback) => {
  fs.readFile(dataDir, 'utf8', (err, data) => {
    if(err && !data) return callback(err, data);
    
    const parsedData = db.parseJsonToObject(data);
    callback(false, parsedData); //ошибок нет, передать JSON
  });
};

db.deleteJson = (callback) => {
  fs.unlink(dataDir, (err) => {
    callback(err);
  });
};

db.generateUserJson = (count) => {
  let users = [];
  
  for (let i = 0; i < count; i++) {
    users = users.concat(generateData(i));
  }
  
  db.createJson(users, (err) => {
    if (err) db.updateJson(users, (error) => {
      if (error) console.log(error);
    });
  });
  
  return null;
};


module.exports = db;
