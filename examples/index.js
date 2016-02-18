var fingerer = require('./lib')();

fingerer.index(function(output) {
    output.write("I'm on the index!");
});

fingerer.path(/^([a-z \.]+)$/gi, function(output, matches) {
    console.log(arguments);
    output.write("I'm on path " + matches[0] + "!");
});

fingerer.listen(function(server) {
    console.log("Finger server listening on " + server.port);
});
