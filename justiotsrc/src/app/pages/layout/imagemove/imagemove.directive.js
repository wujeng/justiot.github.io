/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.pages.layout')
      .directive('imageMove', imagemove);

  /** @ngInject */
  function imagemove() {
    return {
      restrict: 'E',
      controller: 'imagemoveCtrl',
      scope: {
         layoutimage: '='
      },
      templateUrl: 'app/pages/layout/imagemove/imagemove.html'
    };
  }
})();
