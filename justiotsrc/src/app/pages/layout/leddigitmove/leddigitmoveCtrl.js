/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.pages.layout')
      .controller('leddigitmoveCtrl', leddigitmoveCtrl);

  /** @ngInject */
  function leddigitmoveCtrl($scope, FireFactory, $timeout, $rootScope) {
    if(!angular.isDefined($scope.layoutlabel.color)) $scope.layoutlabel.color=0;

    $scope.valuestring=$scope.layoutlabel.datapoint.value.toFixed(2).replace('.','d');
    console.log($scope.valuestring);
    $scope.srcarray=[];
    $scope.widths=[];
    var c='b';
    //    $scope.colors=[{id: 0, label: '青'},{relation: 1, label: '綠'},
    //                           {relation: 2, label: '藍'},{relation: 3, label: '黃'},
    //                         {relation: 4, label: '紅'},{relation: 5, label: '灰'}];
    if($scope.layoutlabel.color==0) c='p';
    else if($scope.layoutlabel.color==1) c='g';
    else if($scope.layoutlabel.color==2) c='b';
    else if($scope.layoutlabel.color==3) c='y';
    else if($scope.layoutlabel.color==4) c='r';
    else if($scope.layoutlabel.color==5) c='d';
    for(var i=0;i<$scope.valuestring.length;i++) {
      var url='app/pages/layout/leddigitmove/images/'+c+$scope.valuestring.substring(i,i+1)+'.gif';
//    console.log(url);
      $scope.srcarray.push(url);
      var wid=20;
      if($scope.valuestring.substring(i,i+1)=='d') wid=10;
      $scope.widths.push(wid);
    }

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

      FireFactory.updatelayoutlabel($scope.layoutlabel, function() {
    //console.log($scope.layoutlabel);
      }, false);

    };

} else {
  interact('.'+$scope.layoutlabel.id).unset();
}
  }
})();
