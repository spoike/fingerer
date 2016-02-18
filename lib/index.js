var net = require('net');
var debug = require('debug')('fingerer:debug');
var error = require('debug')('fingerer:error');

function cleanData (data) {
    return data.replace('/W', '').replace('\r\n', '');
}

function Writer() {
    this.texts = [];
}
Writer.prototype.write = function() {
    this.texts.push(arguments);
}
Writer.prototype.flush = function(socketLike) {
    for (var i = 0; i < this.texts.length; i++) {
        socketLike.write.apply(socketLike, this.texts[i]);
    }
}

module.exports = function createFingerServer() {
    var handlers = {
        index: [],
        paths: []
    };

    return {
        index: function(handler) {
            handlers.index.push(handler);
        },
        path: function(regex, handler) {
            handlers.paths.push({
                regex: regex,
                handler: handler
            });
        },
        listen: function(cb, options) {
            options = Object.assign({
                port: 79,
                address: "127.0.0.1"
            }, options)
            debug("Creating server");
            var server = net.createServer(function(socket) {
                socket.setEncoding("ascii");

                socket.on("data", function(data) {
                    var cleaned = cleanData(data);
                    debug("Received data: " + cleaned);
                    var writer = new Writer();
                    if (data === '\r\n') {
                        debug("Using index route");
                        for (var i = 0; i < handlers.index.length; i++) {
                            handlers.index[i](writer);
                        }
                    } else {
                        for (var i = 0; i < handlers.paths.length; i++) {
                            var h = handlers.paths[i],
                            matches = cleaned.match(h.regex);
                            if (matches) {
                                debug("Route matches " + h.regex, matches);
                                h.handler(writer, matches);
                            }
                        }
                    }
                    writer.flush(socket);
                    socket.end();
                });

                socket.on("end", function() {
                    debug("Ending connection");
                    socket.end();
                });
            }).listen(options.port, options.address);

            server.on("listening", function() {
                cb(options);
            });
        }
    };
};
