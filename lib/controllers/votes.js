'use strict';

var mongoose = require('mongoose'),
    Vote = mongoose.model('Vote'),
    ObjectId = mongoose.Types.ObjectId,
    async = require('async');

var defaultAmount = process.env.NUMBER_OF_VOTES_DEFAULT || 100;

/**
 * Reset Votes
 */
exports.reset = function (req, res) {
    Vote.remove({}, function (err) {
        console.log('collection removed');
        if (err) {
            console.log(err);
        }
        var newVotes = [];
        async.doUntil(function(cb){
            var newVote = Math.random().toString(36).substr(2, 6).toUpperCase();
            if (newVotes.indexOf(newVote) === -1) {
                newVotes.push(newVote);
                var voteObject = new Vote({code:newVote});
                voteObject.save(function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
                cb();
            } else {
                cb();
            }
        },function(){
            return newVotes.length >= defaultAmount;
        },function(){
            res.status(200).send("complete");
        });
    });
};

/**
 * Import Votes
 */
exports.import = function (req, res) {
    if (!req.body.codes) {
        res.send(400, 'Missing Votes');
        return;
    }
    var codes = req.body.codes.split(", ");
    for (var i = 0; i < codes.length; i++) {
        var voteObject = new Vote({code:code});
        voteObject.save(function (err) {
            if (err) {
                console.log(err);
            }
        });
    }

};

/**
 * Add Votes
 */
exports.add = function (req, res) {
    if (!req.params.numberVotes) {
        res.send(400, 'Missing Number of Votes');
        return;
    }
    var newVotes = [];
    var numberVotes = Number(req.params.numberVotes);
    var newLength = numberVotes;
    Vote.find({}, function (err, votes) {
        if (err) {
            console.log("error: "+err);
        }
        if (votes) {
            newLength = votes.length + numberVotes;
            newVotes = votes.map(function(vote) {
                return vote.code;
            });
            async.doUntil(function(cb){
                var newVote = Math.random().toString(36).substr(2, 6).toUpperCase();
                if (newVotes.indexOf(newVote) === -1) {
                    newVotes.push(newVote);
                    var voteObject = new Vote({code:newVote});
                    voteObject.save(function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                    cb();
                } else {
                    cb();
                }
            },function(){
                return newVotes.length >= newLength;
            },function(){
                res.status(200).send("complete");
            });
        } else {
            res.send(404, 'VOTES_NOT_FOUND')
        }
    });
};

/**
 * Update a vote
 */
exports.update = function (req, res) {
    if (!req.body.voteCode) {
        res.send(400, 'Missing Vote Code');
        return;
    }
    var voteCode = req.body.voteCode;
    console.log("request body: "+JSON.stringify(req.body));
    Vote.findOne({code: voteCode}, function (err, voteexist) {
        if (err) {
            console.log("failed to find vote code");
        }
        if (voteexist) {
            Vote.findOneAndUpdate({code: voteCode},{ranked: req.body.ranked, date:Date.now(), $inc: { mods: 1 }, voted: true}, function (err, vote) {
                if (err) {
                    console.log("error: "+err);
                }
                if (vote) {
                    if (vote.mods > 1) {
                        res.json(200, {message:'updated'});
                    } else {
                        res.json(200, {message:'saved'});
                    }
                } else {
                    res.json(404, {message:'invalid'})
                }
            });
        } else {
            res.json(400,{exists: false});
        }
    });
};

/**
 *  List votes
 */
exports.list = function (req, res) {
    Vote.find({}, function (err, votes) {
        if (err) {
            return next(new Error('Failed to load votes'));
        }
        if (votes) {
            res.json(200, {votes:votes});
        } else {
            res.send(404, 'VOTES_NOT_FOUND')
        }
    });
};

/**
 * Remove a vote
 */

exports.remove = function(req, res) {
    if (!req.params.voteId) {
        res.send(400, 'Missing Vote ID');
        return;
    }
    console.log("here in remove");
    var voteId = req.params.voteId;
    Vote.findById(ObjectId(voteId)).remove().exec();
    res.status(200).send("complete");
};