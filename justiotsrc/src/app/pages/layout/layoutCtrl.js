/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.pages.layout')
    .controller('layoutCtrl', layoutCtrl);

  /** @ngInject */
  function layoutCtrl($scope, FireFactory, $rootScope, toastr, $uibModal) {
    $rootScope.$baSidebarService.setMenuCollapsed(true);

    $rootScope.common.state = 'layout';
    if(!$rootScope.common.layoutindex) $rootScope.common.layoutindex=0;
    $scope.common=$rootScope.common;

    if(!$rootScope.common.layouts) return;
    $scope.layout=$rootScope.common.layouts[$rootScope.common.layoutindex];
    $scope.actives = [
      {id: true, text: '啟用'},
      {id: false, text: '禁用'}
    ];

     $scope.showActive=function(a) {
       if(a) return '啟用';
       else return '禁用';
     };
    $scope.showUser=function(uid) {
      return FireFactory.userMap()[uid].name;
    }
    $scope.addLayout=function() {
  //console.log('addLayout');
        $scope.inserted = {
          title:  '圖控'+$scope.common.layouts.length,
          userid: $rootScope.common.targetUser.uid,
          active:   true,
          createdAt: new Date().getTime(),
          tosave: true
        };
        $scope.common.layouts.push($scope.inserted);
  //console.log($scope.common);
    };
    $scope.canEdit=function() {
      return true;
    };
    $scope.saveLayout = function(index) {
      var obj=$rootScope.common.layouts[index];

      if(obj.tosave) {delete obj.tosave; FireFactory.addLayout(obj, function() {$scope.common.layouts.push(obj);});}
      else FireFactory.updateLayout(obj, function() {});
    }

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

    $scope.removeLayout = function(index) {

       var mod=$scope.showModal('刪除圖控頁面','刪除圖控頁面,同時也刪除其圖檔!');
       mod.result.then(function (result) {
             FireFactory.deleteLayout($scope.common.layouts[index].id, function() {
               $scope.common.layouts.splice(index,1);
             });
          }, function (reason) {
    //          console.log('reason');//點擊空白區域，總會輸出backdrop click，點擊取消，則會暑促cancel

          });
    }
  }
})();
