/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.pages.layout')
      .directive('layoutTab', layouttab);

  /** @ngInject */
  function layouttab() {
    return {
      restrict: 'E',
      controller: 'layouttabCtrl',
      scope: {
         layout: '='
      },
      templateUrl: 'app/pages/layout/layouttab/layouttab.html'
    };
  }
})();
