var mongoose = require('mongoose');

var restaurantSchema = mongoose.Schema({
  name: String,
  place_id: { type: Number, unique: true },
  google_rating: Number,
  zagat_food_rating: Number,
  review_count: Number,
  photos: [String],
  short_description: String,
  neighborhood: String,
  location: { lat: Number, long: Number },
  address: String,
  website: String,
  price_level: Number,
  types: [String],
  nearby: [String]
});

var nearbySchema = mongoose.Schema({
  name: String,
  place_id: { type: Number, unique: true },
  nearby: [String]
});

var RestaurantModel = mongoose.model('Restaurant', restaurantSchema);
var NearbyModel = mongoose.model('Nearby', nearbySchema);

function initialize(place_id){
  return new Promise(function(resolve, reject){
    var result = [];
    findNearbyIds(place_id, function(err, nearbyIdResults){
      if(err){
        reject(err);
      } else {
        result.push(nearbyIdResults[0]);
        findMany(nearbyIdResults[0].nearby, function(err, nearbyData){
          if(err){
            reject(err);
          } else {
            result.push(nearbyData);
            resolve(result);
          }
        });
      }
    });
  });
}

function findNearbyIds(place_id, callback){
  NearbyModel.find({place_id: place_id}, callback);
}

// retrieve many restaurants
function findMany(ids, callback) {
  RestaurantModel.find({place_id: {$in: ids}}, callback);
}

exports.RestaurantModel = RestaurantModel;
exports.initialize = initialize;
