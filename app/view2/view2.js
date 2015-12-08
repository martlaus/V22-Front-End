'use strict';

angular.module('myApp.view2', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/view2', {
            templateUrl: 'view2/view2.html',
            controller: 'View2Ctrl'
        });
    }])

	.controller('View2Ctrl', ['$scope', '$location', 'authenticatedUserService', 'authenticationService', 'serverCallService', 'Facebook', 
		function($scope, $location, authenticatedUserService, authenticationService, serverCallService, Facebook) {

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


            $scope.login = function() {
				// From now on you can use the Facebook service just as Facebook api says
				Facebook.login(function(response) {
					console.log('Login done.');
					console.log(response);

					serverCallService.makePost("rest/link/facebook?token=" + response.authResponse.accessToken, {}, facebookLinkingSuccess, facebookLinkingFail);
				});
		    };

		    $scope.getLoginStatus = function() {
				Facebook.getLoginStatus(function(response) {
					if(response.status === 'connected') {
						$scope.loggedIn = true;
						console.log('connected');
					} else {
						$scope.loggedIn = false;
						console.log('not connected');
					}
				});
		    };

		    $scope.me = function() {
				Facebook.api('/me', function(response) {
					$scope.user = response;
					console.log('user');
				});
		    };

		    function facebookLinkingSuccess(data) {
                if (data === undefined) {
                    console.log('No data returned when linking facebook account.');
                } else {
                	authenticatedUserService.setAuthenticatedUser(data);
                    $scope.user = data.user;
                    console.log('Facebook linked.')
                }
            }

            function facebookLinkingFail() {
                console.log('Facebook linking failed.');
            }

	}]);