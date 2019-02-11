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
      "email": "guest@nfu.edu.tw",
      "password": "miketommy"
  })
.constant("myServer", {
      "host": "120.113.76.84",
      "port": 3000
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
