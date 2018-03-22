const fs = require('fs');
const faker = require('faker');
const bluebird = require('bluebird');
const ReadStream = require('./readStream.js');
const Json2Csv = require('json2csv-stream');
const transforms = require('./transformPhotos.js');
fs.readFile = bluebird.promisify(fs.readFile);

let fullUrls = [];
const dbSize = 10000000;
const dbType = 'MySQL' || 'Mongo';

function initialize() {
  faker.seed(123);
  fs.readFile('./db/data/fullUrls.txt', 'utf8')
    .then(function(data){
      data = data.split(', ');
      exports.fullUrls = data;
      createAllRestaurants();
    }).catch(function(err){
      console.log(err);
    });
}

function createAllRestaurants(){
  const rs = new ReadStream(dbSize);
  const file = fs.createWriteStream('./db/data/output.json');
  rs.pipe(file);
  // Comment out above and comment in below and rerun when output.json is completely done
  // if (dbType === 'MySQL'){
  //   createSqlCsv();
  // }
}

///////////////////////////////////////////////////////////////////////////////

function createSqlCsv(){
  const jsonRs = fs.createReadStream('./db/data/output.json');
  createRestCsv(jsonRs);
  // createPhotosCsv(jsonRs);
  createNearbysCsv(jsonRs);
}

/* Once these CSV files are created, you can load them into mySql with a command like this:
      load data local infile '<filepath>/db/data/outputNearbys.csv' into table wegot.nearbys fields terminated by '\t' lines terminated by '\n';
*/

function createRestCsv(jsonRs){
  const csvWs = fs.createWriteStream('./db/data/outputRests.csv');
  var parser = new Json2Csv({
    del: '\t',
    keys: ['restaurant_id', 'name', 'google_rating', 'zagat_food_rating', 'review_count', 'short_description', 'neighborhood', 'price_level', 'type', 'photos'],
    showHeader: false
  });
  jsonRs.pipe(parser).pipe(csvWs);
}

// function createPhotosCsv(jsonRs){
//   const csvWs = fs.createWriteStream('./db/data/outputPhotos.csv');
//   const parser = new Json2Csv({
//     del: '\t',
//     keys: ['restaurant_id', 'photos'],
//     showHeader: false
//   });
//   jsonRs.pipe(parser).pipe(transforms.parsePhotos).pipe(csvWs);
// }

function createNearbysCsv(jsonRs){
  const csvWs = fs.createWriteStream('./db/data/outputNearbys.csv');
  const parser = new Json2Csv({
    del: '\t',
    keys: ['restaurant_id', 'nearby'],
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
