app

.controller('AppMainCtrl', function($rootScope, $http, $location, $scope
                                       , dateUtil, userContextSrv, $q){
    $rootScope.poster = {};

    $rootScope.refresh = function() {
        userContextSrv.reloadPosterAndFloors().then(function() {
            $rootScope.poster = userContextSrv.currentPoster();

            //Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
        });
    };
    
    /**
     * 调用: index.html使用ng-init调用
     */
    $rootScope.initUsercontext = function(currentNodeId, currentPosterId, currentUserId) {
        //console.log("current: node=" + currentNodeId + ", poster=" + currentPosterId + ", user=" + currentUserId);

        return userContextSrv.prepareContext(currentNodeId, currentPosterId, currentUserId).then(function() {
            return $rootScope.populateUI();
        });
    };

    /**
     * 调用:
     * 情况1: index.html使用ng-init调用
     * 情况2: PosterCreationCtrl中创建一张新Poster后
     */
    $rootScope.populateUI = function() {

        console.log("################# $rootScope.populateUI 开始");

        $rootScope.poster = userContextSrv.currentPoster();
        //console.log("$rootScope.poster=" + angular.toJson($rootScope.poster));

        /*
        $rootScope.posterOwner = posterOwner;
        $rootScope.floors = floors.reverse();
        $rootScope.floorOwnerCashe = floorOwnerCashe;
        */

        //不刷新跳转
        $rootScope.posterMainPath = "/node/" + userContextSrv.currentNodeId();
        var prefix = "";
        if ($rootScope.poster.tipAmount && $rootScope.poster.tipAmount > 0) {
            prefix = "悬赏" + $rootScope.poster.tipAmount + "元：";
        }
        $rootScope.documentTitle = prefix + $rootScope.poster.subject;

        $location.path($rootScope.posterMainPath);
        document.title = $rootScope.documentTitle;


        console.log("################# $rootScope.populateUI 完成");

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
                  imgUrl: $location.protocol() + "://" + $location.host() + "/www/img/beauty.jpg",
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
                alert("错误：wx.config error, " + angular.toJson(res));
                //throw new Error(1001);
            });
        });
    }
    
    //TODO 可以用Filter实现
    $rootScope.timeDiff = function(dateTimeStamp) {
        return dateUtil.timeDiff(dateTimeStamp);
    }
    
})

