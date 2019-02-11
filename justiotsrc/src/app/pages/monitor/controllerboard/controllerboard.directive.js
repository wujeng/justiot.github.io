/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.pages.monitor')
      .directive('controllerBoard', controllerboard);

  /** @ngInject */
  function controllerboard() {
    return {
      restrict: 'E',
      controller: 'controllerboardCtrl',
      scope: {
         controller: '='
      },
      templateUrl: 'app/pages/monitor/controllerboard/controllerboard.html'
    };
  }
})();
