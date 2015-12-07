'use strict';

angular.module('myApp.services.authenticationService', []).
    factory('authenticationService',['$location', '$rootScope', 'serverCallService', 'authenticatedUserService', 'alertService',
        function($location, $rootScope, serverCallService, authenticatedUserService, alertService) {

            var LOGIN_ORIGIN = "loginOrigin"; 
            var GOOGLE_CLIENT_ID = '609780541620-0d2pkdl0gg8pkv98l76ei2tkh92kd1rp.apps.googleusercontent.com';

            var instance;
            var isAuthenticationInProgress;
            var isOAuthAuthentication = false;

            var mobileIdLoginSuccessCallback;
            var mobileIdLoginFailCallback;
            var mobileIdChallengeReceivedCallback;

            function loginSuccess(authenticatedUser) {
                if (isEmpty(authenticatedUser)) {
                	loginFail();
                } else {
                    authenticatedUserService.setAuthenticatedUser(authenticatedUser);

                    // if (authenticatedUser.firstLogin) {
                    //     $location.url('/' + authenticatedUser.user.username);
                    // } else if (isOAuthAuthentication) {
                    // 	var url = localStorage.getItem(LOGIN_ORIGIN);
                    // 	$location.url(url);
                    // }

                    // overriding redirect for now
                    $location.url('/view2');

                    enableLogin();
                    localStorage.removeItem(LOGIN_ORIGIN);
                    isOAuthAuthentication = false;

                    if (mobileIdLoginSuccessCallback) {
                        mobileIdLoginSuccessCallback();
                    }
                }
            }

            function loginFail() {
                console.log('Logging in failed.');
                alertService.setErrorAlert('ERROR_LOGIN_FAILED');
                enableLogin();
                
                if (isOAuthAuthentication) {
                	localStorage.removeItem(LOGIN_ORIGIN);
                	$location.url('/');
                }
                
                isOAuthAuthentication = false

                if (mobileIdLoginFailCallback) {
                    mobileIdLoginFailCallback();
                }
            }

            function logoutSuccess(data) {
            	authenticatedUserService.removeAuthenticatedUser();
                enableLogin();
            }

            function logoutFail(data, status) {
                //ignore
            }

            function disableLogin() {
                isAuthenticationInProgress = true;
            }

            function enableLogin() {
                isAuthenticationInProgress = false;
            }

            function loginWithMobileIdSuccess(mobileIDSecurityCodes) {
                if (isEmpty(mobileIDSecurityCodes)) {
                    loginFail();
                } else {
                    mobileIdChallengeReceivedCallback(mobileIDSecurityCodes.challengeId);
                
                    var params = {
                        'token': mobileIDSecurityCodes.token
                    };
                
                    serverCallService.makeGet("rest/login/mobileId/isValid", params, loginSuccess, loginFail);
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

            return {

                getGoogleClientID : function() {
                    return GOOGLE_CLIENT_ID;
                },

                logout : function() {              
                    serverCallService.makePost("rest/logout", {}, logoutSuccess, logoutFail);
                },

                loginWithIdCard : function() {
                    if (isAuthenticationInProgress) {
                        return;
                    }
                
                    disableLogin();
                    serverCallService.makeGet("rest/login/idCard", {}, loginSuccess, loginFail);
                }, 

                loginWithTaat : function() {
                    localStorage.removeItem(LOGIN_ORIGIN);
                    localStorage.setItem(LOGIN_ORIGIN, $location.url());
                    window.location = "/rest/login/taat";
                },
                
                authenticateUsingOAuth : function(token) {
                	var params = {
                            'token': token
                    };
                	
                	serverCallService.makeGet("rest/login/getAuthenticatedUser", params, loginSuccess, loginFail);
                	isOAuthAuthentication = true;
                },

                loginWithMobileId : function(phoneNumber, idCode, successCallback, failCallback, challengeReceivedCallback) {
                    if (isAuthenticationInProgress) {
                        return;
                    }

                    mobileIdLoginSuccessCallback = successCallback;
                    mobileIdLoginFailCallback = failCallback;
                    mobileIdChallengeReceivedCallback = challengeReceivedCallback;

                    var params = {
                        'phoneNumber': phoneNumber,
                        'idCode': idCode
                    };
                
                    disableLogin();
                    serverCallService.makeGet("rest/login/mobileId", params, loginWithMobileIdSuccess, loginFail);
                },

                loginWithGoogle : function(token) {
                    var params = {
                        "token": token
                    }
                    serverCallService.makeGet("rest/login/google", params, loginSuccess, loginFail);
                }

            };
        }]);

