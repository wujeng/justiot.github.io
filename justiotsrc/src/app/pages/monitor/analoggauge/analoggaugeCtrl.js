/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.pages.monitor')
      .controller('analoggaugeCtrl', analoggaugeCtrl);

  /** @ngInject */
  function analoggaugeCtrl($scope) {
//console.log('analoggauge');
//console.log($scope.datapoint);
    $scope.data_width='200';
    $scope.data_height='200';
    var isUndefinedOrNull= function(obj) {
         return !angular.isDefined(obj) || obj===null;
     };
    if(isUndefinedOrNull($scope.datapoint.value)) $scope.datapoint.value=0;
    if(isUndefinedOrNull($scope.datapoint.max)) $scope.datapoint.max=100;
    if(isUndefinedOrNull($scope.datapoint.min)) $scope.datapoint.min=0;
    if(isUndefinedOrNull($scope.datapoint.unit) && $scope.datapoint.max<=100) $scope.datapoint.unit="%";

    if($scope.datapoint.value>$scope.datapoint.max) $scope.datapoint.max=$scope.datapoint.value;
    if($scope.datapoint.value<$scope.datapoint.min) $scope.datapoint.min=$scope.datapoint.value;
//    if(isUndefinedOrNull($scope.datapoint.unit)) $scope.datapoint.unit=['%'];
//    $scope.datapoint.gaugetype='linear-gauge';
  //  console.log($scope.datapoint.max+' '+$scope.datapoint.min);
    $scope.datapoint.gaugetype='radial-gauge';
    if(!isUndefinedOrNull($scope.datapoint.unit) && $scope.datapoint.unit.endsWith('°C')) {
      $scope.datapoint.gaugetype='linear-gauge';
//      $scope.data_width='220';
  //    $scope.data_height='200';
    }
//    if($scope.datapoint.unit[0].endsWith('%')) {
//
//    }
    if($scope.datapoint.max==100 && $scope.datapoint.min==0) {
      $scope.data_major_ticks="0,20,40,60,80,100";
      $scope.data_minor_ticks="5";
      $scope.data_highlights='[{"from": 80, "to": 100, "color": "rgba(190, 180, 200, .75)"}]';
    } else {
      var parts=5;
      var dd=($scope.datapoint.max-$scope.datapoint.min)/parts;
      var str=''+$scope.datapoint.min+',';
      for(var i=1;i<=parts;i++) {
        str=str+($scope.datapoint.min+i*dd).toPrecision(4);
        if(i!=parts) str=str+',';
      }
      $scope.data_major_ticks=str;
  //  console.log(str);
      $scope.data_minor_ticks="5";
      $scope.data_highlights='[{"from": '+($scope.datapoint.min+dd*4)+', "to": '+$scope.datapoint.max+', "color": "rgba(190, 180, 200, .75)"}]';

  //    $scope.data_highlights="[{ from: 0, to: 50, color: 'rgba(0,255,0,.15)' }, \
  //  { from: 50, to: 100, color: 'rgba(255,255,0,.15)' }, \
  //      { from: 100, to: 150, color: 'rgba(255,30,0,.25)' }, \
  //      { from: 150, to: 200, color: 'rgba(255,0,225,.25)' }, \
  //      { from: 200, to: 220, color: 'rgba(0,0,255,.25)' }]";
    }

  }
})();
