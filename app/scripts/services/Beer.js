'use strict';

angular.module('angularPassportApp')
    .factory('Beer', function ($resource) {
        return {
            getBeers: $resource('/auth/beers'),
            addBeer: $resource('/auth/beers/add/'),
            updateBeer: $resource('/auth/beers/update/'),
            removeBeer: $resource('/auth/beers/remove/:beerId/')
        };
    });