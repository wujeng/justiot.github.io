/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.pages.monitor')
      .directive('analogGauge', analoggauge);

  /** @ngInject */
  function analoggauge() {
    return {
      restrict: 'E',
      controller: 'analoggaugeCtrl',
      scope: {
         datapoint: '='
      },
      templateUrl: 'app/pages/monitor/analoggauge/analoggauge.html'
    };
  }
})();
