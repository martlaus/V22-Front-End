'use strict';

angular.module('myApp.services', [
	'myApp.services.alertService',
    'myApp.services.authenticatedUserService',
    'myApp.services.serverCallService',
    'myApp.services.authenticationService'
])

    .value('services', '0.1');
