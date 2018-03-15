const fs = require('fs');
const faker = require('faker');
const bluebird = require('bluebird');
const fakerModel = require('./faker-restaurant-model.js');

let fullUrls = [];
let id = 1;
// const dbSize = 10000000;
const dbSize = 80;

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

function createAllRestaurants(){
  for(id; id <= dbSize; id++){
    console.log(new fakerModel(id));
  }
}

function createUrlArray() {
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

initialize();

exports.dbSize = dbSize;
