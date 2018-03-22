const db = require('../sqlConnection.js');
const pool = db.pool();

const initialize = {
  init: function(restaurant_id){
    return new Promise(function(resolve, reject){
      pool.getConnection(function(err, conn){
        if(err){
          conn.release();
          reject(err);
        }
        if(conn){
          const getName = restaurants.findOneBasic(restaurant_id, conn);
          const getNearbyData = getName.then(function(nameResults) {
            var nearbyIdStrs = nameResults.nearby.split(',');
            return restaurants.findManyRestaurants(nearbyIdStrs, conn);
          });
          return Promise.all([getName, getNearbyData]).then(function([nameResult, nearbyData]){
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
      conn.query(`SELECT name, nearby FROM restaurants WHERE restaurant_id = ${restaurant_id};`, function(err, results) {
        if (err) {
          reject(err);
        } else {
          resolve(results[0]);
        }
      });
    });
  },

  findOneExtended: function(restaurant_id, conn){
    return new Promise(function(resolve, reject){
      conn.query(`SELECT * FROM restaurants WHERE restaurant_id = ${restaurant_id};`, function(err, results) {
        if (err) {
          reject(err);
        } else {
          if(!results.length){
            reject(err);
            return;
          }
          results[0].photos = results[0].photos.split(',');
          resolve(results[0]);
        }
      });
    });
  },

  findManyRestaurants: function(restaurantArr, conn){
    var nearbyResults = [];
    var getNearbyPromises = [];
    restaurantArr.forEach( nearbyId => {
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

exports.retrieveRestAndNearbys = initialize.init;
