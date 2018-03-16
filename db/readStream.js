const Readable = require('stream').Readable;
const util = require('util');
const FakerModel = require('./models/faker-restaurant-model.js');

var ReadStream = function(dbSize) {
    Readable.call(this, { objectMode: true });
    this.data;
    this.id = 0;
    this.dbSize = dbSize;
};

util.inherits(ReadStream, Readable);

ReadStream.prototype._read = function() {
    if (this.id === this.dbSize) {
        return this.push(null);
    }
    // console.log("pushed: ", this.id + 1);
    var data = new FakerModel(this.id++);
    this.push(JSON.stringify(data));
};

module.exports = ReadStream;
