// const Sequelize = require('sequelize');
const csvParser = require('csv-parser');
const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');
//
// const sequelize = new Sequelize('wegot', 'root', 'test123', {
//   dialect: 'mysql',
//   pool: {
//     max: 10,
//     min: 0,
//     idle: 20000,
//     acquire: 20000
//   }
// });
//
// sequelize.authenticate().then(function (err) {
//  if (err) {
//     console.log('There is connection in ERROR');
//  } else {
//     console.log('Connection has been established successfully');
//  }
// });
//
// const restaurants = sequelize.define('restaurants', {
//   restaurant_id: {
//     type: Sequelize.INTEGER,
//     primaryKey: true
//   },
//   name: Sequelize.STRING,
//   google_rating: Sequelize.FLOAT(2,1),
//   zagat_food_rating: Sequelize.FLOAT(2,1),
//   review_count: Sequelize.INTEGER,
//   short_description: Sequelize.STRING,
//   neighborhood: Sequelize.STRING,
//   price_level: Sequelize.INTEGER,
//   type: Sequelize.STRING
// });
//
// const photos = sequelize.define('photos', {
//   photo_id: {
//     type: Sequelize.INTEGER,
//     primaryKey: true
//   },
//   photo_url: Sequelize.STRING,
//   restaurant_id: Sequelize.INTEGER
// });
//
// const nearbys = sequelize.define('nearbys', {
//   restaurant_id: Sequelize.INTEGER,
//   nearby_id: Sequelize.INTEGER
// });
//
// //////////////////////////////////////
//
// function insertRestaurantData(data){
//   const restObj = {};
//   restObj.restaurant_id = data.place_id;
//   restObj.name = data.name;
//   restObj.google_rating = data.google_rating;
//   restObj.zagat_food_rating = data.zagat_food_rating;
//   restObj.review_count = data.review_count;
//   restObj.short_description = data.short_description;
//   restObj.neighborhood = data.neighborhood;
//   restObj.price_level = data.price_level;
//   restObj.type = data.types;
//   restaurants.sync({force: true})
//     .then(function(err) {
//       restaurants.create(restObj)
//         .then(restaurant => {
//           console.log('inserted restaurant');
//         });
//     });
// }
//
// function insertPhotosData(photosArr, restaurantId){
//   let photosObj = {};
//   photosObj.restaurant_id = restaurantId;
//   photos.sync({force: true})
//     .then(function(err) {
//       for(var i = 0; i < photosArr.length; i++){
//         photosArr[i] = photosArr[i].replace('"','').replace('[','').replace(']','').replace('"','');
//         photosObj.photo_id = photoId++;
//         photosObj.photo_url = photosArr[i];
//         photos.create(photosObj)
//           .then(photo => {
//             console.log('inserted photo');
//           });
//       }
//     });
// }
//
// function insertNearbyData(nearbysArr, restaurantId){
//   nearbysArr = nearbysArr.replace('[','').replace(']','').split(',');
//   let nearbyObj = {};
//   nearbyObj.restaurant_id = restaurantId;
//   nearbys.sync({force: true})
//     .then(function(err) {
//       for(var i = 0; i < nearbysArr.length; i++){
//         nearbyObj.nearby_id = nearbysArr[i];
//         nearbys.create(nearbyObj)
//           .then(nearby => {
//             console.log('inserted nearby');
//           });
//       }
//     });
// }
//
//////////////////////////////////////

// function writeRestaurantCSV(data){
//   // const restObj = {};
//   // restObj.restaurant_id = data.place_id;
//   // restObj.name = data.name;
//   // restObj.google_rating = data.google_rating;
//   // restObj.zagat_food_rating = data.zagat_food_rating;
//   // restObj.review_count = data.review_count;
//   // restObj.short_description = data.short_description;
//   // restObj.neighborhood = data.neighborhood;
//   // restObj.price_level = data.price_level;
//   // restObj.type = data.types;
//   // return restObj;
//   readStream.push(data.place_id + '\t');
//   readStream.push(data.name + '\t');
//   readStream.push(data.google_rating + '\t');
// }


//////////////////////////////////////

const csvFile = path.join(__dirname, './data/output.csv');
// let photoId = 0;

const writeFile = fs.createWriteStream(path.join(__dirname, './data/outputRests.csv'));
// restObj.pipe(writeFile);

// let readStream = new Readable();

fs.createReadStream(csvFile)
  .pipe(csvParser({separator: '\t', newline: '\n'}))
  // .pipe(writeFile);
  .on('data', function(data){
    console.log(data);
    // let restaurantId = data.place_id;
    // let photosArr = data.photos.split('\t')[0].split(',');
    // let nearbysArr = data.photos.split('\t')[1];
    // writeRestaurantCSV(data);
    // writePhotosCSV(photosArr, restaurantId);
    // writeNearbyCSV(nearbysArr, restaurantId);
    // insertRestaurantData(data);
    // insertPhotosData(photosArr, restaurantId);
    // insertNearbyData(nearbysArr, restaurantId);
  });

// readStream.pipe(writeFile);
