/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.pages.iottables', ['ngAnimate', 'ngSanitize', 'mgcrea.ngStrap'])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('iottables', {
          cache: false,
          url: '/iottables',
          templateUrl: 'app/pages/iottables/iottables.html',
          title: '資料設定',
          sidebarMeta: {
            icon: 'ion-grid',
            order: 300,
          },
        });
  }

})();
