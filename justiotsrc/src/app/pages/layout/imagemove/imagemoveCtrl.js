/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.pages.layout')
      .controller('imagemoveCtrl', imagemoveCtrl);

  /** @ngInject */
  function imagemoveCtrl($scope, $rootScope, $timeout, FireFactory) {
//console.log($scope.layoutimage.x+' '+$scope.layoutimage.y);
$scope.common=$rootScope.common;
if($scope.layoutimage.datapointid) {
  if($scope.layoutimage.datapointid!='0') {
    $scope.datapoint=$rootScope.common.datapointMap[$scope.layoutimage.datapointid];
  }
}


$timeout(function() {
  var d = document.getElementById($scope.layoutimage.id);
  d.style.position = "absolute";
  d.style.left = $scope.layoutimage.x+'px';
  d.style.top = $scope.layoutimage.y+'px';

  var dd = document.getElementById($scope.layoutimage.id+'dptitle');
  if(!dd) return;
  dd.style.position = "absolute";
  dd.style.left = $scope.layoutimage.x+'px';
  dd.style.top = $scope.layoutimage.y+'px';
}, 1500);


if($rootScope.common.layoutcommand=='moveImage') {
    interact('.'+$scope.layoutimage.id)
  .draggable({
    onmove: dragMoveListener,
    onend: dragEndListener,
    autoScroll: true,
    allowFrom: '[drag-handle]'
  })
  .resizable({
    preserveAspectRatio: true,
    edges: { left: true, right: true, bottom: true, top: true }
  })
  .on('resizemove', function (event) {
    var target = event.target,
        x = (parseFloat(target.getAttribute('data-x')) || 0),
        y = (parseFloat(target.getAttribute('data-y')) || 0);
//console.log(target);
    // update the element's style
    target.style.width  = event.rect.width + 'px';
    target.style.height = event.rect.height + 'px';
    // translate when resizing from top or left edges
    x += event.deltaRect.left;
    y += event.deltaRect.top;

    target.style.webkitTransform = target.style.transform =
        'translate(' + x + 'px,' + y + 'px)';

    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);

    $scope.$apply(function(){
      $scope.layoutimage.width=event.rect.width;
      $scope.layoutimage.height=event.rect.height;
    });

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
      $scope.layoutimage.x=rect.left;
      $scope.layoutimage.y=rect.top;
    });

  };
  function dragEndListener (event) {
      var target = event.target;
      var rect = target.getBoundingClientRect();
      var parent=target.parentElement;
      var rectp=parent.getBoundingClientRect();
      $scope.layoutimage.x=rect.left-rectp.left;
      $scope.layoutimage.y=rect.top-rectp.top;
//console.log(rect.left);
//console.log(rectp.left);
//console.log(rect.left-rectp.left);
//console.log(rect.top-rectp.top);
  //    $scope.layoutimage.x=rect.left;
  //    $scope.layoutimage.y=rect.top;
//$scope.layoutimage.x=document.getElementById($scope.layoutimage.id).offsetLeft;
//      $scope.layoutimage.y=document.getElementById($scope.layoutimage.id).offsetTop;

      FireFactory.updatelayoutimage($scope.layoutimage, function() {
        var d = document.getElementById($scope.layoutimage.id+'dptitle');
        if(d) {
          d.style.position = "absolute";
          d.style.left = $scope.layoutimage.x+'px';
          d.style.top = $scope.layoutimage.y+'px';
        }

      }, false);
  };
} else {
  interact('.'+$scope.layoutimage.id).unset();
}

  }
})();
