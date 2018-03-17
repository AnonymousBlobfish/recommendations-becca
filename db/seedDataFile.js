const fs = require('fs');
const faker = require('faker');
const bluebird = require('bluebird');
const ReadStream = require('./readStream.js');
const Json2Csv = require('json2csv-stream');
const transforms = require('./transformPhotos.js');

let fullUrls = [];
const dbSize = 100;
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

function createAllRestaurants(){
  const rs = new ReadStream(dbSize);
  const file = fs.createWriteStream('./db/data/output.json');
  rs.pipe(file);
  if (dbType === 'MySQL'){
    createSqlCsv();
  }
}

///////////////////////////////////////////////////////////////////////////////

function createSqlCsv(){
  const jsonRs = fs.createReadStream('./db/data/output.json');
  createRestCsv(jsonRs);
  createPhotosCsv(jsonRs);
  createNearbysCsv(jsonRs);
}

function createRestCsv(jsonRs){
  const jsonWs = fs.createWriteStream('./db/data/outputRests.csv');
  var parser = new Json2Csv({
    del: '\t',
    keys: ['place_id', 'name', 'google_rating', 'zagat_food_rating', 'review_count', 'short_description', 'neighborhood', 'price_level', 'type'],
    showHeader: false
  });
  jsonRs.pipe(parser).pipe(jsonWs);
}

function createPhotosCsv(jsonRs){
  const csvWs = fs.createWriteStream('./db/data/outputPhotos.csv');
  const parser = new Json2Csv({
    del: '\t',
    keys: ['place_id', 'photos'],
    showHeader: false
  });
  jsonRs.pipe(parser).pipe(transforms.parsePhotos).pipe(csvWs);
}

function createNearbysCsv(jsonRs){
  const csvWs = fs.createWriteStream('./db/data/outputNearbys.csv');
  const parser = new Json2Csv({
    del: '\t',
    keys: ['place_id', 'nearby'],
    showHeader: false
  });
  jsonRs.pipe(parser).pipe(transforms.parseNearbys).pipe(csvWs);
}

///////////////////////////////////////////////////////////////////////////////

initialize();

/* Becca: After the json file is created, run the following command from the db folder:
  mongoimport -d wegot -c restaurants --file data/output.json
*/

exports.dbSize = dbSize;
exports.dbType = dbType;
// exports.fullUrls set above in initialize after createUrlArray complete
