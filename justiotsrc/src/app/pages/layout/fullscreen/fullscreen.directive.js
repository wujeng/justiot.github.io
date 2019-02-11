/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.pages.layout')
      .directive('fullscreen', fullscreen);

  /** @ngInject */
  function fullscreen() {
    return {
      restrict: 'E',
      controller: 'fullscreenCtrl',
      scope: {
         layout: '='
      },
      templateUrl: 'app/pages/layout/fullscreen/fullscreen.html'
    };
  }
})();
