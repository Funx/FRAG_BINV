'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
	'ngRoute',
	'ngAnimate',
	'myApp.filters',
	'myApp.services',
	'myApp.directives',
	'myApp.controllers'
]).
								config(['$routeProvider', function($routeProvider) {
/*
										$routeProvider.when('/', {
											templateUrl: 'partials/home.html',
											controller: 'homeCtrl'
										});*/
										
										$routeProvider.when('/map', {
											templateUrl: 'partials/map.html',
											controller: 'mapCtrl'
										});

										$routeProvider.when('/map/:datatype', {
											templateUrl: 'partials/map.html',
											controller: 'mapCtrl'
										});

										$routeProvider.when('/bird/:specy', {
											templateUrl: 'partials/map.html',
											controller: 'birdsCtrl'
										});

										$routeProvider.when('/area', {
											templateUrl: 'partials/area.html',
											controller: 'areaCtrl'
										});

										$routeProvider.when('/area/:area', {
											templateUrl: 'partials/area.html',
											controller: 'areaCtrl'
										});

										$routeProvider.otherwise({redirectTo: '/map'});
									}]);

var myApp = angular.module('Svgs', []);

angular.forEach([
	{ngAttrName: 'ngXlinkHref', attrName: 'xlink:href'},
	{ngAttrName: 'ngWidth', attrName: 'width'},
	{ngAttrName: 'ngHeight', attrName: 'height'}
], function(pair) {

	var ngAttrName = pair.ngAttrName;
	var attrName = pair.attrName;

	myApp.directive(ngAttrName, function(IeHelperSrv) {

		return {
			priority: 99,
			link: function(scope, element, attrs) {

				attrs.$observe(ngAttrName, function(value) {

					if (!value)
						return;

					attrs.$set(attrName, value);
				});
			}
		};
	});
});