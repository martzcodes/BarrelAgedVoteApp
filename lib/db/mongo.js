'use strict';

var mongoose = require('mongoose'),
    config = require('../config/config')
exports.mongoose = mongoose;

var mongoOptions = { db: { safe: true } };

// Connect to Database
exports.db = mongoose.connect('mongodb://'+config.db+':'+ config.dbport+config.dbname, mongoOptions, function (err, res) {
  if (err) {
    console.log ('ERROR connecting to: ' + 'mongodb://'+config.db+':'+ config.dbport+config.dbname + '. ' + err);
  } else {
    console.log ('Successfully connected to: ' + 'mongodb://'+config.db+':'+ config.dbport+config.dbname);
  }
});