.controller("PosterMainCtrl", function($scope, $rootScope, $q, $location
    , userContextSrv
    , $ionicModal, $ionicPopover, $ionicPopup, $http){
    console.log("PosterMainCtrl: BEGIN................");

    $rootScope.myNewPoster = {"tipAmount" : 0};

    $ionicModal.fromTemplateUrl('/www/templates/proposal_creation.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.proposeBtnClick = function() {
        $scope.modal.show();
    }

    $scope.commit = function(proposalId) {
        userContextSrv.commitProposal(proposalId).then(function() {
            return userContextSrv.viewTips();
        }).then(function(tips) {
            $rootScope.tips = tips;

            console.log("################# 跳转至linkpath ");
            //不刷新跳转
            $location.path($rootScope.posterMainPath + "/linkpath/proposal/" + proposalId);

            return;
        });
    }

    $scope.viewTips = function(proposalId) {
        userContextSrv.viewTips().then(function(tips) {
            console.log("$scope.viewTips: tips= " + angular.toJson(tips))
            $rootScope.tips = tips;

            console.log("################# 跳转至linkpath ");
            //不刷新跳转
            $location.path($rootScope.posterMainPath + "/commitresult");

            return;
        });
    }

    $scope.tipsCalc = function(proposalId) {
        $rootScope.tips = [];

        userContextSrv.tipsCalc(proposalId).then(function(tips) {
            console.log("$scope.tipsCalc: tips= " + angular.toJson(tips))
            $rootScope.tips = tips;

            console.log("################# 跳转至linkpath ");
            //不刷新跳转
            $location.path($rootScope.posterMainPath + "/linkpath/proposal/" + proposalId);

            return;
        });
    }

    $scope.propose = function() {
        console.log("################# $scope.propose 开始");

        userContextSrv.proposeAtCurrentNode($rootScope.solution).then(function() {
            console.log("################# $scope.propose 完成");
            $rootScope.solution = "";
            $scope.modal.hide();
            $rootScope.refresh();
        });
    }
    
    $ionicModal.fromTemplateUrl('/www/templates/poster_creation.html', {
      scope: $scope
    }).then(function(modal) {
        $scope.posterCreationModal = modal;

        //TODO
        /*
        $rootScope.myNewPoster.subject = "test Subj";
        $rootScope.myNewPoster.body =  "test Body";
        $rootScope.myNewPoster.tipAmount = "123";
        $scope.posterCreationModal.show();
        */
    });
    
    $ionicModal.fromTemplateUrl('/www/templates/share.html', {
      scope: $scope
    }).then(function(modal) {
        $scope.shareModal = modal;
    });

    $ionicPopover.fromTemplateUrl('/www/templates/main_menu.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.popover = popover;
    });

    $scope.setTipAmount = function(amount) {
        $rootScope.myNewPoster.tipAmount = amount;
    };

    $scope.createPoster = function() {

        try {
            var tipAmount = $rootScope.myNewPoster.tipAmount;
            if (isNaN(tipAmount)) {
                throw new Error("红包金额格式不正确，请输入数字，最小金额为1元。");
            }
            var tipAmount = Number(tipAmount);
            if (tipAmount < 1) {
                throw new Error("红包金额格式不正确，请输入数字，最小金额为1元。");
            }
            //TODO  最大金额
        } catch(err) {
            $ionicPopup.alert({
               title: '提示',
               template: err.message,
               okText: "关闭",
               okType: "button-stable"
            });
            return;
        }


        var createWXOrder = function(posterId) {

            //alert("createWXOrder: 开始");
            var apiURL = "/pay/wxpay?poster=" + posterId;
            var promise = 
                $http.get(apiURL).then(function(response) {
                    //console.log("success: get " + apiURL + ", data=" + angular.toJson(response.data));
                    //alert("createWXOrder: 完成");

                    if (!response || !response.data || !response.data.payargs) {
                        throw new Error(1000);
                    }

                    //alert("wx.chooseWXPay: 开始");
                    wx.chooseWXPay({
                        timestamp: parseInt(response.data.payargs.timeStamp),
                        nonceStr: response.data.payargs.nonceStr,
                        package: response.data.payargs.package,
                        signType: response.data.payargs.signType,
                        paySign: response.data.payargs.paySign,
                        success: function (res) {
                            //alert("wx.chooseWXPay: 完成, res" + angular.toJson(res));
                        }
                    });

                    return;
                }, function(response) {
                    var errorMsg = "error:  get " + apiURL + ", status=" + status;
                    console.log(errorMsg);
                    throw new Error(1000, errorMsg);
                });
            return promise;
        }

        var newPoster = {
            "subject" : $rootScope.myNewPoster.subject 
            , "body" : $rootScope.myNewPoster.body
            , "tipAmount":  $rootScope.myNewPoster.tipAmount
        };

        userContextSrv.createPosterAndUpdateContext(newPoster).then(function() {
            return createWXOrder(userContextSrv.currentPoster().id);
        }).then(function() {
            //alert("wx.chooseWXPay: 完成后的下一步");
            $rootScope.myNewPoster = {};
            $scope.posterCreationModal.hide();
            $rootScope.populateUI();
            return;
        });
    };
})

.controller("ProposeCtrl", function($scope, $rootScope, userContextSrv){
    console.log("ProposeCtrl: BEGIN................");

})

.controller("LinkPathCtrl", function($scope, $rootScope, userContextSrv, $stateParams, $location){
    // + $routeParams.proposalid
    console.log("LinkPathCtrl: BEGIN................$routeParams.proposalId=" + $stateParams.proposalid);

    $scope.commit = function() {
        userContextSrv.commitProposal($stateParams.proposalid).then(function() {
            return userContextSrv.viewTips();
        }).then(function(tips) {
            //$rootScope.tips = tips;
            console.log("tips=" + angular.toJson(tips));

            console.log("################# 跳转首页");
            //不刷新跳转
            $location.path($rootScope.posterMainPath);

            $rootScope.refresh();

            return;
        });
    }

})

.controller("CommitResultCtrl", function(){
    console.log("CommitResultCtrl: BEGIN................");

})

;
