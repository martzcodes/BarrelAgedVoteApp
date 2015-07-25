'use strict';

angular.module('angularPassportApp')
    .controller('AdminCtrl', function ($scope, Auth, Vote, Beer, $location, $rootScope) {
        $scope.error = {};
        $scope.user = {};
        $scope.admin = {
            votes: [],
            numberVotes: 1,
            votesUsed: 0
        };

        function update () {
            Vote.getVotes.get(function(votes){
                $scope.admin.votes = votes.votes;
                $scope.admin.votesUsed = 0;
                for (var i = 0; i < votes.votes.length; i++) {
                    if (votes.votes.voted) {
                        $scope.admin.votesUsed++;
                    }
                }
            });
        }

        $scope.getVotes = function() {
            update();
        };

        $scope.resetVotes = function() {
            Vote.resetVotes.get(function(){
                console.log("reset votes");
                update();
            });
        };

        $scope.addVotes = function() {
            console.log("trying to add votes: "+ $scope.admin.numberVotes);
            Vote.addVotes.get({numberVotes:$scope.admin.numberVotes},function(){
                console.log("added votes");
                update();
            });
        };

        $scope.deleteVote = function(voteId) {
            console.log("trying to remove a code: "+voteId);
            Vote.removeVote.get({voteId:voteId},function(){
                console.log("vote deleted");
                update();
            });
        };

        $scope.addBeer = function() {
            console.log("trying to add beer: ", $scope.editBeer);
            Beer.addVotes.get({numberVotes:$scope.admin.numberVotes},function(){
                console.log("added votes");
                update();
            });
        };

        $scope.deleteVote = function(voteId) {
            console.log("trying to remove a code: "+voteId);
            Vote.removeVote.get({voteId:voteId},function(){
                console.log("vote deleted");
                update();
            });
        };

        $scope.login = function (form) {
            Auth.login('password', {
                    'email': $scope.user.email,
                    'password': $scope.user.password
                },
                function (err) {
                    $scope.errors = {};

                    if (!err) {
                        update();
                        $location.path('/');
                    } else {
                        angular.forEach(err.errors, function (error, field) {
                            form[field].$setValidity('mongoose', false);
                            $scope.errors[field] = error.type;
                        });
                        $scope.error.other = err.message;
                    }
                });
        };

        if ($rootScope.currentUser) {
            update();
        }

    });
