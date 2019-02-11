/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.pages.monitor')
      .directive('remoteDrive', remotedrive);

  /** @ngInject */
  function remotedrive() {
    return {
      restrict: 'E',
      controller: 'remotedriveCtrl',
      scope: {
         datapoint: '='
      },
      templateUrl: 'app/pages/monitor/remotedrive/remotedrive.html'
    };
  }
})();
