/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.pages.login')
    .controller('loginCtrl', loginCtrl);

  /** @ngInject */
  function loginCtrl($scope, LoaderFactory, FireFactory, GUEST, $rootScope, AuthFactory) {
    $rootScope.common.state = 'login';
    $scope.common=$rootScope.common;
    $scope.tabSelected=function(type){
      var ind=0;
      if(type=='login') ind=0;
      else if(type=='register') ind=1;
      else if(type=='password') ind=2;
      else if(type=='profile') ind=3;
      else if(type=='logout') ind=4;
      else return;
          $rootScope.common.loginActiveTab=ind;
        };
    $scope.tabSelected=function(type) {
    }

    $scope.logined=FireFactory.isAuthenticated();
    $scope.user = {};
    $scope.user.email='';
    $scope.user.password='';
    var saveduser=AuthFactory.getUser();
    if(saveduser) {
      $scope.user.email=saveduser.email;
      $scope.user.password=saveduser.password;
    }
 if(FireFactory.user()) {
    $scope.profile={
      name: FireFactory.user().name,
      email: FireFactory.user().email,
      password: FireFactory.user().password,
      uid: FireFactory.user().uid,
      role: FireFactory.user().role,
      active: FireFactory.user().active,
      createdAt: FireFactory.user().createdAt
    };

    if(FireFactory.user().hasOwnProperty('companyid'))  $scope.profile.companyid=FireFactory.user().companyid;
    if(FireFactory.user().hasOwnProperty('ownedCompanyid'))  $scope.profile.companyid=FireFactory.user().ownedCompanyid;
  }

    $scope.login=function() {
      if($scope.user.email==null || $scope.user.email.length==0)
       {LoaderFactory.toggleLoadingWithMessage('請輸入email!');
        return;
       }
      if($scope.user.password==null || $scope.user.password.length==0)
       {LoaderFactory.toggleLoadingWithMessage('請輸入密碼!');
        return;
       }
      FireFactory.login($scope.user, function(){
        //console.log(FireFactory.users());
      }, true);
    };
    $scope.register=function() {
      if($scope.user.email==null || $scope.user.email.length==0)
       {LoaderFactory.toggleLoadingWithMessage('請輸入email!');
        return;
       }
      if($scope.user.password==null || $scope.user.password.length==0)
       {LoaderFactory.toggleLoadingWithMessage('請輸入密碼!');
        return;
       }
      if($scope.user.password!=$scope.user.password1)
       {LoaderFactory.toggleLoadingWithMessage('請確認密碼相符合!');
        return;
       }
      if($scope.user.name==null || $scope.user.name.length==0)
       {LoaderFactory.toggleLoadingWithMessage('請輸入姓名!');
        return;
       }
       if($scope.user.password.length<6)
        {LoaderFactory.toggleLoadingWithMessage('密碼必須多於6個字元!');
         return;
        }
      FireFactory.register($scope.user, function() {
      });
    };
    $scope.updateProfile=function() {
      if($scope.profile.email==null || $scope.profile.email.length==0)
       {LoaderFactory.toggleLoadingWithMessage('請輸入email!');
        return;
       }
      if($scope.profile.password==null || $scope.profile.password.length==0)
       {LoaderFactory.toggleLoadingWithMessage('請輸入密碼!');
        return;
       }
      if($scope.profile.password!=$scope.profile.password1)
       {LoaderFactory.toggleLoadingWithMessage('請確認密碼相符合!');
        return;
       }
      if($scope.profile.name==null || $scope.profile.name.length==0)
       {LoaderFactory.toggleLoadingWithMessage('請輸入姓名!');
        return;
       }
       if($scope.profile.password.length<6)
        {LoaderFactory.toggleLoadingWithMessage('密碼必須多於6個字元!');
         return;
        }
      delete $scope.profile.password1;
      FireFactory.updateUser($scope.profile, function() {
      });
    };
    $scope.forgot = function() {
      if($scope.user.email==null || $scope.user.email.length==0)
       {LoaderFactory.toggleLoadingWithMessage('請輸入email!');
        return;
       }
      FireFactory.sendResetPasswordEmail($scope.user.email, function() {
        var mod=$scope.showModal('查看信箱','查看信箱('+$scope.user.email+'),重置密碼.');
        mod.result.then(function (result) {

           }, function (reason) {
           });
        });
    };
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
                   </div>\
                   </div>',
        size: size
      });
      return mod;
    };
    $scope.logout=function() {
      if(FireFactory.user().email==GUEST.email) return;
      FireFactory.logout(function() {});
    };
  }
})();
