'use strict';

var path = require('path'),
    auth = require('../config/auth');

module.exports = function(app) {
  // User Routes
  var users = require('../controllers/users');
  //app.post('/auth/users', users.create);
  app.get('/reset', users.reset);

  // Beer Routes
  var beers = require('../controllers/beers');
  app.get('/auth/beers',beers.list);
  app.post('/auth/beers/add', auth.ensureAuthenticated, beers.create);
  app.post('/auth/beers/update', auth.ensureAuthenticated, beers.update);
  app.get('/auth/beers/remove/:beerId', auth.ensureAuthenticated, beers.remove);

  // Vote Routes
  var votes = require('../controllers/votes');
  app.get('/auth/votes', auth.ensureAuthenticated, votes.list);
  app.get('/auth/votes/reset', auth.ensureAuthenticated, votes.reset);
  app.get('/auth/votes/add/:numberVotes', auth.ensureAuthenticated, votes.add);
  app.get('/auth/votes/remove/:voteId', auth.ensureAuthenticated, votes.remove);
  app.post('/auth/votes/update/:voteCode', votes.update);

  // Session Routes
  var session = require('../controllers/session');
  app.get('/auth/session', auth.ensureAuthenticated, session.session);
  app.post('/auth/session', session.login);
  app.del('/auth/session', session.logout);

  // Angular Routes
  app.get('/partials/*', function(req, res) {
    var requestedView = path.join('./', req.url);
    res.render(requestedView);
  });

  app.get('/*', function(req, res) {
    if(req.user) {
      res.cookie('user', JSON.stringify(req.user.user_info));
    }

    res.render('index.html');
  });

};