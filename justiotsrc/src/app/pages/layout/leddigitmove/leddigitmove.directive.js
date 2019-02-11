/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.pages.layout')
      .directive('leddigitmove', leddigitmove);

  /** @ngInject */
  function leddigitmove() {
    return {
      restrict: 'E',
      controller: 'leddigitmoveCtrl',
      scope: {
         layoutlabel: '='
      },
      templateUrl: 'app/pages/layout/leddigitmove/leddigitmove.html'
    };
  }
})();
