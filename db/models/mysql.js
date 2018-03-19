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
          resolve(results);
        }
      });
    });
  },

  findOneExtendedWithPhotos: function(restaurant_id){
    return new Promise(function(resolve, reject){
      con.query(`SELECT * FROM restaurants WHERE restaurant_id = ${restaurant_id};`, function(err, result) {
        if (err) {
          console.log(err); // Should send back 500
          reject(err);
        } else {
          console.log('result of search for nearby restaurant info is ', result);
          // let nearbyRestIdresult[0].restaurant_id;
          console.log('restaurant Id is ', result[0].restaurant_id);
          photos.find(result[0].restaurant_id)
            .then(photoUrls => {
              let photoArr = [];
              for (var i = 0; i < photoUrls.length; i++){
                photoArr.push(photoUrls[i].photo_url);
              }
              result.photos = photoArr;
              resolve(result);
              // if(i === (nearbyRests.length - 1)){
              //   console.log('resolved');
              //   resolve(nearbyRests);
              // }
              // console.log('nearbyRest length is... ', nearbyRests.length);
            }).catch(err => {
              reject(err);
            })
          // resolve(results);
        }
      });
    });
  },

  findManyRestaurants: function(restaurantArr){
    return new Promise(function(resolve, reject){
      // let restIdsString = '(';
      // for (var i = 0; i < restaurantArr.length; i++){
      //   restIdsString += '"' + restaurantArr[i].nearby_id + '"';
      //   if(i !== restaurantArr.length - 1){
      //     restIdsString += ', ';
      //   }
      // }
      // restIdsString += ')';
      // console.log('restIdsString is ', restIdsString);
      console.log(restaurantArr[0].nearby_id);

      var nearbyResults = [];

      restaurants.findOneExtendedWithPhotos(50)
        .then(result1 => {
          console.log('result after first call is ', result1);
          nearbyResults.push(result1);
          restaurants.findOneExtendedWithPhotos(40)
            .then(result2 => {
              nearbyResults.push(result2);
            });
        }).then(() => {
          restaurants.findOneExtendedWithPhotos(30)
            .then(result3 => {
              nearbyResults.push(result3);
            });
        }).then(() => {
          restaurants.findOneExtendedWithPhotos(20)
            .then(result4 => {
              nearbyResults.push(result4);
            });
        }).then(() => {
          restaurants.findOneExtendedWithPhotos(10)
            .then(result5 => {
              nearbyResults.push(result5);
            });
        }).then(() => {
          restaurants.findOneExtendedWithPhotos(60)
            .then(result6 => {
              nearbyResults.push(result6);
              resolve(nearbyResults)
            });
        }).catch(err => {
          console.log(err);
        })
      // con.query(`SELECT * FROM restaurants WHERE restaurant_id IN ${restIdsString};`, function(err, nearbyRests) {
      //   if (err) {
      //     console.log(err); // Should send back 500
      //     reject(err);
      //   } else {
      //     console.log(nearbyRests);
      //     for (var i = 0; i < nearbyRests.length; i++){
      //       photos.find(nearbyRests[i].restaurant_id)
      //         .then(photoUrls => {
      //           let photoArr = [];
      //           for (var i = 0; i < photoUrls.length; i++){
      //             photoArr.push(photoUrls[i].photo_url);
      //           }
      //           nearbyRests[i].photos = photoArr;
      //           if(i === (nearbyRests.length - 1)){
      //             console.log('resolved');
      //             resolve(nearbyRests);
      //           }
      //           console.log('nearbyRest length is... ', nearbyRests.length);
      //         }).catch(err => {
      //           reject(err);
      //         })
      //     }
      //     // console.log('resolve');
      //     // resolve(nearbyRests);
      //   }
      // });
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
