/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.pages.iottables')
      .directive('iotRules', iotrules);

  /** @ngInject */
  function iotrules() {
    return {
      restrict: 'E',
      controller: 'iotrulesCtrl',
      scope: {
         rule: '='
      },
      templateUrl: 'app/pages/iottables/iotrules/iotrules.html'
    };
  }
})();
