var net = require('net');
var debug = require('debug')('fingerer:debug');
var error = require('debug')('fingerer:error');
var QueryRouter = require('./QueryRouter');

function cleanData (data) {
    return data.replace('/W', '').replace('\r\n', '');
}

function Writer() {
    this.texts = [];
}
Writer.prototype.write = function(text, encoding) {
    this.texts.push([text, encoding]);
}
Writer.prototype.writeLine = function(text, encoding) {
    this.texts.push([text + "\r\n", encoding]);
}
Writer.prototype.flush = function(socketLike) {
    for (var i = 0; i < this.texts.length; i++) {
        socketLike.write.apply(socketLike, this.texts[i]);
    }
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
                    var writer = new Writer();
                    qr.process(cleaned, writer);
                    writer.flush(socket);
                    socket.end();
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
