/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.pages.layout')
      .controller('iolabelmoveCtrl', iolabelmoveCtrl);

  /** @ngInject */
  function iolabelmoveCtrl($scope, FireFactory, $timeout, $rootScope) {
//console.log($scope.layoutlabel);
if(!angular.isDefined($scope.layoutlabel.x)) {
  $scope.layoutlabel.x=200;
  $scope.layoutlabel.y=100;
}
if(!angular.isDefined($scope.layoutlabel.color)) $scope.layoutlabel.color=0;

//$scope.getValue=function() {
//  if(($scope.layoutlabel.datapoint.dptype==0 || $scope.layoutlabel.datapoint.dptype==1) && $scope.layoutlabel.datapoint.value==1) return 'ON';
//  if(($scope.layoutlabel.datapoint.dptype==0 || $scope.layoutlabel.datapoint.dptype==1) && $scope.layoutlabel.datapoint.value==0) return 'OFF';
//  return $scope.layoutlabel.datapoint.value.toPrecision(6);
//}
  // $scope.layoutlabel.datapoint=FireFactory.datapointMap()[$scope.layoutlabel.datapointid];
  // console.log($scope.layoutlabel.datapoint.title+' '+$scope.layoutlabel.datapoint.id+' '+$scope.layoutlabel.id)

   $timeout(function() {
     //var d = document.getElementById($scope.layoutlabel.id);
     var c= document.getElementById('dragcontainer');
     var crect = c.getBoundingClientRect();
     var x=$scope.layoutlabel.x || 0;
     var y=$scope.layoutlabel.y || 0;
     if(x==0) x=crect.left;
     if(y==0) y=crect.top;
     var d= document.getElementsByClassName($scope.layoutlabel.id);
     d[0].style.position = "absolute";
     d[0].style.left = x+'px';
     d[0].style.top = y+'px';
   }, 1500);

if($rootScope.common.layoutcommand=='moveImage') {
   interact('.'+$scope.layoutlabel.id)
   .draggable({
   onmove: dragMoveListener,
   onend: dragEndListener
 });

   function dragMoveListener (event) {
   var target = event.target;
   var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx ;
   var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy ;

   target.style.webkitTransform =
   target.style.transform ='translate(' + x + 'px, ' + y + 'px)';

   target.setAttribute('data-x', x);
   target.setAttribute('data-y', y);

   $scope.$apply(function(){
     var rect = target.getBoundingClientRect();
  //   var parent=target.parentElement;//.parentElement;
  //   var rectp=parent.getBoundingClientRect();
  //   $scope.layoutlabel.x=rect.left-rectp.left;
//     $scope.layoutlabel.y=rect.top-rectp.top;
$scope.layoutlabel.x=rect.left;
$scope.layoutlabel.y=rect.top;
//console.log($scope.layoutlabel.x+' '+$scope.layoutlabel.y);
   });

   };
   function dragEndListener (event) {
     var target = event.target;

     var rect = target.getBoundingClientRect();
     var parent=target.parentElement;
     var rectp=parent.getBoundingClientRect();
     $scope.layoutlabel.x=rect.left-rectp.left;
     $scope.layoutlabel.y=rect.top-rectp.top;

//     var rect = target.getBoundingClientRect();
//$scope.layoutlabel.x=rect.left;
//$scope.layoutlabel.y=rect.top;
//console.log($scope.layoutlabel);
     FireFactory.updatelayoutlabel($scope.layoutlabel, function() {
//console.log($scope.layoutlabel);
     }, false);

   };
}else {
  interact('.'+$scope.layoutlabel.id).unset();
}
  }
})();
