/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('JustIOT.theme.components')
      .directive('pageTop', pageTop);

  /** @ngInject */
  function pageTop() {
    return {
      restrict: 'E',
      controller: 'pageTopCtrl',
      templateUrl: 'app/theme/components/pageTop/pageTop.html'
    };
  }

})();
