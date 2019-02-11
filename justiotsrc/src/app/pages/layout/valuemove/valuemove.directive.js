/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.pages.layout')
      .directive('valuemove', valuemove);

  /** @ngInject */
  function valuemove() {
    return {
      restrict: 'E',
      controller: 'valuemoveCtrl',
      scope: {
         layoutlabel: '='
      },
      templateUrl: 'app/pages/layout/valuemove/valuemove.html'
    };
  }
})();
