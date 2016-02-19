var net = require('net');
var debug = require('debug')('fingerer:debug');
var error = require('debug')('fingerer:error');
var QueryRouter = require('./QueryRouter');
var Writer = require('./Writer');

function cleanData (data) {
    return data.replace('/W', '').replace('\r\n', '');
}

function createFingerServer() {
    var qr = new QueryRouter();

    return {
        index: function(handler) {
            qr.use(/^$/gi, handler);
        },
        use: function() {
            qr.use.apply(qr, arguments);
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
                    var writer = new Writer(socket);
                    var isAsync = qr.process(cleaned, writer);
                    if (!isAsync) {
                        writer.flush();
                    }
                });

                socket.on("end", function() {
                    debug("Ended connection");
                    socket.end();
                });
            }).listen(options.port, options.address);

            server.on("listening", function() {
                cb(options);
            });
        }
    };
};

Object.assign(createFingerServer, require('./middlewares'));

module.exports = createFingerServer;
