/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.pages.history.tables', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('history.tables', {
          cache: false,
          url: '/tables',
          templateUrl: 'app/pages/history/tables/tables.html',
          title: '表列',
          sidebarMeta: {
            order: 10,
          },
        });
  }

})();
