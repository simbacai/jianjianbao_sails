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

            wx.error(function(res){
                alert("错误：wx.config error, " + angular.toJson(res));
                //throw new Error(1001);
            });
        });
    };
    
    //TODO 可以用Filter实现
    $scope.timeDiff = function(dateTimeStamp) {
        return dateUtil.timeDiff(dateTimeStamp);
    };
    
});
