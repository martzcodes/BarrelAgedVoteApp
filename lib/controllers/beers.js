'use strict';

var mongoose = require('mongoose'),
    Beer = mongoose.model('Beer'),
    ObjectId = mongoose.Types.ObjectId;

/**
 * Create beer
 * requires: {username, password, email}
 * returns: {email, password}
 */
exports.create = function (req, res) {
    var beerObject = req.body.beer;

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
        if (beers) {
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
    var beer = req.body.beer;
    Beer.findOneAndUpdate({_id: beer._id},beer, function (err, updatedBeer) {
        if (err) {
            console.log("error: "+err);
        }
        if (updatedBeer) {
            res.json(200, updatedBeer);
        } else {
            res.send(404, 'Beer_NOT_FOUND')
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