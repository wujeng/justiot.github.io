/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.pages.login', [])
      .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
        .state('login', {
          cache: false,
          url: '/login',
          templateUrl: 'app/pages/login/login.html',
          title: '登入/註冊',
          sidebarMeta: {
            icon: 'ion-lock-combination',
            order: 200,
          },
        });
  }

})();
