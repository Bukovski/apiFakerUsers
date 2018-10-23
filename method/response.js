function isString(field) {
  return (typeof field === 'string') && field.trim().length && isNaN(field);
}

function notFound(res, text) {
  res.writeHead(404, { "Content-Type": "text/json" });
  
  const textMessage = (text) ? text : "404 Data Not Found";
  res.end(JSON.stringify({ 'Error': textMessage }));
}

function success(res, text, isJson = false) {
  res.writeHead(200, { "Content-Type": "text/json" });
  
  if (isJson) {
    res.end(JSON.stringify(text));
  } else {
    res.end(JSON.stringify({ 'Success': text }));
  }
}


module.exports = {
  isString,
  notFound,
  success
};
