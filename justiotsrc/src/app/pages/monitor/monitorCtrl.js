/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.pages.monitor')
    .controller('monitorCtrl', monitorCtrl);

  /** @ngInject */
  function monitorCtrl($scope, FireFactory, $rootScope) {
    $rootScope.common.state = 'monitor';
     FireFactory.setScopeData($scope);
  }
})();
