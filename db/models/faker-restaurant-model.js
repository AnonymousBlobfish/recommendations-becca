const faker = require('faker');
const fs = require('fs');
const seedJSON = require('./../seedDataFile.js');
let imageIdx = 0;

var Restaurant = function(id){
  this.restaurant_id = id;
  this.name = faker.company.companyName();
  this.google_rating = faker.finance.amount(0,5,1);
  this.zagat_food_rating = faker.finance.amount(0,5,1);
  this.review_count = faker.random.number({min:1, max:1000});
  this.short_description = faker.lorem.words(10);
  this.neighborhood = faker.lorem.words(3);
  this.price_level = faker.random.number(4);
  this.type = this.createType();
  this.photos = this.createImages();
  this.nearby = this.createNearby();
};

Restaurant.prototype.createType = function(){
  const types = ["Bar", "Bar", "Bar", "Restaurant", "Restaurant", "Restaurant", "Restaurant", "Restaurant", "Food", "Food", "Food Delivery"];
  const rdmIdx = Math.floor(Math.random() * types.length);
  return types[rdmIdx];
}

Restaurant.prototype.createNearby = function(){
  let nearby = [];
  const nearbyCount = 6;
  for(var i = 0; i < nearbyCount; i++){
    const randomNum = faker.random.number(seedJSON.dbSize);
    nearby.push(randomNum);
  }
  return nearby;
}

Restaurant.prototype.createImages = function(){
  let images = [];
  let imageUrlCount = seedJSON.fullUrls.length;
  for(var i = 0; i < 3; i++){
    imageIdx = (++imageIdx < imageUrlCount) ? ++imageIdx : 0;
    images.push(seedJSON.fullUrls[imageIdx]);
  }
  // console.log(images.join());
  return images.join();
}

Restaurant.prototype.createUrlArray = function() {
  return new Promise(function(resolve, reject){
    fs.readFile('fullUrls.txt', 'utf8', function(err, data) {
      if(err){
        reject(err);
      } else {
        resolve(data.split(', '));
      }
    });
  })
}

module.exports = Restaurant;
