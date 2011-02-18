if (process.getuid() != 0) {
  console.log('Must run as root to bind on port 80!');
  console.log('We will automatically revert to a lesser powerful being');
  console.log('You can change this in the configuration files');
  process.exit(1);
}

var docroot = '/'

if (process.argv.length < 3) {
  throw 'Usage: sudo node main.js <serverroot>';
  process.exit(0);
}
else {
  docroot = process.argv[2];
}

// We prepare some modules we'll need
var sys = require("sys"), 
    http = require("http"),  
    url = require("url"), 
    path = require("path"),  
    fs = require("fs"),
    log = require('util').log;

http.createServer(function serverHandler(request, response) {  
    // Parse the url so we can use it
    var uri = url.parse(request.url).pathname;
    
    log('Request for ' + uri);
 
    var realpath;
    
    try {
      realpath = fs.realpathSync(docroot + uri);
    } catch (e) {
      response.writeHead(404);
      response.end('404 - Not Found');
    }
    
    // Serve files if they're in the docroot
    if ((new RegExp('^' + docroot)).exec(realpath))
    {
      fs.readFile(realpath, 'binary', function(err, file) {
        if (err) {
          log(err);
          response.writeHead(404);
          response.end('404 - Not Found');
          return;
        }
        
        response.writeHead(200);
        response.write(file,'binary');
        response.end();
      });
    }
    else {
        response.writeHead(404);
        response.end('404 - Not Found');
    }
  
}).listen(80); // Wait so what did you write there? .168? :')
log("Server running at http://localhost:80/"); 

process.setuid('nobody');
log('Now running as nobody');