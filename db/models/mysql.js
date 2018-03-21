const db = require('../sqlConnection.js');
const con = db.connection();

const restaurants = {
  findOneBasic: function(restaurant_id){
    return new Promise(function(resolve, reject){
      con.query(`SELECT restaurant_id, name FROM restaurants WHERE restaurant_id = ${restaurant_id};`, function(err, results) {
        if (err) {
          console.log(err); // Should send back 500
          reject(err);
        } else {
          console.log(results);
          resolve(results);
        }
      });
    });
  },

  findOneExtended: function(restaurant_id){
    return new Promise(function(resolve, reject){
      con.query(`SELECT * FROM restaurants WHERE restaurant_id = ${restaurant_id};`, function(err, results) {
        if (err) {
          console.log(err); // Should send back 500
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },

  findManyRestaurants: function(restaurantArr){
    var nearbyResults = [];
    var getNearbyPromises = [];
    restaurantArr.forEach( restToNearbyPair => {
      var nearbyId = restToNearbyPair.nearby_id;
      var nearbyPromise = restaurants.findOneExtendedWithPhotos(nearbyId);
      getNearbyPromises.push(nearbyPromise);
    })
    return Promise.all(getNearbyPromises).then(function(resultsArr){
      resultsArr.forEach(nearbyResult => {
        nearbyResults.push(nearbyResult[0]);
      })
      return nearbyResults;
    });
  },

  findOneExtendedWithPhotos: function(restaurant_id){
    let photoArr = [];
    var findPhotos = photos.find(restaurant_id);
    var findRestExtended = findPhotos.then(function(findPhotosResult) {
        for (var i = 0; i < findPhotosResult.length; i++){
          photoArr.push(findPhotosResult[i].photo_url);
        }
        return restaurants.findOneExtended(restaurant_id);
    });
    return Promise.all([findPhotos, findRestExtended]).then(function([findPhotosResult, findRestExtendedResult]) {
        findRestExtendedResult[0].photos = photoArr;
        return findRestExtendedResult;
    });
  }
}


const nearbys = {
  find: function(restaurant_id){
    return new Promise(function(resolve, reject){
      con.query(`SELECT * FROM nearbys WHERE restaurant_id = ${restaurant_id};`, function(err, results) {
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

const photos = {
  find: function(restaurant_id){
    return new Promise(function(resolve, reject){
      con.query(`SELECT photo_url FROM photos WHERE restaurant_id = ${restaurant_id};`, function(err, results) {
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

exports.findOneRestaurant = restaurants.findOneBasic;
exports.findManyRestaurants = restaurants.findManyRestaurants;
exports.findNearbys = nearbys.find;
exports.findPhotos = photos.find;
