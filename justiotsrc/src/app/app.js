'use strict';

angular.module('JustIOT', [
  'ngAnimate',
  'ui.bootstrap',
  'ui.sortable',
  'ui.router',
  'ngTouch',
  'toastr',
  'smart-table',
  "xeditable",
  'ui.slimscroll',
  'ngJsTree',
  'angular-progress-button-styles',

  'JustIOT.theme',
  'JustIOT.pages',
  'firebase',
  'JustIOT.factory'
])
.filter('reverse', function() {
  return function(items) {
    if(!items) return items;
    return items.slice().reverse();
  };
})
.constant("GUEST", {
      "email": "xxxxxxxxx",
      "password": "xxxxxxxxxxx"
  })
.constant("myServer", {
      "host": "xxx.xxx.xxx.xxx",
      "port": xxxx
  })
.config(appConfig);

  var translations = {
    Start: 'Start',
    HEADLINE: 'What an awesome module!',
    PARAGRAPH: 'Srsly!',
    NAMESPACE: {
      PARAGRAPH: 'And it comes with awesome features!'
    }
  };

  /** @ngInject */
  function appConfig() {

  }
