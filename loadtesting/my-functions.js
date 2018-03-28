function generateRandomData(userContext, events, done) {
  userContext.vars.randomId = Math.floor(Math.random() * 10000000);
  return done();
}

function generateLessRandomId(userContext, events, done) {
  userContext.vars.lessRandomId = Math.floor(Math.random() * 100);
  return done();
}

module.exports = {
  generateRandomData: generateRandomData,
  generateLessRandomId: generateLessRandomId
};
