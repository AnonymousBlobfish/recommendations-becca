const faker = require('faker');

const Restaurant = {
  name: faker.company.companyName(),
  //place_id: index?//
  google_rating: faker.amount(0,5,1),
  zagat_food_rating: faker.amount(0,5,1),
  review_count: faker.number({min:1, max:1000}),
  //photos: photosURLArray,
  short_description: faker.lorem.words(num[10]),
  neighborhood: faker.lorem.words(num[3]),
  location: {
    lat: faker.address.latitude(),
    long: faker.address.longitude()
  },
  address: `${faker.address.streetAddress("###")}, ${faker.address.city()}, ${faker.address.stateAbbr()} ${faker.address.zipCode()}, USA`,
  website: faker.internet.url(),
  price_level: faker.random.number(4),
  types: [faker.lorem.words(num[1])],
  nearby: [faker.random.number(1000000), faker.random.number(1000000), faker.random.number(1000000), faker.random.number(1000000), faker.random.number(1000000), faker.random.number(1000000)]
}

module.exports = Restaurant
