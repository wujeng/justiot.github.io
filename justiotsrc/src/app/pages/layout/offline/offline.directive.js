/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.pages.layout')
      .directive('offline', offline);

  /** @ngInject */
  function offline() {
    return {
      restrict: 'E',
      controller: 'offlineCtrl',
      scope: {
         controller: '='
      },
      templateUrl: 'app/pages/layout/offline/offline.html'
    };
  }
})();
