var http = require('http');

module.exports = http.createServer(function(req, res){
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });
    res.end('Wahoo: ' + new Date());
});
setTimeout(function() {
    console.log('PID Crash: ' + process.pid);
    throw('Killing the PID');
}, (parseInt(process.pid) / 5));
