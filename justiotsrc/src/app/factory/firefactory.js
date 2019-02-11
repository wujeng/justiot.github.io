/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.factory')
    .factory('FireFactory', firefactory);

  /** @ngInject */
  function firefactory($rootScope, $firebaseAuth, AuthFactory, GUEST, LoaderFactory, httpFactory) {
// copy to JustIOTapp
// 1. LoaderFactory-->Loader
// 2. go('monitor') --> go('app.monitor')
// 3. setTargetData  +  setScopeData
// 4. setScopeData   +  *Map


        var vm = this;
        vm.companys=[];
        vm.products=[];
        vm.cameras=[];
        vm.controllers=[];
        vm.gpsloggers=[];
        vm.datapoints=[];
        vm.rules=[];
        vm.users=[];
        vm.layouts=[];

        vm.companyMap={};
        vm.productMap={};
        vm.userMap={};
        vm.cameraMap={};
        vm.controllerMap={};
        vm.gpsloggerMap={};
        vm.datapointMap={};
        vm.ruleMap={};
        vm.layoutMap={};
        vm.layoutimageMap={};
        vm.layoutlabelMap={};

        vm.targetUser=null;
        vm.user=null;
        vm.userid=null;
        vm.isAuthenticated = false;
        vm.isAdmin = false;
        vm.isCompanyAdmin = false;
        vm.isCustomer = false;
        vm.isGuest = false;
        vm.isUser = false;
        vm.isOwner=false;
        vm.isTargetAdmin=false;
        vm.listCanSwipe = false;
        vm.company=null;
        vm.guestuid=null;
$rootScope.common={};


        var deleteKey=function(obj) {
          var keys=Object.keys(obj);
          for(var i=0;i<keys.length;i++) {
            if(keys[i].startsWith("$")) {
              delete obj[keys[i]];
              continue;
            }
            if(angular.isObject(obj[keys[i]])) {
              deleteKey(obj[keys[i]]);
            }
          }
          return obj;
        };
        var deleteUndefined=function(obj) {
          var keys=Object.keys(obj);
          for(var i=0;i<keys.length;i++) {
            if(obj[keys[i]] == undefined) {
              delete obj[keys[i]];
              continue;
            }
            if(angular.isObject(obj[keys[i]])) {
              deleteUndefined(obj[keys[i]]);
            }
          }
          return obj;
        };

        var setRole= function(user) {
          vm.user=user;
          vm.userid=user.uid;
          vm.isAuthenticated = isLoggedIn(user);
          vm.isAdmin = isAdmin(user);
          vm.isCompanyAdmin = isCompanyAdmin(user);
          vm.isCustomer = isCustomer(user);
          vm.isGuest = isGuest(user);
          vm.isUser = isUser(user);
          if(vm.isGuest || vm.isCustomer) vm.listCanSwipe = false;
          else vm.listCanSwipe = true;

          $rootScope.user=user;                            // for justiotapp
          $rootScope.userid=user.uid;
          $rootScope.isAuthenticated=vm.isAuthenticated;
          $rootScope.isAdmin=vm.isAdmin;
          $rootScope.isCompanyAdmin=vm.isCompanyAdmin;
          $rootScope.isCustomer=vm.isCustomer;
          $rootScope.isGuest=vm.isGuest;
          $rootScope.isUser=vm.isUser;
          $rootScope.listCanSwipe=vm.listCanSwipe;

          $rootScope.common.user=user;
          $rootScope.common.userid=user.uid;
          $rootScope.common.isAuthenticated=vm.isAuthenticated;
          $rootScope.common.isAdmin=vm.isAdmin;
          $rootScope.common.isCompanyAdmin=vm.isCompanyAdmin;
          $rootScope.common.isCustomer=vm.isCustomer;
          $rootScope.common.isGuest=vm.isGuest;
          $rootScope.common.isUser=vm.isUser;
          $rootScope.common.listCanSwipe=vm.listCanSwipe;
        };

        var isAdmin= function(user) {
          if(user!=null && user.role==9) return true;
          else return false;
        };
        var isCompanyAdmin= function(user) {
          if(user!=null && user.role==4) return true;
          else return false;
        };
        var isCustomer= function(user) {
          if(user!=null && user.role==2) return true;
          else return false;
        };
        var isGuest= function(user) {
          if(user!=null && user.role==0) return true;
          else return false;
        };
        var isUser= function(user) {
          if(user!=null && user.role==1) return true;
          else return false;
        };


        var isOwner=function() {
          if(vm.user.uid==vm.targetUser.uid) return true;
          else return false;
        };
        var isTargetAdmin=function() {
          return isCompanyAdminForUser(vm.targetUser);
        }
        var isLoggedIn= function(user) {
            if(user!=null && !(user.email==GUEST.email)) return true;
            else return false;
        };


       var appendArray= function(oldarray, newarray) {
         for(var i=0;i<newarray.length;i++)
          {
            oldarray.push(newarray[i]);
          }
       }

    var clear= function() {
      vm.companys=[];
      vm.products=[];
      vm.cameras=[];
      vm.controllers=[];
      vm.gpsloggers=[];
      vm.datapoints=[];
      vm.rules=[];
      vm.users=[];
      vm.layouts=[];

      vm.companyMap={};
      vm.productMap={};
      vm.userMap={};
      vm.cameraMap={};
      vm.controllerMap={};
      vm.gpsloggerMap={};
      vm.datapointMap={};
      vm.ruleMap={};
      vm.layoutMap={};
      vm.layoutimageMap={};
      vm.layoutlabelMap={};

      vm.targetUser=null;
      vm.user=null;
      vm.userid=null;
      vm.isAuthenticated = false;
      vm.isAdmin = false;
      vm.isCompanyAdmin = false;
      vm.isCustomer = false;
      vm.isGuest = false;
      vm.isUser = false;
      vm.isOwner=false;
      vm.isTargetAdmin=false;
      vm.listCanSwipe = false;
      vm.company=null;
    };
    var getUsers= function() {
      vm.users=[];
      if(vm.company) {
        var ids=Object.keys(vm.userMap);
        for(var i=0;i<ids.length;i++) {
          var u=vm.userMap[ids[i]];
          if(u.companyid==vm.company.id) {
            vm.users.push(u);
            continue;
          }

          if(vm.isAdmin && u.role==4 && u.ownedCompanyid==vm.company.id) {
//        console.log(u.name);
            vm.users.push(u);
          }
        }
      } else {
        var ids=Object.keys(vm.userMap);
        for(var i=0;i<ids.length;i++) {
          var u=vm.userMap[ids[i]];
          if(u.role==2 && u.public) vm.users.push(u);
        }
        for(var i=0;i<ids.length;i++) {
          var u=vm.userMap[ids[i]];
          if(u.role==0 || u.role==1) vm.users.push(u);
          else {
            if(vm.isAdmin && u.role==9) vm.users.push(u);
          }
        }
      }
//      $rootScope.users=vm.users;
      $rootScope.common.users=vm.users;
    };
    var getCompanys= function() {
      vm.companys=[];
      var ids=Object.keys(vm.companyMap);
      ids.forEach(function(id) {
        var company=vm.companyMap[id];
        company.admin=vm.userMap[company.adminuid];
        vm.companys.push(company);
      });
//      $rootScope.companys=vm.companys;
      $rootScope.common.companys=vm.companys;
    };

    var watchDatapoint= function(datapoint) {
      firebase.database().ref().child('/datapoints/'+datapoint.userid+'/'+datapoint.id+'/value').on('value', function(data) {
      				if(!data.exists()) return;
      				$rootScope.$apply( function() {
      				//	var d=data.val();
      				//	datapoint.value=d.value;
      				//	datapoint.datatime=d.createdAt;
 //vm.datapointMap[datapoint.id].value=data.val();
      				  datapoint.value=data.val();
      					datapoint.datatime=new Date().getTime();
                $rootScope.common.datatime=datapoint.datatime;
//console.log('watch:'+datapoint.title+":"+datapoint.value);
//if($rootScope.state=='layout' && $rootScope.common.layoutcommand=='none') $rootScope.goto('layout');

      					if(datapoint.dptype==2 || datapoint.dptype==3) {
      						var gauge = document.gauges.get(datapoint.id);
      						if(gauge!=null) {
      							gauge.value=datapoint.value;
      		//            var min=gauge.minValue;
      		//            if(min==undefined) min=0;
      		//            var max=gauge.maxValue;
      		//            if(max==undefined) max=100;
      		//            console.log(gauge.value+' '+min+' '+max);
      		//            if(gauge.value<min) gauge.update({minValue: gauge.value});
      		//            if(gauge.value>max) gauge.update({maxValue:gauge.value});
      						}
      					}


                  });
      			});
    };
    var watchController= function(controller) {
      firebase.database().ref().child('/controllers/'+controller.userid+'/'+controller.id+'/offline').on('value', function(data) {
              if(!data.exists()) return;
              $rootScope.$apply( function() {
                controller.offline=data.val();
              });
            });
    };

//    var watchoffDatapoint= function(datapoint) {
//      firebase.database().ref().child('/datas/'+datapoint.userid+'/'+datapoint.id).off();
//    };

    var deleteLayout= function(id,callback,ashow) {
      var show=false;
      if(typeof ashow==undefined || ashow==null) show=true;
      else show=ashow;
      var layout=vm.layoutMap[id];
      var u=vm.userMap[layout.userid];
      if(show) LoaderFactory.showLoading('刪除監控配置...');
      Object.keys(vm.layoutimageMap).forEach(function(id){
        var image=vm.layoutimageMap[id];
        if(image.layoutid==id) deletelayoutimage(image.id,null,false);
      });
      Object.keys(vm.layoutlabelMap).forEach(function(id){
        var label=vm.layoutlabelMap[id];
        if(label.layoutid==id) deletelayoutlabel(label.id,null,false);
      });
      firebase.database().ref().child('layouts/'+u.uid+'/'+id).remove(function(error){
       if(error)
        {if(show) LoaderFactory.hideLoading();
          LoaderFactory.toggleLoadingWithMessage(error);
          return;
        }
       else
        {
         if(show) LoaderFactory.hideLoading();
         delete vm.layoutMap[id];
         if(callback) callback();
        }
      });
    };
    var deletelayoutimage= function(id,callback,ashow) {
      var show=false;
      if(typeof ashow==undefined || ashow==null) show=true;
      else show=ashow;
      var image=vm.layoutimageMap[id];
      deleteImageFile(image, null, null);
      var layout=vm.layoutMap[image.layoutid];
      var u=vm.userMap[layout.userid];
      if(show) LoaderFactory.showLoading('刪除圖片...');
      firebase.database().ref().child('layoutimages/'+u.uid+'/'+id).remove(function(error){
       if(error)
        {if(show) LoaderFactory.hideLoading();
          LoaderFactory.toggleLoadingWithMessage(error);
          return;
        }
       else
        {
         if(show) LoaderFactory.hideLoading();
         delete vm.layoutimageMap[id];
         if(callback) callback();
        }
      });
    };
    var deletelayoutlabel= function(id,callback,ashow) {
      var show=false;
      if(typeof ashow==undefined || ashow==null) show=true;
      else show=ashow;
      var label=vm.layoutlabelMap[id];
      var layout=vm.layoutMap[label.layoutid];
      var u=vm.userMap[layout.userid];
      if(show) LoaderFactory.showLoading('刪除標示...');
      firebase.database().ref().child('layoutlabels/'+u.uid+'/'+id).remove(function(error){
       if(error)
        {if(show) LoaderFactory.hideLoading();
          LoaderFactory.toggleLoadingWithMessage(error);
          return;
        }
       else
        {
         if(show) LoaderFactory.hideLoading();
         delete vm.layoutlabelMap[id];
         if(callback) callback();
        }
      });
    };
    var deleteDatapoint= function(id,callback,ashow) {
      var show=false;
      if(typeof ashow==undefined || ashow==null) show=true;
      else show=ashow;
      var datapoint=vm.datapointMap[id];
      var u=vm.userMap[datapoint.userid];
      if(show) LoaderFactory.showLoading('刪除資料點...');
      firebase.database().ref().child('datas/'+datapoint.userid+'/'+datapoint.id).remove(function(error){
       if(error)
        {if(show) LoaderFactory.hideLoading();
          LoaderFactory.toggleLoadingWithMessage(error);
          return;
        }
       else
        {var labelids=Object.keys(vm.layoutlabelMap);
          for(var i=0;i<labelids.length;i++) {
            var l=vm.layoutlabelMap[labelids[i]];
            if(l.datapointid==id) deletelayoutlabel(l.id,null,ashow);
          }

          var imageids=Object.keys(vm.layoutimageMap);
            for(var i=0;i<imageids.length;i++) {
              var im=vm.layoutimageMap[imageids[i]];
              if(im.datapointid && im.datapointid==id) im.datapointid=null;
            }

          firebase.database().ref().child('/datapoints/'+u.uid+'/'+datapoint.id).remove(function(error){
          if(error)
           {if(show) LoaderFactory.hideLoading();
            LoaderFactory.toggleLoadingWithMessage(error);
            return;
           }
          else
           {if(show) LoaderFactory.hideLoading();
            delete vm.datapointMap[datapoint.id];
            if(callback) callback();
           }
          });
        }
      });
    }
    var getDatapointlist=function(controllerid) {
      var dplist=[];
      Object.keys(vm.datapointMap).forEach(function(id){
        var dp=vm.datapointMap[id];
        if(dp.controllerid==controllerid) dplist.push(id);
      });
      return dplist;
    }
    var deleteController= function(id, callback, ashow) {
      var show=false;
      if(typeof ashow==undefined || ashow==null) show=true;
      else show=ashow;
      if(show) LoaderFactory.showLoading('刪除控制器...');
      var controller=vm.controllerMap[id];
      var u=vm.userMap[controller.userid];
      var dps=getDatapointlist(id);
      dps.forEach(function(dp, index) {
        deleteDatapoint(dp,null,false);
      });
      firebase.database().ref().child('/controllers/'+u.uid+'/'+controller.id).remove(function(error){
       if(error)
        {if(show) LoaderFactory.hideLoading();
          LoaderFactory.toggleLoadingWithMessage(error);
          return;
        }
       else
        {if(show) LoaderFactory.hideLoading();
          delete vm.controllerMap[controller.id];
         if(callback) callback();
        }
      });
    };

    var deleteGPSLogger= function(id, callback, ashow) {
      var show=false;
      if(typeof ashow==undefined || ashow==null) show=true;
      else show=ashow;
      var gpslogger=vm.gpsloggerMap[id];
      var u=vm.userMap[gpslogger.userid];
      if(show) LoaderFactory.showLoading('刪除GPS記錄器...');
      firebase.database().ref().child('gpsdatas/'+gpslogger.userid+'/'+gpslogger.id).remove(function(error){
       if(error)
        {if(show) LoaderFactory.hideLoading();
          LoaderFactory.toggleLoadingWithMessage(error);
          return;
        }
       });
      firebase.database().ref().child('/gpsloggers/'+u.uid+'/'+gpslogger.id).remove(function(error){
        if(error)
         {if(show) LoaderFactory.hideLoading();
           LoaderFactory.toggleLoadingWithMessage(error);
           return;
         }
        else
         {if(show) LoaderFactory.hideLoading();
           delete vm.gpsloggerMap[gpslogger.id];
          if(callback) callback();
         }
       });
    }

    var deleteCamera=function(id, callback, ashow) {
      var show=false;
      if(typeof ashow==undefined || ashow==null) show=true;
      else show=ashow;
      var camera=vm.cameraMap[id];
      var u=vm.userMap[camera.userid];
      if(show) LoaderFactory.showLoading('刪除攝影機...');
      firebase.database().ref().child('/cameras/'+u.uid+'/'+camera.id).remove(function(error){
        if(error)
         {if(show) LoaderFactory.hideLoading();
           LoaderFactory.toggleLoadingWithMessage(error);
           return;
         }
        else
         {if(show) LoaderFactory.hideLoading();
           delete vm.cameraMap[camera.id];
          if(callback) callback();
         }
       });
    }

/*
    var deleteCompany=function(id, callback, ashow) {
      var show=false;
      if(typeof ashow==undefined || ashow==null) show=true;
      else show=ashow;
      LoaderFactory.showLoading('刪除公司...');
      var company=vm.companyMap[id];
      httpFactory.deleteCompany(vm.user.uid, id).success(function(data) {
          if(show) LoaderFactory.hideLoading();
          if(callback) callback();
        }).error(function(err, statusCode) {
          if(show) LoaderFactory.hideLoading();
          LoaderFactory.toggleLoadingWithMessage(err.message);
        });
    }
*/

    var deleteRule=function(id, callback, ashow) {
      var show=false;
      if(typeof ashow==undefined || ashow==null) show=true;
      else show=ashow;
      var rule=vm.ruleMap[id];
      var u=vm.userMap[rule.userid];
      if(show) LoaderFactory.showLoading('刪除規則...');
      firebase.database().ref().child('/rules/'+rule.userid+'/'+rule.id).remove(function(error){
         if(error)
          {if(show) LoaderFactory.hideLoading();
            LoaderFactory.toggleLoadingWithMessage(error);
  //console.log(error);
            return;
          }
         else
          {if(show) LoaderFactory.hideLoading();
            delete vm.ruleMap[id];
  //console.log('deleteRule');
           if(callback) callback();
          }
        });
   };

    var deleteFirebaseUser=function(uid, callback, ashow) {
      deleteuser(uid,callback,ashow);
  /*
      var currentuser=vm.user;
      if(currentuser.uid==uid) {
        LoaderFactory.toggleLoadingWithMessage("不能刪除自己!");
        return;
      }
      var user=vm.userMap[uid];
      firebaseLogin(user.email, user.password, function(u) {
        deleteuser(uid,null,false);

        var user = firebase.auth().currentUser;
        user.delete().then(function() {
           login(currentuser,callback,false,false);
        }, function(error) {
          LoaderFactory.toggleLoadingWithMessage(error);
          return;
        });
      });
*/

    };
    var deleteUser= function(id, callback, ashow) {
      var show=false;
      if(typeof ashow==undefined || ashow==null) show=true;
      else show=ashow;

      if(vm.user==null)  {
        LoaderFactory.toggleLoadingWithMessage("無執行使用者資料!");
        return;
      }
      if(vm.user.role!=4 && vm.user.role!=9) {
        LoaderFactory.toggleLoadingWithMessage("無權使用!");
        return;
      }

      var user=vm.userMap[id];
      if(user==null)  {
        LoaderFactory.toggleLoadingWithMessage("無使用者資料!");
        return;
      }
      if(user.role==9) {
        LoaderFactory.toggleLoadingWithMessage("不能刪除管理者!");
        return;
      }
      if(user.role==0 || user.role==1) {
        if(vm.user.role==4)
          {res.status(404).send({ message: '無權使用!'});
           LoaderFactory.toggleLoadingWithMessage("廠商不能刪除一般使用者!");
           return;
          }
      }
      if(user.role==4) {
        if(vm.user.role==4)
        {LoaderFactory.toggleLoadingWithMessage("無權使用!");
         return;
        }
      }
      if(show) LoaderFactory.showLoading('刪除使用者...');
      deleteFirebaseUser(id,function() {
        if(callback) callback();
        if(show) LoaderFactory.hideLoading();
      }, false);
    };

    var deleteuser=function(uid, callback, ashow) {
      var show=false;
      if(typeof ashow==undefined || ashow==null) show=true;
      else show=ashow;
      var user=vm.userMap[uid];
      if(user==null) {
        LoaderFactory.toggleLoadingWithMessage("無使用者資料?");
        return;
      }
      deletecontrollers(uid);
      deletedatapoints(uid);
      deletecameras(uid);
      deletegpsloggers(uid);
      deleterules(uid);

      deletelayouts(uid);

      if(user.role==4) {
        if(user.hasOwnProperty('ownedCompanyid')) {
          deleteCompany(user.ownedCompanyid, null, false);
        }
      }
      delete vm.userMap[uid];
      firebase.database().ref().child('/users/'+uid).remove(function(error){
       if(error)
        {if(show) LoaderFactory.hideLoading();
          LoaderFactory.toggleLoadingWithMessage(error);
          return;
        }
       else
        {if(show) LoaderFactory.hideLoading();
          delete vm.userMap[uid];
          getUsers();
         if(callback) callback();
        }
      });
    };

    var deleteCompany=function(companyid, callback, ashow) {
      var show=false;
      if(typeof ashow==undefined || ashow==null) show=true;
      else show=ashow;
      Object.keys(vm.userMap).forEach(function(uid){  // delete customers
        var u=vm.userMap[uid];
        if(u.hasOwnProperty('companyid') && u.companyid==companyid) deleteuser(uid,null,false);
      });
      firebase.database().ref().child('/products/'+companyid).remove(function(error){
         if(error)
          {//if(show) LoaderFactory.hideLoading();
            LoaderFactory.toggleLoadingWithMessage(error);
            return;
          }

        });
      firebase.database().ref().child('/companys/'+companyid).remove(function(error){
         if(error)
          {if(show) LoaderFactory.hideLoading();
            LoaderFactory.toggleLoadingWithMessage(error);
            return;
          }
         else
          {if(show) LoaderFactory.hideLoading();
           if(callback) callback();
          }
        });
    };

    var deleterules=function(userid) {
      firebase.database().ref().child('/rules/'+userid).remove(function(error){
         if(error)
          {//if(show) LoaderFactory.hideLoading();
            LoaderFactory.toggleLoadingWithMessage(error);
            return;
          }

        });
    }
    var deletecontrollers=function(userid) {
      firebase.database().ref().child('/controllers/'+userid).remove(function(error){
         if(error)
          {//if(show) LoaderFactory.hideLoading();
            LoaderFactory.toggleLoadingWithMessage(error);
            return;
          }

        });
    };
    var deletedatapoints=function(userid) {
      /*
      var promises=[];
      Object.keys(vm.datapointMap).forEach(function(id){
        var dp=vm.datapointMap[id];
        if(dp.userid==userid) {
    console.log('remove:'+dp.title);
          var p=firebase.database().ref().child('/datapoints/'+userid+'/'+dp.id).remove(function(error){
             if(error)
              {//if(show) LoaderFactory.hideLoading();
                LoaderFactory.toggleLoadingWithMessage(error);
                return;
              }
            });
          promises.push(p);
        }
      });
      Promise.all(promises).then(function(data){

    //    firebase.database().ref().child('/datapoints/'+userid).off();
        */
        firebase.database().ref().child('/datapoints/'+userid).remove(function(error){
           if(error)
            {//if(show) LoaderFactory.hideLoading();
              LoaderFactory.toggleLoadingWithMessage(error);
              return;
            }

          });
    };
    var deletecameras=function(userid) {
      firebase.database().ref().child('/cameras/'+userid).remove(function(error){
         if(error)
          {//if(show) LoaderFactory.hideLoading();
            LoaderFactory.toggleLoadingWithMessage(error);
            return;
          }

        });
    };
    var deletegpsloggers=function(userid) {
      firebase.database().ref().child('/gpsloggers/'+userid).remove(function(error){
         if(error)
          {//if(show) LoaderFactory.hideLoading();
            LoaderFactory.toggleLoadingWithMessage(error);
            return;
          }

        });
    };
    var deletelayouts=function(userid) {
      firebase.database().ref().child('/layoutimages/'+userid).remove(function(error){
         if(error)
          {//if(show) LoaderFactory.hideLoading();
            LoaderFactory.toggleLoadingWithMessage(error);
            return;
          }

        });
      firebase.database().ref().child('/layoutlabels/'+userid).remove(function(error){
           if(error)
            {//if(show) LoaderFactory.hideLoading();
              LoaderFactory.toggleLoadingWithMessage(error);
              return;
            }

        });
      firebase.database().ref().child('/layouts/'+userid).remove(function(error){
         if(error)
          {//if(show) LoaderFactory.hideLoading();
            LoaderFactory.toggleLoadingWithMessage(error);
            return;
          }

        });
    };


    var addLayout= function(layout, callback, ashow) {
    layout=deleteUndefined(deleteKey(layout));
      var show=false;
      if(typeof ashow==undefined || ashow==null) show=true;
      else show=ashow;
      var u=vm.userMap[layout.userid];
      if(u.role==9 || u.role==4) return;
      layout.createdAt=new Date().getTime();
//    console.log(layout);
      if(show) LoaderFactory.showLoading('新增監控配置...');
      var key = firebase.database().ref().child('/layouts/'+u.uid).push().key;
       layout.id=key;
       layout.createdAt=new Date().getTime();
       firebase.database().ref().child('/layouts/'+u.uid+'/'+layout.id).set(layout, function(error) {
        if (error) {
           if(show) LoaderFactory.hideLoading();
           LoaderFactory.toggleLoadingWithMessage(error);
           return;
        } else {
           if(show) LoaderFactory.hideLoading();
           vm.layoutMap[layout.id]=layout;
           if(callback) callback();
        }});
    }
    var addlayoutimage= function(image, callback, ashow) {
    image=deleteUndefined(deleteKey(image));
      var show=false;
      if(typeof ashow==undefined || ashow==null) show=true;
      else show=ashow;
      var layout=vm.layoutMap[image.layoutid];
      var u=vm.userMap[layout.userid];
      if(u.role==9 || u.role==4) return;
  //  console.log(image);
      if(show) LoaderFactory.showLoading('新增圖片...');
      var key = firebase.database().ref().child('/layoutimages/'+u.uid).push().key;
       image.id=key;
       image.createdAt=new Date().getTime();
       firebase.database().ref().child('/layoutimages/'+u.uid+'/'+image.id).set(image, function(error) {
        if (error) {
           if(show) LoaderFactory.hideLoading();
           LoaderFactory.toggleLoadingWithMessage(error);
           return;
        } else {
           if(show) LoaderFactory.hideLoading();
           vm.layoutimageMap[image.id]=image;
           if(callback) callback();
        }});
    }
    var addlayoutlabel= function(label, callback, ashow) {
    label=deleteUndefined(deleteKey(label));
      var show=false;
      if(typeof ashow==undefined || ashow==null) show=true;
      else show=ashow;
      var layout=vm.layoutMap[label.layoutid];
      var u=vm.userMap[layout.userid];
      if(u.role==9 || u.role==4) return;
//    console.log(label);
      if(show) LoaderFactory.showLoading('新增標示...');
      var key = firebase.database().ref().child('/layoutlabels/'+u.uid).push().key;
       label.id=key;
       label.createdAt=new Date().getTime();
       firebase.database().ref().child('/layoutlabels/'+u.uid+'/'+label.id).set(label, function(error) {
        if (error) {
           if(show) LoaderFactory.hideLoading();
           LoaderFactory.toggleLoadingWithMessage(error);
           return;
        } else {
           if(show) LoaderFactory.hideLoading();
           vm.layoutlabelMap[label.id]=label;
           if(callback) callback();
        }});
    }
    var addDatapoint= function(datapoint, callback, ashow) {
datapoint=deleteUndefined(deleteKey(datapoint));
      var show=false;
      if(typeof ashow==undefined || ashow==null) show=true;
      else show=ashow;
      var u=vm.userMap[datapoint.userid];
      if(u.role==9 || u.role==4) return;
      datapoint.createdAt=new Date().getTime();
//console.log(datapoint);
      if(show) LoaderFactory.showLoading('新增資料點...');
      var key = firebase.database().ref().child('/datapoints/'+u.uid).push().key;
       datapoint.id=key;
       firebase.database().ref().child('/datapoints/'+u.uid+'/'+datapoint.id).set(datapoint, function(error) {
        if (error) {
           if(show) LoaderFactory.hideLoading();
           LoaderFactory.toggleLoadingWithMessage(error);
           return;
        } else {
           if(show) LoaderFactory.hideLoading();
           vm.datapointMap[datapoint.id]=datapoint;
           if(callback) callback();
        }});
    }
    var addController= function(controller, callback, ashow) {
  controller=deleteUndefined(deleteKey(controller));
     var show=false;
     if(typeof ashow==undefined || ashow==null) show=true;
     else show=ashow;
      var u=vm.userMap[controller.userid];
      if(u.role==9 || u.role==4) return;
      if(controller.hasOwnProperty("datapoints")) delete controller.datapoints;
      if(show) LoaderFactory.showLoading('新增控制器...');
      var key = firebase.database().ref().child('/controllers/'+u.uid).push().key;
       controller.id=key;
       controller.createdAt=new Date().getTime();
       firebase.database().ref().child('/controllers/'+u.uid+'/'+controller.id).set(controller, function(error) {
        if (error) {
           if(show) LoaderFactory.hideLoading();
           LoaderFactory.toggleLoadingWithMessage(error);
           return;
        } else {
           if(show) LoaderFactory.hideLoading();
           vm.controllerMap[controller.id]=controller;
           if(callback) callback();
        }
      });

    }
    var addGPSLogger= function(gpslogger, callback, ashow) {
  gpslogger=deleteUndefined(deleteKey(gpslogger));
  var show=false;
  if(typeof ashow==undefined || ashow==null) show=true;
  else show=ashow;
      var u=vm.userMap[gpslogger.userid];
      if(u.role==9 || u.role==4) return;
      if(show) LoaderFactory.showLoading('新增控制器...');
      var key = firebase.database().ref().child('/gpsloggers/'+u.uid).push().key;
       gpslogger.id=key;
       gpslogger.createdAt=new Date().getTime();
       firebase.database().ref().child('/gpsloggers/'+u.uid+'/'+gpslogger.id).set(gpslogger, function(error) {
        if (error) {
           if(show) LoaderFactory.hideLoading();
           LoaderFactory.toggleLoadingWithMessage(error);
           return;
        } else {
           if(show) LoaderFactory.hideLoading();
           vm.gpsloggerMap[gpslogger.id]=gpslogger;
           if(callback) callback();
        }
      });
    }
    var addCamera=function(camera, callback, ashow) {
  camera=deleteUndefined(deleteKey(camera));
  var show=false;
  if(typeof ashow==undefined || ashow==null) show=true;
  else show=ashow;
      var u=vm.userMap[camera.userid];
      if(u.role==9 || u.role==4) return;
      if(show) LoaderFactory.showLoading('新增攝影機...');
      var key = firebase.database().ref().child('/cameras/'+u.uid).push().key;
       camera.id=key;
       camera.createdAt=new Date().getTime();
       firebase.database().ref().child('/cameras/'+u.uid+'/'+camera.id).set(camera, function(error) {
        if (error) {
           if(show) LoaderFactory.hideLoading();
           LoaderFactory.toggleLoadingWithMessage(error);
           return;
        } else {
           if(show) LoaderFactory.hideLoading();
           vm.cameraMap[camera.id]=camera;
           if(callback) callback();
        }
      });
    }
    var addCompany=function(company, callback, ashow) {
company=deleteUndefined(deleteKey(company));
var show=false;
if(typeof ashow==undefined || ashow==null) show=true;
else show=ashow;
      if(show) LoaderFactory.showLoading('新增公司...');
      var key = firebase.database().ref().child('companys').push().key;
      company.id=key;
      company.createdAt=new Date().getTime();
      firebase.database().ref().child('companys/'+company.id).set(company, function(error) {
       if (error) {
          if(show) LoaderFactory.hideLoading();
          LoaderFactory.toggleLoadingWithMessage(error);
          return;
       } else {
          vm.companyMap[company.id]=company;
          getCompanys();
          var admin=vm.userMap[company.adminuid];
          admin.ownedCompanyid=company.id;
          firebase.database().ref().child('users/'+company.adminuid).set(admin, function(error) {
                 if(error) {
                   if(show) LoaderFactory.hideLoading();
                   LoaderFactory.toggleLoadingWithMessage(error);
                   return;
                 }
                 if(show) LoaderFactory.hideLoading();
                 if(callback) callback();
                });
            }
      });
    }
    var addRule=function(rule, callback, ashow) {
//      console.log(rule);
      rule=deleteUndefined(deleteKey(rule));
      var show=false;
      if(typeof ashow==undefined || ashow==null) show=true;
      else show=ashow;
//console.log(rule);
      var u=vm.userMap[rule.userid];
      if(u.role==9 || u.role==4) return;
      if(show) LoaderFactory.showLoading('新增規則...');
      var key = firebase.database().ref().child('/rules/'+u.uid).push().key;
       rule.id=key;
      //console.log(rule);
      rule.createdAt=new Date().getTime();
       firebase.database().ref().child('/rules/'+u.uid+'/'+rule.id).set(rule, function(error) {
        if (error) {
           if(show) LoaderFactory.hideLoading();LoaderFactory.toggleLoadingWithMessage(error);return;
        } else {
           if(show) LoaderFactory.hideLoading();
           vm.ruleMap[rule.id]=rule;
           if(callback) callback();
        }
      });
    };
    /*
    var addUser=function(user, callback, ashow) {
user=deleteUndefined(deleteKey(user));
var show=false;
if(typeof ashow==undefined || ashow==null) show=true;
else show=ashow;
      if(show) LoaderFactory.showLoading('新增使用者...');
      httpFactory.addUser(vm.user.uid, user).success(function(data) {
//        console.log(data);
    //      delete user.password;
//    console.log(data);
          LoaderFactory.hideLoading();
          user.uid=data.uid;
          vm.userMap[user.uid]=user;
          if(callback) callback();
        }).error(function(err, statusCode) {
          LoaderFactory.hideLoading();
          LoaderFactory.toggleLoadingWithMessage(err.message);
        });
    }
    */
    var addUser=function(user, callback, ashow) {
//console.log(user);
user=deleteUndefined(deleteKey(user));
var show=false;
if(typeof ashow==undefined || ashow==null) show=true;
else show=ashow;

if(user.email==null || user.email.length==0)
 {LoaderFactory.toggleLoadingWithMessage('請輸入email!');
  return;
 }
if(user.password==null || user.password.length==0)
 {LoaderFactory.toggleLoadingWithMessage('請輸入密碼!');
  return;
 }
if(user.name==null || user.name.length==0)
 {LoaderFactory.toggleLoadingWithMessage('請輸入姓名!');
  return;
 }
 if(user.password.length<6)
  {LoaderFactory.toggleLoadingWithMessage('密碼必須多於6個字元!');
   return;
  }


      if(show) LoaderFactory.showLoading('新增使用者...');
      addFirebaseUser(user,function() {
        if(callback) callback();
        if(show) LoaderFactory.hideLoading();
      });
    };

    var addFirebaseUser=function(user, callback) {
      var currentuser=vm.user;
      $firebaseAuth().$createUserWithEmailAndPassword(user.email, user.password)
      .then(function(u) {
        user.uid=u.uid;
        user.active=true;
        user.createdAt=new Date().getTime();
        delete user.password;
        delete user.password1;
        firebase.database().ref().child('users/'+u.uid).set(user, function(error) {
         if (error) {
            LoaderFactory.toggleLoadingWithMessage(error);return;
         } else {
            login(currentuser,callback,false,false);
         }
        });
      })
      .catch(function(error) {LoaderFactory.toggleLoadingWithMessage(error);});
    };

    var updateDatapoint= function(datapoint, callback) {
      datapoint=deleteUndefined(deleteKey(datapoint));
  //  console.log(firebase.auth().currentUser.uid);
  //  console.log(datapoint);
      var u=vm.userMap[datapoint.userid];
      if(u.role==9 || u.role==4) return;
      var datas=datapoint.datas;
      var data=datapoint.data;
      var labels=datapoint.labels;
      var series=datapoint.series;
      var gaugetype=datapoint.gaugetype;
      var imageon=datapoint.imageon;
      var imageoff=datapoint.imageoff;
      delete datapoint.perioddataready;
      delete datapoint.datas;
      delete datapoint.data;
      delete datapoint.labels;
      delete datapoint.series;
      delete datapoint.gaugetype;
      delete datapoint.imageon;
      delete datapoint.imageoff;
      LoaderFactory.showLoading('更新資料點...');
      firebase.database().ref().child('/datapoints/'+u.uid+'/'+datapoint.id).set(datapoint, function(error) {
       if (error) {
          LoaderFactory.hideLoading();
          datapoint.datas=datas;
          datapoint.data=data;
          datapoint.labels=labels;
          datapoint.series=series;
          datapoint.gaugetype=gaugetype;
          datapoint.imageon=imageon;
          datapoint.imageoff=imageoff;
          LoaderFactory.toggleLoadingWithMessage(error);return;
       } else {
          LoaderFactory.hideLoading();
          datapoint.datas=datas;
          datapoint.data=data;
          datapoint.labels=labels;
          datapoint.series=series;
          datapoint.gaugetype=gaugetype;
          datapoint.imageon=imageon;
          datapoint.imageoff=imageoff;
          if(callback) callback();
       }
      });
    }
    var updateLayout= function(layout, callback, showmessage) {
      layout=deleteUndefined(deleteKey(layout));
//    console.log(firebase.auth().currentUser.uid);
//    console.log(datapoint);
      var u=vm.userMap[layout.userid];
      if(u.role==9 || u.role==4) return;
      var layoutimages=layout.layoutimages;
      var layoutlabels=layout.layoutlabels;
      var bg=layout.background;
      delete layout.layoutimages;
      delete layout.layoutlabels;
      delete layout.background;
      if(angular.isString(layout.size)) layout.size=parseInt(layout.size);
      if(showmessage) LoaderFactory.showLoading('更新圖控資料...');
//console.log(layout);
      firebase.database().ref().child('/layouts/'+u.uid+'/'+layout.id).set(layout, function(error) {
       if (error) {
          if(showmessage)LoaderFactory.hideLoading();
          layout.layoutimages=layoutimages;
          layout.layoutlabels=layoutlabels;
          layout.background=bg;
          LoaderFactory.toggleLoadingWithMessage(error);return;
       } else {
          if(showmessage) LoaderFactory.hideLoading();
          layout.layoutimages=layoutimages;
          layout.layoutlabels=layoutlabels;
          layout.background=bg;
          if(callback) callback();
       }
      });
    }
    var updatelayoutimage= function(image, callback, showmessage) {
      image=deleteUndefined(deleteKey(image));
      var layout=vm.layoutMap[image.layoutid];
      var u=vm.userMap[layout.userid];
      if(u.role==9 || u.role==4) return;
      if(showmessage) LoaderFactory.showLoading('更新圖片資料...');
      if(!image.createdAt) image.createdAt=new Date().getTime();
      if(angular.isString(image.height)) image.height=parseInt(image.height.replace("px",""));
      if(angular.isString(image.width)) image.width=parseInt(image.width.replace("px",""));
      if(angular.isString(image.value)) image.value=Number(image.value);
      delete image.visable;
      var dp=image.datapoint;
      delete image.datapoint;
//console.log(image.x+' '+image.y);
      firebase.database().ref().child('/layoutimages/'+u.uid+'/'+image.id).set(image, function(error) {
       if (error) {
          if(showmessage) LoaderFactory.hideLoading();
          image.datapoint=dp;
          LoaderFactory.toggleLoadingWithMessage(error);return;
       } else {
//console.log(image);
          if(showmessage) LoaderFactory.hideLoading();
          image.datapoint=dp;
          if(callback) callback();
       }
      });
    }
    var updatelayoutlabel= function(label, callback, showmessage) {
      label=deleteUndefined(deleteKey(label));
      var layout=vm.layoutMap[label.layoutid];
      var u=vm.userMap[layout.userid];
      if(u.role==9 || u.role==4) return;
      if(showmessage) LoaderFactory.showLoading('更新圖片資料...');
      if(!label.createdAt) label.createdAt=new Date().getTime();
      var dp=label.datapoint;
      delete label.datapoint;
      delete label.visible;
      delete label.visable;
      delete label.height;
      delete label.width;
      if(angular.isString(label.size)) label.size=parseInt(label.size);
      if(angular.isString(label.dotnumber)) label.dotnumber=parseInt(label.dotnumber);
//console.log(label);
      firebase.database().ref().child('layoutlabels/'+u.uid+'/'+label.id).set(label, function(error) {
       if (error) {
  //console.log(error);
          if(showmessage) LoaderFactory.hideLoading();
          label.datapoint=dp;
          LoaderFactory.toggleLoadingWithMessage(error);return;
       } else {
          if(showmessage) LoaderFactory.hideLoading();
          label.datapoint=dp;
          if(callback) callback();
       }
      });
    }

    var updateController= function(controller, callback) {
      controller=deleteUndefined(deleteKey(controller));
      var u=vm.userMap[controller.userid];
      if(u.role==9 || u.role==4) return;
      if(controller.hasOwnProperty("datapoints")) delete controller.datapoints;
      delete controller.tablerows;
      delete controller.tableheads;
      LoaderFactory.showLoading('更新控制器...');
      firebase.database().ref().child('/controllers/'+u.uid+'/'+controller.id).set(controller, function(error) {
       if (error) {
          LoaderFactory.hideLoading();LoaderFactory.toggleLoadingWithMessage(error);return;
       } else {
          LoaderFactory.hideLoading();
          if(callback) callback();
       }
      });
    }
    var updateGPSLogger= function(gpslogger, callback) {
      gpslogger=deleteUndefined(deleteKey(gpslogger));
      var u=vm.userMap[gpslogger.userid];
      if(u.role==9 || u.role==4) return;
      LoaderFactory.showLoading('更新控制器...');
      firebase.database().ref().child('/gpsloggers/'+u.uid+'/'+gpslogger.id).set(gpslogger, function(error) {
       if (error) {
          LoaderFactory.hideLoading();LoaderFactory.toggleLoadingWithMessage(error);return;
       } else {
          LoaderFactory.hideLoading();
          if(callback) callback();
       }
     });
    }
    var updateCamera=function(camera, callback) {
      camera=deleteUndefined(deleteKey(camera));
      var u=vm.userMap[camera.userid];
      if(u.role==9 || u.role==4) return;
      LoaderFactory.showLoading('更新攝影機...');
      firebase.database().ref().child('/cameras/'+u.uid+'/'+camera.id).set(camera, function(error) {
       if (error) {
          LoaderFactory.hideLoading();LoaderFactory.toggleLoadingWithMessage(error);return;
       } else {
          LoaderFactory.hideLoading();
          if(callback) callback();
       }
      });
    };

    var updateCompany=function(company, callback) {
      company=deleteUndefined(deleteKey(company));
      LoaderFactory.showLoading('更新公司...');
      firebase.database().ref().child('companys/'+company.id).set(company, function(error) {
       if (error) {
          LoaderFactory.hideLoading();LoaderFactory.toggleLoadingWithMessage(error);return;
       } else {
          vm.companyMap[company.id]=company;
          var u=vm.userMap[company.adminuid];
          u.ownedCompanyid=company.id;
          updateUser(u,function(){},false);
          getCompanys();
          if(callback) callback();
          LoaderFactory.hideLoading();
       }
     });
    }
    var updateRule=function(rule, callback) {
      rule=deleteUndefined(deleteKey(rule));
      var u=vm.userMap[rule.userid];
      if(u.role==9 || u.role==4) return;
      LoaderFactory.showLoading('更新規則...');
      firebase.database().ref().child('/rules/'+u.uid+'/'+rule.id).set(rule, function(error) {
       if (error) {
          LoaderFactory.hideLoading();LoaderFactory.toggleLoadingWithMessage(error);return;
       } else {
          LoaderFactory.hideLoading();
          if(callback) callback();
       }
       });
    };

var updateUser=function(user, callback, showmessage) {

  user=deleteUndefined(deleteKey(user));
if(user.email==null || user.email.length==0)
 {LoaderFactory.toggleLoadingWithMessage('請輸入email!');
  return;
 }
if(user.password==null || user.password.length==0)
 {LoaderFactory.toggleLoadingWithMessage('請輸入密碼!');
  return;
 }
if(user.name==null || user.name.length==0)
 {LoaderFactory.toggleLoadingWithMessage('請輸入姓名!');
  return;
 }
 if(user.password.length<6)
  {LoaderFactory.toggleLoadingWithMessage('密碼必須多於6個字元!');
   return;
  }

  if(showmessage) LoaderFactory.showLoading('更新使用者...');
  updateFirebaseUser(user,function(){
    if(callback) callback();
    if(showmessage) LoaderFactory.hideLoading();
  }, showmessage);

}

var isCompanyAdminForUser=function(uid) {
  if(!vm.isCompanyAdmin) return false;
  if(!uid.companyid) return false;
  if(vm.user.ownedCompanyid!=uid.companyid) return false;
  return true;
};

var updateFirebaseUser=function(user, callback, showmessage) {
//console.log('updateFirebaseUser');
//console.log(user);
  var fcu = firebase.auth().currentUser;
//console.log(fcu.uid+' '+user.uid);
  if(user.uid==fcu.uid) {
    if(user.email!=fcu.email) {
      fcu.updateEmail(user.email).then(function() {
         }, function(error) {
         LoaderFactory.toggleLoadingWithMessage(error);
        });
    }
    if(user.password!=fcu.password) {
     fcu.updatePassword(user.password).then(function() {
       firebase.database().ref().child('users/'+user.uid).set(user, function(error) {
        if (error) {
           LoaderFactory.toggleLoadingWithMessage(error);return;
        } else {

        }
       });

      }, function(error) {
        LoaderFactory.toggleLoadingWithMessage(error);
      });
   }
   delete user.password;
   delete user.password1;
//console.log(user);
   firebase.database().ref().child('users/'+user.uid).set(user, function(error) {
     if (error) {
        LoaderFactory.toggleLoadingWithMessage(error);return;
     } else {

     }
    });
  }

  if(vm.isAdmin || isCompanyAdminForUser(user.uid)) {
    var pe={};
    pe.email=user.email
    if(user.password) pe.password=user.password;
    firebase.database().ref().child('pe/'+user.uid).set(pe, function(error) {
      if (error) {
        LoaderFactory.toggleLoadingWithMessage(error);return;
      } else {

      }
    });

   delete user.password;
   delete user.password1;
   firebase.database().ref().child('users/'+user.uid).set(user, function(error) {
     if (error) {
       LoaderFactory.toggleLoadingWithMessage(error);return;
     } else {

     }
   });
 }
  /*
  var currentuser=vm.user;
  console.log('updateFirebaseUser:'+user.email+' '+user.password1);
  $firebaseAuth().$signInWithEmailAndPassword(user.email, user.password1)
  .then(function(u) {

    var fu = firebase.auth().currentUser;
  //console.log(fu);
    if(fu.email!=user.email) {
      fu.updateEmail(user.email).then(function() {
         }, function(error) {
         LoaderFactory.toggleLoadingWithMessage(error);
        });
    }
   if(user.password!=user.password1) {
     fu.updatePassword(user.password).then(function() {
       firebase.database().ref().child('users/'+user.uid).set(user, function(error) {
        if (error) {
           LoaderFactory.toggleLoadingWithMessage(error);return;
        } else {
           login(currentuser,callback,false,false);
        }
       });

      }, function(error) {
        LoaderFactory.toggleLoadingWithMessage(error);
      });
   } else {
     firebase.database().ref().child('users/'+user.uid).set(user, function(error) {
      if (error) {
         LoaderFactory.toggleLoadingWithMessage(error);return;
      } else {
         login(currentuser,callback,false,false);
      }
     });
   }


   })
  .catch(function(error) {LoaderFactory.toggleLoadingWithMessage(error);});
  */
};
/*
    var toChartData=function(data) {
      var d={};
      d.id=data.key;
      d.datas=toArray(data.val());
//      console.log(d.datas);
      return d;
    };
    */
/*
    var getDatas=function(datapointid, endtimestamp, numberperpage, callback) {
  //console.log(numberperpage);
      var dp=vm.datapointMap[datapointid];
      var u=vm.userMap[dp.userid];
      firebase.database().ref().child('datas/'+u.uid+'/'+datapointid)
      .orderByChild('createdAt')
      .endAt(endtimestamp)  //1491307822407
      .limitToLast(numberperpage)
      .once('value', function(data) {

          callback(toChartData(data));
        }, function(error) {alert(error);});

    };
*/
    var periodptno=30;
    var getPeriodDatas=function(datapointid, starttimestamp, endtimestamp, callback) {
  //console.log(numberperpage);
      var dp=vm.datapointMap[datapointid];
      var u=vm.userMap[dp.userid];
      var first={createdAt: starttimestamp, value:0.0};

      firebase.database().ref().child('datas/'+u.uid+'/'+datapointid)
        .orderByChild('createdAt')
        .endAt(starttimestamp)
        .limitToLast(1)
        .once('value', function(data) {
          if(!data.exists()) {

          }
        //        console.log(toArray(data.val())[0].value);
          first.value=toArray(data.val())[0].value;
          firebase.database().ref().child('datas/'+u.uid+'/'+datapointid)
          .orderByChild('createdAt')
          .startAt(starttimestamp)
          .endAt(endtimestamp)
    //      .limitToLast(5)
          .once('value', function(dt) {
            var ary=[];
            if(!dt.exists()) {
              ary.push(first);
              ary.push({createdAt: endtimestamp, value: first.value});
            } else {
              ary=toArray(dt.val());
              ary.unshift(first);
            }
//            console.log(ary);
            var times=[];
            var tick=(endtimestamp-starttimestamp)/periodptno;
            for(var i=0;i<=periodptno;i++) {
              times.push(starttimestamp+i*tick);
            }
            var obj = {
              table: ary,
              interpolation: function (time) {
                for(var i=0;i<ary.length;i++) {
                  if(time<ary[i].createdAt) {
                    return {createdAt: time, value: ary[i-1].value}
                  }
                }
               return {createdAt: time, value: ary[0].value}
              }
            }
            var dary=times.map(obj.interpolation,obj);
//    console.log(dary);
      //      console.log(first);
      //      console.log(toArray(data.val()));
    //      console.log(toArray(data.val()).unshift({createdAt: starttimestamp, value:firstvalue}));
    //          callback(toChartData(data));
              callback(dary);
            }, function(error) {alert(error);});


       }, function(error) {alert(error);});

    };

    var setScopeData=function($scope) {
      //$scope.users=vm.users;
    //$scope.companys=vm.companys;
    $scope.controllers=vm.controllers;
    $scope.gpsloggers=vm.gpsloggers;
    $scope.cameras=vm.cameras;
    $scope.datapoints=vm.datapoints;
    $scope.rules=vm.rules;
    $scope.layouts=vm.layouts;

    $scope.companyMap=vm.companyMap;
    $scope.userMap=vm.userMap;
    $scope.controllerMap=vm.controllerMap;
    $scope.gpsloggerMap=vm.gpsloggerMap;
    $scope.cameraMap=vm.cameraMap;
    $scope.datapointMap=vm.datapointMap;
    $scope.ruleMap=vm.ruleMap;
    $scope.layoutMap=vm.layoutMap;
    };

   var loadcompany=function(callback) {
  var starttime=new Date().getTime();
     if(vm.isGuest || vm.isUser) {
       if(callback) callback();
       return;
     }
     if(vm.isCustomer) {
       var comref=firebase.database().ref().child('companys/'+vm.user.companyid);
       comref.once('value', function(data) {
         if(!data.exists()) {if(callback) callback();return;}
           var company=data.val();
           vm.companyMap[vm.user.companyid]=company;
           getCompanys();
           setCompany(company.id);
           if(callback) callback();
       },function(error) {
         LoaderFactory.toggleLoadingWithMessage(error);
         if(callback) callback();
         return;
      });
    } else if(vm.isCompanyAdmin) {
       var comref=firebase.database().ref().child('companys/'+vm.user.ownedCompanyid);
       comref.once('value', function(data) {
         if(!data.exists()) {if(callback) callback();return;}
           var company=data.val();
           vm.companyMap[vm.user.ownedCompanyid]=company;
           getCompanys();
           setCompany(company.id);
           if(callback) callback();
       },function(error) {
         LoaderFactory.toggleLoadingWithMessage(error);
if(callback) callback();
         return;
      });
     } else if(vm.isAdmin) {
       var comref=firebase.database().ref().child('companys');
       comref.once('value', function(data) {
			    if(!data.exists()) {if(callback) callback();return;}
 			    vm.companyMap=data.val();
 			    getCompanys();
          if(vm.companys.length>0) setCompany(vm.companys[0].id);
          if(callback) callback();
		   },function(error) {
			    LoaderFactory.toggleLoadingWithMessage(error);
if(callback) callback();
          return;
		   });

       comref.orderByChild('createdAt').startAt(starttime).on('child_added', function(data) {
         if(!data.exists()) return;
         var u=data.val();
         vm.companyMap[u.id]=u;
         getCompanys();
       });
  /*
       comref.on('child_changed', function(data) {
         if(!data.exists()) return;
         var dp=data.val();
         var old=vm.companyMap[dp.id];
         if(old==null || old=='undefined') {
           vm.companyMap[dp.id]=dp;
           getCompanys();
           return;
         }
         Object.keys(dp).forEach(function(key){
            old[key]=dp[key];
          });
         getCompanys();
       });
  */
       comref.on('child_removed', function(data) {
        if(!data.exists()) return;
        var u=data.val();
        delete vm.companyMap[u.id];
        getCompanys();
       });
     }
  };
   var loadusers=function(callback) {
  var starttime=new Date().getTime();
     if(vm.isCustomer) {
       var userref=firebase.database().ref().child('users/'+vm.user.uid);
       userref.once('value').then(function(data) {
         if(!data.exists()) {LoaderFactory.toggleLoadingWithMessage('loadusers error!');if(callback) callback();return;}
         var u=data.val();
  //       u.password1=u.password;
         vm.userMap[vm.user.uid]=u;
         getUsers();
         if(callback) callback();
         return;
       })
       .catch(function(error) {
          LoaderFactory.toggleLoadingWithMessage(error);
if(callback) callback();
          return;
       });
     }
     var userref=firebase.database().ref().child('users');
     userref.once('value').then(function(data) {
       if(!data.exists()) {LoaderFactory.toggleLoadingWithMessage('loadusers error!');if(callback) callback();return;}
       var obj=data.val();
       if(vm.isAdmin) {
         vm.userMap=obj;
         Object.keys(vm.userMap).forEach(function(uid){
           var u=vm.userMap[uid];
//           u.password1=u.password;
         });
       }
       else if(vm.isCompanyAdmin) {
         vm.userMap={};
         vm.userMap[vm.user.uid]=vm.user;
         var uids=Object.keys(obj);
         uids.forEach(function(uid){
           var u=obj[uid];
           if(u.companyid==vm.user.ownedCompanyid) {
        //     u.password1=u.password;
             vm.userMap[uid]=u;
           }
         });
       }
       else if(vm.isUser || vm.isGuest) {
         vm.userMap={};
         var us=toArray(obj);
         for(var i=0;i<us.length;i++) {
           var u=us[i];
           if(u.role!=2) continue;
           if(u.public) {
  //console.log('add user:'+u.name);
             vm.userMap[u.uid]=u;
           }
         }
         for(var i=0;i<us.length;i++) {
           var u=us[i];
           if(u.role==9 || u.role==4 || u.role==2) continue;
    //       u.password1=u.password;
           vm.userMap[u.uid]=u;
         }
       }
//  console.log(vm.userMap);
       getUsers();
        if(callback) callback();
     })
     .catch(function(error) {
        LoaderFactory.toggleLoadingWithMessage(error);
if(callback) callback();
        return;
     });

  userref.orderByChild('createdAt').startAt(starttime).on('child_added', function(data) {
    if(!data.exists()) return;
    var u=data.val();
//    u.password1=u.password;
    if(vm.isAdmin) vm.userMap[u.uid]=u;
    else if(vm.isCompanyAdmin) {
      if(u.companyid==vm.user.ownedCompanyid) vm.userMap[u.uid]=u;
    }
    else if(vm.isCustomer) {
      if(u.uid==vm.user.uid) vm.userMap[u.uid]=u;
    }
    else if(vm.isUser || vm.isGuest) {
      if(u.role==0 || u.role==1) vm.userMap[u.uid]=u;
    }
    getUsers();
  });
/*
  userref.on('child_changed', function(data) {
    if(!data.exists()) return;
    var u=data.val();
    u.password1=u.password;
    if(vm.isAdmin) vm.userMap[u.uid]=u;
    else if(vm.isCompanyAdmin) {
      if(u.companyid==vm.user.ownedCompanyid) vm.userMap[u.uid]=u;
    }
    else if(vm.isCustomer) {
      if(u.uid==vm.user.uid) vm.userMap[u.uid]=u;
    }
    else if(vm.isUser || vm.isGuest) {
      if(u.role==0 || u.role==1) vm.userMap[u.uid]=u;
    }
    getUsers();
  });
*/
 userref.on('child_removed', function(data) {
   if(!data.exists()) return;
   var u=data.val();
//   u.password1=u.password;
//console.log('child_removed:'+u.uid);
   delete vm.userMap[u.uid];
/*
   if(vm.isAdmin) delete vm.userMap[u.uid];
   else if(vm.isCompanyAdmin) {
     if(u.companyid==vm.user.ownedCompanyid) delete vm.userMap[u.uid];
   }
   else if(vm.isCustomer) {}
   else if(vm.isUser || vm.isGuest) {
     if(u.role==0 || u.role==1) delete vm.userMap[u.uid];
   }
   */
   getUsers();
  });
};

   var createLock=function() {
     vm.lock={};
     vm.lock.controller=false;
     vm.lock.camera=false;
     vm.lock.gpslogger=false;
     vm.lock.rule=false;
     vm.lock.datapoint=false;

     vm.lock.layout=false;
     vm.lock.layoutimage=false;
     vm.lock.layoutlabel=false;
   }
   var checkLock=function() {
  //console.log(vm.lock);
     if(!vm.lock.controller) return false;
     if(!vm.lock.datapoint) return false;
     if(!vm.lock.camera) return false;
     if(!vm.lock.gpslogger) return false;
     if(!vm.lock.rule) return false;

     if(!vm.lock.layout) return false;
     if(!vm.lock.layoutimage) return false;
     if(!vm.lock.layoutlabel) return false;
     return true;
   }

   var removeStringArrayElement=function(array, element) {
     var ind=-1;
     for(var i=0;i<array.length;i++) {
       if(array[i]==element) {ind=i;break;}
     }
     if(ind>=0) array.splice(ind,1);
    };

   var watchoff=function() {
     if(vm.targetUser!=null)
      {var ouid=vm.targetUser.uid;
//       vm.datapoints.forEach(function(dp){watchoffDatapoint(dp);});
       firebase.database().ref().child('datapoints/'+ouid).off();
       firebase.database().ref().child('controllers/'+ouid).off();
       firebase.database().ref().child('cameras/'+ouid).off();
       firebase.database().ref().child('gpsloggers/'+ouid).off();
       firebase.database().ref().child('rules/'+ouid).off();

       firebase.database().ref().child('layouts/'+ouid).off();
       firebase.database().ref().child('layoutimages/'+ouid).off();
       firebase.database().ref().child('layoutlabels/'+ouid).off();

       firebase.database().ref().child('message/'+ouid).off();
      }
   };

   var watchon=function(uid) {

     for(var i=0;i<vm.datapoints.length;i++) {
       watchDatapoint(vm.datapoints[i]);
     }
     for(var i=0;i<vm.controllers.length;i++) {
       watchController(vm.controllers[i]);
     }
     watchChildAddRemove(uid); // datapoints, controllers, cameras, gpsloggers, rules, layouts, layoutimages, layoutlabels
     firebase.database().ref().child('message/'+uid).on('value', function(data) {
            if(!data.exists()) return;
            var msg=data.val();
            alert(msg.body);
      });
   };

    var clearTarget=function() {
      vm.cameras=[];
      vm.controllers=[];
      vm.gpsloggers=[];
      vm.datapoints=[];
      vm.rules=[];
      vm.layouts=[];

      vm.cameraMap={};
      vm.controllerMap={};
      vm.gpsloggerMap={};
      vm.datapointMap={};
      vm.ruleMap={};
      vm.layoutMap={};
      vm.layoutimageMap={};
      vm.layoutlabelMap={};
    };

    var loadTarget=function(uid, redirect) {
//console.log('loadtarget:'+uid);
      clearTarget();
      watchoff();

      vm.targetUser=vm.userMap[uid];
//      $rootScope.targetUser=vm.targetUser;
      $rootScope.common.targetUser=vm.targetUser;
      vm.isOwner=isOwner();
      vm.isTargetAdmin=isTargetAdmin();
    		$rootScope.isOwner=vm.isOwner;    // for justiotapp
    		$rootScope.isTargetAdmin=vm.isTargetAdmin;
        $rootScope.common.isOwner=vm.isOwner;
      	$rootScope.common.isTargetAdmin=vm.isTargetAdmin;

      createLock();
      var dpref=firebase.database().ref().child('datapoints/'+uid);
      dpref.once('value').then(function(data) {
        if(!data.exists()) {
          vm.lock.datapoint=true;
          if(checkLock()) loadcompleted(uid, redirect);
          return;
        }
      var cs=data.val();
      Object.keys(cs).forEach(function(key){
        vm.datapointMap[key]=cs[key];
//console.log(vm.datapointMap[key]);
      });
      vm.lock.datapoint=true;
      if(checkLock()) loadcompleted(uid, redirect);
    }).catch(function(error) {LoaderFactory.toggleLoadingWithMessage(error);});

    var conref=firebase.database().ref().child('controllers/'+uid);
    conref.once('value').then(function(data) {
        if(!data.exists()) {
          vm.lock.controller=true;
          if(checkLock()) loadcompleted(uid, redirect);
          return;
        }
      var cs=data.val();
      Object.keys(cs).forEach(function(key){
        vm.controllerMap[key]=cs[key];
      });
      vm.lock.controller=true;
      if(checkLock()) loadcompleted(uid, redirect);
    }).catch(function(error) {LoaderFactory.toggleLoadingWithMessage(error);});

    var camref=firebase.database().ref().child('cameras/'+uid);

    camref.once('value').then(function(data) {
      if(!data.exists()) {
        vm.lock.camera=true;
        if(checkLock()) loadcompleted(uid, redirect);
        return;
      }
    var cs=data.val();
    Object.keys(cs).forEach(function(key){
      vm.cameraMap[key]=cs[key];
    });
    vm.lock.camera=true;
    if(checkLock()) loadcompleted(uid, redirect);
    }).catch(function(error) {LoaderFactory.toggleLoadingWithMessage(error);});

    var gpsref=firebase.database().ref().child('gpsloggers/'+uid);
    gpsref.once('value').then(function(data) {
      if(!data.exists()) {
        vm.lock.gpslogger=true;
        if(checkLock()) loadcompleted(uid, redirect);
        return;
      }
    var cs=data.val();
    Object.keys(cs).forEach(function(key){
      vm.gpsloggerMap[key]=cs[key];
    });
    vm.lock.gpslogger=true;
    if(checkLock()) loadcompleted(uid, redirect);
    }).catch(function(error) {LoaderFactory.toggleLoadingWithMessage(error);});

    var rref=firebase.database().ref().child('rules/'+uid);
    rref.once('value').then(function(data) {
      if(!data.exists()) {
        vm.lock.rule=true;
        if(checkLock()) loadcompleted(uid, redirect);
        return;
      }
    var cs=data.val();
    Object.keys(cs).forEach(function(key){
      vm.ruleMap[key]=cs[key];
    });
    vm.lock.rule=true;
    if(checkLock()) loadcompleted(uid, redirect);
    }).catch(function(error) {LoaderFactory.toggleLoadingWithMessage(error);});

    var layoutref=firebase.database().ref().child('layouts/'+uid);
    layoutref.once('value').then(function(data) {
      if(!data.exists()) {
        vm.lock.layout=true;
        if(checkLock()) loadcompleted(uid, redirect);
        return;
      }
    var cs=data.val();
    Object.keys(cs).forEach(function(key){
      vm.layoutMap[key]=cs[key];
    });
    vm.lock.layout=true;
    if(checkLock()) loadcompleted(uid, redirect);
    }).catch(function(error) {LoaderFactory.toggleLoadingWithMessage(error);});

    var imageref=firebase.database().ref().child('layoutimages/'+uid);
    imageref.once('value').then(function(data) {
      if(!data.exists()) {
        vm.lock.layoutimage=true;
        if(checkLock()) loadcompleted(uid, redirect);
        return;
      }
    var cs=data.val();
    Object.keys(cs).forEach(function(key){
      vm.layoutimageMap[key]=cs[key];
    });
    vm.lock.layoutimage=true;
    if(checkLock()) loadcompleted(uid, redirect);
    }).catch(function(error) {LoaderFactory.toggleLoadingWithMessage(error);});

    var labelref=firebase.database().ref().child('layoutlabels/'+uid);
    labelref.once('value').then(function(data) {
      if(!data.exists()) {
        vm.lock.layoutlabel=true;
        if(checkLock()) loadcompleted(uid, redirect);
        return;
      }
    var cs=data.val();
//console.log(cs);
    Object.keys(cs).forEach(function(key){
      vm.layoutlabelMap[key]=cs[key];
    });
    vm.lock.layoutlabel=true;
    if(checkLock()) loadcompleted(uid, redirect);
    }).catch(function(error) {LoaderFactory.toggleLoadingWithMessage(error);});

    };

   var loadcompleted=function(uid, redirect) {
//console.log('loadcompleted '+redirect);

     setTargetUser(uid, redirect);
   }
   var watchChildAddRemove=function(uid) {
var starttime=new Date().getTime();
          var dpref=firebase.database().ref().child('datapoints/'+uid);
        dpref.orderByChild('createdAt').startAt(starttime).on('child_added', function(data) {
            if(!data.exists()) return;
            var dp=data.val();
            vm.datapointMap[dp.id]=dp;
             watchDatapoint(dp);
             setTargetData(uid);
           });
    /*
        dpref.on('child_changed', function(data) {
            if(!data.exists()) return;
            var dp=data.val();
     //console.log('datapoint child_changed');
     //console.log(dp);
            var old=vm.datapointMap[dp.id];
            if(old==null || old=='undefined') {
              vm.datapointMap[dp.id]=dp;
              watchDatapoint(dp);
              setTargetData(uid);
              return;
            }
            var keys=Object.keys(dp);
            for(var i=0;i<keys.length;i++) {
       //       console.log(keys[i]);
              old[keys[i]]=dp[keys[i]];
            }
     //       Object.keys(dp).forEach(function(key){
     //console.log(key);
     //         vm.datapointMap[dp.id][key]=dp[key];
     //       });
           });
           */
        dpref.on('child_removed', function(data) {
            if(!data.exists()) return;
            var dp=data.val();
            delete vm.datapointMap[dp.id];
            setTargetData(uid);
       //     getDatapoints(uid);
           });

        var conref=firebase.database().ref().child('controllers/'+uid);
        conref.orderByChild('createdAt').startAt(starttime).on('child_added', function(data) {
            if(!data.exists()) return;
            var dp=data.val();
            var dpid=dp.id;
            vm.controllerMap[dp.id]=dp;
            setTargetData(uid);
           });
           /*
        conref.on('child_changed', function(data) {
            if(!data.exists()) return;
            var dp=data.val();
            var old=vm.controllerMap[dp.id];
            if(old==null || old=='undefined') {
              vm.controllerMap[dp.id]=dp;
              setTargetData(uid);
              return;
            }
            Object.keys(dp).forEach(function(key){
              old[key]=dp[key];
            });
           });
           */
        conref.on('child_removed', function(data) {
            if(!data.exists()) return;
            var dp=data.val();
            delete vm.controllerMap[dp.id];
            setTargetData(uid);
           });

        var camref=firebase.database().ref().child('cameras/'+uid);
        camref.orderByChild('createdAt').startAt(starttime).on('child_added', function(data) {
            if(!data.exists()) return;
            var dp=data.val();
            vm.cameraMap[dp.id]=dp;
       //     setTargetData(uid);
            getCameras(uid);
           });
           /*
        camref.on('child_changed', function(data) {
            if(!data.exists()) return;
            var dp=data.val();
            var old=vm.cameraMap[dp.id];
            if(old==null || old=='undefined') {
              vm.cameraMap[dp.id]=dp;
              getCameras(uid);
              return;
            }
            Object.keys(dp).forEach(function(key){
              old[key]=dp[key];
            });
           });
           */
        camref.on('child_removed', function(data) {
            if(!data.exists()) return;
            var dp=data.val();
            delete vm.cameraMap[dp.id];
            getCameras(uid);
     //       setTargetData(uid);
           });

        var gpsref=firebase.database().ref().child('gpsloggers/'+uid);
        gpsref.orderByChild('createdAt').startAt(starttime).on('child_added', function(data) {
            if(!data.exists()) return;
            var dp=data.val();
            vm.gpsloggerMap[dp.id]=dp;
            getGPSLoggers(uid);
     //       setTargetData(uid);
           });
           /*
        gpsref.on('child_changed', function(data) {
            if(!data.exists()) return;
            var dp=data.val();
            var old=vm.gpsloggerMap[dp.id];
            if(old==null || old=='undefined') {
              vm.gpsloggerMap[dp.id]=dp;
              getGPSLoggers(uid);
              return;
            }
            Object.keys(dp).forEach(function(key){
              old[key]=dp[key];
            });
           });
           */
        gpsref.on('child_removed', function(data) {
            if(!data.exists()) return;
            var dp=data.val();
            delete vm.gpsloggerMap[dp.id];
            getGPSLoggers(uid);
       //     setTargetData(uid);
           });
        var rref=firebase.database().ref().child('rules/'+uid);
        rref.orderByChild('createdAt').startAt(starttime).on('child_added', function(data) {
            if(!data.exists()) return;
            var dp=data.val();
            vm.ruleMap[dp.id]=dp;
            getRules(uid);
       //     setTargetData(uid);
           });
           /*
        rref.on('child_changed', function(data) {
            if(!data.exists()) return;
            var dp=data.val();
            var old=vm.ruleMap[dp.id];
            if(old==null || old=='undefined') {
              vm.ruleMap[dp.id]=dp;
              getRules(uid);
              return;
            }
            Object.keys(dp).forEach(function(key){
              old[key]=dp[key];
            });
           });
           */
        rref.on('child_removed', function(data) {
            if(!data.exists()) return;
     //  console.log('rule child_removed');
            var dp=data.val();
     //    console.log(dp);
            delete vm.ruleMap[dp.id];
            getRules(uid);
     //       setTargetData(uid);
           });

           var layoutref=firebase.database().ref().child('layouts/'+uid);
           layoutref.orderByChild('createdAt').startAt(starttime).on('child_added', function(data) {
               if(!data.exists()) return;
               var dp=data.val();
               vm.layoutMap[dp.id]=dp;
               getLayouts(uid);
           //     setTargetData(uid);
              });
              /*
           layoutref.on('child_changed', function(data) {
               if(!data.exists()) return;
               var dp=data.val();
               var old=vm.layoutMap[dp.id];
               if(old==null || old=='undefined') {
                 vm.layoutMap[dp.id]=dp;
                 getLayouts(uid);
                 return;
               }
               Object.keys(dp).forEach(function(key){
                 old[key]=dp[key];
               });
              });
              */
           layoutref.on('child_removed', function(data) {
               if(!data.exists()) return;
           //  console.log('rule child_removed');
               var dp=data.val();
           //    console.log(dp);
               delete vm.layoutMap[dp.id];
               getLayouts(uid);
           //       setTargetData(uid);
              });

           var iref=firebase.database().ref().child('layoutimages/'+uid);
           iref.orderByChild('createdAt').startAt(starttime).on('child_added', function(data) {
               if(!data.exists()) return;
               var dp=data.val();
               vm.layoutimageMap[dp.id]=dp;
               getLayouts(uid);
              //     setTargetData(uid);
             });
             /*
           iref.on('child_changed', function(data) {
              if(!data.exists()) return;
              var dp=data.val();
              var old=vm.layoutimageMap[dp.id];
              if(old==null || old=='undefined') {
                vm.layoutimageMap[dp.id]=dp;
                getLayouts(uid);
                return;
              }
              Object.keys(dp).forEach(function(key){
                old[key]=dp[key];
              });
             });
             */
            iref.on('child_removed', function(data) {
               if(!data.exists()) return;
              //  console.log('rule child_removed');
                var dp=data.val();
              //    console.log(dp);
                delete vm.layoutimageMap[dp.id];
                getLayouts(uid);
              //       setTargetData(uid);
             });

            var labref=firebase.database().ref().child('layoutlabels/'+uid);
            labref.orderByChild('createdAt').startAt(starttime).on('child_added', function(data) {
                 if(!data.exists()) return;
                 var dp=data.val();
       //  console.log(dp);
                 vm.layoutlabelMap[dp.id]=dp;
                 getLayouts(uid);
                //     setTargetData(uid);
               });
               /*
             labref.on('child_changed', function(data) {
                if(!data.exists()) return;
                var dp=data.val();
                var old=vm.layoutlabelMap[dp.id];
                if(old==null || old=='undefined') {
                  vm.layoutlabelMap[dp.id]=dp;
                  getLayouts(uid);
                  return;
                }
       //  console.log('layoutlabel child_changed');
         //console.log(dp);
                Object.keys(dp).forEach(function(key){
                  old[key]=dp[key];
                });

                vm.layoutlabelMap[dp.id].datapoint=vm.datapointMap[dp.datapointid];
       //  console.log(vm.layoutlabelMap[dp.id]);
       //  console.log($rootScope.layout.layoutlabels);
               });
               */
              labref.on('child_removed', function(data) {
                 if(!data.exists()) return;
                //  console.log('rule child_removed');
                  var dp=data.val();
                //    console.log(dp);
                  delete vm.layoutlabelMap[dp.id];
                  getLayouts(uid);
                //       setTargetData(uid);
               });

   }

   var setTargetUser=function(uid, redirect) {
     setTargetData(uid);
//console.log('watch');
     watchon(uid);
  //   if(redirect) {
  //console.log('redirect');
//  console.log(vm.targetUser.name);
//  console.log(vm.layoutMap);
       if(Object.keys(vm.layoutMap).length>0) $rootScope.goto('layout');
       else $rootScope.goto('monitor');
  //   }

};
/*
var bubbleSort=function (items) {
  console.log('bubbleSort');
    var length = items.length;
    for (var i = (length - 1); i >= 0; i--) {
    console.log(i);
        for (var j = (length - i); j > 0; j--) {
    //    console.log(j);
            if (items[j].order < items[j - 1].order) {
                //Swap the numbers
                var tmp = items[j];
                items[j] = items[j - 1];
                items[j - 1] = tmp;
            }
        }
    }
    console.log(items);
    return items;
};
*/
Array.prototype.bubble_sort = function() {
	var i, j, temp;
	for (i = 0; i < this.length - 1; i++)
		for (j = 0; j < this.length - 1 - i; j++)
			if (this[j] > this[j + 1]) {
				temp = this[j];
				this[j] = this[j + 1];
				this[j + 1] = temp;
			}
	return this;
};

  var setTargetData=function(uid) {
//console.log('setTargetData:'+uid);
//    getUsers();
    getCompanys();  // may or may not have companys
    getControllers(uid); // include datapoints
    getCameras(uid);
    getGPSLoggers(uid);
    getRules(uid);

    getLayouts(uid);
//console.log('setTargetData:'+uid);
    setScopeData($rootScope);      // for justiotapp
    setScopeData($rootScope.common);
//console.log($rootScope.common);
  };
  var getLayouts=function(uid) {
    vm.layouts=[];
    var cids=Object.keys(vm.layoutMap);
    cids.forEach(function(cid){
      var c=vm.layoutMap[cid];
      if(c.userid==uid) vm.layouts.push(c);
    });

    vm.layouts.forEach(function(lay){
      lay.layoutimages=getlayoutimages(lay.id);
      lay.layoutlabels=getlayoutlabels(lay.id);
    });
  };
  var getlayoutimages=function(layoutid) {
    var is=[];
    var cids=Object.keys(vm.layoutimageMap);
    cids.forEach(function(cid){
      var c=vm.layoutimageMap[cid];
      if(c.layoutid==layoutid) is.push(c);
    });
    return is;
  };
  var getlayoutlabels=function(layoutid) {
    var is=[];
    var cids=Object.keys(vm.layoutlabelMap);
    cids.forEach(function(cid){
      var c=vm.layoutlabelMap[cid];
      if(c.layoutid==layoutid) {
        c.datapoint=vm.datapointMap[c.datapointid];
        if(!c.hasOwnProperty('x')) c.x=0;
        if(!c.hasOwnProperty('y')) c.y=0;
        is.push(c);
      }
    });
    return is;
  };

  var getControllers=function(uid) {
    getDatapoints(uid);
    vm.controllers=[];
//console.log(vm.controllerMap);
    var cids=Object.keys(vm.controllerMap);
    cids.forEach(function(cid){
//console.log(cid);
      var c=vm.controllerMap[cid];
      if(c.userid==uid) vm.controllers.push(c);
    });

    vm.controllers.forEach(function(con){
      var dps=[]
      vm.datapoints.forEach(function(dp){
        if(!dp.value) dp.value=0;
        if(dp.controllerid==con.id) dps.push(dp);
      });
     dps.bubble_sort();
      con.datapoints=dps;
    });
  };

  var getDatapoints=function(uid) {
    vm.datapoints=[];
    var cids=Object.keys(vm.datapointMap);
    cids.forEach(function(cid){
      var c=vm.datapointMap[cid];
      if(c.userid==uid) vm.datapoints.push(c);
    });
  }

  var getGPSLoggers=function(uid) {
    vm.gpsloggers=[];
    var cids=Object.keys(vm.gpsloggerMap);
    cids.forEach(function(cid){
      var c=vm.gpsloggerMap[cid];
      if(c.userid==uid) vm.gpsloggers.push(c);
    });
  }
  var getCameras=function(uid) {
    vm.cameras=[];
    var cids=Object.keys(vm.cameraMap);
    cids.forEach(function(cid){
      var c=vm.cameraMap[cid];
      if(c.userid==uid) vm.cameras.push(c);
    });
  }
  var getRules=function(uid) {
    vm.rules=[];
    var cids=Object.keys(vm.ruleMap);
    cids.forEach(function(cid){
      var c=vm.ruleMap[cid];
      if(c.userid==uid) vm.rules.push(c);
    });
  }

  /*
   var initload= function (user, callback, redirect) {  // companyMap userMap totaldata[userid]
     loadcompany();
     loadusers();
     loadTarget(vm.user.uid, redirect);
     if(callback) callback();
  };
*/
   var toArray= function (obj) {
     if(obj==null) return [];
     var list=[];
     var names=Object.keys(obj);
     for(var i=0;i<names.length;i++)
      list.push(obj[names[i]]);
     return list;
   };
   var sendResetPasswordEmail= function (email, callback) {
     LoaderFactory.showLoading('送密碼重置信...');
     firebase.auth().sendPasswordResetEmail(email).then(function() {
         LoaderFactory.hideLoading();
         if(callback) callback();
       }, function(error) {
          LoaderFactory.hideLoading();LoaderFactory.toggleLoadingWithMessage(error);
       });
   };
  var setRemotecommand= function(remotecommand, callback) {
    LoaderFactory.showLoading('傳送遙控指令...');

    var ctrl=vm.controllerMap[remotecommand.controllerid];
    remotecommand.userid=ctrl.userid;
    var key = firebase.database().ref().child('remotecommands/'+ctrl.userid+'/'+ctrl.id).push().key;
    remotecommand.id=key;
    firebase.database().ref().child('remotecommand/'+remotecommand.controllerid).set(remotecommand, function(error) {
      if (error) {
        console.log(error);return;
      } else {

      }
    });
    firebase.database().ref().child('remotecommands/'+ctrl.userid+'/'+ctrl.id+'/'+key).set(remotecommand, function(error) {
      if (error) {
        LoaderFactory.hideLoading();LoaderFactory.toggleLoadingWithMessage(error);return;
      } else {
        LoaderFactory.hideLoading();
        if(callback) callback();
      }
    });

  };

  var firebaseLogin=function(email, password, callback) {
    $firebaseAuth().$signInWithEmailAndPassword(email, password)
    .then(function(user) {
       firebase.database().ref().child('users/'+user.uid)
        .once('value', function(data) {
           if(!data.exists()) {
             LoaderFactory.toggleLoadingWithMessage("查無使用者資料?");
             return;
           }
           var u=data.val();
           callback(u);
          },function(error) {LoaderFactory.toggleLoadingWithMessage(error);});
        })
    .catch(function(error) {LoaderFactory.toggleLoadingWithMessage(error);});
  };
  var firstUser=function() {
//    vm.users.forEach(function(u){
//      console.log(u);
//      if(u.role==1 || u.role==2) return u;
//    });
//    Object.keys(vm.userMap).forEach(function(uid){
//      var u=vm.userMap[uid];
//      console.log(u);
//      if(u.role==1 || u.role==2) return u;
//    });
    var uids=Object.keys(vm.userMap);
    for(var i=0;i<uids.length;i++) {
      var u=vm.userMap[uids[i]];
      if(u.role==1 || u.role==2) return u;
    }
    return null;
  };
  var login=function (user, callback, useloader, redirect) {
    if(user.email==null || user.email.length==0 || user.email==GUEST.email)
     {user=GUEST; useloader=false;}

    if(useloader) LoaderFactory.showLoading('請稍候...');
  //console.log('login:'+user.email+' '+user.password);
    var redir=true;
    if(typeof redirect !=undefined && redirect!=null) redir=redirect;
 watchoff();
 clear();
    firebaseLogin(user.email, user.password, function(u){
      if(u.email==GUEST.email) vm.guestuid=u.uid;
         setRole(u);
  //       u.password1=u.password;
         vm.userMap[user.uid]=u;
         if(u.email!=GUEST.email) AuthFactory.setUser(u);

         loadcompany(function(){
           loadusers(function(){
var cid='players';
if(vm.company!=null) cid=vm.company.id;
setCompany(cid);
//console.log(vm.users);
             var first=firstCompanyCustomer(cid);
             if(u.uid==vm.guestuid) {
               loadTarget(vm.guestuid, redir);
             } else {
               if(first!=null) loadTarget(first.uid, redir);
               else loadTarget(vm.guestuid, redir);
             }
             /*
             if(u.role==4 || u.role==9) {
               var first=firstUser();
        //     console.log(first);
               if(first!=null) loadTarget(first.uid, redir);
               else loadTarget(vm.guestuid, redir);
             } else loadTarget(vm.user.uid, redir);
//console.log('after loadtarget');

*/
             if(callback) callback();

//             if (typeof FCMPlugin != 'undefined') {
//             FCMPlugin.subscribeToTopic(u.uid, function(msg){
//             console.log('subscribeToTopic callback successfully: ' + msg);
//             },function(err){
//              console.log('Error subscribeToTopic callback: ' + err);
//             });
//             }

             if(useloader) LoaderFactory.hideLoading();
             if(redirect) {
      //    console.log(vm.layoutMap);
               if(Object.keys(vm.layoutMap).length>0) $rootScope.goto('layout');
               else $rootScope.goto('monitor');
             }

           });
         });
    });
  };
  var register= function (user, callback) {
    LoaderFactory.showLoading('註冊...'+user.name);
  //    LoaderFactory.hideLoading();
  //    LoaderFactory.toggleLoadingWithMessage(err.message);

    $firebaseAuth().$createUserWithEmailAndPassword(user.email, user.password)
    .then(function(u) {
  //console.log(u);
      clear();
      user.uid=u.uid;
      user.role=1;
      user.active=true;
      user.createdAt=new Date().getTime();
      delete user.password1;
      delete user.password;
      firebase.database().ref().child('users/'+u.uid).set(user, function(error) {
       if (error) {
          LoaderFactory.hideLoading();LoaderFactory.toggleLoadingWithMessage(error);return;
       } else {
          setRole(user);
          vm.userMap[user.uid]=user;
          AuthFactory.setUser(user);
  //        delete vm.userMap[user.uid].password;
          loadcompany(function(){
            loadusers(function(){
              loadTarget(vm.user.uid, true);

              if(callback) callback();
              LoaderFactory.hideLoading();
            });
          });
       }
      });
    })
    .catch(function(error) {LoaderFactory.hideLoading();LoaderFactory.toggleLoadingWithMessage(error);});
  };
  var logout= function (callback) {
    var self=this;
  //  console.log('logout');

  //    FCMPlugin.unsubscribeFromTopic(vm.user.uid, function(msg){
  //       console.log('subscribeToTopic callback successfully: ' + msg);
  //    },function(err){
  //       console.log('Error subscribeToTopic callback: ' + err);
  //    });
    watchoff();
    firebase.auth().signOut()
    .then(function() {
       AuthFactory.clear();
       if($rootScope.common.openToPublic) self.login(GUEST,callback);
      })
    .catch(function(error) {LoaderFactory.hideLoading();LoaderFactory.toggleLoadingWithMessage(error);});
  };

 var firstCompanyCustomer=function(companyid) {
   if(!companyid) return null;
   if(companyid=='players') {
     for(var i=0;i<vm.users.length;i++) {
       var u=vm.users[i];
       if(u.role==0 || u.role==1) return u;
     }
   } else {
    for(var i=0;i<vm.users.length;i++) {
     var u=vm.users[i];
     if(!u.companyid) continue;
     if(u.companyid==companyid) return u;
    }
   }
   return null;
 };

  var setCompany=function(id) {
    vm.company=vm.companyMap[id];
    getUsers();
  //  $rootScope.company=vm.company;
    $rootScope.common.company=vm.company;
//    var u=firstCompanyCustomer(id);
//    if(u!=null) {
//      loadTarget(u.uid, true);
//    }
  };

  var uploadImageFile= function(image, file, fprogress, err, done) {
    var storageRef = firebase.storage().ref();
    var metadata = {
      'contentType': file.type
    };
    var id=file.name+new Date().getTime();
    var uploadTask = storageRef.child('layoutimages/' +vm.targetUser.uid+'/'+image.layoutid+'/'+ id).put(file, metadata);
    uploadTask.on('state_changed', function(snapshot){
      if(fprogress) fprogress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
    //      console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
  //        console.log('Upload is running');
          break;
      }
    }, function(error) {
      if(err) err(error);
    }, function() {
      image.url=uploadTask.snapshot.downloadURL;
      image.fileid=id;
      addlayoutimage(image, function(){
       if(done) done(image.url,id);
      }, false);
    });
  };
  var deleteImageFile= function(image, err, done) {
    var layout=vm.layoutMap[image.layoutid];
    var user=vm.userMap[layout.userid];
    firebase.storage().ref().child('layoutimages/' +user.uid+'/'+layout.id+'/'+ image.fileid).delete()
    .then(function() {
        if(done) done();
      }).catch(function(error) {
        console.log(error);
        if(err) err(error);
      });
  };

  var api = {
    register: register,
    login: login,
    logout: logout,

    addDatapoint: addDatapoint,
    addController: addController,
    addGPSLogger: addGPSLogger,
    addCamera: addCamera,
    addCompany: addCompany,
    addRule: addRule,
    addUser: addUser,
    addLayout: addLayout,
    addlayoutimage: addlayoutimage,
    addlayoutlabel: addlayoutlabel,
    updateDatapoint: updateDatapoint,
    updateLayout: updateLayout,
    updatelayoutimage: updatelayoutimage,
    updatelayoutlabel: updatelayoutlabel,
    updateController: updateController,
    updateGPSLogger: updateGPSLogger,
    updateCamera: updateCamera,
    updateCompany: updateCompany,
    updateRule: updateRule,
    updateUser: updateUser,
    deleteDatapoint: deleteDatapoint,
    deleteController: deleteController,
    deleteGPSLogger: deleteGPSLogger,
    deleteCamera: deleteCamera,
    deleteCompany: deleteCompany,
    deleteRule: deleteRule,
    deleteUser: deleteUser,
    deleteLayout: deleteLayout,
    deletelayoutimage: deletelayoutimage,
    deletelayoutlabel: deletelayoutlabel,
    getUsers: getUsers,
//    getDatas: getDatas,
    getPeriodDatas: getPeriodDatas,
    sendResetPasswordEmail: sendResetPasswordEmail,
    setRemotecommand: setRemotecommand,
    loadTarget: loadTarget,

    uploadImageFile: uploadImageFile,
    deleteImageFile: deleteImageFile,

    companys: function() {return vm.companys;},
    cameras: function() {return vm.cameras;},
    controllers: function() {return vm.controllers;},
    gpsloggers: function() {return vm.gpsloggers;},
    datapoints: function() {return vm.datapoints;},
    rules: function() {return vm.rules;},
    users: function() {return vm.users;},
    layouts: function() {return vm.layouts;},

    companyMap: function() {return vm.companyMap;},
    productMap: function() {return vm.productMap;},
    cameraMap: function() {return vm.cameraMap;},
    controllerMap: function() {return vm.controllerMap;},
    gpsloggerMap: function() {return vm.gpsloggerMap;},
    datapointMap: function() {return vm.datapointMap;},
    ruleMap: function() {return vm.ruleMap;},
    userMap: function() {return vm.userMap;},
    layoutMap: function() {return vm.layoutMap;},
    layoutimageMap: function() {return vm.layoutimageMap;},
    layoutlabelMap: function() {return vm.layoutlabelMap;},

    targetUser: function() {return vm.targetUser;},
    user: function() {return vm.user;},
    isAuthenticated: function() {return vm.isAuthenticated;},
    isAdmin: function() {return vm.isAdmin;},
    isCompanyAdmin: function() {return vm.isCompanyAdmin;},
    isCustomer: function() {return vm.isCustomer;},
    isGuest: function() {return vm.isGuest;},
    isUser: function() {return vm.isUser;},
    listCanSwipe: function() {return vm.listCanSwipe;},
    company: function() {return vm.company;},
    setCompany: setCompany,
    firstCompanyCustomer: firstCompanyCustomer,
    setScopeData: setScopeData
   }
  return api;
 }

})();
