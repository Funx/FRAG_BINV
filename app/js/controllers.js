'use strict';


/* Controllers */

var controllers = angular.module('myApp.controllers', []);

controllers.controller('globalCtrl', function($rootScope, $scope, $timeout) {
	// ROOOOT
	$rootScope.birds = DB.getBirds();
	$rootScope.areas = DB.getAreas();
	$rootScope.sectors = DB.getSectors();
	$rootScope.sectors[1].color = "#46764e";
	$rootScope.sectors[2].color = "#9eb353";
	$rootScope.guadeloupe = $scope.sectors.splice(0, 1)[0];

	$rootScope.displayMenu = true;
	$rootScope.displayPhoto = false;
	$rootScope.displayPreviousButton = false;
	$rootScope.displayNotif = false;

	$rootScope.states = {
		diversityLink: 'current'
		, populationLink: null
	};
	
	$rootScope.dataType = " oiseaux / heure filet ";

	var $notifier = $("#notifier");

	$rootScope.notifyStart = function(data) {
		$rootScope.displayNotif = true;
		$rootScope.notification = data;
	};
	$rootScope.notifyEnd = function() {
		$notifier.delay(100).queue(function() {
			//$(this).removeClass('visible');
		});
	};
	
	$rootScope.pieInit = function(){
		$timeout(function(){
			console.log('timeout');
			PieChart.init($rootScope);
		},1000);
	};
	
});

controllers.controller('mapCtrl', function($routeParams, $scope, $rootScope, $http) {
	console.log('============= mapCtrl ============');

	var MAX_RADIUS = 20;
	var MIN_RADIUS = 5;

	var PER_H_FILET = 1;

	$rootScope.displayPhoto = false;
	$rootScope.displayPreviousButton = false;
	$rootScope.displayMenu = true;
	$rootScope.displayNotif = false;

	$rootScope.states = {
		diversityLink: 'current'
		, populationLink: null
	};

	var taffyAreas = TAFFY($rootScope.areas);
	$scope.areas = $rootScope.areas;

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

	$rootScope.getValueOf = function(area) {
		if ($rootScope.states.diversityLink == 'current') {
			//diversity of the area
			return area.diversity;
		} else {
			//birds by PER_H_FILET h_filet
			return area.birdsPerHour * PER_H_FILET;
		}
	};

	$rootScope.getWeightedValueOf = function(area) {
		var value = $rootScope.getValueOf(area);
		if ($rootScope.states.diversityLink == 'current') {
			//diversity of the area
			var min = $scope.diversity.min;
			var max = $scope.diversity.max;
		} else {
			//birds by PER_H_FILET h_filet
			var min = $scope.birdsPerHour.min * PER_H_FILET;
			var max = $scope.birdsPerHour.max * PER_H_FILET;
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
				$rootScope.states = {
					diversityLink: null
					, populationLink: 'current'
				};
				$rootScope.title = "Population totale";
				$scope.subtitle = $scope.birdsPerHour.total + " oiseaux / heure filet ";
				$rootScope.dataType = " oiseaux / heure filet ";
				break;
			case'diversity':
				$rootScope.states = {
					diversityLink: 'current'
					, populationLink: null
				};
				$rootScope.title = "Diversité des espèces";
				$scope.subtitle = $scope.diversity.total + " espèces capturées";
				$rootScope.dataType = "espèces différentes";
				break;
		}
	};

	//init;
	if (!$routeParams.datatype) {
		$routeParams.datatype = "population";
	}
	$scope.setDataType($routeParams.datatype);
});

//area CTRL
controllers.controller('areaCtrl', function($scope, $rootScope, $routeParams) {
	console.log('============= areaCtrl ============');

	$rootScope.displayPreviousButton = true;
	$rootScope.displayMenu = false;
	$rootScope.displayNotif = false;


	$scope.id = $routeParams.area;

	if ($routeParams.area == "guadeloupe"
									|| $routeParams.area == "grande-terre"
									|| $routeParams.area == "basse-terre") {
		$scope.displayMiniMap = true;
		$scope.displaySvg = false;
	} else {
		$scope.displayMiniMap = false;
		$scope.displaySvg = true;
	}

	$scope.area = DB.getAllAreas({id: $scope.id})[0];

	$rootScope.title = $scope.area.lieuDit;

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

	};
});

controllers.controller('birdsCtrl', function($routeParams, $scope, $rootScope, $http) {
	var MAX_RADIUS = 50;
	var MIN_RADIUS = 3;

	var PER_H_FILET = 1;

	$scope.displayPhoto = true;
	$rootScope.displayPreviousButton = false;
	$rootScope.displayMenu = true;
	$rootScope.displayNotif = false;

	$rootScope.states = {
		diversityLink: null
		, populationLink: null
	};

	var taffyAreas = TAFFY(DB.getAreas());
	$scope.birdsPerHour = {
		min: taffyAreas().min('birdsPerHour') * PER_H_FILET
		, max: taffyAreas().max('birdsPerHour') * PER_H_FILET
		, total: $rootScope.guadeloupe.countPerHour[$routeParams.specy] * PER_H_FILET
	};

	$scope.specy = TAFFY(DB.getBirds('guadeloupe'))({id: $routeParams.specy}).get()[0];
	$scope.subtitle = $scope.birdsPerHour.total + " oiseaux / heure filet ";
	$rootScope.title = $scope.specy.name;

	$rootScope.dataType = " oiseaux / heure filet ";

	$rootScope.getValueOf = function(area) {
		//birds by PER_H_FILET h_filet
		return area.countPerHour[$scope.specy.id] * PER_H_FILET;
	};

	$rootScope.getWeightedValueOf = function(area) {
		var value = $rootScope.getValueOf(area);
		//birds by PER_H_FILET h_filet
		var min = 0;
		var max = 0.5;
		if (value == 0) {
			return 0;
		} else {
			return value * (MAX_RADIUS - MIN_RADIUS) + MIN_RADIUS;
		}
	};
});