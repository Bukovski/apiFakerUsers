const path = require('path');
const fs = require('fs');
const faker = require('../libs/faker.min.js');


const db = {};
const dataDir = path.join(__dirname, '../.data/users.json');

function generateData(id) {
  return {
    "id": id,
    "name": faker.name.firstName(),
    "username": faker.internet.userName(),
    "avatar": faker.image.avatar(),
    "email": faker.internet.email(),
    "phone": faker.phone.phoneNumberFormat(1)
  };
}

db.parseJsonToObject = (str) => {
  try {
    return JSON.parse(str);
  } catch(e) {
    return {};
  }
};

db.createJson = (data) => {
  return new Promise((resolve, reject) => {
    fs.open(dataDir, 'wx', (err, fileDescriptor) => {
      if (err && !fileDescriptor) return reject('Could not create new file, it may already exist');
      const stringData = JSON.stringify(data, undefined, 2);
    
      fs.writeFile(fileDescriptor, stringData, (err) => {
        if (err) return reject('Error writing to new file');
      
        fs.close(fileDescriptor, (err) => {
          if (err) return reject('Error closing new file');
  
          resolve(true)
        });
      });
    });
  });
};

db.updateJson = (data) => {
  return new Promise((resolve, reject) => {
    fs.open(dataDir, 'r+', (err, fileDescriptor) => {
      if (err && !fileDescriptor) return reject('Could not open file for updating, it may not exist yet');
      const stringData = JSON.stringify(data, undefined, 2);
      
      fs.ftruncate(fileDescriptor, (err) => {
        if (err) return reject('Error truncating file');
        
        fs.writeFile(fileDescriptor, stringData, (err) => {
          if (err) return reject('Error writing to existing file');
          
          fs.close(fileDescriptor, (err) => {
            if (err) return reject('Error closing existing file');
  
            resolve(true)
          });
        });
      });
    });
  });
};

db.readJson = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(dataDir, 'utf8', (err, data) => {
      if(err || !data) return reject(err, data);
    
      const parsedData = db.parseJsonToObject(data);
      resolve(parsedData);
    });
  });
};

db.deleteJson = () => {
  return new Promise((resolve, reject) => {
    fs.unlink(dataDir, (err) => {
      if (err) return reject(err);
  
      resolve(true)
    });
  })
};

db.generateUserJson = (count) => {
  let users = [];
  
  for (let i = 0; i < count; i++) {
    users = users.concat(generateData(i));
  }
  
  return new Promise((resolve, reject) => {
    db.createJson(users)
      .then(() => resolve(true))
      .catch(() => db.updateJson(users)
        .then(() => resolve(true))
        .catch((error) => reject(error))
      )
  })
};


module.exports = db;
