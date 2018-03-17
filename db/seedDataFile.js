const fs = require('fs');
const faker = require('faker');
const bluebird = require('bluebird');
const ReadStream = require('./readStream.js');

let fullUrls = [];
const dbSize = 10;
const dbType = 'MySQL' || 'Mongo';

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
  const rs = new ReadStream(dbSize);
  const file = fs.createWriteStream('./db/data/output.csv');
  if (dbType === 'Mongo'){
    file = fs.createWriteStream('./db/data/output.json');
  }
  rs.pipe(file);
}

function createUrlArray() {
  return new Promise(function(resolve, reject){
    fs.readFile('./db/data/fullUrls.txt', 'utf8', function(err, data) {
      if(err){
        reject(err);
      } else {
        resolve(data.split(', '));
      }
    });
  })
}

initialize();

/* Becca: After the json file is created, run the following command from the db folder:
  mongoimport -d wegot -c restaurants --file data/output.json
*/

exports.dbSize = dbSize;
exports.dbType = dbType;
// exports.fullUrls set above in initialize after createUrlArray complete
