/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('JustIOT.theme.components')
      .controller('MsgCenterCtrl', MsgCenterCtrl);

  /** @ngInject */
  function MsgCenterCtrl($scope, FireFactory, $rootScope, $sce, $timeout) {
$scope.common=$rootScope.common;

$scope.fullscreen=function() {
  console.log('fullscreen');
  $rootScope.$fullscreen=true;
};

$scope.setLayoutCommand=function(command) {
  $rootScope.common.layoutcommand=command;
  $rootScope.goto('layout');
};
$scope.setLayoutindex=function(index) {
  $rootScope.common.layoutcommand='none';
  $rootScope.common.layoutindex=index;
  $rootScope.goto('layout');
};

    $rootScope.logout=function() {
      FireFactory.logout(function() {});
    };
    $rootScope.login=function() {
      $rootScope.goto('login');
    };
    $rootScope.profile=function() {
      console.log('go login');
$rootScope.goto('login');
$rootScope.activateLoginTab('profile');



    };
    $rootScope.setUser=function(id){
        FireFactory.loadTarget(id, true);
      };
/*
      var firstUser=function() {
        for(var i=0;i<$rootScope.common.users.length;i++) {
          var u=$rootScope.common.users[i];
          if(u.role==1 || u.role==2) return u;
        }
        return null;
      };
*/
    $rootScope.setCompany=function(companyid) {
  //console.log('setCompany');
      FireFactory.setCompany(companyid);
      var u=FireFactory.firstCompanyCustomer(companyid);
      if(u!=null) {
        FireFactory.loadTarget(u.uid, true);
      }
    }
  }
})();
