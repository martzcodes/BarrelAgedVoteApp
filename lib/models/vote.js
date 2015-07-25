'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var VoteSchema = new Schema({
    code: {
        type: String,
        unique: true,
        required: true
    },
    ranked: {
        type: Array
    },
    date: {
        type: Date,
        default: Date.now
    },
    mods: {
        type: Number,
        default: 0
    },
    voted: {
        type: Boolean,
        default: false
    }
});

mongoose.model('Vote', VoteSchema);
