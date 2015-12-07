'use strict';

angular.module('myApp.view1', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl'
        });
    }])

    .controller('View1Ctrl', ['$scope', 'serverCallService', '$route', '$rootScope', '$location', 'authenticatedUserService',
        function ($scope, serverCallService, $route, $rootScope, $location, authenticatedUserService) {

            $scope.mobileIdChallenge = false;

            serverCallService.makeGet("http://localhost:7070/rest/user?username=mati.maasikas", {}, success, fail);

            function success(user) {
                if (user === undefined || user.length < 1) {
                    console.log('No data returned by getting user.');

                } else {
                    console.log(user);
                }
            }

            function fail() {
                console.log('Getting user failed');

            }
        }]);