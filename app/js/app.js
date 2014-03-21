'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
    'ngRoute',
    'myApp.filters',
    'myApp.services',
    'myApp.directives',
    'myApp.controllers'
]).
        config(['$routeProvider', function($routeProvider) {

                $routeProvider.when('/map', {
                    templateUrl: 'partials/map.html',
                    controller: 'mapCtrl'
                });

                $routeProvider.when('/map/:datatype', {
                    templateUrl: 'partials/map.html',
                    controller: 'mapCtrl'
                });

                $routeProvider.when('/map/:datatype/:specy', {
                    templateUrl: 'partials/map.html',
                    controller: 'mapCtrl'
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

var app = {
    'title': "Répartition des oiseaux en Guadeloupe"
    , 'x': "x"
    , notification: {
        id: ""
        , area: ""
        , name: "Guadeloupe"
        , value: 16
        , color: "rgb(50,150,12)"
    }
};