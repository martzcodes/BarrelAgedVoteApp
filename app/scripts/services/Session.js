'use strict';

angular.module('barrelAgedApp')
  .factory('Session', function ($resource) {
    return $resource('/auth/session/');
  });
