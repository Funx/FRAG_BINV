'use strict';
/* Controllers */

angular.module('myApp.controllers', [])
        //population CTRL
        .controller('mapCtrl', function($routeParams, $scope, $http) {

            var MAX_RADIUS = 20;
            var MIN_RADIUS = 2;

            var PER_H_FILET = 1;

            var $notifier = $("#notifier");
            $scope.app = app;

            $scope.states = {
                diversityLink: 'current'
                , populationLink: null
            };

            $scope.areas = DB.getAreas();
            $scope.sectors = DB.getSectors();
            $scope.sectors[1].color = "#46764e";
            $scope.sectors[2].color = "#9eb353";
            $scope.guadeloupe = $scope.sectors.splice(0, 1)[0];
            var taffyAreas = TAFFY(DB.getAreas());

            $scope.diversity = {
                min: taffyAreas().min('diversity')
                , max: taffyAreas().max('diversity')
                , total: $scope.guadeloupe.diversity
            };

            $scope.birdsPerHour = {
                min: taffyAreas().min('birdsPerHour') * PER_H_FILET
                , max: taffyAreas().max('birdsPerHour') * PER_H_FILET
                , total: $scope.guadeloupe.birdsPerHour * PER_H_FILET
            };

            $scope.notification = app.notification;

            $scope.notifyStart = function(data) {
                $notifier.addClass('visible');
                $scope.notification = data;
            };
            $scope.notifyEnd = function() {
                $notifier.delay(100).queue(function() {
                    $(this).removeClass('visible');
                });
            };

            $scope.getValueOf = function(area) {
                if ($scope.states.diversityLink == 'current') {
                    //diversity of the area
                    return area.diversity;
                } else {
                    //birds by PER_H_FILET h_filet
                    if (!$scope.specy) {
                        return area.birdsPerHour * PER_H_FILET;
                    } else {
                        return area.countPerHour[$scope.specy.id] * PER_H_FILET;
                    }
                }
            };

            $scope.getWeightedValueOf = function(area) {
                var value = $scope.getValueOf(area);
                if ($scope.states.diversityLink == 'current') {
                    //diversity of the area
                    var min = $scope.diversity.min;
                    var max = $scope.diversity.max;
                } else {
                    //birds by PER_H_FILET h_filet
                    if (!$scope.specy) {
                        var min = $scope.birdsPerHour.min * PER_H_FILET;
                        var max = $scope.birdsPerHour.max * PER_H_FILET;
                    } else {
                        var min = 0;
                        var max = $scope.birdsPerHour.max * PER_H_FILET;
                    }
                }
                if (value == 0) {
                    return 0;
                } else {
                    return (value - min) / (max - min) * (MAX_RADIUS - MIN_RADIUS) + MIN_RADIUS;
                }
            };

            $scope.setDataType = function(dataType, specy) {
                switch (dataType) {
                    case'population':
                        $scope.states = {
                            diversityLink: null
                            , populationLink: 'current'
                        };
                        if (specy) {
                            $scope.specy = TAFFY(DB.getBirds('guadeloupe'))({id: specy}).get()[0];
                            console.log($scope.specy);

                            $scope.title = $scope.specy.name;
                        } else {
                            $scope.title = "Population totale";

                        }
                        $scope.subtitle = $scope.birdsPerHour.total + " oiseaux / heure filet ";
                        $scope.dataType = " oiseaux / heure filet ";
                        PieChart.init($scope.sectors, $scope);
                        MapChart.init($scope.sectors, $scope);
                        break;
                    case'diversity':
                        $scope.states = {
                            diversityLink: 'current'
                            , populationLink: null
                        };
                        $scope.title = "Diversité des espèces";
                        $scope.subtitle = $scope.diversity.total + " espèces capturées";
                        $scope.dataType = "espèces différentes";
                        PieChart.init($scope.sectors, $scope);
                        MapChart.init($scope.sectors, $scope);
                        break;
                }
            };
            //init;
            if (!$routeParams.datatype) {
                $routeParams.datatype = "population";
            }
            $scope.setDataType($routeParams.datatype, $routeParams.specy);
            // modif
            $scope.birds = DB.getBirds();
            // /modif
        })

        //area CTRL
        .controller('areaCtrl', function($scope, $routeParams) {
            $scope.app = app;
            $scope.id = $routeParams.area;

            if ($routeParams.area == "guadeloupe") {
                $scope.title = "Population totale";
            } else {
                $scope.title = "Population locale";
            }

            $scope.area = DB.getAllAreas({id: $scope.id})[0];


            console.log($scope.area);
            $scope.getPopulationRateOf = function(bird) {
                return Math.round((bird.population / $scope.area.population) * 10000) / 100;
            };

            var allBirds = DB.getBirds($scope.id);
            var birdsInProject = TAFFY(allBirds)({isInProject: true}).get();
            $scope.birds = allBirds;


            var showAllBirds = true;
            $scope.nbSpecies = 15;
            $scope.showBirdsInProject = function() {
                showAllBirds = !showAllBirds;
                if (showAllBirds == true) {
                    $scope.birds = allBirds;
                }
                else {
                    $scope.birds = birdsInProject;
                }

            }
        });

