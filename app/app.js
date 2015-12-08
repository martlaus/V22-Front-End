'use strict';

// Declare app level module which depends on views, and components
angular
    .module('myApp', [
        'ngRoute',
        'myApp.view1',
        'myApp.view2',
        'myApp.version',
        'myApp.services',
        'directive.g+signin',
        'myApp.facebook'
    ])
    .config(['$routeProvider',
        '$locationProvider',
        '$httpProvider',
        function ($routeProvider, $locationProvider, $httpProvider) {
            $routeProvider.otherwise({redirectTo: '/view1'});
    }]);
