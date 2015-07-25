'use strict';

var mongoose = require('mongoose'),
    Beer = mongoose.model('Beer'),
    ObjectId = mongoose.Types.ObjectId;

/**
 * Create beer
 * requires: {username, password, email}
 * returns: {email, password}
 */
exports.create = function (req, res, next) {
    var beerObject = req.body;
    var newBeer = new Beer(beerObject);

    newBeer.save(function (err) {
        if (err) {
            return res.json(400, err);
        }
        res.status(200).send("complete");
    });
};

/**
 *  List beers
 */
exports.list = function (req, res) {
    Beer.find({}, function (err, beers) {
        if (err) {
            return next(new Error('Failed to load Beers'));
        }
        if (beer) {
            res.json(200, {beers: beers});
        } else {
            res.send(404, 'BEERS_NOT_FOUND')
        }
    });
};

/**
 * Update a beer
 */
exports.update = function (req, res) {
    var beer = req.beer;

    beer.save(function (err) {
        if (err) {
            res.json(500, err);
        } else {
            res.json(beer);
        }
    });
};

/**
 * Remove a beer
 */

exports.remove = function(req, res) {
    if (!req.params.beerId) {
        res.send(400, 'Missing Beer ID');
        return;
    }
    var beerId = req.params.beerId;
    Beer.findById(ObjectId(beerId)).remove().exec();
    res.status(200).send("complete");
};