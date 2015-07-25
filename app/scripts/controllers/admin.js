'use strict';

angular.module('angularPassportApp')
    .controller('AdminCtrl', function ($scope, Auth, Vote, Beer, $location, $rootScope) {
        $scope.error = {};
        $scope.user = {};
        $scope.admin = {
            votes: [],
            numberVotes: 1,
            votesUsed: 0,
            editBeer: {
                _id: "",
                name: "",
                description: "",
                brewery: ""
            },
            beers: [],
            codesList: ""
        };

        function updateVotes () {
            var commasep = "";
            Vote.getVotes.get(function(votes){
                $scope.admin.votes = votes.votes;
                $scope.admin.votesUsed = 0;
                for (var i = 0; i < votes.votes.length; i++) {
                    if (votes.votes[i].voted) {
                        $scope.admin.votesUsed++;
                    }
                    $scope.admin.codesList += commasep+votes.votes[i].code;
                    commasep= ", ";
                }
            });
        }

        $scope.getVotes = function() {
            updateVotes();
        };

        $scope.resetVotes = function() {
            Vote.resetVotes.get(function(){
                console.log("reset votes");
                updateVotes();
            });
        };

        $scope.addVotes = function() {
            console.log("trying to add votes: "+ $scope.admin.numberVotes);
            Vote.addVotes.get({numberVotes:$scope.admin.numberVotes},function(){
                console.log("added votes");
                updateVotes();
            });
        };

        $scope.deleteVote = function(voteId) {
            console.log("trying to remove a code: "+voteId);
            Vote.removeVote.get({voteId:voteId},function(){
                console.log("vote deleted");
                updateVotes();
            });
        };

        function updateBeers() {
            Beer.getBeers.get(function(beers){
                $scope.admin.beers = beers.beers;
                $scope.admin.editBeer = {
                    _id: "",
                    name: "",
                    description: "",
                    brewery: ""
                };
            });
        }

        $scope.addBeer = function() {
            console.log("trying to add beer: ", $scope.admin.editBeer);
            Beer.addBeer.save({beer:$scope.admin.editBeer},function(){
                console.log("added beer");
                updateBeers();
            });
        };

        $scope.editBeer = function(beer) {
            $scope.admin.editBeer = beer;
        };

        $scope.cancelEditBeer = function() {
            $scope.admin.editBeer = {
                _id: "",
                name: "",
                description: "",
                brewery: ""
            };
        };

        $scope.updateBeer = function() {
            console.log("trying to add beer: ", $scope.admin.editBeer);
            Beer.updateBeer.save({beer:$scope.admin.editBeer},function(){
                console.log("added beer");
                updateBeers();
            });
        };

        $scope.deleteBeer = function(beerId) {
            console.log("trying to remove a beer: "+beerId);
            Beer.removeBeer.get({beerId:beerId},function(){
                console.log("beer deleted");
                updateBeers();
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
            updateVotes();
            updateBeers();
        }

    });
