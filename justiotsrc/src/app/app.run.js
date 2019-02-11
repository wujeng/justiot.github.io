/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT')
    .run(appRun);

  /** @ngInject */
  function appRun($firebaseAuth, $rootScope, AuthFactory, FireFactory, $state, $timeout, GUEST) {

    var config = {
      apiKey: "",
      authDomain: "",
      databaseURL: "",
      projectId: "",
      storageBucket: "",
      messagingSenderId: ""
    };
    firebase.initializeApp(config);

$rootScope.goto=function (state) {$state.go(state, {} , { reload: true });};
$rootScope.common.openToPublic=false;

    if (typeof FCMPlugin != 'undefined') {
            FCMPlugin.getToken(function(token){
               alert(token);
             }, function(err){
               console.log('error retrieving token: ' + err);
             });

                   FCMPlugin.onNotification(function(data){
                     if(data.wasTapped){
                 //Notification was received on device tray and tapped by the user.
                       alert( JSON.stringify(data) );
                     }else{
                 //Notification was received in foreground. Maybe the user needs to be notified.
                       alert( JSON.stringify(data) );
                    }
                   },function(msg){
                      console.log('onNotification callback successfully registered: ' + msg);
                   },function(err){
                      console.log('Error registering onNotification callback: ' + err);
                   });
    }
$rootScope.common.layoutcommand='none';

    $rootScope.common.$state = $state;
    $rootScope.common.loginactive = {login: true};
    $rootScope.common.iottablesactive = {datapoint: true};
    $rootScope.activateLoginTab = function(tab) {
       $rootScope.common.loginactive = {}; //reset
       $rootScope.common.loginactive[tab] = true;
     };
     $rootScope.activateIOTTablesTab = function(tab) {
        $rootScope.common.iottablesactive = {}; //reset
        $rootScope.common.iottablesactive[tab] = true;
      };

      $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
        $rootScope.common.from=from.name;
       });

      var user=AuthFactory.getUser();
      if(user) FireFactory.login(user);
      else if($rootScope.common.openToPublic) FireFactory.login(GUEST);
      else $rootScope.goto('login');

      $rootScope.getNumber = function(num) {
            return new Array(num);
        };

  }

})();
