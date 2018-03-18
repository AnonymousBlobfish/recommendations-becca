const db = require('../sqlConnection.js');
const con = db.connection();

const restaurants = {
  findOne: function(restaurant_id){
    return new Promise(function(resolve, reject){
      con.query(`SELECT restaurant_id, name FROM restaurants WHERE restaurant_id = ${restaurant_id};`, function(err, results) {
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
    return new Promise(function(resolve, reject){
      let restIdsString = '(';
      for (var i = 0; i < restaurantArr.length; i++){
        restIdsString += '"' + restaurantArr[i].nearby_id + '"';
        if(i !== restaurantArr.length - 1){
          restIdsString += ', ';
        }
      }
      restIdsString += ')';
      con.query(`SELECT * FROM restaurants WHERE restaurant_id IN ${restIdsString};`, function(err, nearbyRests) {
        if (err) {
          console.log(err); // Should send back 500 somehow;
          reject(err);
        } else {
          for (var i = 0; i < nearbyRests.length; i++){
            photos.find(nearbyRests[i].restaurant_id)
              .then(photoUrls => {
                let photoArr = [];
                for (var i = 0; i < photoUrls.length; i++){
                  photoArr.push(photoUrls[i].photo_url);
                }
                nearbyRests[i].photos = photoArr;
                if(i === (nearbyRests.length - 1)){
                  console.log('resolved');
                  resolve(nearbyRests);
                }
                console.log('nearbyRest length is... ', nearbyRests.length);
              }).catch(err => {
                reject(err);
              })
          }
          // console.log('resolve');
          // resolve(nearbyRests);
        }
      });
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

exports.findOneRestaurant = restaurants.findOne;
exports.findManyRestaurants = restaurants.findManyRestaurants;
exports.findNearbys = nearbys.find;
exports.findPhotos = photos.find;
