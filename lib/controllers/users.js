'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    passport = require('passport'),
    ObjectId = mongoose.Types.ObjectId,
    defaultusers = require('../config/default');

/**
 * Create user
 * requires: {username, password, email}
 * returns: {email, password}
 */
exports.create = function (req, res, next) {
    var userObject = req.body;
    var newUser = new User(userObject);
    newUser.provider = 'local';

    newUser.save(function (err) {
        if (err) {
            return res.json(400, err);
        }

        req.logIn(newUser, function (err) {
            if (err) return next(err);
            return res.json(newUser.user_info);
        });
    });
};

exports.reset = function (req, res) {
    if (process.env.DEFAULT_USER && process.env.DEFAULT_EMAIL && process.env.DEFAULT_PASSWORD) {
        var userObject = {
            username: process.env.DEFAULT_USER,
            email: process.env.DEFAULT_EMAIL,
            password: process.env.DEFAULT_PASSWORD
        };
        var newEnvUser = new User(userObject);
        newEnvUser.provider = 'local';
        newEnvUser.save(function (err) {
            if (err) {
                console.log(err);
            }
        });
    }
    if (defaultusers) {
        if (defaultusers.users) {
            User.remove({}, function (err) {
                console.log('collection removed');
                if (err) {
                    console.log(err);
                }
                defaultusers.users.forEach(function (defaultuser) {
                    var newUser = new User(defaultuser);
                    newUser.provider = 'local';
                    newUser.save(function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                });

            });
        }
    }
};

/**
 *  Show profile
 *  returns {username, profile}
 */
exports.show = function (req, res, next) {
    var userId = req.params.userId;

    User.findById(ObjectId(userId), function (err, user) {
        if (err) {
            return next(new Error('Failed to load User'));
        }
        if (user) {
            res.send({username: user.username, profile: user.profile, clients: user.clients});
        } else {
            res.send(404, 'USER_NOT_FOUND')
        }
    });
};

/**
 * Update a user
 */
exports.update = function (req, res) {
    var user = req.user;

    user.save(function (err) {
        if (err) {
            res.json(500, err);
        } else {
            res.json(user);
        }
    });
};

/**
 *  Username exists
 *  returns {exists}
 */
exports.exists = function (req, res, next) {
    var username = req.params.username;
    User.findOne({username: username}, function (err, user) {
        if (err) {
            return next(new Error('Failed to load User ' + username));
        }

        if (user) {
            res.json({exists: true});
        } else {
            res.json({exists: false});
        }
    });
};