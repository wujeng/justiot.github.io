/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.pages.monitor')
      .controller('remotedriveCtrl', remotedriveCtrl);

  /** @ngInject */
  function remotedriveCtrl($scope, $uibModal, FireFactory) {
    $scope.showModal=function(head, text, size) {
      var mod=$uibModal.open({
        animation: true,
        template: '<div class="modal-content">\
                   <div class="modal-header bg-info">\
                     <i class="ion-information-circled modal-icon"></i><span> '+head+'</span>\
                   </div>\
                   <div class="modal-body text-center">'+text+'</div>\
                   <div class="modal-footer">\
                   <button type="button" class="btn btn-info" ng-click="$close()">確定</button>\
                   <button type="button" class="btn btn-info" ng-click="$dismiss()">取消</button>\
                   </div>\
                   </div>',
        size: size
      });
      return mod;
    };
    $scope.showErrorModal=function(head, text, size) {
      var mod=$uibModal.open({
        animation: true,
        template: '<div class="modal-content">\
                   <div class="modal-header bg-info">\
                     <i class="ion-android-warning modal-icon"></i><span> '+head+'</span>\
                   </div>\
                   <div class="modal-body text-center">'+text+'</div>\
                   <div class="modal-footer">\
                   <button type="button" class="btn btn-info" ng-click="$close()">確定</button>\
                   </div>\
                   </div>',
        size: size
      });
      return mod;
    };

    $scope.drive=function() {
      if($scope.datapoint.newvalue==null) {
        $scope.showErrorModal('錯誤','請設定數值,數位驅動為0或1.');
        return;
      }
      if($scope.datapoint.newvalue==$scope.datapoint.value) {
        $scope.showErrorModal('錯誤','設定值等於目前輸出值.');
        return;
      }
      var str='ON';
      var mod=null;
      if($scope.datapoint.dptype==0 || $scope.datapoint.dptype==1) {
        if($scope.datapoint.newvalue!='1') str='OFF';
        mod=$scope.showModal('驅動控制器','驅動控制器資料點('+$scope.datapoint.title+')為'+str+'!');
      } else {
        mod=$scope.showModal('驅動控制器','驅動控制器資料點('+$scope.datapoint.title+')為'+$scope.datapoint.newvalue+'!');
      }
      mod.result.then(function (result) {
            var rc={command: 'set '+$scope.datapoint.order+' '+$scope.datapoint.newvalue,
                    controllerid: $scope.datapoint.controllerid,
                    emituserid:   FireFactory.user().uid,
                    executedAt: null,
                    createdAt:   new Date().getTime()};
            FireFactory.setRemotecommand(rc, function() {
            });

         }, function (reason) {
             console.log('reason');

         });
    }
  }
})();
