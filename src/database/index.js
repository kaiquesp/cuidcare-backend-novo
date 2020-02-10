const mongoose = require('mongoose');

mongoose.connect('mongodb://cuidcare:cuidcare2019@ds011912.mlab.com:11912/heroku_s2nwmkk0', { useMongoClient: true });
mongoose.Promise = global.Promise;

module.exports = mongoose;
