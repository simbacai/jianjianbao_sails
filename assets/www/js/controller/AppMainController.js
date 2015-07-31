app

.controller('AppMainCtrl', function($http, $location, $scope,
                                       JianJianBaoAPISrv, $q){

    $scope.refresh = function() {
        JianJianBaoAPISrv.reloadPosterAndFloors().then(function() {
            $rootScope.poster = JianJianBaoAPISrv.currentPoster();

            //Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
    
    /**
     * 调用: index.html使用ng-init调用
     */
    $scope.initialize = function(node, poster, user) {
        //console.log("current: node=" + currentNodeId + ", poster=" + currentPosterId + ", user=" + currentUserId);
        $scope.nodeId = node;
        $scope.posterId = poster;
        $scope.userId = user;
        $scope.initializeJssdk();
    };

    /**
     * 调用:
     * 情况1: index.html使用ng-init调用
     * 情况2: PosterCreationCtrl中创建一张新Poster后
     */
    $scope.initializeJssdk = function() {

        var apiURL = "/jssdk/getsign?url=" + encodeURIComponent($location.absUrl());
        //alert("getsign, $location.absUrl()=" + encodeURIComponent($location.absUrl()));
        var promise = 
            $http.get(apiURL).then(function(response) {
                console.log("success: get " + apiURL);
                //alert("getsign: 完成");
                return response;
            }, function(response) {
                var errorMsg = "error:  get " + apiURL + ", status=" + status;
                console.log(errorMsg);
                throw new Error(1000, errorMsg);
            });
        promise.then(function(response) {
            var msg = "wx.config: 开始, timestamp=" + response.data.timestamp
                + ", nonceStr=" + response.data.nonceStr
                + ", signature=" + response.data.signature
                + "$location.absUrl()=" + $location.absUrl();
            //alert(msg);

            wx.config({
              debug: false,
              //appId: 'wxf13d012c692b6895',
              appId: 'wxcd3e2f8024ba7f49',
              timestamp: parseInt(response.data.timestamp),
              nonceStr: response.data.nonceStr,
              signature: response.data.signature,
              jsApiList: [
                'checkJsApi',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'hideMenuItems',
                'showMenuItems',
                'hideAllNonBaseMenuItem',
                'showAllNonBaseMenuItem',
                'translateVoice',
                'startRecord',
                'stopRecord',
                'onRecordEnd',
                'playVoice',
                'pauseVoice',
                'stopVoice',
                'uploadVoice',
                'downloadVoice',
                'chooseImage',
                'previewImage',
                'uploadImage',
                'downloadImage',
                'getNetworkType',
                'openLocation',
                'getLocation',
                'hideOptionMenu',
                'showOptionMenu',
                'closeWindow',
                'scanQRCode',
                'chooseWXPay',
                'openProductSpecificView',
                'addCard',
                'chooseCard',
                'openCard'
              ]
            });

            wx.ready(function(){
                //alert("wx.config: ready");
                wx.onMenuShareAppMessage({
                  title: $rootScope.documentTitle,
                  desc: $rootScope.poster.body,
                  link: $location.protocol() + "://" + $location.host() + $rootScope.posterMainPath,
                  //imgUrl: $location.protocol() + "://" + $location.host() + "/www/img/beauty.jpg",
                  imgUrl: $rootScope.poster.createdByUserObj.headimgurl,
                  trigger: function (res) {
                    // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
                    //alert('用户点击发送给朋友');
                  },
                  success: function (res) {
                    //alert('已分享');

                  },
                  cancel: function (res) {
                    //alert('已取消');
                  },
                  fail: function (res) {
                    alert(JSON.stringify(res));
                  }
                });
            });

            wx.error(function(res){
                //alert("错误：wx.config error, " + angular.toJson(res));
                //throw new Error(1001);
            });
        });
    };
    
    //TODO 可以用Filter实现
    $scope.timeDiff = function(dateTimeStamp) {
        return dateUtil.timeDiff(dateTimeStamp);
    };
    
});
