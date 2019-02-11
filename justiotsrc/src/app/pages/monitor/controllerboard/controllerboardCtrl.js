/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.pages.monitor')
      .controller('controllerboardCtrl', controllerboardCtrl);

  /** @ngInject */
  function controllerboardCtrl($scope, FireFactory, $rootScope) {
    $scope.common=$rootScope.common;
    $scope.hasOutput=function() {
      for(var i=0;i<$scope.common.datapoints.length;i++) {
        var dp=$scope.common.datapoints[i];
        if(dp.dptype==1 || dp.dptype==3) return true;
      }
      return false;
    };
    $scope.hasDigital=function() {
      for(var i=0;i<$scope.common.datapoints.length;i++) {
        var dp=$scope.common.datapoints[i];
        if(dp.dptype==0 || dp.dptype==1) return true;
      }
      return false;
    };
    $scope.hasAnalog=function() {
      for(var i=0;i<$scope.common.datapoints.length;i++) {
        var dp=$scope.common.datapoints[i];
        if(dp.dptype==2 || dp.dptype==3) return true;
      }
      return false;
    };
  }
})();
