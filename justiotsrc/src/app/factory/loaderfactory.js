/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.factory')
    .factory('LoaderFactory', loaderfactory);

  var modal=null;
  /** @ngInject */
  function loaderfactory($uibModal, toastr) {
    var LOADERAPI = {

        showLoading: function(text) {
            text = text || '載入中...';
            modal=$uibModal.open({
              animation: true,
              template: '<div class="modal-content"> \
                  <div class="modal-header bg-success"> \
                    <i class="ion-checkmark modal-icon"></i><span> 網路傳輸</span> \
                  </div> \
                  <div class="modal-body text-center">'+text+'</div> \
                  <div class="modal-footer"> \
                    <button type="button" class="btn btn-success" ng-click="$dismiss()">OK</button> \
                  </div> \
                </div>'
    //      templateUrl:     'app/factory/successModal.html'//,
        //      size: size,
      //        resolve: {
      //          items: function () {
      //            return $scope.items;
      //          }
      //        }
            });
        },

        hideLoading: function() {
            if(modal!=null) modal.dismiss();
        },

        toggleLoadingWithMessage: function(text) {
            toastr.error(text, '錯誤');
        }

    };
    return LOADERAPI;
 }

})();
