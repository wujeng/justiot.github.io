/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.pages.history.charts')
      .directive('controllerChart', controllerchart);

  /** @ngInject */
  function controllerchart() {
    return {
      restrict: 'E',
      controller: 'controllerchartCtrl',
      scope: {
         controller: '='
      },
      templateUrl: 'app/pages/history/charts/controllerchart/controllerchart.html'
    };
  }
})();
