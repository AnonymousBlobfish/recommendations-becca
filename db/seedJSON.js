const fs = require('fs');
const faker = require('faker');
const bluebird = require('bluebird');
const fakerModel = require('./models/faker-restaurant-model.js');

const Readable = require('stream').Readable;
const util = require('util');

let fullUrls = [];
let id = 1;
// const dbSize = 10000000;
const dbSize = 80;

function initialize() {
  faker.seed(123);
  createUrlArray()
    .then(function(data){
      fullUrls = data;
      exports.fullUrls = fullUrls;
      createAllRestaurants();
    }).catch(function(err){
      console.log(err);
    });
}

function createAllRestaurants(){
  var ReadStream = function() {
      Readable.call(this, {
          objectMode: true
      });
      this.data;
      this.id = 0;
  };
  util.inherits(ReadStream, Readable);
  ReadStream.prototype._read = function() {
      if (this.id === 80) {
          return this.push(null);
      }
      var data = new fakerModel(this.id);
      console.log('read             : ' + JSON.stringify(data));
      this.push(JSON.stringify(data));
  };
  var rs = new ReadStream();
  const file = fs.createWriteStream('./data/output.json');
  rs.pipe(file);
  // for(id; id <= dbSize; id++){
  //   console.log(new fakerModel(id));
  //
  //
  //   // readableSrc.pipe(writableDest)
  //   // fs.createReadStream(file)
  //     // .pipe(fs.createWriteStream('./data/output.json'))
  //     // .on('finish', function(){ console.log('Done'); });
  // }
}

// var data = require('./test_data.json'),
// var Readable = require('stream').Readable;
// var util = require('util')


function createUrlArray() {
  return new Promise(function(resolve, reject){
    fs.readFile('./data/fullUrls.txt', 'utf8', function(err, data) {
      if(err){
        reject(err);
      } else {
        resolve(data.split(', '));
      }
    });
  })
}

initialize();

exports.dbSize = dbSize;
