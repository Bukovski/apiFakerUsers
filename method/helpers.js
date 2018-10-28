const crypto = require('crypto');

// Container for all the helpers
const helpers = {};
const config = {
  'hashingSecret' : 'thisIsASecret' //соль для пароля
};


// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = (str) => {
  try{
    return JSON.parse(str);
  } catch(e){
    return {};
  }
};

// Create a SHA256 hash
helpers.hash = (str) => {
  if (typeof(str) === 'string' && str.length > 0) {
    return crypto.createHmac('sha256', config.hashingSecret)
      .update(str).digest('hex');
  } else {
    return false;
  }
};

helpers.createRandomString = (strLength) => {
  strLength = (typeof strLength === 'number') && strLength > 0 ? strLength : false;
  
  if (strLength) {
    const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const possibleLength = possibleCharacters.length;
    
    let str = '';
    
    for (let i = 0; i < strLength; i++) {
      str += possibleCharacters[(Math.floor(Math.random() * possibleLength))];
    }
    
    return str;
  } else {
    return false;
  }
};



module.exports = helpers;
