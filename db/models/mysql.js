const db = require('../sqlConnection.js');
const pool = db.pool();

const initialize = {
  init: function(restaurant_id){
    return new Promise(function(resolve, reject){
      pool.getConnection(function(err, conn){
        if(err){
          conn.release();
          console.log(err); // Send back 500?
          reject(err);
        }
        if(conn){
          const getName = restaurants.findOneBasic(restaurant_id, conn);
          const getNearbyIds = nearbys.find(restaurant_id, conn);
          const getNearbyData = getNearbyIds.then(function(nearbyIdResults) {
              return restaurants.findManyRestaurants(nearbyIdResults, conn);
          });
          return Promise.all([getName, getNearbyIds, getNearbyData]).then(function([nameResult, nearbyArr, nearbyData]){
            const results = [];
            results.push(nameResult);
            results.push(nearbyData);
            conn.release();
            resolve(results);
          });
        }
      });
    });
  }
}

const restaurants = {
  findOneBasic: function(restaurant_id, conn){
    return new Promise(function(resolve, reject){
      conn.query(`SELECT name FROM restaurants WHERE restaurant_id = ${restaurant_id};`, function(err, results) {
        if (err) {
          console.log(err); // Should send back 500
          reject(err);
        } else {
          resolve(results[0]);
        }
      });
    });
  },

  findOneExtended: function(restaurant_id, conn){
    return new Promise(function(resolve, reject){
      conn.query(`SELECT * FROM restaurants2 WHERE restaurant_id = ${restaurant_id};`, function(err, results) {
        if (err) {
          console.log(err); // Should send back 500
          reject(err);
        } else {
          // console.log(results);
          // console.log('photos string is ', results[0].photos);
          // console.log('split ', results[0].photos.split(','));
          results[0].photos = results[0].photos.split(',');
          // console.log('modified ', results[0]);
          resolve(results[0]);
        }
      });
    });
  },

  findManyRestaurants: function(restaurantArr, conn){
    var nearbyResults = [];
    var getNearbyPromises = [];
    restaurantArr.forEach( restToNearbyPair => {
      var nearbyId = restToNearbyPair.nearby_id;
      // var nearbyPromise = restaurants.findOneExtendedWithPhotos(nearbyId, conn);
      // var nearbyId = 1;
      var nearbyPromise = restaurants.findOneExtended(nearbyId, conn);
      getNearbyPromises.push(nearbyPromise);
    })
    return Promise.all(getNearbyPromises).then(function(resultsArr){
      resultsArr.forEach(nearbyResult => {
        nearbyResults.push(nearbyResult);
      })
      return nearbyResults;
    });
  },
}

//   findOneExtendedWithPhotos: function(restaurant_id, conn){
//     let photoArr = [];
//     var findPhotos = photos.find(restaurant_id, conn);
//     var findRestExtended = findPhotos.then(function(findPhotosResult) {
//         for (var i = 0; i < findPhotosResult.length; i++){
//           photoArr.push(findPhotosResult[i].photo_url);
//         }
//         return restaurants.findOneExtended(restaurant_id, conn);
//     });
//     return Promise.all([findPhotos, findRestExtended]).then(function([findPhotosResult, findRestExtendedResult]) {
//         findRestExtendedResult[0].photos = photoArr;
//         return findRestExtendedResult;
//     });
//   }
// }


const nearbys = {
  find: function(restaurant_id, conn){
    return new Promise(function(resolve, reject){
      conn.query(`SELECT * FROM nearbys WHERE restaurant_id = ${restaurant_id};`, function(err, results) {
        if (err) {
          console.log(err); // Should send back 500 somehow;
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }
}

// const photos = {
//   find: function(restaurant_id, conn){
//     return new Promise(function(resolve, reject){
//       conn.query(`SELECT photo_url FROM photos WHERE restaurant_id = ${restaurant_id};`, function(err, results) {
//         if (err) {
//           console.log(err); // Should send back 500 somehow;
//           reject(err);
//         } else {
//           resolve(results);
//         }
//       });
//     });
//   }
// }

exports.findOneRestaurant = restaurants.findOneBasic;
exports.findManyRestaurants = restaurants.findManyRestaurants;
exports.findNearbys = nearbys.find;
// exports.findPhotos = photos.find;
exports.retrieveRestAndNearbys = initialize.init;
