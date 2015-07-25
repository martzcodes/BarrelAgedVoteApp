'use strict';

angular.module('angularPassportApp')
    .factory('Vote', function ($resource) {
        return {
            getVotes: $resource('/auth/votes'),
            resetVotes: $resource('/auth/votes/reset'),
            addVotes: $resource('/auth/votes/add/:numberVotes/'),
            updateVote: $resource('/auth/votes/update/:voteCode/'),
            removeVote: $resource('/auth/votes/remove/:voteId/')
        };
    });
/*
 app.get('/auth/votes', auth.ensureAuthenticated, votes.list);
 app.get('/auth/votes/reset', auth.ensureAuthenticated, votes.reset);
 app.post('/auth/votes/update/:voteCode', votes.update);
 app.get('/auth/votes/remove/:voteId', auth.ensureAuthenticated, votes.remove);
 */