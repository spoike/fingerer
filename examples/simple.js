var fingerer = require('../lib')();

fingerer.index(function(req) {
    req.write("I'm on the index!");
});

fingerer.use(/^([a-z \.]+)$/gi, function(req) {
    req.write("I'm on path " + req.query + "!");
});

fingerer.listen(function(server) {
    console.log("Finger server listening on " + server.port);
});
