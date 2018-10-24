const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const open = promisify(fs.open);
const close = promisify(fs.close);
const ftruncate = promisify(fs.ftruncate);
const writeFile = promisify(fs.writeFile);
const faker = require('../libs/faker.min.js');
const { notFound } = require('./response');


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

db.createJson = async (data) => {
  let fileDescriptor;
  
  try {
    fileDescriptor = await open(dataDir, 'wx')
  } catch (e) {
    throw new Error('Could not create new file, it may already exist');
  }
  
  try {
    const stringData = JSON.stringify(data, undefined, 2);
    
    await writeFile(fileDescriptor, stringData)
  } catch (e) {
    throw new Error('Error writing to new file');
  }
  
  try {
    close(fileDescriptor)
  } catch (e) {
    throw new Error('Error closing new file');
  }
};

db.updateJson = async (data) => {
  let fileDescriptor;
  
  try {
    fileDescriptor = await open(dataDir, 'r+')
  } catch (e) {
    throw new Error('Could not open file for updating, it may not exist yet');
  }
  
  try {
    await ftruncate(fileDescriptor)
  } catch (e) {
    throw new Error('Error truncating file');
  }
  
  try {
    const stringData = JSON.stringify(data, undefined, 2);
    
    await writeFile(fileDescriptor, stringData);
  } catch (e) {
    throw new Error('Error writing to existing file');
  }
  
  try {
    close(fileDescriptor)
  } catch (e) {
    throw new Error('Error closing new file');
  }
};

db.readJson = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(dataDir, 'utf8', (err, data) => {
      if(err && !data) return reject(new Error(err));
    
      const parsedData = db.parseJsonToObject(data);
      resolve(parsedData);
    });
  });
};

db.deleteJson = () => {
  return new Promise((resolve, reject) => {
    fs.unlink(dataDir, (err) => {
      if (err) return reject(new Error(err));
  
      resolve(true)
    });
  })
};

db.generateUserJson = async (count) => {
  let users = [];
  
  for (let i = 0; i < count; i++) {
    users = users.concat(generateData(i));
  }
  
  try {
    await db.createJson(users)
  } catch (e) {
    try {
      db.updateJson(users)
    } catch (err) {
      throw new Error(err)
    }
  }
};

db.getTemplate = (res, httpPath, filePath) => {
  fs.stat(filePath, function(err, stats) {
    if (err) {
      notFound(res);
    } else if (stats.isFile()) {
      const mimeTypes = {
        '.js'  : 'text/javascript',
        '.html': 'text/html',
        '.css' : 'text/css',
        '.jpg' : 'image/jpeg',
        '.gif' : 'image/gif',
        '.png' : 'image/png'
      };
      const mimeType = mimeTypes[path.extname(httpPath)];
      
      fs.readFile(filePath, 'utf8', function (err, data) {
        if(err) {
          notFound(res, 'Could not lind or open lile '+ pathname + ' for reading');
        } else {
          res.writeHead( 200, {'Content-Type': mimeType});
          res.end(data);
        }
      })
    }
  });
};

module.exports = db;
