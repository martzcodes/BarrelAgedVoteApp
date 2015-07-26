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
            codesList: "",
            results: {}
        };

        function getBeerById(beerId) {
            for (var j = 0; j <= $scope.admin.beers.length; j++) {
                if (j === $scope.admin.beers.length) {
                    return null;
                } else {
                    if (beerId === $scope.admin.beers[j]._id) {
                        return $scope.admin.beers[j];
                    }
                }
            }
        }

        function updateVotes() {
            var commasep = "";
            Vote.getVotes.get(function (votes) {
                $scope.admin.votes = votes.votes;
                $scope.admin.votesUsed = 0;
                $scope.admin.results = {};
                for (var i = 0; i < votes.votes.length; i++) {
                    if (votes.votes[i].voted) {
                        $scope.admin.votesUsed++;
                        for (var j = 0; j < votes.votes[i].ranked.length; j++) {
                            if (!$scope.admin.results[votes.votes[i].ranked[j].id]) {
                                $scope.admin.results[votes.votes[i].ranked[j].id] = {
                                    beer: getBeerById(votes.votes[i].ranked[j].id),
                                    points: Number(votes.votes[i].ranked[j].points)
                                };
                            } else {
                                $scope.admin.results[votes.votes[i].ranked[j].id].points = Number($scope.admin.results[votes.votes[i].ranked[j].id].points) + Number(votes.votes[i].ranked[j].points);
                            }
                        }
                        /*
                        if ($scope.admin.results.length === 0) {
                            for (var j = 0; j < votes.votes[i].ranked.length; j++) {
                                if ($scope.admin.results.map(function (result) {
                                        return result.beer._id;
                                    }).indexOf(votes.votes[i].ranked[j].id) > -1) {
                                    for (var k = 0; k < $scope.admin.results.length; k++) {
                                        if ($scope.admin.results[k]._id === votes.votes[i].ranked[j].id) {
                                            $scope.admin.results[k].votes = $scope.admin.results[k].votes + votes.votes[i].ranked[j].points;
                                        }
                                    }
                                } else {
                                    $scope.admin.results.push({
                                        beer: getBeerById(votes.votes[i].ranked[j].id),
                                        votes: votes.votes[i].ranked[j].points
                                    });
                                }
                            }
                        } else {
                            $scope.admin.results.push({
                                beer: getBeerById(votes.votes[i].ranked[j].id),
                                votes: votes.votes[i].ranked[j].points
                            });
                        }
                        */
                    }
                    $scope.admin.codesList += commasep + votes.votes[i].code;
                    commasep = ", ";
                }
            });
        }

        $scope.getVotes = function () {
            updateVotes();
        };

        $scope.resetVotes = function () {
            Vote.resetVotes.get(function () {
                console.log("reset votes");
                updateVotes();
            });
        };

        $scope.addVotes = function () {
            console.log("trying to add votes: " + $scope.admin.numberVotes);
            Vote.addVotes.get({numberVotes: $scope.admin.numberVotes}, function () {
                console.log("added votes");
                updateVotes();
            });
        };

        $scope.importCodes = function () {
            Vote.importVotes.get({codes: $scope.admin.importList}, function () {
                updateVotes();
            });
        };

        $scope.deleteVote = function (voteId) {
            console.log("trying to remove a code: " + voteId);
            Vote.removeVote.get({voteId: voteId}, function () {
                console.log("vote deleted");
                updateVotes();
            });
        };

        function updateBeers(callback) {
            Beer.getBeers.get(function (beers) {
                $scope.admin.beers = beers.beers;
                $scope.admin.editBeer = {
                    _id: "",
                    name: "",
                    description: "",
                    brewery: ""
                };
                if (callback) {
                    callback();
                }
            });
        }

        $scope.addBeer = function () {
            console.log("trying to add beer: ", $scope.admin.editBeer);
            delete $scope.admin.editBeer._id;
            Beer.addBeer.save({beer: $scope.admin.editBeer}, function () {
                console.log("added beer");
                updateBeers();
            });
        };

        $scope.editBeer = function (beer) {
            $scope.admin.editBeer = beer;
        };

        $scope.cancelEditBeer = function () {
            $scope.admin.editBeer = {
                _id: "",
                name: "",
                description: "",
                brewery: ""
            };
        };

        $scope.updateBeer = function () {
            console.log("trying to add beer: ", $scope.admin.editBeer);
            Beer.updateBeer.save({beer: $scope.admin.editBeer}, function () {
                console.log("added beer");
                updateBeers();
            });
        };

        $scope.deleteBeer = function (beerId) {
            console.log("trying to remove a beer: " + beerId);
            Beer.removeBeer.get({beerId: beerId}, function () {
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
                        updateBeers(function() {
                            updateVotes();
                        });
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
            updateBeers(function () {
                updateVotes();
            });
        }

    });
