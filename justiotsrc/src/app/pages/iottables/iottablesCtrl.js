/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.pages.iottables')
    .controller('iottablesCtrl', iottablesCtrl);

  /** @ngInject */
  function iottablesCtrl(FireFactory, RuleFactory, $scope, $rootScope, $uibModal, $filter, editableOptions, editableThemes, GUEST, toastr) {
$rootScope.common.state = 'iottables';
//console.log($rootScope.userid);
$scope.common=$rootScope.common;
//$scope.userid=$rootScope.common.userid;
    editableOptions.theme = 'bs3';
    editableThemes['bs3'].submitTpl = '<button type="submit" class="btn btn-primary btn-with-icon"><i class="ion-checkmark-round"></i></button>';
    editableThemes['bs3'].cancelTpl = '<button type="button" ng-click="$form.$cancel()" class="btn btn-default btn-with-icon"><i class="ion-close-round"></i></button>';

    var loaddata=function() {
//      $scope.users=FireFactory.users();
//      $scope.companys=FireFactory.companys();
//      $scope.controllers=FireFactory.controllers();
//      $scope.gpsloggers=FireFactory.gpsloggers();
//      $scope.cameras=FireFactory.cameras();
//      $scope.datapoints=FireFactory.datapoints();
//      $scope.rules=FireFactory.rules();

      $scope.companyarray=[];
//console.log($scope.common);
      for(var i=0;i<$scope.common.companys.length;i++)
       {$scope.companyarray.push({id: $scope.common.companys[i].id, text: $scope.common.companys[i].title});
       }
      $scope.userarray=[];
      if($rootScope.common.isUser || $rootScope.common.isCustomer) {
        $scope.userarray.push({id: $scope.common.user.uid, text: $scope.common.user.name});
      } else {
        for(var i=0;i<$scope.common.users.length;i++)
         {$scope.userarray.push({id: $scope.common.users[i].uid, text: $scope.common.users[i].name});
         }
      }

      $scope.companyadminarray=[];
      var uids=Object.keys($scope.common.userMap);
      for(var i=0;i<uids.length;i++) {
        var u=$scope.common.userMap[uids[i]];
        if(u.role==4) $scope.companyadminarray.push({id: u.uid, text: u.name});
      }

      $scope.controllerarray=[];
      for(var i=0;i<$scope.common.controllers.length;i++)
       {$scope.controllerarray.push({id: $scope.common.controllers[i].id, text: $scope.common.controllers[i].title});
       }

//  console.log($scope.companyarray);
//  console.log($scope.userarray);
//  console.log($scope.controllerarray);
    };
    $scope.tabSelected=function(type) {
//console.log($tabSetStatus.activeTab);
//console.log(type);
     loaddata();
    }

    loaddata();

    if($scope.common.isAdmin) {
      $scope.roles = [
        {id: 1, text: '使用者'},
        {id: 2, text: '客戶'},
        {id: 4, text: '公司管理者'},
        {id: 9, text: '系統管理者'}
      ];
    } else if($scope.common.isCompanyAdmin){
      $scope.roles = [
        {id: 2, text: '客戶'}
      ];
    } else {
      $scope.roles = [
        {id: 0, text: '訪客'},
        {id: 1, text: '使用者'},
        {id: 2, text: '客戶'},
        {id: 4, text: '公司管理者'},
        {id: 9, text: '系統管理者'}
      ];
    }

    $scope.dptypes = [
      {id: 0, text: '數位輸入'},
      {id: 1, text: '數位輸出'},
      {id: 2, text: '類比輸入'},
      {id: 3, text: '類比輸出'},
      {id: 4, text: 'GPS資料'}
    ];

    $scope.ctypes = [
      {id: 0, text: '其他'},
      {id: 1, text: 'Arduino'}
    ];

    $scope.actives = [
      {id: true, text: '啟用'},
      {id: false, text: '禁用'}
    ];
    $scope.yesno = [
      {id: true, text: '是'},
      {id: false, text: '否'}
    ];
     $scope.showRole=function(user) {
       for(var i=0;i<$scope.roles.length;i++) {
         if($scope.roles[i].id==user.role) return $scope.roles[i].text;
        }
       return '[未設定]';
     };
     $scope.showActive=function(a) {
       if(a.active) return '啟用';
       else return '禁用';
     };
     $scope.showPublic=function(a) {
       if(!a.public) a.public=false;
       if(a.public) return '是';
       else return '否';
     };
    $scope.showOwnedCompany=function(user) {
      if(user.ownedCompanyid && $scope.companyarray.length) {
        var selected = $filter('filter')($scope.companyarray, {id: user.ownedCompanyid});
        return selected.length ? selected[0].text : '';
      } else return ''
    };
    $scope.showUserCompany=function(user) {
      if(user.companyid && $scope.companyarray.length) {
        var selected = $filter('filter')($scope.companyarray, {id: user.companyid});
        return selected.length ? selected[0].text : '[未設定]';
      } else return '[未設定]'
    };

    $scope.showCompanyAdmin=function(company) {
      if(company.adminuid && $scope.companyadminarray.length) {
        var selected = $filter('filter')($scope.companyadminarray, {id: company.adminuid});
        return selected.length ? selected[0].text : '[未設定]';
      } else return '[未設定]'
    };

    $scope.showControllerUser=function(controller) {
      if(controller.userid && $scope.userarray.length) {
        var selected = $filter('filter')($scope.userarray, {id: controller.userid});
        return selected.length ? selected[0].text : '[未設定]';
      } else return '[未設定]'
    }
    $scope.showControllerType=function(controller) {
      if(controller.type && $scope.ctypes.length) {
        var selected = $filter('filter')($scope.ctypes, {id: controller.type});
        return selected.length ? selected[0].text : '';
      } else return ''
    }
    $scope.showGPSLoggerUser=function(gpslogger) {
      if(gpslogger.userid && $scope.userarray.length) {
        var selected = $filter('filter')($scope.userarray, {id: gpslogger.userid});
        return selected.length ? selected[0].text : '[未設定]';
      } else return '[未設定]'
    }

    $scope.showCameraUser=function(camera) {
      if(camera.userid && $scope.userarray.length) {
        var selected = $filter('filter')($scope.userarray, {id: camera.userid});
        return selected.length ? selected[0].text : '[未設定]';
      } else return '[未設定]'
    }

    $scope.showDatapointType=function(datapoint) {
      if(datapoint.dptype>=0 && $scope.dptypes.length) {
        var selected = $filter('filter')($scope.dptypes, {id: datapoint.dptype});
        return selected.length ? selected[0].text : '[未設定]';
      } else return '[未設定]'
    }
    $scope.showDatapointUser=function(datapoint) {
      if(datapoint.userid && $scope.userarray.length) {
        var selected = $filter('filter')($scope.userarray, {id: datapoint.userid});
        return selected.length ? selected[0].text : '[未設定]';
      } else return '[未設定]'
    }
   $scope.showDatapointController=function(datapoint) {
     if(datapoint.controllerid && $scope.controllerarray.length) {
       var selected = $filter('filter')($scope.controllerarray, {id: datapoint.controllerid});
       return selected.length ? selected[0].text : '[未設定]';
     } else return '[未設定]'
   }

   $scope.showRuleTimeCondition=function(rule) {
     return RuleFactory.timeconditionstr(rule);
   }
   $scope.showRuleIOCondition=function(rule) {
     return RuleFactory.ioconditionsstr(rule.iocondition);
   }
   $scope.showRuleAction=function(rule) {
     return RuleFactory.actionstr(rule);
   }

    $scope.saveUser = function(index) {
    //  console.log($scope.users[index]);
//      var obj=deleteUndefined(deleteKey($scope.users[index]));
      var obj=$scope.common.users[index];
  //    console.log(obj);

      if(obj.tosave) {delete obj.tosave; FireFactory.addUser(obj, function() {});}
      else FireFactory.updateUser(obj, function() {});
    }
    $scope.saveCompany = function(index) {
      console.log($scope.common.companys[index]);
//      var obj=deleteUndefined(deleteKey($scope.companys[index]));
      var obj=$scope.common.companys[index];
      if(obj.tosave) {delete obj.tosave; FireFactory.addCompany(obj, function() {});}
      else FireFactory.updateCompany(obj, function() {});
    }
    $scope.saveController = function(index) {
      console.log($scope.common.controllers[index]);

//      var obj=deleteUndefined(deleteKey($scope.controllers[index]));
      var obj=$scope.common.controllers[index];
      console.log(obj.userid);
      if($rootScope.common.isUser || $rootScope.common.isCustomer) {
        obj.userid=FireFactory.user().uid;
      }
      if(obj.userid==undefined || obj.userid==null) {
        var mod=$scope.showConfirmModal('設定使用者','必須設定使用者!');
            mod.result.then(function (result) {
              if(obj.tosave) $scope.common.controllers.splice(index,1);
            return;
         }, function (reason) {
           if(obj.tosave) $scope.common.controllers.splice(index,1);
           return;
         });
         return;
       }
      if(typeof obj.done !== 'undefined') delete obj.done;
      if(typeof obj.datapoints !== 'undefined') delete obj.datapoints;

      if(obj.tosave) {delete obj.tosave; FireFactory.addController(obj, function() {});}
      else FireFactory.updateController(obj, function() {});
    }
    $scope.saveGPSLogger = function(index) {
      console.log($scope.common.gpsloggers[index]);

//      var obj=deleteUndefined(deleteKey($scope.gpsloggers[index]));
      var obj=$scope.common.gpsloggers[index];
      console.log(obj.userid);
      if($rootScope.common.isUser || $rootScope.common.isCustomer) {
        obj.userid=FireFactory.user().uid;
      }
      if(obj.userid==undefined || obj.userid==null) {
        var mod=$scope.showConfirmModal('設定使用者','必須設定使用者!');
            mod.result.then(function (result) {
              if(obj.tosave) $scope.common.gpsloggers.splice(index,1);
            return;
         }, function (reason) {
           if(obj.tosave) $scope.common.gpsloggers.splice(index,1);
           return;
         });
         return;
       }
      if(typeof obj.done !== 'undefined') delete obj.done;
      if(typeof obj.datapoints !== 'undefined') delete obj.datapoints;

      if(obj.tosave) {delete obj.tosave; FireFactory.addGPSLogger(obj, function() {});}
      else FireFactory.updateGPSLogger(obj, function() {});
    }
    $scope.saveCamera = function(index) {
      console.log($scope.common.cameras[index]);
//      var obj=deleteUndefined(deleteKey($scope.cameras[index]));
      var obj=$scope.common.cameras[index];
      if($rootScope.common.isUser || $rootScope.common.isCustomer) {
        obj.userid=FireFactory.user().uid;
      }
      if(obj.userid==undefined || obj.userid==null) {
        var mod=$scope.showConfirmModal('設定使用者','必須設定使用者!');
            mod.result.then(function (result) {
              if(obj.tosave) $scope.common.cameras.splice(index,1);
            return;
         }, function (reason) {
           if(obj.tosave) $scope.common.cameras.splice(index,1);
           return;
         });
         return;
       }
      if(obj.tosave) {delete obj.tosave; FireFactory.addCamera(obj, function() {});}
      else FireFactory.updateCamera(obj, function() {});
    }

    var isNumber=function(n) {
      return !isNaN(n) && angular.isNumber(+n);
    };

    var isRepeatOrder=function(controllerid, index, order) {
      if(controllerid==undefined || controllerid==null) return false;
      for(var i=0;i<$scope.common.datapoints.length;i++) {
        if(i==index) continue;
        if($scope.common.datapoints[i].controllerid==controllerid &&
           $scope.common.datapoints[i].order==order ) return true;
      }
      return false;
    };

    var isUndefinedOrNull= function(obj) {
         return !angular.isDefined(obj) || obj===null;
     };


    $scope.changeDatapoint = function(index) {
  //console.log('changeDatapoint');
  //console.log($scope.datapoints[index]);
       $scope.common.datapoints[index].changed=true;
       var x = $scope.common.datapoints[index].order;
       if(!isNumber(x)) {
         try {x=parseInt(x, 10);}
         catch(err) {x=0;}
       }
       if(isRepeatOrder($scope.common.datapoints[index].controllerid,index, x)) {
         var mod=$scope.showConfirmModal('次序不重覆','同一控制器下,資料點次序不可重覆!');
             mod.result.then(function (result) {
          }, function (reason) {
          });
       }
     };
    $scope.saveDatapoint = function(index) {
//  console.log($scope.datapoints[index]);
//      var obj=deleteUndefined(deleteKey($scope.datapoints[index]));
      var obj=$scope.common.datapoints[index];
      if($rootScope.common.isUser || $rootScope.common.isCustomer) {
        obj.userid=$scope.common.user.uid;
      }
      if(obj.userid==undefined || obj.userid==null) {
        var mod=$scope.showConfirmModal('設定使用者','必須設定使用者!');
            mod.result.then(function (result) {
              if(obj.tosave) $scope.common.datapoints.splice(index,1);
            return;
         }, function (reason) {
           if(obj.tosave) $scope.common.datapoints.splice(index,1);
           return;
         });
         return;
       }
       if(obj.controllerid==undefined || obj.controllerid==null) {
         var mod=$scope.showConfirmModal('設定控制器','必須設定控制器!');
             mod.result.then(function (result) {
               if(obj.tosave) $scope.common.datapoints.splice(index,1);
             return;
          }, function (reason) {
            if(obj.tosave) $scope.common.datapoints.splice(index,1);
            return;
          });
          return;
        }
      if(typeof obj.done !== 'undefined') delete obj.done;
      if(typeof obj.datas !== 'undefined') delete obj.datas;
      delete $scope.common.datapoints[index].changed;
      if(obj.tosave) {delete obj.tosave; FireFactory.addDatapoint(obj, function() {});}
      else FireFactory.updateDatapoint(obj, function() {});
    }
    $scope.addRule = function() {
      $rootScope.common.rule=null;
      $rootScope.common.modaladd=$uibModal.open({
        animation: true,
        template: '<iot-rules rule="rule"></iot-rules>',
        size: 'lg'//,
    //    resolve: {
    //        items: function () {
    //          return $scope.items;
    //        }
    //      }
      });
      $rootScope.common.modaladd.result.then(function (rule) {
if(rule==undefined || rule==null) return;
    //        console.log(rule);
    //       var obj=deleteUndefined(deleteKey(rule));
    //        console.log(obj);
    //        delete obj.$$hashKey;
            console.log('before add');
            FireFactory.addRule(rule, function(){
               $scope.common.rules.push(rule);
            });
         }, function (reason) {
           console.log('addRule reason'+reason);
         });
    }

    $scope.editRule = function(index) {
      $rootScope.common.rule=$scope.common.rules[index];
      $rootScope.common.modaledit=$uibModal.open({
        animation: true,
        template: '<iot-rules rule="rule" ng-model="rule"></iot-rules>',
        size: 'lg'//,
    //    resolve: {
    //        items: function () {
    //          return $scope.items;
    //        }
    //      }
      });
      $rootScope.common.modaledit.result.then(function (rule) {
            if(rule==undefined || rule==null) return;
            FireFactory.updateRule(rule, function(){
            });
         }, function (reason) {
           console.log('addRule reason'+reason);
         });
    }

    $scope.showConfirmModal=function(head, text, size) {
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
        size: size//,
    //    resolve: {
    //        items: function () {
    //          return $scope.items;
    //        }
    //      }
      });
      return mod;
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
                   <button type="button" class="btn btn-info" ng-click="$dismiss()">取消</button>\
                   </div>\
                   </div>',
        size: size//,
    //    resolve: {
  //        items: function () {
  //          return $scope.items;
  //        }
  //      }
      });
      return mod;
    };

    $scope.act=function() {
      console.log('act');
    }

    $scope.removeUser = function(index) {
      var u=$scope.common.users[index];
      if(u.email==GUEST.email) {
        toastr.error('不可刪除訪客資料!', '刪除使用者('+u.name+')', {})
        return;
      }
      if(u.role==9) {
        toastr.error('不可刪除管理者資料!', '刪除使用者('+u.name+')', {})
        return;
      }
      var mod=$scope.showModal('刪除使用者','刪除使用者,同時也刪除其攝影機,控制器,控制規則及資料點!');
      mod.result.then(function (result) {
            FireFactory.deleteUser(u.uid, function() {
//              $scope.common.users.splice(index,1);
            });
         }, function (reason) {
         });
    }
    $scope.removeCompany = function(index) {
      var mod=$scope.showModal('刪除廠商','刪除廠商,同時也刪除其用戶及用戶的攝影機,控制器,控制規則及資料點!');
      mod.result.then(function (result) {
            FireFactory.deleteCompany($scope.common.companys[index].id, function() {
//              $scope.companys.splice(index,1);
            });
         }, function (reason) {
         });

    }
    $scope.removeController = function(index) {
       var mod=$scope.showModal('刪除控制器','刪除控制器,同時也刪除其控制規則,資料點!');
       mod.result.then(function (result) {
    //         console.log('result'); //result關閉是回傳的值
    //         console.log($scope.common.controllers);
             FireFactory.deleteController($scope.common.controllers[index].id, function() {
//               $scope.controllers.splice(index,1);
             });
    //         console.log($scope.controllers);
          }, function (reason) {
              console.log('reason');//點擊空白區域，總會輸出backdrop click，點擊取消，則會暑促cancel

          });
  //
    }
    $scope.removeGPSLogger = function(index) {
       var mod=$scope.showModal('刪除GPS記錄器','刪除GPS記錄器及其資料!');
       mod.result.then(function (result) {
             console.log('result'); //result關閉是回傳的值
             console.log($scope.common.gpsloggers);
             FireFactory.deleteGPSLogger($scope.common.gpsloggers[index].id, function() {
      //         $scope.gpsloggers.splice(index,1);

             });
             console.log($scope.common.gpsloggers);
          }, function (reason) {
              console.log('reason');//點擊空白區域，總會輸出backdrop click，點擊取消，則會暑促cancel

          });
  //
    }
    $scope.removeCamera = function(index) {
      var mod=$scope.showModal('刪除攝影機','刪除攝影機!');
      mod.result.then(function (result) {
            FireFactory.deleteCamera($scope.common.cameras[index].id, function() {
  //            $scope.cameras.splice(index,1);
            });
         }, function (reason) {
         });
    }
    $scope.removeDatapoint = function(index) {
      var mod=$scope.showModal('刪除資料點','刪除資料點,同時刪除其歷史資料!');
      mod.result.then(function (result) {
            FireFactory.deleteDatapoint($scope.common.datapoints[index].id, function() {
    //          $scope.datapoints.splice(index,1);
            });
         }, function (reason) {
         });

    }
    $scope.removeRule = function(index) {
    //   console.log($scope.common.rules);
      var mod=$scope.showModal('刪除控制規則','刪除控制規則!');
      mod.result.then(function (result) {
            FireFactory.deleteRule($scope.common.rules[index].id, function() {
    //  $scope.rules.splice(index,1);
            });
         }, function (reason) {
    //console.log(reason);
         });

    }

    $scope.addUser=function() {
        $scope.inserted = {
          email: 'guest@gmail.com',
          name: '姓名',
          password: 'password',
          active: true,
          createdAt: new Date().getTime(),
          public: false,
          tosave: true
        };
        if($rootScope.common.isCompanyAdmin) {
          $scope.inserted.companyid=FireFactory.user().ownedCompanyid;
          $scope.inserted.role=2;
        }
        $scope.common.users.push($scope.inserted);
    };
    $scope.addCompany=function() {
        $scope.inserted = {
          title: '名稱',
          description: '說明',
          active: true,
          createdAt: new Date().getTime(),
          tosave:true
        };
        $scope.common.companys.push($scope.inserted);
    };
    $scope.addController=function() {
        $scope.inserted = {
          id: '0',
          title: '控制器',
          description: '說明',
          active: true,
          createdAt: new Date().getTime(),
          offine: false,
          tosave: true
        };
        if(FireFactory.user().role==1 || FireFactory.user().role==2) {
          $scope.inserted.userid=FireFactory.user().uid;
        }
        $scope.common.controllers.push($scope.inserted);
    };
    $scope.addGPSLogger=function() {
        $scope.inserted = {
          title: 'GPS記錄器',
          description: '說明',
          active: true,
          createdAt: new Date().getTime(),
          tosave: true
        };
        if(FireFactory.user().role==1 || FireFactory.user().role==2) {
          $scope.inserted.userid=FireFactory.user().uid;
        }
        $scope.common.gpsloggers.push($scope.inserted);
    };
    $scope.addCamera=function() {
        $scope.inserted = {
          title: '名稱',
          description: '說明',
          url: '監看網址',
          active: true,
          createdAt: new Date().getTime(),
          tosave: true
        };
        if(FireFactory.user().role==1 || FireFactory.user().role==2) {
          $scope.inserted.userid=FireFactory.user().uid;
        }
        $scope.common.cameras.push($scope.inserted);
    };
    $scope.addDatapoint=function() {
        $scope.inserted = {
          title: '名稱',
          description: '說明',
          dptype: 0,
          order: 0,
          active: true,
          createdAt: new Date().getTime(),
          tosave: true
        };
        if(FireFactory.user().role==1 || FireFactory.user().role==2) {
          $scope.inserted.userid=FireFactory.user().uid;
        }
        $scope.common.datapoints.push($scope.inserted);
    };


    $scope.cancel=function(form, which, one, index) {
      if(which!='datapoint') form.$cancel();
      if(one.tosave)
       {if(which=='user') $scope.common.users.splice(index,1);
        else if(which=='company') $scope.common.companys.splice(index,1);
        else if(which=='controller') $scope.common.controllers.splice(index,1);
        else if(which=='gpslogger') $scope.common.gpsloggers.splice(index,1);
        else if(which=='camera') $scope.common.cameras.splice(index,1);
        else if(which=='datapoint') $scope.common.datapoints.splice(index,1);
       }
      console.log('cancel');
    };

    $scope.canEdit=function() {
      if($rootScope.common.isGuest || $rootScope.common.isCustomer) return false;
      if($rootScope.common.isUser || $rootScope.common.isCustomer) {
        if($rootScope.common.targetUser.uid!=$scope.common.user.uid) return false;
      }
      return true;
    };
  }
})();
