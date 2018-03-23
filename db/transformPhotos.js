const { Transform } = require('stream');
const StringDecoder = require('string_decoder').StringDecoder;
const stringdecoder = new StringDecoder('utf8');

const parsePhotos = new Transform({
  transform(data, encoding, callback){
    data = stringdecoder.write(data);
    data = data.split('\t');
    let restId = data[0].split('\n');
    restId = restId[restId.length - 1];
    const photos = data[1].split(',');
    for(var i = 0; i < photos.length; i++){
      const line = restId + '\t' + photos[i] + '\n';
      this.push(line);
    }
    callback();
  }
})

const parseNearbys = new Transform({
  transform(data, encoding, callback){
    data = stringdecoder.write(data);
    data = data.split('\t');
    let restId = data[0].split('\n');
    restId = restId[restId.length - 1];
    const nearbys = data[1].split(',');
    for(var i = 0; i < nearbys.length; i++){
      const line = restId + '\t' + nearbys[i] + '\n';
      this.push(line);
    }
    callback();
  }
})

exports.parsePhotos = parsePhotos;
exports.parseNearbys = parseNearbys;
