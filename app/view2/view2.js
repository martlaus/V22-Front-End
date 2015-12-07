'use strict';

angular.module('myApp.view2', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/view2', {
            templateUrl: 'view2/view2.html',
            controller: 'View2Ctrl'
        });
    }])

	.controller('View2Ctrl', ['$scope', '$location', 'authenticatedUserService', 'authenticationService', 
		function($scope, $location, authenticatedUserService, authenticationService) {

			$scope.user = authenticatedUserService.getUser();

			$scope.logout = function() {
				authenticationService.logout();
				$location.url('/');
			}

			$scope.goToLandingPage = function() {
				$location.url('/');
			}
 

	}]);