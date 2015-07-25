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
    if (!req.params.voteCode) {
        res.send(400, 'Missing Vote Code');
        return;
    }
    var voteCode = req.params.voteCode;
    Vote.findOneAndUpdate({code: voteCode},{ranked: req.body, date:Date.now(), $inc: { mods: 1 }, voted: true}, function (err, vote) {
        if (err) {
            console.log("error: "+err);
        }
        if (vote) {
            res.json(200, vote);
        } else {
            res.send(404, 'VOTE_NOT_FOUND')
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