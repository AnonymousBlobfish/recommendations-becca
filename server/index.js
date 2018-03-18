const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

var mySqlModels = require('../db/models/mysql.js');
const dbAddress = process.env.DB_ADDRESS || 'localhost';

app.use(cors());
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, '../client/dist')));
app.use('/restaurants/:id', express.static(path.join(__dirname, '../client/dist')));

app.get('/api/restaurants/:id/recommendations', function (req, res) {
  var placeId = req.params.id || 0;
  console.log("GET " + req.url);

  // find recommended restaurants based on id
  var results = [];
  mySqlModels.findOneRestaurant(placeId)
    .then(data => {
      data = data[0]; // Necessary to get data from RowDataPacket
      results.push(data);
      // res.status(200);
      // res.send(results);
      mySqlModels.findNearbys(data.restaurant_id)
        .then(nearbyArr => {
          console.log(nearbyArr);
          mySqlModels.findManyRestaurants(nearbyArr)
            .then(nearbyData => {
              console.log(nearbyData);
              results.push(nearbyData);
              res.status(200);
              res.send(results);
            })
        });
    }).catch(err => {
      res.status(500);
      console.log(err);
    });
});

app.listen(3004, function () { console.log('WeGot app listening on port 3004!') });
