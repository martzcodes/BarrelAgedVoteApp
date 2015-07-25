'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BeerSchema = new Schema({
    name: String,
    description: String,
    brewery: String,
    date: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Beer', BeerSchema);
