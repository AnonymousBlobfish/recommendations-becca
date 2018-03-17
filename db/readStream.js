const Readable = require('stream').Readable;
const util = require('util');
const FakerModel = require('./models/faker-restaurant-model.js');
const seedDataFile = require('./seedDataFile');

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
    var data = new FakerModel(this.id++);

    if(seedDataFile.dbType === 'MySQL'){ // Creating csv file for MySQL
      if(this.id === 1){ // Create header
        for(var key in data){
          this.push(JSON.stringify(key) + '\t');
          if(key === 'nearby'){
            this.push('\n');
            break;
          }
        }
      }
      for(var key in data){
        if(typeof data[key] !== 'function'){
          this.push(JSON.stringify(data[key]) + '\t');
        }
      }
      this.push('\n');

    } else if (seedDataFile.dbType === 'Mongo'){ // Creating json file for Mongo
      this.push(JSON.stringify(data));
    }
};

module.exports = ReadStream;
