/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.pages.history.tables')
    .controller('controllertableCtrl', controllertableCtrl);

  /** @ngInject */
  function controllertableCtrl($scope, FireFactory, toastr){
   if($scope.controller==undefined || $scope.controller==null) return;
   if($scope.controller.datapoints==null) return;

   $scope.controller.tablerows=[];
   $scope.controller.tableheads=[];
   $scope.range={};
   $scope.range.dt=new Date();
   $scope.range.dataperiod={
    singleSelect: '0',
    multipleSelect: []
   };

   $scope.range.time = $scope.range.dt.toTimeString().split(' ')[0]
   $scope.range.dtopened=false;
   $scope.range.dateformat = 'yyyy-MM-dd';
   $scope.range.options = {
       showWeeks: false
   };

   var getPeriod=function() {
     var period=30*60*1000;
     if($scope.range.dataperiod.singleSelect=='0') period=15*60*1000;
     else if($scope.range.dataperiod.singleSelect=='1') period=30*60*1000;
     else if($scope.range.dataperiod.singleSelect=='2') period=60*60*1000;
     else if($scope.range.dataperiod.singleSelect=='3') period=12*60*60*1000;
     else if($scope.range.dataperiod.singleSelect=='4') period=24*60*60*1000;
     else if($scope.range.dataperiod.singleSelect=='5') period=7*24*60*60*1000;
     return period;
   };

   var checkPageReady=function() {
     for(var k=0;k<$scope.controller.datapoints.length;k++) {
       var dp=$scope.controller.datapoints[k];
//console.log(dp.d.datas.length);
       if(!dp.perioddataready) return false;
     }
     applydatas();
   }
$scope.timestamps=[];
   var loadpointPeriodDatas=function(id, starttimestamp, endtimestamp) {
   //console.log('loadpointPeriodDatas:'+starttimestamp+'->'+endtimestamp);
     var dp=FireFactory.datapointMap()[id];
     FireFactory.getPeriodDatas(id, starttimestamp, endtimestamp, function(d) {
       if(d==null || d==undefined) {
         toastr.error('查無'+dp.title+'歷史資料!', '錯誤');
         return;
       }
       dp.datas=d;
       dp.perioddataready=true;
       checkPageReady();
    });
   };

/*

   var loadpointPeriodDatas=function(id, starttimestamp, endtimestamp) {
     var promise = new Promise(function(resolve, reject) {
       FireFactory.getPeriodDatas(id, starttimestamp, endtimestamp, function(d) {
         if(d==null || d==undefined) {reject(Error("not response"));}
         if(d.datas==null || d.datas==undefined || d.datas.length==0) {resolve("1");}
         var datapoint=FireFactory.datapointMap()[id];
         datapoint.d=d;
           resolve("0");
         });
     });
     return promise;
   };
   var mapdata=function(time, datas) {
  //   console.log('time='+time);
     for(var i=1;i<(datas.length-1);i++) {
  //    console.log(datas[i].createdAt);
//       if(time>=datas[i].createdAt) return datas[i].value;
       if(time>=datas[i].createdAt && time<datas[i+1].createdAt) return datas[i].value;
     }
     return datas[datas.length-1].value;
   }
   */
   var applydatas=function() {
     var timeline=[];
     $scope.controller.timelabel=[];
     var tableheads=[];
     var datapoint=null;
     var leng=0;
//     tableheads.push('時間');
     for(var k=0;k<$scope.controller.datapoints.length;k++) {
       var dp=$scope.controller.datapoints[k];
//console.log(dp.d.datas.length);
       tableheads.push(dp.title);
     }
     var datapoint=$scope.controller.datapoints[0];
     for(var i=0;i<datapoint.datas.length;i++) {
       timeline.push(datapoint.datas[i].createdAt);
     }
//console.log(timeline);
     var tablerows=[];
     var index=0;
     for(var i=(timeline.length-1);i>=0;i--) {
//   for(var i=0;i<timeline.length;i++) {
      var onerow={};
//   console.log(timeline[i]);
  //     onerow['時間']=new Date(timeline[i]).toLocaleString();
  $scope.controller.timelabel[index]=new Date(timeline[i]).toLocaleString();
       for(var k=0;k<$scope.controller.datapoints.length;k++) {
         var dp=$scope.controller.datapoints[k];
         onerow[dp.title]=dp.datas[i].value;
//onerow[dp.title]=dp.d.datas[i].value;
       }
       tablerows.push(onerow);
       index++;
     }
     $scope.$apply(function(){
       $scope.controller.tablerows=tablerows;
       $scope.controller.tableheads=tableheads;
      });
   }

   var loadpagePeriodDatas=function(starttimestamp, endtimestamp) {
     for(var k=0;k<$scope.controller.datapoints.length;k++) {
       var dp=$scope.controller.datapoints[k];
       var dpid=dp.id;
       dp.perioddataready=false;
       loadpointPeriodDatas(dpid, starttimestamp,  endtimestamp);
     }
   };

   $scope.nextpage=function() {
     var now=$scope.nowtimestamp;
     $scope.nowtimestamp=$scope.timestamps.pop();
     if($scope.nowtimestamp==undefined) return;
     loadpagePeriodDatas($scope.nowtimestamp-getPeriod(),$scope.nowtimestamp);
   };
   $scope.lastpage=function() {
     var now=$scope.nowtimestamp;
     $scope.nowtimestamp=$scope.nowtimestamp-getPeriod();
     loadpagePeriodDatas($scope.nowtimestamp-getPeriod(),$scope.nowtimestamp);
     $scope.timestamps.push(now);
   };

   var getDate=function(date) {
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString();
    var formatedMonth = (month.length === 1) ? ("0" + month) : month;
    var day = date.getDate().toString();
    var formatedDay = (day.length === 1) ? ("0" + day) : day;
   return year + "-" + formatedMonth + "-" + formatedDay;
   };
   $scope.firstpage=function() {
     var v=$scope.range.time;
     if(!v) v='00:00:00';

     $scope.nowtimestamp=new Date(getDate($scope.range.dt)+'T'+v).getTime();
   //     $scope.nowtimestamp=new Date().getTime();
   //console.log('now:'+$scope.nowtimestamp+'<-'+$scope.nowtimestamp0);
     $scope.timestamps=[];
     loadpagePeriodDatas($scope.nowtimestamp-getPeriod(),$scope.nowtimestamp);
   };

   /*
   var loadpagePeriodDatas=function(starttimestamp, endtimestamp) {
       var promises=[];
       for(var k=0;k<$scope.controller.datapoints.length;k++) {
         var dp=$scope.controller.datapoints[k];
         var dpid=dp.id;
         var p=loadpointPeriodDatas(dpid, starttimestamp,  endtimestamp);
         promises.push(p);
       }
      return Promise.all(promises);
   };

   $scope.nextpage=function() {
     var now=$scope.nowtimestamp;
     $scope.nowtimestamp=$scope.timestamps.pop();
     if($scope.nowtimestamp==undefined) return;
     loadpagePeriodDatas($scope.nowtimestamp-getPeriod(),$scope.nowtimestamp)
     .then(function(values){
       var ok=true;
       for(var i=0;i<values.length;i++) {
         if(values[i]=='1') {ok=false; break;}
       }
       if(!ok) {
         toastr.error('查無資料!', '錯誤');
         $scope.timestamps.push($scope.nowtimestamp);
         $scope.nowtimestamp=now;
       } else {
         applydatas();
       }
     });
   };
   $scope.lastpage=function() {
     var now=$scope.nowtimestamp;
     $scope.nowtimestamp=$scope.nowtimestamp-getPeriod();
     loadpagePeriodDatas($scope.nowtimestamp-getPeriod(),$scope.nowtimestamp)
     .then(function(values){
       var ok=true;
       for(var i=0;i<values.length;i++) {
         if(values[i]=='1') {ok=false; break;}
       }
       if(!ok) {
         toastr.error('查無資料!', '錯誤');
         $scope.nowtimestamp=now;
       } else {
         $scope.timestamps.push(now);
         applydatas();
       }
     });
   };

   var getDate=function(date) {
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString();
    var formatedMonth = (month.length === 1) ? ("0" + month) : month;
    var day = date.getDate().toString();
    var formatedDay = (day.length === 1) ? ("0" + day) : day;
  return year + "-" + formatedMonth + "-" + formatedDay;
};
   $scope.firstpage=function() {
     var v=$scope.range.time;
     if(!v) v='00:00:00';
     $scope.nowtimestamp=new Date(getDate($scope.range.dt)+'T'+v).getTime();
     $scope.timestamps=[];
     loadpagePeriodDatas($scope.nowtimestamp-getPeriod(),$scope.nowtimestamp)
     .then(function(values){
       var ok=true;
       for(var i=0;i<values.length;i++) {
         if(values[i]=='1') {ok=false; break;}
       }
       if(!ok) {
         toastr.error('查無資料!', '錯誤');
       } else {
         applydatas();
       }
     });
   };
   */
$scope.firstpage();
    $scope.changeData = function () {
    };
    $scope.dtopen = function() {
        $scope.range.dtopened = true;
    }

  }


})();
