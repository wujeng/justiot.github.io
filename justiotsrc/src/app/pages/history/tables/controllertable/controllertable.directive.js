/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.pages.history.tables')
      .directive('controllerTable', controllertable);

  /** @ngInject */
  function controllertable() {
    return {
      restrict: 'E',
      controller: 'controllertableCtrl',
      scope: {
         controller: '='
      },
      templateUrl: 'app/pages/history/tables/controllertable/controllertable.html'
    };
  }
})();
