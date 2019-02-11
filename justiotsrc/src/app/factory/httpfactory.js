/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.factory')
    .factory('httpFactory', httpfactory);

  /** @ngInject */
  function httpfactory($http, myServer) {
    var API = {
            deleteUser: function(userid, duid) {
                return $http.delete('http://'+myServer.host+':'+myServer.port+ '/'+userid+'/user/'+duid);
            },

            addUser: function(userid, user) {
                return $http.post('http://'+myServer.host+':'+myServer.port+ '/'+userid+'/user/', user);
            },

            updateUser: function(userid, user) {
                return $http.put('http://'+myServer.host+':'+myServer.port+ '/'+userid+'/user/'+user.uid, user);
            },

            deleteCompany: function(userid, companyid) {
                return $http.delete('http://'+myServer.host+':'+myServer.port+ '/'+userid+'/company/'+companyid);
            }
        };

        return API;
 }

})();
