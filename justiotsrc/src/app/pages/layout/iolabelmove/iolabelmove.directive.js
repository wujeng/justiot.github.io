/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.pages.layout')
      .directive('iolabelmove', iolabelmove);

  /** @ngInject */
  function iolabelmove() {
    return {
      restrict: 'E',
      controller: 'iolabelmoveCtrl',
      scope: {
         layoutlabel: '='
      },
      templateUrl: 'app/pages/layout/iolabelmove/iolabelmove.html'
    };
  }
})();
