angular.module('myApp.facebook', ['facebook'])

  .config(function(FacebookProvider) {
     var myAppId = '936721186364464';
     
     // You can set appId with setApp method
     // FacebookProvider.setAppId('myAppId');
     
     /**
      * After setting appId you need to initialize the module.
      * You can pass the appId on the init method as a shortcut too.
      */
     FacebookProvider.init(myAppId);
  });
