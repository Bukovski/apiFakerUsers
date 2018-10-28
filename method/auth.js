const auth = {};




auth.post = function(data, callback) {
  console.log(data);
  
  const firstName = (typeof data.payload.firstName === 'string') && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  const lastName = (typeof data.payload.lastName === 'string') && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  const phone = (typeof data.payload.phone === 'string') && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
  const password = (typeof data.payload.password === 'string') && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  /*
  {
    "email": "somemail@mail.ru",
    "login": "Axel_McGlynn14",
    "firstName": "Charity",
    "avatar": "",
    "hashedPassword": "dlsfjdksjfdsf851sdfsf"
  }
  */
  
  
};















module.exports = auth;