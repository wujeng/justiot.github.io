/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.pages.history.charts')
    .controller('tablesCtrl', tablesCtrl);

  /** @ngInject */
  function tablesCtrl($scope, FireFactory, $rootScope) {
    $scope.controllers=FireFactory.controllers();
    $rootScope.common.state = 'history';
  }
})();