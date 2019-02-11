/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.pages.history.charts')
    .controller('controllerchartCtrl', controllerchartCtrl);

  /** @ngInject */
  function controllerchartCtrl($scope, FireFactory, toastr){
  //  console.log('controllerchartCtrl');
  //  console.log($scope.controller.id);
   if($scope.controller==undefined || $scope.controller==null) return;
   if($scope.controller.datapoints==null) return;
   $scope.range={};
   $scope.range.dt=new Date();
   $scope.range.dataperiod={
    singleSelect: '0',
    multipleSelect: []//,
  //  option1: 'option-1'
   };
//   range.dataperiod.singleSelect
//   $scope.range.time=$scope.range.dt.getHours()+':' + $scope.range.dt.getMinutes() + ':' + $scope.range.dt.getSeconds();
   $scope.range.time = $scope.range.dt.toTimeString().split(' ')[0]
   $scope.range.dtopened=false;
   $scope.range.dateformat = 'yyyy-MM-dd';
   $scope.range.options = {
       showWeeks: false
   };
//   console.log(now.getFullYear()+ '-'+(now.getMonth() + 1) + '-' + now.getDate());
//   console.log($scope.range);

   var getPeriod=function() {
     var period=30*60*1000;
     if($scope.range.dataperiod.singleSelect=='0') period=15*60*1000;
     else if($scope.range.dataperiod.singleSelect=='1') period=30*60*1000;
     else if($scope.range.dataperiod.singleSelect=='2') period=60*60*1000;
     else if($scope.range.dataperiod.singleSelect=='3') period=12*60*60*1000;
     else if($scope.range.dataperiod.singleSelect=='4') period=24*60*60*1000;
     else if($scope.range.dataperiod.singleSelect=='5') period=7*24*60*60*1000;
//console.log('period='+period);
     return period;
   };

//   $scope.npp='50';
//   $scope.numberperpage=50;
   $scope.timestamps=[];
   /*
   var loadpoint=function(id, timestamp, numberperpage) {
     FireFactory.getDatas(id, timestamp, numberperpage, function(d) {
       if(d==null || d==undefined) return;
       if(d.datas==null || d.datas==undefined || d.datas.length==0) return;
       $scope.$apply(function(){
         var datapoint=FireFactory.datapointMap()[id];
   //console.log('loadpoint:'+datapoint.title);
         datapoint.datas=d.datas;
         $scope.nowtimestamp=timestamp;
         $scope.lasttimestamp=d.datas[0].createdAt;
    //     console.log(d.datas);
         datapoint.labels=[];
         datapoint.data=[];
         datapoint.series=[datapoint.title];
         var data=[];
         for(var j=0;j<datapoint.datas.length;j++) {
           var tim = new Date(datapoint.datas[j].createdAt);
           datapoint.labels.push(tim.getHours()+':' + tim.getMinutes() + ':' + tim.getSeconds());
           data.push(datapoint.datas[j].value);
         }
         datapoint.data.push(data);
       });

       });
   };
   */
   var loadpointPeriodDatas=function(id, starttimestamp, endtimestamp) {
//console.log('loadpointPeriodDatas:'+starttimestamp+'->'+endtimestamp);
     var dp=FireFactory.datapointMap()[id];
     FireFactory.getPeriodDatas(id, starttimestamp, endtimestamp, function(d) {
       if(d==null || d==undefined) {
         toastr.error('查無'+dp.title+'歷史資料!', '錯誤');
         return;
       }
       $scope.$apply(function(){
          dp.datas=d;
         dp.labels=[];
         dp.data=[];
         dp.series=[dp.title];
         var data=[];
         for(var j=0;j<dp.datas.length;j++) {
           var tim = new Date(dp.datas[j].createdAt);
           dp.labels.push(tim.getHours()+':' + tim.getMinutes() + ':' + tim.getSeconds());
           data.push(dp.datas[j].value);
         }
         dp.data.push(data);
       });
    });
   };
   /*
   var applydatas=function() {
     for(var k=0;k<$scope.controller.datapoints.length;k++) {
       var dp=$scope.controller.datapoints[k];
$scope.$apply(function(){
       dp.datas=dp.d.datas;
       dp.labels=[];
       dp.data=[];
       dp.series=[dp.title];
       var data=[];
       for(var j=0;j<dp.datas.length;j++) {
         var tim = new Date(dp.datas[j].createdAt);
         dp.labels.push(tim.getHours()+':' + tim.getMinutes() + ':' + tim.getSeconds());
         data.push(dp.datas[j].value);
       }
       dp.data.push(data);
       });
     }
   }
   */
   var loadpagePeriodDatas=function(starttimestamp, endtimestamp) {
     for(var k=0;k<$scope.controller.datapoints.length;k++) {
       var dp=$scope.controller.datapoints[k];
       var dpid=dp.id;
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
$scope.firstpage();
    $scope.changeData = function () {
    };
    $scope.dtopen = function() {
        $scope.range.dtopened = true;
    }

  }






})();
