const db = require('./db');
const helpers = require('./helpers');
const { notFound, success } = require('./response');

const auth = {};


auth.postAuth = async (res, data) => {
  /*{ login: 'Axel_McGlynn14',
    firstName: 'Alessa',
    lastName: 'Gelespi',
    email: 'somemail@mail.ru',
    password: 'dlsfjdksjfdsf851sdfsf' }*/
  const login = (typeof data.login === 'string') && data.login.trim().length > 0 ? data.login.trim() : false;
  const firstName = (typeof data.firstName === 'string') && data.firstName.trim().length > 0 ? data.firstName.trim() : false;
  const lastName = (typeof data.lastName === 'string') && data.lastName.trim().length > 0 ? data.lastName.trim() : false;
  const email = (typeof data.email === 'string') && data.email.trim().length > 8 ? data.email.trim() : false;
  const password = (typeof data.password === 'string') && data.password.trim().length > 0 ? data.password.trim() : false;
  
  if (login && firstName && lastName && email && password) { //все данные пришли без ошибок
    try {
      await db.readJson('auth/' + email);
  
      notFound(res, `Such ${ email } user already exists`);
    } catch (e) {
      const hashedPassword = helpers.hash(password); //кодируем пароль
  
      if (hashedPassword) { //пароль зашифрован
        const userObject = { //шаблон который закинем в файл
          'login': login,
          'firstName': firstName,
          'lastName': lastName,
          'email': email,
          'password': hashedPassword
        };
  
        try {
          await db.createJson(userObject, 'auth/' + email); //создаем новый файл с данными
          
          success(res, `User was create`, false);
        } catch (e) {
          notFound(res, "Could not create the new user");
        }
      }
    }
  } else {
    notFound(res, "Missing required fields");
  }
};


auth.getAuth = async (res, query) => {
  const email = (typeof query.email === 'string') && query.email.trim().length > 8 ? query.email.trim() : false;
  const password = (typeof query.password === 'string') && query.password.trim().length > 0 ? query.password.trim() : false;
  
  if (!email || !password) return notFound(res, "Missing required field");
  
  try {
    const getUserData = await db.readJson('auth/' + email);
    
    if (getUserData.password !== helpers.hash(password)) {
      notFound(res, "Wrong password");
    }
  
    delete getUserData.password;
    
    success(res, getUserData);
  } catch (e) {
    notFound(res, "User not found");
  }
};














module.exports = auth;