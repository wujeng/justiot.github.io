/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.pages.layout', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
    .state('layout', {
      cache: false,
      url: '/layout',
      templateUrl: 'app/pages/layout/layout.html',
      title: '圖控',
      sidebarMeta: {
        icon: 'ion-android-laptop',
        order: 50,
      },
    });
  }

})();
