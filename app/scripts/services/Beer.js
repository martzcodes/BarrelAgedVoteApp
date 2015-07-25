'use strict';

angular.module('angularPassportApp')
    .factory('Vote', function ($resource) {
        return {
            getVotes: $resource('/auth/beers'),
            resetVotes: $resource('/auth/beers/reset'),
            addVotes: $resource('/auth/beers/add/'),
            updateVote: $resource('/auth/beers/update/'),
            removeVote: $resource('/auth/beers/remove/:beerId/')
        };
    });