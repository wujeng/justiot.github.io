/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.pages.monitor')
      .directive('digitalGauge', digitalgauge);

  /** @ngInject */
  function digitalgauge() {
    return {
      restrict: 'E',
      controller: 'digitalgaugeCtrl',
      scope: {
         datapoint: '='
      },
      templateUrl: 'app/pages/monitor/digitalgauge/digitalgauge.html'
    };
  }
})();
