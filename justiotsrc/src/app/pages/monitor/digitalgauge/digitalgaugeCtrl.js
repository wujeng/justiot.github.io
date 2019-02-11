/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.pages.monitor')
      .controller('digitalgaugeCtrl', digitalgaugeCtrl);

  /** @ngInject */
  function digitalgaugeCtrl($scope) {
    if($scope.datapoint.value==undefined || $scope.datapoint.value==null) $scope.datapoint.value=0;

    if($scope.datapoint.dptype==0) {
      $scope.datapoint.imageon='assets/img/app/dio/switch-on.png';
      $scope.datapoint.imageoff='assets/img/app/dio/switch-off.png';
    } else if($scope.datapoint.dptype==1) {
      $scope.datapoint.imageon='assets/img/app/dio/led-lamp-red-on.png';
      $scope.datapoint.imageoff='assets/img/app/dio/led-lamp-red-off.png';
    }
  }
})();
