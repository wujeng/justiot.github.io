/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.pages.history.tables')
      .directive('datapointTable', datapointtable);

  /** @ngInject */
  function datapointtable() {

    return {
      restrict: 'E',
      controller: 'datapointtableCtrl',
      scope: {
         datapoint: '='
      },
      templateUrl: 'app/pages/history/tables/datapointtable/datapointtable.html'
    };

  }
})();
