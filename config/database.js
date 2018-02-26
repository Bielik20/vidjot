if (process.env.NODE_ENV === 'production') {
  module.exports = { mongoURI: 'mongodb://bielik:bielik@ds249718.mlab.com:49718/vidjot-prod' }
} else {
  module.exports = { mongoURI: 'mongodb://localhost/vidjot-dev' }
}