'use strict';

angular.module('myApp.view1', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view1', {
            templateUrl: 'view1/view1.html',
            controller: 'View1Ctrl'
        });
    }])

    .controller('View1Ctrl', ['$scope', 'serverCallService', '$route', '$rootScope', '$location', 'authenticatedUserService', 'authenticationService', 'Facebook', 
        function ($scope, serverCallService, $route, $rootScope, $location, authenticatedUserService, authenticationService, Facebook) {

            $scope.mobileId = {};
            $scope.validation = {
                error: {}
            };
            $scope.mobileIdChallenge = false;

            $scope.googleClientID = authenticationService.getGoogleClientID();

            $scope.$on('event:google-plus-signin-success', function (event,authResult) {
                console.log('Google sign-in successful. ');
                authenticationService.loginWithGoogle(authResult.id_token);
            });

            $scope.$on('event:google-plus-signin-failure', function (event,authResult) {
                console.log('Google sign-in failed or sign-out detected. ');
            });

            $scope.idCardAuth = function() {
                authenticationService.loginWithIdCard();
            };


            $scope.mobileIdAuth = function() {
                var idCodeValid = validateIdCode();
                var phoneNumberValid = validatePhoneNumber();

                if (idCodeValid && phoneNumberValid) {
                    authenticationService.loginWithMobileId($scope.mobileId.phoneNumber, $scope.mobileId.idCode,
                    mobileIdSuccess, mobileIdFail, mobileIdReceiveChallenge);
                }
            };

            function mobileIdSuccess() {
                $scope.mobileIdChallenge = null;
                $scope.mobileId.idCode = null;
                $scope.mobileId.phoneNumber = null;
            }

            function mobileIdFail() {
                $scope.mobileIdChallenge = null;
            }

            function mobileIdReceiveChallenge(challenge) {
                $scope.mobileIdChallenge = challenge;
            }

            function validateIdCode() {
                $scope.validation.error.idCode = null;

                var isValid = false;

                if (isEmpty($scope.mobileId.idCode)) {
                    $scope.validation.error.idCode = "required";
                } else {
                    isValid = isIdCodeValid($scope.mobileId.idCode);

                    if (!isValid) {
                        $scope.validation.error.idCode = "invalid";
                    }
                }

                return isValid;
            }

            function validatePhoneNumber() {
                $scope.validation.error.phoneNumber = null;

                var isValid = false;

                if (isEmpty($scope.mobileId.phoneNumber)) {
                    $scope.validation.error.phoneNumber = "required";
                } else {
                    isValid = isPhoneNumberEstonian($scope.mobileId.phoneNumber);

                    if (!isValid) {
                        $scope.validation.error.phoneNumber = "notEstonian";
                    }
                }

                return isValid;
            }

            function isPhoneNumberEstonian(phoneNumber) {
                return !phoneNumber.startsWith("+") || phoneNumber.startsWith("+372");
            }

            function isIdCodeValid(idCode) {
                if (!idCode || idCode.length !== 11) {
                    return false;
                }

                var controlCode;

                var firstWeights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1];
                var secondWeights = [3, 4, 5, 6, 7, 8, 9, 1, 2, 3];

                var firstSum = 0;
                for (var i = 0; i < 10; i++) {
                    firstSum += idCode.charAt(i) * firstWeights[i];
                }

                if (firstSum % 11 !== 10) {
                    controlCode = firstSum % 11;
                } else {
                    // Calculate second sum using second set of weights
                    var secondSum = 0;
                    for (i = 0; i < 10; i++) {
                        secondSum += idCode.charAt(i) * secondWeights[i];
                    }

                    if (secondSum % 11 !== 10) {
                        controlCode = secondSum % 11;
                    } else {
                        controlCode = 0;
                    }
                }

                if (idCode[10] == controlCode) {
                    return true;
                } else {
                    return false;
                }
            }

            function isEmpty(str) {
                if (!str || str === undefined) {
                    return true;
                }
                
                if (typeof str != 'String') {
                    return false;
                }
                
                return str.trim().length === 0;
            }


            $scope.facebookAuth = function() {
                // From now on you can use the Facebook service just as Facebook api says
                Facebook.login(function(response) {
                    console.log('Login done.');
                    console.log(response);

                    authenticationService.loginWithFacebook(response.authResponse.accessToken);
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

        }]);