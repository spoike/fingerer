function Writer(socketLike) {
    this.texts = [];
    this.socketLike = socketLike;
}
Writer.prototype.write = function(text, encoding) {
    this.texts.push([text, encoding]);
}
Writer.prototype.writeLine = function(text, encoding) {
    this.texts.push([text + "\r\n", encoding]);
}
Writer.prototype.flush = function() {
    for (var i = 0; i < this.texts.length; i++) {
        this.socketLike.write.apply(this.socketLike, this.texts[i]);
    }
    this.socketLike.end();
}

module.exports = Writer;
