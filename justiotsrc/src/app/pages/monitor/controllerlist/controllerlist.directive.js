/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.pages.monitor')
      .directive('controllerList', controllerlist);

  /** @ngInject */
  function controllerlist() {
    return {
      restrict: 'E',
      controller: 'controllerlistCtrl',
      scope: {
         controller: '='
      },
      templateUrl: 'app/pages/monitor/controllerlist/controllerlist.html'
    };
  }
})();
