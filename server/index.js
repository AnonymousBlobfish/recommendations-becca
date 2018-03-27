require('newrelic');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

var restaurants = require('../db/models/restaurant.js');
var mongoose = require('mongoose');
const dbAddress = process.env.DB_ADDRESS || 'localhost';

var uri = `mongodb://${dbAddress}/wegot`;
mongoose.connect(uri, { useMongoClient: true });

app.use(cors());
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, '../client/dist')));
app.use('/restaurants/:id', express.static(path.join(__dirname, '../client/dist')));

app.get('/api/restaurants/:id/recommendations', function (req, res) {
  var placeId = req.params.id || 0;
  console.log(uri);
  // find recommended restaurants based on id
  restaurants.initialize(placeId)
    .then(results => {
      console.log('results ', results);
      res.status(200);
      res.send(results);
    }).catch(err => {
      console.log('error ', err);
      res.status(500);
    });
});


app.listen(3004, function () { console.log('WeGot app listening on port 3004!') });
