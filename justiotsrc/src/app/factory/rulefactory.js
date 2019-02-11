/**
 * @author Wu-Jeng Li
 * created on 02.04.2017
 */
(function () {
  'use strict';

  angular.module('JustIOT.factory')
    .factory('RuleFactory', rulefactory);

  /** @ngInject */
  function rulefactory(FireFactory) {
    var ioconditionstr= function(iocondition) {
         var rel=['等於','不等於','大於','大於或等於','小於','小於或等於','距離等於','距離大於','距離小於'];
         var des=FireFactory.datapointMap()[iocondition.datapointid].title;
         des=des+' ';
         des=des+rel[iocondition.relation];
         des=des+iocondition.value.toString();
         des=des+' ';
         return des;
      };

      var iodrivestr= function(iodrive) {
        var iod='設定 '+FireFactory.datapointMap()[iodrive.datapointid].title+' 為 '+iodrive.value.toString();
        if(iodrive.duration != undefined && iodrive.duration!=null && iodrive.duration!=0)
         iod=iod+' '+iodrive.duration+'分鐘';
         return iod;
      };

        var UserAPI = {

          timeconditionstr: function(rule) {
  //  console.log(rule);
            if(rule.time1==null || rule.time1.length==0) return "";
            var weeks=["星期一","星期二","星期三","星期四","星期五","星期六","星期日"];
            var des="";
            if(rule.week!=null && rule.week.length>0)
             {for(var j=0;j<rule.week.length;j++)
               {
                des=des+weeks[parseInt(rule.week.charAt(j))-1]+' ';
               }
             }
            if(rule.time2==null || rule.time2.length==0)
             {
              if(rule.date1!=null && rule.date1.length>0) des=des+rule.date1+' ';
              if(rule.time1!=null && rule.time1.length>0) des=des+rule.time1+' ';
             }
            else
             {des=des+'從';
              if(rule.date1!=null && rule.date1.length>0) des=des+rule.date1+' ';
              if(rule.time1!=null && rule.time1.length>0) des=des+rule.time1+' ';
              des=des+'到';
              if(rule.date2!=null && rule.date2.length>0) des=des+rule.date2+' ';
              if(rule.time2!=null && rule.time2.length>0) des=des+rule.time2+' ';
              if(rule.reverse) des=des+'時段之外';
             }
             return des;
          },

          ioconditionsstr: function(iocondition) {
            if(iocondition==null || iocondition.length==0) return "";
            var iocond="";
            for(var i=0;i<iocondition.length;i++)
              {iocond=iocond+ioconditionstr(iocondition[i]);
               if(i!=(iocondition.length-1)) iocond=iocond+',';
              }

             return iocond;
          },

          iodrivesstr: function(iodrive) {
            if(iodrive==null || iodrive.length==0) return "";
            var iod="";
            if(iodrive!=null && iodrive.length>0)
            {for(var i=0;i<iodrive.length;i++)
              {iod=iod+iodrivestr(iodrive[i]);
               if(i!=(iodrive.length-1)) iod=iod+',';
              }
            }
             return iod;
          },

          description: function(rule) {
            var des=this.timeconditionstr(rule);
             var iocond=this.ioconditionsstr(rule.iocondition);
             var iod=this.iodrivesstr(rule.iodrive);
             var str='條件:<br>';
             if(des.length>0) str='時間條件:'+des+'<br>';
             if(iocond.length>0) str=str+'輸入輸出條件:'+iocond+'<br>';
             if(iod.length>0) str=str+'驅動輸出:'+iod+'<br>';
             if(rule.sms!=null && rule.sms.length>0) str=str+'SMS: '+rule.sms+'<br>';
             if(rule.email!=null && rule.email.length>0) str=str+'EMail: '+rule.email+'<br>';
             if(rule.notification) str=str+'發Notification通知.';
             return str;
    /*
             if(des.length>0) str=str+'<div class="item">'+des+'</div>';
             if(iocond.length>0) str=str+'<div class="item">'+iocond+'</div>';
             if(iod.length>0) str=str+'<div class="item">'+iod+'</div>';
             if(rule.sms!=null && rule.sms.length>0) str=str+'<div class="item">'+'SMS: '+rule.sms+'</div>';
             if(rule.email!=null && rule.email.length>0) str=str+'<div class="item">'+'EMail: '+rule.email+'</div>';
             if(rule.notification) str=str+'<div class="item">'+'Notification: <img src="img/yes.gif">'+'</div>';

             return '<div class="list list-inset">'+str+'</div>';
    */
          },
          conditionstr: function(rule) {
            var des=this.timeconditionstr(rule);
            var iocond=this.ioconditionsstr(rule.iocondition);
            var str='<p>';
            if(des.length>0) str='時間條件:'+des;
            if(str.length>0 && iocond.length>0) str=str+'<br>';
            if(iocond.length>0) str=str+'輸入輸出條件:'+iocond;
            str=str+'</p>';
            return str;
          },
          actionstr: function(rule) {
            var iod=this.iodrivesstr(rule.iodrive);
            var str='';
            if(iod.length>0) str=str+iod+',';
            if(rule.sms!=null && rule.sms.length>0) str=str+'SMS: '+rule.sms+',';
            if(rule.email!=null && rule.email.length>0) str=str+'EMail: '+rule.email+',';
            if(rule.notification) str=str+'發Notification通知.';
      //      str=str+'';
            return str;
          }
        };

        return UserAPI;
 }

})();
