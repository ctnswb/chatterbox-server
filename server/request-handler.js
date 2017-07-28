var data = {results: []};

var ids = 1;

var headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type':'application/json'
};

var requestHandler = function(request, response) {
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  var urlObj = require('url').parse(request.url, true);

  if (request.method === 'GET') {
    var statusCode = 200;
    if (urlObj.pathname !== '/classes/messages' && urlObj.pathname !=='/classes/room') {
      statusCode = 404;
    }
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(data));
  } else if (request.method === 'POST'){
    var rawData = "";
    if (urlObj.pathname === '/classes/messages' || urlObj.pathname === '/classes/room') {
      request.on('data', (chunk) => {
        rawData+=chunk;
      });
      request.on('end', ()=>{
        var message = JSON.parse(rawData);
        message.objectId = ids;
        ids++;
        data.results.push(message);
        response.writeHead(201, headers);
        response.end();
      });
      request.on('error', (err) => {
        console.log(error(err));
      })
    }
  } else if (request.method === 'OPTIONS'){
    response.writeHead(200, headers);
    response.end(JSON.stringify(data));
  }

};


module.exports.requestHandler = requestHandler;
module.exports.data = data;
