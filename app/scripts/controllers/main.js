'use strict';

angular.module('barrelAgedApp')
    .controller('MainCtrl', function ($scope, Vote, Beer) {

        function shuffle(array) {
            var currentIndex = array.length, temporaryValue, randomIndex ;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
        }


        function resetMain() {
            Beer.getBeers.get(function(beers){
                var shuffledBeers = shuffle(beers.beers);
                for (var i = 0; i < shuffledBeers.length; i++) {
                    shuffledBeers[i].points = i+1;
                }
                $scope.main = {
                    code: "",
                    beers: shuffledBeers,
                    alert: {},
                    disableSubmit: true
                };
            });
        }

        resetMain();

        $scope.upBeer = function(beerPoints) {
            for (var i = 0; i < $scope.main.beers.length; i++) {
                if ($scope.main.beers[i].points === beerPoints) {
                    $scope.main.beers[i].points++;
                } else {
                    if ($scope.main.beers[i].points === beerPoints+1) {
                        $scope.main.beers[i].points--;
                    }
                }
            }
        };

        $scope.downBeer = function(beerPoints) {
            for (var i = 0; i < $scope.main.beers.length; i++) {
                if ($scope.main.beers[i].points === beerPoints) {
                    $scope.main.beers[i].points--;
                } else {
                    if ($scope.main.beers[i].points === beerPoints-1) {
                        $scope.main.beers[i].points++;
                    }
                }
            }
        };

        $scope.codeLengthCheck = function() {
            if ($scope.main.code.length !== 6) {
                $scope.main.disableSubmit = true;
            } else {
                $scope.main.disableSubmit = false;
            }
        };

        $scope.submitVote = function() {
            var rankedObject = [];
            for (var i = 0; i < $scope.main.beers.length; i++) {
                rankedObject.push({id:$scope.main.beers[i]._id,points:$scope.main.beers[i].points});
            }
            Vote.updateVote.save({voteCode: $scope.main.code, ranked: rankedObject}, function(res) {
                var message = res.message;
                console.log("message: ",message);
                if (message === 'saved') {
                    $scope.main.alert ={
                        title: "Thanks!",
                        class: "alert-success"
                    };
                    resetMain();
                }
                if (message === 'updated') {
                    $scope.main.alert = {
                        title: "Your vote has been updated.",
                        class: "alert-info"
                    };
                    resetMain();
                }
            },function(err){
                var message = err.message;
                console.log("err: ",err);
                if (message === "invalid") {
                    $scope.main.alerts = {
                        title: "Not a valid code.",
                        class: "alert-danger"
                    };
                } else {
                    $scope.main.alerts = {
                        title: "There was an error :(",
                        class: "alert-danger"
                    };
                }
            });
        }

    });
