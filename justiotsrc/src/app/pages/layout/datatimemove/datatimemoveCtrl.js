/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.pages.layout')
      .controller('datatimemoveCtrl', datatimemoveCtrl);

  /** @ngInject */
  function datatimemoveCtrl($scope, FireFactory, $timeout, $rootScope) {
    $scope.common=$rootScope.common;
    var fsize=$scope.layout.size+'pt';
    $scope.myStyle={
      "position": "absolute",
      "display": "inline-block",
      "font-family": "'Century Gothic', CenturyGothic, AppleGothic, sans-serif",
      "font-size": fsize,
      "color": "#A1D9E3",
    //      "background-color" : "coral",
    //      font-style: normal,
    //      font-variant: normal,
    //      font-weight: 500,
    //      line-height: 26.4px,
      "padding": "0px",
      "margin": "0px"
    };
   $timeout(function() {
     //var d = document.getElementById($scope.layoutlabel.id);
     var c= document.getElementById('dragcontainer');
     var crect = c.getBoundingClientRect();
     var x=$scope.layout.x || 0;
     var y=$scope.layout.y || 0;
     if(x==0) x=crect.left;
     if(y==0) y=crect.top;
     var d= document.getElementsByClassName($scope.layout.id);
     d[0].style.position = "absolute";
     d[0].style.left = x+'px';
     d[0].style.top = y+'px';
   }, 1500);

if($rootScope.common.layoutcommand=='moveImage') {
   interact('.'+$scope.layout.id)
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
$scope.layout.x=rect.left;
$scope.layout.y=rect.top;
//console.log($scope.layoutlabel.x+' '+$scope.layoutlabel.y);
   });

   };
   function dragEndListener (event) {
     var target = event.target;

     var rect = target.getBoundingClientRect();
     var parent=target.parentElement;
     var rectp=parent.getBoundingClientRect();
     $scope.layout.x=rect.left-rectp.left;
     $scope.layout.y=rect.top-rectp.top;

     FireFactory.updateLayout($scope.layout, function() {
//console.log($scope.layoutlabel);
     },false);

   };

 } else {
   interact('.'+$scope.layout.id).unset();
 }

  }
})();
