'use strict';

angular.module('barrelAgedApp')
    .factory('Vote', function ($resource) {
        return {
            getVotes: $resource('/auth/votes'),
            resetVotes: $resource('/auth/votes/reset'),
            importVotes: $resource('/auth/votes/import'),
            addVotes: $resource('/auth/votes/add/:numberVotes/'),
            updateVote: $resource('/auth/votes/update'),
            removeVote: $resource('/auth/votes/remove/:voteId/')
        };
    });