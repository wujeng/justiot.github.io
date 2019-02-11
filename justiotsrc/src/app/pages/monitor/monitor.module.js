/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.pages.monitor', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
    .state('monitor', {
      cache: false,
      url: '/monitor',
      templateUrl: 'app/pages/monitor/monitor.html',
      title: '監控',
      sidebarMeta: {
        icon: 'ion-android-home',
        order: 100,
      },
    });
  }

})();
