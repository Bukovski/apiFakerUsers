function isString(field) {
  return (typeof field === 'string') && field.trim().length && isNaN(field);
}

function notFound(res, text) {
  res.writeHead(404, { "Content-Type": "text/plain" });
  
  const textMessage = (text) ? text : "404 Data Not Found";
  res.end(`Error: ${ textMessage }`);
}

function success(res, text, isJson = false) {
  if (isJson) {
    res.writeHead(200, { "Content-Type": "text/json" });
    res.end(JSON.stringify(text));
  } else {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end(`Success: ${ text }`);
  }
}


module.exports = {
  isString,
  notFound,
  success
};
