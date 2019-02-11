/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.factory')
    .factory('LSFactory', lsfactory);

  /** @ngInject */
  function lsfactory() {
    var LSAPI = {

        clear: function() {
            return localStorage.clear();
        },

        get: function(key) {
    //  console.log('LSFactory get:'+key);  //  angular.fromJson
  //          var item=localStorage.getItem(key);
  //  console.log(localStorage.getItem(key));
  //          if(item==null || item == undefined) return null;
            var item;
            try{
               item=localStorage.getItem("username");
            }catch(e){
               return null;
            }
            return JSON.parse(item);
  //          return angular.fromJson(localStorage.getItem(key));
        },

        set: function(key, data) {
  //  console.log('set:'+key+' '+JSON.stringify(data));
            return localStorage.setItem(key, JSON.stringify(data || null));
        },

        delete: function(key) {
            return localStorage.removeItem(key);
        }
    };

    return LSAPI;
 }

})();
