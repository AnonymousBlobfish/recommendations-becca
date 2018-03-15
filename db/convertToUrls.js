/* BECCA: This file takes an input file called imageUrls.txt and creates a file called
fullUrls.txt.  The imageUrls.txt was created in the AWS CLI with the following commands:

    aws s3 ls s3://wegot-recommendations-images > imageList.txt
    sed 's/^.\{30\}//' imageList.txt > imageUrls.txt

*/

const fs = require('fs');
const lineReader = require('readline').createInterface({
  input: fs.createReadStream('./imageUrls.txt')
});

lineReader.on('line', function (line) {
  const strippedURI = line.replace(/\s/g, '');
  const fullUrl = `https://d11h7stelz8497.cloudfront.net/${strippedURI}, `;
  fs.appendFile('./fullUrls.txt', fullUrl, function (err) {
    if (err) throw err;
  });
});
