/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.factory')
    .factory('AuthFactory', authfactory);

  /** @ngInject */
  function authfactory(LSFactory) {
    var userKey = 'user';

        var AuthAPI = {

            getUser: function() {
               var u=LSFactory.get(userKey);
  //  console.log('LSFactory.get:'+u);
                return u;
            },

            setUser: function(user) {
                var u= LSFactory.set(userKey, user);
  //  console.log('AuthFactory.setUser:'+user.email);
                return u;
            },

            clear: function() {
                LSFactory.delete(userKey);
            }

        };

        return AuthAPI;
 }

})();
