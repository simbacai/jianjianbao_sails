"use strict";

/**
 * 用法：console.log(dateUtil.timeDiff("2015-05-24 13:58:25.130Z"));
 */
app.service('dateUtil', function() {
    this.timeDiff = function(dateTimeStamp) {
        var minute = 1000 * 60;
        var hour = minute * 60;
        var day = hour * 24;
        var halfamonth = day * 15;
        var month = day * 30;
        
        var now = new Date().getTime();
        var diffValue = now - new Date(dateTimeStamp).getTime();
        
        if(diffValue < 0){
            //console.log("结束日期不能小于开始日期！");
         }
        var monthC =diffValue/month;
        var weekC =diffValue/(7*day);
        var dayC =diffValue/day;
        var hourC =diffValue/hour;
        var minC =diffValue/minute;
        
        if (dayC>=2) {
            return parseInt(dayC) +"天前";
        } else if (dayC>=1){
            return "昨天";
        } else if(hourC>=1){
            return parseInt(hourC) +"小时前";
        } else if(minC>=1){
            return parseInt(minC) +"分钟前";
        }else {
            return "刚刚";
        }
    }
});
