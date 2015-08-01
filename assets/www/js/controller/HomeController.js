app

.controller("HomeCtrl", 
  function ($scope, lodash, $q, JianJianBaoAPISrv, $location, $http, $rootScope)  {
    console.log("HomeCtrl: BEGIN................");
    $scope.poster = {};
    $scope.proposals = [];

    //Load the Poster
    JianJianBaoAPISrv
    .getPoster($scope.posterId, $scope.userId)
    .then(function (poster) {
      $scope.poster = poster;
      $scope.initializeJssdk($scope);
      return null;
    })
    //Load the proposals
    .then(function () {
      var dfd = $q.defer();
      dfd.resolve();
      promise = dfd.promise;
   
      lodash.each($scope.poster.proposals.reverse(), function(proposalId) {
          promise = promise.then(function() {
              return JianJianBaoAPISrv.getProposal(proposalId);
          }).then(function(proposal) {
              // ...
              $scope.proposals.push(proposal);
          });
      });   
    });

    //Get the proposalsummary push message
    io.socket.on('poster', function (proposalSummary) { 
      JianJianBaoAPISrv.getProposal(proposalSummary.data.proposal)
      .then(function(proposal){
        //Todo: $scope update does not update view
        $scope.proposals.unshift(proposal);
        //$scope.$apply();
      });
    });
    io.socket.get("/poster/" + $scope.posterId);


    $scope.initializeJssdk = function($scope) {

        var apiURL = "/jssdk/getsign?url=" + encodeURIComponent($scope.absUrl);
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
              		//alert("scope.poster.subject" + $scope.poster.subject);
              		//alert("scope.poster.body" + $scope.poster.body);
              		//alert("scope.nodeId" + $scope.nodeId);
              		//alert("URL" + $location.protocol() + "://" + $location.host() + "/node/" + $scope.nodeId);
              		//alert("scope.poster.owner.hedimgurl" + $scope.poster.owner.headimgurl);

                wx.onMenuShareTimeline({
                  title: $scope.poster.subject,
                  desc: $scope.poster.body,
                  link: $location.protocol() + "://" + $location.host() + "/node/" + $scope.nodeId,
                  //imgUrl: $location.protocol() + "://" + $location.host() + "/www/img/beauty.jpg",
                  imgUrl: $scope.poster.owner.headimgurl,
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
                    //alert(JSON.stringify(res));
                  }
                });

                wx.onMenuShareAppMessage({
                  title: $scope.poster.subject,
                  desc: $scope.poster.body,
                  link: $location.protocol() + "://" + $location.host() + "/node/" + $scope.nodeId,
                  //imgUrl: $location.protocol() + "://" + $location.host() + "/www/img/beauty.jpg",
                  imgUrl: $scope.poster.owner.headimgurl,
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
                    //alert(JSON.stringify(res));
                  }
                });                
            });

            wx.error(function(res){
                //alert("错误：wx.config error, " + angular.toJson(res));
                //throw new Error(1001);
            });
        });
    };

})

.controller("HomeProposalCtrl", 
  function ($scope, $location, JianJianBaoAPISrv,$controller)  {
    $controller('HomeCtrl', {$scope : $scope}); //Make HomeProposalCtrl as child of HomeCtrl
    $scope.solution = "";
    $scope.propose = function() {        
        JianJianBaoAPISrv.postProposal($scope.solution, $scope.posterId, $scope.nodeId)
        .then(function(response) {
            $location.path("/tab/home");
        });   
    } ;
})

.controller("HomeShareCtrl", 
  function($scope, $q, JianJianBaoAPISrv)  {
})

.controller("HomeCheckTipsCtrl", 
  function($scope, JianJianBaoAPISrv, $stateParams)  {
    var posterId = $stateParams.id;
    JianJianBaoAPISrv.viewTips(posterId)
    .then(function(tips) {
        $scope.tips = tips;
    });
})

.controller("HomeProposalLinkPathCtrl", 
  function($scope, $q, $location, JianJianBaoAPISrv, $stateParams)  {
    var proposalId = $stateParams.id;
    JianJianBaoAPISrv
    .getPoster($scope.posterId, $scope.userId)
    .then(function (poster) {
      $scope.poster = poster;
      return null;
    })
    .then(function () {
      return JianJianBaoAPISrv.tipsCalc(proposalId);
    })
    .then(function (tips) {
      $scope.tips = tips;
    });
})

.controller("HomeProposalAdoptCtrl", 
  function($scope, $q, $location, JianJianBaoAPISrv, $stateParams, $controller)  {
    $controller('HomeCtrl', {$scope : $scope});
    var proposalId = $stateParams.id;
    JianJianBaoAPISrv.tipsCalc(proposalId)
    .then(function (tips) {
      $scope.tips = tips;
    });

    $scope.commit = function() {
        JianJianBaoAPISrv.commitProposal($stateParams.id)
        .then(function(tips) {
          //Todo: commit satus does not refresh view
          $scope.poster.commited = true;
          $location.path("/tab/home");
        });
    }
})



