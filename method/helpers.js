const crypto = require('crypto');

// Container for all the helpers
const helpers = {};
const config = {
  'hashingSecret' : 'thisIsASecret' //соль для пароля
};


// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = function(str) {
  try{
    return JSON.parse(str);
  } catch(e){
    return {};
  }
};

// Create a SHA256 hash
helpers.hash = function(str) {
  if (typeof(str) === 'string' && str.length > 0) {
    return crypto.createHmac('sha256', config.hashingSecret)
      .update(str).digest('hex');
  } else {
    return false;
  }
};


module.exports = helpers;
