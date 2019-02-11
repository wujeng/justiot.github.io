/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.pages.history', [
      'JustIOT.pages.history.charts',
      'JustIOT.pages.history.tables'

  ])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('history', {
          cache: false,
          url: '/history',
          abstract: true,
          template: '<div ui-view  autoscroll="true" autoscroll-body-top></div>',
          title: '歷史資料',
          sidebarMeta: {
            icon: 'ion-stats-bars',
            order: 400,
          },
        });
  }

})();
