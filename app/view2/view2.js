'use strict';

angular.module('myApp.view2', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/view2', {
            templateUrl: 'view2/view2.html',
            controller: 'View2Ctrl'
        });
    }])

	.controller('View2Ctrl', ['$scope', '$location', 'authenticatedUserService', 'authenticationService', 'serverCallService', 
		function($scope, $location, authenticatedUserService, authenticationService, serverCallService) {

			$scope.user = authenticatedUserService.getUser();
			$scope.googleClientID = authenticationService.getGoogleClientID();

			$scope.logout = function() {
				authenticationService.logout();
				$location.url('/');
			}

			$scope.goToLandingPage = function() {
				$location.url('/');
			}


			$scope.$on('event:google-plus-signin-success', function (event,authResult) {
			    console.log('Google sign-in successful. ');
			    serverCallService.makePost("rest/link/google?token=" + authResult.id_token, {}, googleLinkingSuccess, googleLinkingFail);
			});

			$scope.$on('event:google-plus-signin-failure', function (event,authResult) {
			    console.log('Google sign-in failed or sign-out detected. ');
			});

            function googleLinkingSuccess(data) {
                if (data === undefined) {
                    console.log('No data returned when linking google account.');
                } else {
                	authenticatedUserService.setAuthenticatedUser(data);
                    $scope.user = data.user;
                }
            }

            function googleLinkingFail() {
                console.log('Google linking failed.');
            }

	}]);