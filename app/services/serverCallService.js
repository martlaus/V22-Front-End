'use strict';

angular.module('myApp.services.serverCallService', []).

    factory('serverCallService', ["services", "$http", "$location", "authenticatedUserService",
        function (services, $http, $location, authenticatedUserService) {

            return {
                makePost: function (url, data, successCallback, errorCallback) {
                    var headers = {};
                    var user = authenticatedUserService.getUser();

                    if (authenticatedUserService.isAuthenticated()) {
                        headers.Authentication = authenticatedUserService.getToken();
                        headers.Username = user.username;
                    }

                    $http({
                        method: 'POST',
                        url: url,
                        data: data,
                        headers: headers
                    }).
                        success(function (data) {
                            successCallback(data);
                        }).
                        error(function (data, status, headers, config) {
                            if (status == '419') {
                                authenticatedUserService.removeAuthenticatedUser();
                                instance.makePost(url, data, successCallback, errorCallback);
                            } else {
                                errorCallback(data, status);
                            }
                        });
                },

                makeGet: function (url, params, successCallback, errorCallback, finallyCallback) {
                    var headers = {};
                    var user = authenticatedUserService.getUser();

                    if (authenticatedUserService.isAuthenticated()) {
                        headers.Authentication = authenticatedUserService.getToken();
                        headers.Username = user.username;
                    }

                    $http({
                        method: 'GET',
                        url: url,
                        params: params,
                        headers: headers
                    }).
                        success(function (data) {
                            successCallback(data);
                        }).
                        error(function (data, status, headers, config) {
                            if (status == '419') {
                                authenticatedUserService.removeAuthenticatedUser();
                                instance.makeGet(url, params, successCallback, errorCallback);
                            } else {
                                errorCallback(data, status);
                            }
                        }).finally(finallyCallback);
                },

                makeJsonp: function (url, params, successCallback, errorCallback) {
                    var headers = {};

                    $http({
                        method: 'JSONP',
                        url: url,
                        params: params,
                        headers: headers
                    }).
                        success(function (data) {
                            successCallback(data);
                        }).
                        error(function (data, status, headers, config) {
                            errorCallback(data, status);
                        });
                }
            };

        }]);
