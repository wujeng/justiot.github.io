/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.pages.monitor')
      .controller('controllerlistCtrl', controllerlistCtrl);

  /** @ngInject */
  function controllerlistCtrl($scope, FireFactory) {
//    console.log('controllerboard');
    $scope.datapoints=FireFactory.datapoints();
    $scope.hasOutput=function() {
      for(var i=0;i<$scope.datapoints.length;i++) {
        var dp=$scope.datapoints[i];
        if(dp.dptype==1 || dp.dptype==3) return true;
      }
      return false;
    };
    $scope.hasDigital=function() {
      for(var i=0;i<$scope.datapoints.length;i++) {
        var dp=$scope.datapoints[i];
        if(dp.dptype==0 || dp.dptype==1) return true;
      }
      return false;
    };
    $scope.hasAnalog=function() {
      for(var i=0;i<$scope.datapoints.length;i++) {
        var dp=$scope.datapoints[i];
        if(dp.dptype==2 || dp.dptype==3) return true;
      }
      return false;
    };
  }
})();
