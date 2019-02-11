(function () {
  'use strict';

  angular.module('JustIOT.pages', [
    'ui.router',

    'JustIOT.pages.login',
    'JustIOT.pages.iottables',
    'JustIOT.pages.monitor',
    'JustIOT.pages.history',
    'JustIOT.pages.layout'
  ])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($urlRouterProvider, baSidebarServiceProvider) {
    $urlRouterProvider.otherwise('/login');
  }

})();
