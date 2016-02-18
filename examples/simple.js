var fingerer = require('../lib')();

fingerer.index(function(output) {
    output.write("I'm on the index!");
});

fingerer.use(/^([a-z \.]+)$/gi, function(output, matches) {
    output.write("I'm on path " + matches[0] + "!");
});

fingerer.listen(function(server) {
    console.log("Finger server listening on " + server.port);
});
