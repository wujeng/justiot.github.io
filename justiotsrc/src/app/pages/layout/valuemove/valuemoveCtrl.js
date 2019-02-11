/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.pages.layout')
      .controller('valuemoveCtrl', valuemoveCtrl);

  /** @ngInject */
  function valuemoveCtrl($scope, FireFactory, $timeout, $rootScope) {
    if(!angular.isDefined($scope.layoutlabel.color)) $scope.layoutlabel.color=0;
    if(!angular.isDefined($scope.layoutlabel.dotnumber)) $scope.layoutlabel.dotnumber=0;
  //  if(!angular.isDefined($scope.layoutlabel.size)) $scope.layoutlabel.size=60;
    var fsize=$scope.layoutlabel.size+'px';
    $scope.myStyle={
      "position": "absolute",
//      "display": "inline-block",
      "font-family": "'Century Gothic', CenturyGothic, AppleGothic, sans-serif",
      "font-size": fsize,
      "textAlign": "center",
      "color": "white",
      "width": "200px",
  //    "height": "50px",
  //    "border": "1px solid blue",
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
      var x=$scope.layoutlabel.x || 200;
      var y=$scope.layoutlabel.y || 200;
      if(x==0) x=crect.left;
      if(y==0) y=crect.top;
      var d= document.getElementsByClassName($scope.layoutlabel.id);
      d[0].style.position = "absolute";
//      d[0].style.left = x-(d[0].offsetWidth/2)+'px';
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

      FireFactory.updatelayoutlabel($scope.layoutlabel, function() {
    //console.log($scope.layoutlabel);
      }, false);

    };


  } else {
    interact('.'+$scope.layoutlabel.id).unset();
  }

}
})();
