'use strict';

angular.module('angularPassportApp')
    .controller('MainCtrl', function ($scope, Auth, $location, $rootScope) {
        $scope.error = {};
        $scope.user = {};
    });
