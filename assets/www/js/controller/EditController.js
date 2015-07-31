app

.controller('EditCtrl', function($http, $location, $scope, $ionicPopup,
                                       dateUtil, JianJianBaoAPISrv, $q){    
    $scope.myNewPoster = {};

    $scope.setTipAmount = function(amount) {
        $scope.myNewPoster.tipAmount = amount;
    };

    $scope.createPoster = function() {

        try {
            var tipAmount = $scope.myNewPoster.tipAmount;
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
            "subject" : $scope.myNewPoster.subject 
            , "body" : $scope.myNewPoster.body
            , "tipAmount":  $scope.myNewPoster.tipAmount
        };

        JianJianBaoAPISrv.createPosterAndUpdateContext(newPoster)
        .then(function() {
            return createWXOrder(JianJianBaoAPISrv.currentPoster().id);
        })
        .then(function() {
            //alert("wx.chooseWXPay: 完成后的下一步");
            $rootScope.myNewPoster = {};
            $scope.posterCreationModal.hide();
            $rootScope.populateUI();
            return;
        });
    };

});
