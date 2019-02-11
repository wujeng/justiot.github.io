/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.pages.iottables')
      .controller('iotrulesCtrl', iotrulesCtrl);

  /** @ngInject */
  function iotrulesCtrl($scope, FireFactory, RuleFactory, LoaderFactory, $rootScope, toastr) {
    console.log('iotrulesCtrl');
    $scope.datapoints=FireFactory.datapoints();
    $scope.week=[false,false,false,false,false,false,false];
    $scope.rule=$rootScope.common.rule;
    console.log($scope.rule);
    if($scope.rule==undefined || $scope.rule==null) {
     $scope.rule={title: 'title', iocondition: [], iodrive: [],
       userid: FireFactory.targetUser().uid, active: true, createdAt:
       new Date().getTime()};
     } else {
       if($scope.rule.time1!=null && $scope.rule.time1.length>0) $scope.rule.hasTime=true;
       else $scope.rule.hasTime=false;
       if($scope.rule.week!=null && $scope.rule.week.length>0)
        {
          for(var i=0;i<$scope.rule.week.length;i++)
            {
              $scope.week[parseInt($scope.rule.week.charAt(i))-1]=true;
            }
          $scope.rule.isCycle=true;
        }
       else $scope.rule.isCycle=false;
       if($scope.rule.time2!=null && $scope.rule.time2.length>0) $scope.rule.isPeriod=true;
       else $scope.rule.isPeriod=false;
     }

    $scope.relations=[{relation: 0, label: '等於'},{relation: 1, label: '不等於'},
                          {relation: 2, label: '大於'},{relation: 3, label: '大於或等於'},
                        {relation: 4, label: '小於'},{relation: 5, label: '小於或等於'},
                     {relation: 6, label: '距離等於'},{relation: 7, label: '距離大於'},{relation: 8, label: '距離小於'}];

    $scope.actives = [
      {id: true, text: '啟用'},
      {id: false, text: '禁用'}
    ];

    $scope.showActive=function(a) {
      if(a.active) return '啟用';
      else return '禁用';
    };
    $scope.users=FireFactory.users();
    $scope.showUserName=function(uid) {
      return FireFactory.userMap()[uid].name;
    };
    $scope.showDatapointTitle=function(datapointid) {
console.log(datapointid);
      return FireFactory.datapointMap()[datapointid].title;
    };
    $scope.showRelation=function(relation) {
      return $scope.relations[relation].label;
    };

    $scope.addIOCondition=function() {
      if(FireFactory.datapoints()==null || FireFactory.datapoints().length<=0) {
        toastr.info('無資料點!', '設定資料點條件:', {})
        return;
      }
      var ioc={datapointid: FireFactory.datapoints()[0].id,
        relation: 0, value: 0};
      $scope.rule.iocondition.push(ioc);

      console.log($scope.rule);
    };
    $scope.cancelIOCondition=function(index) {
      $scope.rule.iocondition.splice(index,1);
    };
    $scope.outputarray=[];
    for(var i=0;i<FireFactory.datapoints().length;i++) {
      if(FireFactory.datapoints()[i].dptype==1 || FireFactory.datapoints()[i].dptype==3) $scope.outputarray.push(FireFactory.datapoints()[i]);
    }
    $scope.addIODrive=function() {
      if($scope.outputarray.length<=0) {
        toastr.info('無輸出的資料點!', '設定驅動條件:', {})
        return;
      }
      var iod={datapointid: $scope.outputarray[0].id, value: 0};
      $scope.rule.iodrive.push(iod);
    };
    $scope.cancelIOCondition=function(index) {
      $scope.rule.iocondition.splice(index,1);
    };
    $scope.changeIOCondition=function(index) {
      console.log('changeIOCondition');
    };
    $scope.changeIODrive=function(index) {
      console.log('changeIODrive');
    };
    $scope.cancelIODrive=function(index) {
      $scope.rule.iodrive.splice(index,1);
    };
    $scope.onHide=function() {
  //    console.log('onHide');
  //    $scope.rule.timeconditionstr=RuleFactory.timeconditionstr($scope.rule);
    };

    $scope.setCycle=function() {
      if(!$scope.isCycle) {
        for(var i=0;i<7;i++) $scope.week[i]=false;
        $scope.rule.week="";
      }
    };

    $scope.setWeek=function() {
      $scope.rule.week="";
      if($scope.week[0]) $scope.rule.week=$scope.rule.week+"1";
      if($scope.week[1]) $scope.rule.week=$scope.rule.week+"2";
      if($scope.week[2]) $scope.rule.week=$scope.rule.week+"3";
      if($scope.week[3]) $scope.rule.week=$scope.rule.week+"4";
      if($scope.week[4]) $scope.rule.week=$scope.rule.week+"5";
      if($scope.week[5]) $scope.rule.week=$scope.rule.week+"6";
      if($scope.week[6]) $scope.rule.week=$scope.rule.week+"7";
    };

    $scope.saveRule=function(result){
       if(angular.isString(result) && result=='cancel') {
         if($scope.rule.id!=undefined && $scope.rule.id!=null)
          $rootScope.common.modaledit.close();
         else
          $rootScope.common.modaladd.close();
         return;
       }
  //console.log('hasTime:'+$scope.hasTime);
  //      console.log('isPeriod:'+$scope.isPeriod);
  //      console.log('isTimePeriod:'+$scope.isTimePeriod);
//        console.log('weekd1:'+$scope.week.d1);
  //      console.log('weekd2:'+$scope.week.d2);
        if(!$scope.rule.hasTime) {
          $scope.rule.week="";
          $scope.rule.time1=null;
          $scope.rule.time2=null;
          $scope.rule.reverse=false;
          $scope.rule.date1=null;
          $scope.rule.date2=null;
         } else {
           $scope.rule.week="";
           if($scope.rule.isCycle)
            {
              if($scope.week[0]) $scope.rule.week=$scope.rule.week+"1";
              if($scope.week[1]) $scope.rule.week=$scope.rule.week+"2";
              if($scope.week[2]) $scope.rule.week=$scope.rule.week+"3";
              if($scope.week[3]) $scope.rule.week=$scope.rule.week+"4";
              if($scope.week[4]) $scope.rule.week=$scope.rule.week+"5";
              if($scope.week[5]) $scope.rule.week=$scope.rule.week+"6";
              if($scope.week[6]) $scope.rule.week=$scope.rule.week+"7";
              if($scope.rule.week.length<=0)
              {LoaderFactory.toggleLoadingWithMessage('請設定周期日!');
               return;
              }
              $scope.rule.date1=null;
              $scope.rule.date2=null;
              if($scope.rule.time1==null || $scope.rule.time1.length==0)
              {
                LoaderFactory.toggleLoadingWithMessage('請設定時間!');
                 return;
              }
              if($scope.rule.isPeriod)
               {if($scope.rule.time2==null || $scope.rule.time2.length==0)
                 {
                  LoaderFactory.toggleLoadingWithMessage('請設定時間!');
                  return;
                 }
               }
              else $scope.rule.time2=null;
            }
           else
            {if($scope.rule.date1==null || $scope.rule.date1.length==0)
              {
               LoaderFactory.toggleLoadingWithMessage('請設定日期!');
               return;
              }
             if($scope.rule.time1==null || $scope.rule.time1.length==0)
             {
               LoaderFactory.toggleLoadingWithMessage('請設定時間!');
                return;
             }
              if($scope.rule.isPeriod)
              {if($scope.rule.date2==null || $scope.rule.date2.length==0)
                {
                 LoaderFactory.toggleLoadingWithMessage('請設定日期!');
                 return;
                }
                if($scope.rule.time2==null || $scope.rule.time2.length==0)
                {
                  LoaderFactory.toggleLoadingWithMessage('請設定時間!');
                   return;
                }
              }
              else
              {$scope.rule.date2=null;
               $scope.rule.time2=null;
              }

            }

         }
        if($scope.rule.iocondition!=null && $scope.rule.iocondition.length>0)
        {
          for(var i=0;i<$scope.rule.iocondition.length;i++) delete $scope.rule.iocondition[i].description;
        }
        else $scope.rule.iocondition=null;
        if($scope.rule.iodrive!=null && $scope.rule.iodrive.length>0)
        {
         for(var i=0;i<$scope.rule.iodrive.length;i++) delete $scope.rule.iodrive[i].description;
        }
        else $scope.rule.iodrive=null;

                  if($scope.rule.active==null || $scope.rule.active.length==0)
                   {LoaderFactory.toggleLoadingWithMessage('設定使用!');
                    return;
                   }
                   if($scope.rule.userid==null)
                    {LoaderFactory.toggleLoadingWithMessage('設定使用人!');
                     return;
                    }
console.log($scope.rule);
delete $scope.rule.hasTime;
delete $scope.rule.isCycle;
delete $scope.rule.isPeriod;
       if($scope.rule.id!=undefined && $scope.rule.id!=null)
        $rootScope.common.modaledit.close($scope.rule);
       else
        $rootScope.common.modaladd.close($scope.rule);
      }

      $scope.showRuleTimeCondition=function(rule) {
  //      console.log('showRuleTimeCondition');
        return RuleFactory.timeconditionstr(rule);
      }


  }
})();
