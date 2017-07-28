/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var data = {results: []};

var ids = 1;

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var requestHandler = function(request, response) {
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  var urlObj = require('url').parse(request.url, true);

  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';

  if (request.method === 'GET') {
    var statusCode = 200;
    if (urlObj.pathname !== '/classes/messages' && urlObj.pathname !=='/classes/room') {
      statusCode = 404;
    }
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(data));
  } else if (request.method === 'POST'){
    var rawData = [];
    if (urlObj.pathname === '/classes/messages' || urlObj.pathname === '/classes/room') {
      request.on('data', (chunk) => {
        rawData.push(chunk);
      });
      request.on('end', ()=>{
        rawData = Buffer.concat(rawData).toString();
        console.log('data type:'+ typeof rawData);
        console.log('rawData:' , rawData);

        a = rawData.split('&')
        var username = a[0].substring(9);
        var text = a[1].substring(5).replace(/[+]/g,' ');
        var roomname = a[2].substring(9);
        data.results.push({username: username, text: text, roomname: roomname, objectId: ids});

        ids++;
      });
      request.on('error', (err) => {
        console.log(error(err));
      })
      response.writeHead(201, headers);
      response.write(JSON.stringify(data));
      response.end();
    }
  } else if (request.method === 'OPTIONS'){
    response.writeHead(200, headers);
    response.end(JSON.stringify(data));
  }

};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.

module.exports.requestHandler = requestHandler;
module.exports.data = data;
