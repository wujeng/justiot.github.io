/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.pages.layout')
      .controller('fullscreenCtrl', fullscreenCtrl);

  /** @ngInject */
  function fullscreenCtrl($scope, FireFactory, $timeout, $rootScope) {
//console.log('valueCtrl');
$timeout(function() {
  //var d = document.getElementById($scope.layoutlabel.id);
  var c= document.getElementById('dragcontainer');
  var crect = c.getBoundingClientRect();
  var x=$scope.layout.fsx || 0;
  var y=$scope.layout.fsy || 0;
  if(x==0) x=crect.left;
  if(y==0) y=crect.top;
  var d= document.getElementsByClassName('fullscreen');
  d[0].style.position = "absolute";
  d[0].style.left = x+'px';
  d[0].style.top = y+'px';
}, 1500);

    if(!angular.isDefined($scope.layout.fsx) || $scope.layout.fsx==0) {
      $scope.layout.fsx=100;
      $scope.layout.fsy=100;
    }
    $scope.isFullScreen=function() {
//  return  document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled;
    return !(!window.screenTop && !window.screenY) ;
//    return  document.fullscreenElement ||
//	    document.webkitFullscreenElement ||
//	    document.mozFullScreenElement ||
//	    document.msFullscreenElement;
    };
    $scope.fullscreen=function() {
  //    console.log('fullscreen');
      var elem = document.getElementById('dragcontainer');
      	if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {
      		if (elem.requestFullscreen) {
      			elem.requestFullscreen();
      		} else if (elem.msRequestFullscreen) {
      			elem.msRequestFullscreen();
      		} else if (elem.mozRequestFullScreen) {
      			elem.mozRequestFullScreen();
      		} else if (elem.webkitRequestFullscreen) {
      			elem.webkitRequestFullscreen();
      		}

          $rootScope.$fullscreen=true;
      	} else {
      		if (document.exitFullscreen) {
      			document.exitFullscreen();
      		} else if (document.msExitFullscreen) {
      			document.msExitFullscreen();
      		} else if (document.mozCancelFullScreen) {
      			document.mozCancelFullScreen();
      		} else if (document.webkitExitFullscreen) {
      			document.webkitExitFullscreen();
      		}
          $rootScope.$fullscreen=false;
      	}
    };

    $scope.myStyle={
      "position": "absolute",
      "display": "inline-block",
      "font-family": "'Century Gothic', CenturyGothic, AppleGothic, sans-serif",
      "font-size": '20px',
      "color": "white",
//      "background-color" : "coral",
//      font-style: normal,
//      font-variant: normal,
//      font-weight: 500,
//      line-height: 26.4px,
      "padding": "0px",
      "margin": "0px"
    };

    if($rootScope.common.layoutcommand=='moveImage') {
       interact('.fullscreen')
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
    $scope.layout.fsx=rect.left;
    $scope.layout.fsy=rect.top;
    //console.log($scope.layoutlabel.x+' '+$scope.layoutlabel.y);
       });

       };
       function dragEndListener (event) {
         var target = event.target;

         var rect = target.getBoundingClientRect();
         var parent=target.parentElement;
         var rectp=parent.getBoundingClientRect();
         $scope.layout.fsx=rect.left-rectp.left;
         $scope.layout.fsy=rect.top-rectp.top;

         FireFactory.updateLayout($scope.layout, function() {
    //console.log($scope.layoutlabel);
         },false);

       };

     } else {
       interact('.fullscreen').unset();
     }


  }
})();
