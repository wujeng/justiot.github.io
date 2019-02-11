/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.pages.layout')
      .directive('datatimemove', datatimemove);

  /** @ngInject */
  function datatimemove() {
    return {
      restrict: 'E',
      controller: 'datatimemoveCtrl',
      scope: {
         layout: '='
      },
      templateUrl: 'app/pages/layout/datatimemove/datatimemove.html'
    };
  }
})();
