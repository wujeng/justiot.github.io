/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.pages.layout')
      .controller('layouttabCtrl', layouttabCtrl);

  /** @ngInject */
  function layouttabCtrl($scope, FireFactory, $rootScope, toastr, $document, $timeout) {
//console.log($scope.layout);

$scope.showImage=function(layoutimage) {
  if(layoutimage.datapointid=='0') return false;
  if($rootScope.common.layoutcommand=='moveImage') return true;
  var visable=false;
  if(!layoutimage.datapointid) return false;
  var dp=FireFactory.datapointMap()[layoutimage.datapointid];
  if(!dp) return;
//console.log(dp.value+' '+im.value);
  switch(layoutimage.relation) {
    case 0: //等於
       if(dp.value==layoutimage.value) visable=true;
       break;
    case 1: //不等於
       if(dp.value!=layoutimage.value) visable=true;
       break;
    case 2://大於
       if(dp.value>layoutimage.value) visable=true;
       break;
    case 3://大於或等於
       if(dp.value>=layoutimage.value) visable=true;
       break;
    case 4://小於
       if(dp.value<layoutimage.value) visable=true;
       break;
    case 5://小於或等於
       if(dp.value<=layoutimage.value) visable=true;
       break;
  }
  return visable;
};
$scope.common=$rootScope.common;
    if(!angular.isDefined($scope.layout)) return;
    if(!angular.isDefined($scope.layout.x)) {
      $scope.layout.x=100;
      $scope.layout.y=100;
    }
    if(!angular.isDefined($scope.layout.size)) {
      $scope.layout.size=20;
    }

var addControllerArray=function(array, dpid) {
  var dp=$scope.common.datapointMap[dpid];
  var c=$scope.common.controllerMap[dp.controllerid];
  for(var i=0;i<array.length;i++) {
    if(array[i].id==c.id) return;
  }
  array.push(c);
};

$scope.layoutcontrollers=[];

    $scope.datapoints=FireFactory.datapoints();
    $scope.labels={};
    for(var i=0;i<$scope.datapoints.length;i++) {
      $scope.labels[$scope.datapoints[i].id]=false;
    }
    for(var i=0;i<$scope.layout.layoutlabels.length;i++) {
      var lab=$scope.layout.layoutlabels[i];
      if(!lab.color) lab.color=0;
      if(!lab.type) lab.type=0;
      $scope.labels[lab.datapointid]=true;

      addControllerArray($scope.layoutcontrollers, lab.datapointid);
    }
    $scope.dps=[{id: '0', title: '背景圖'}];
    var dps=FireFactory.datapoints();
    for(var i=0;i<dps.length;i++) {
      $scope.dps.push({'id': dps[i].id, 'title': dps[i].title});
    }
    for(var i=0;i<$scope.layout.layoutimages.length;i++) {
      var im=$scope.layout.layoutimages[i];
      if(angular.isUndefined(im.datapointid) || im.datapointid === null) continue;
      if(im.datapointid=='0') {
        $scope.layout.background=im;
      } else {

        addControllerArray($scope.layoutcontrollers, lab.datapointid);
      }
    }

/*
   for(var i=0;i<$scope.layout.layoutimages.length;i++) {
      var im=$scope.layout.layoutimages[i];
      im.visable=false;
      if(!im.datapointid) continue;
      if(im.datapointid=='0') continue;
      var dp=FireFactory.datapointMap()[im.datapointid];
//console.log(dp.value+' '+im.value);
      switch(im.relation) {
        case 0: //等於
           if(dp.value==im.value) im.visable=true;
           break;
        case 1: //不等於
           if(dp.value!=im.value) im.visable=true;
           break;
        case 2://大於
           if(dp.value>im.value) im.visable=true;
           break;
        case 3://大於或等於
           if(dp.value>=im.value) im.visable=true;
           break;
        case 4://小於
           if(dp.value<im.value) im.visable=true;
           break;
        case 5://小於或等於
           if(dp.value<=im.value) im.visable=true;
           break;
      }
//      console.log(dp.title+' '+im.visable);
    }
*/

/*
$timeout(function() {
  var ele=document.getElementById($scope.layout.id);
console.log(ele);
  ele.style.backgroundImage = 'url(' + $scope.layout.background.url + ')';
  ele.style.width=$scope.layout.background.width.toString()+'px';
  ele.style.height=$scope.layout.background.height.toString()+'px';

//  var ele2=$document[0].getElementById($scope.layout.id+'move');
//  var ele2=document.getElementById($scope.layout.id+'move');
//  console.log(ele2);
//  ele2.style.backgroundImage = 'url(' + $scope.layout.background.url + ')';
//  ele2.style.width=$scope.layout.background.width.toString()+'px';
//  ele2.style.height=$scope.layout.background.height.toString()+'px';

}, 2000);
*/
    $scope.relations=[{relation: 0, label: '等於'},{relation: 1, label: '不等於'},
                          {relation: 2, label: '大於'},{relation: 3, label: '大於或等於'},
                        {relation: 4, label: '小於'},{relation: 5, label: '小於或等於'},
                     {relation: 6, label: '距離等於'},{relation: 7, label: '距離大於'},{relation: 8, label: '距離小於'}];
    $scope.showDatapointTitle=function(datapointid) {
      if(datapointid==null || datapointid==undefined) return '';
      if(datapointid=='0') return '背景圖';
      return FireFactory.datapointMap()[datapointid].title;
     };
    $scope.showRelation=function(relation) {
      if(relation==null || relation==undefined) return '';
      return $scope.relations[relation].label;
     };
    $scope.saveImage = function(index) {
       var obj=$scope.layout.layoutimages[index];
  console.log(obj);
       FireFactory.updatelayoutimage(obj, function() {
         console.log(obj);
       });
     }
    $scope.colors=[{id: 0, label: '青'},{id: 1, label: '綠'},
                           {id: 2, label: '藍'},{id: 3, label: '黃'},
                         {id: 4, label: '紅'},{id: 5, label: '灰'}];
    $scope.types=[{id: 0, label: '垂直面板'},{id: 1, label: '水平面板'},
                   {id: 2, label: 'LED數字'},{id: 3, label: '數值'}];
     $scope.saveLabel = function(index) {
        var obj=$scope.layout.layoutlabels[index];
//console.log(obj);
        FireFactory.updatelayoutlabel(obj, function() {
        });

      }
    $scope.showColor=function(id) {
      if(id==undefined) return '';
      return $scope.colors[id].label;
    }
    $scope.showType=function(id) {
      if(id==undefined) return '';
      return $scope.types[id].label;
    }

    $scope.switch=false;
    $scope.image={};
    $scope.image.url=null;
    $scope.image.uploading=false;
    $scope.image.progress=0;
    $scope.setFiles = function(element) {
      $scope.image.files = []
      for (var i = 0; i < element.files.length; i++) {
//console.log(element.files[i]);
        var fname=element.files[i].name.toLowerCase();
        if(!fname.endsWith('.gif') && !fname.endsWith('.png') && !fname.endsWith('.jpg') && !fname.endsWith('.jpeg')) {
          toastr.error('只能上傳圖檔!(gif,png,jpg,jpeg)', '上傳錯誤', {timeOut: 5000});
          return;
        }
        $scope.image.files.push(element.files[i])
      }

      $scope.image.uploading=true;
      $scope.image.url=null;
      var file=$scope.image.files[0];

    var _URL = window.URL || window.webkitURL;
    var img = new Image();
    img.onload = function () {
    //     alert(this.width + " " + this.height);
    //console.log(this.width + " " + this.height);
     var image={
       title:  '',
       width: this.width,
       height: this.height,
       layoutid: $scope.layout.id
     };
     FireFactory.uploadImageFile(image, file, function(progress){
      //   console.log(progress);
         $scope.image.progress=progress;
         $scope.$apply($scope.image.progress);
       },function(err){
         console.log(err);
         toastr.error(err, '上傳錯誤', {timeOut: 5000});
       },function(url,fileid){


    //        $scope.image.url=url;
         $scope.image.uploading=false;
    //          $scope.$apply($scope.image.url);
         $scope.$apply($scope.image.uploading);
         $scope.$apply($scope.layout.layoutimages);
         $rootScope.goto('layout');
       });
    };
    img.src = _URL.createObjectURL(file);

    };

    $scope.canEdit=function() {
      return true;
    };
    $scope.removeImage=function(index) {
      var image=$scope.layout.layoutimages[index];
      FireFactory.deletelayoutimage(image.id, function(){
      //  $scope.layout.images.splice(index,1);
      }, true);
    };

    $scope.cancel=function(form) {
      form.$cancel();

      console.log('cancel');
    };

    var inLabels=function(dpid, labels) {
      if(labels==null) return null;
      if(!angular.isArray(labels)) return null;
      for(var i=0;i<labels.length;i++) {
        var lab=labels[i];
        if(lab.datapointid==dpid) return lab.id;
      }
      return null;
    }
    $scope.setLayoutLabel=function(dpid) {
  //console.log(dpid);
  //console.log($scope.labels[dpid]);
      if($scope.labels[dpid]) {
          if(!inLabels(dpid,$scope.layout.layoutlabels)) {
            var label={
              layoutid: $scope.layout.id,
              datapointid: dpid,
              size: 20,
              type: 0
            };
            FireFactory.addlayoutlabel(label, function() {
              label.datapoint=FireFactory.datapointMap()[label.datapointid];
            }, false);
          }
      } else {
          var labid=inLabels(dpid,$scope.layout.layoutlabels);
          if(labid) {
            FireFactory.deletelayoutlabel(labid, function() {

            }, false);
          }
      }
    };


  }
})();
