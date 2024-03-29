app

.controller('EditCtrl', function($http, $location, $scope, $ionicPopup,
                                       JianJianBaoAPISrv, $q, $window){    
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

        var createWXOrder = function(posterId, $window) {
          //alert("createWXOrder: 开始");
          var apiURL = "/pay/wxpay?poster=" + posterId;
          return  $http.get(apiURL)
		  .then(function(response) {
                  //console.log("success: get " + apiURL + ", data=" + angular.toJson(response.data));
                  //alert("createWXOrder: 完成");

                  if (!response || !response.data || !response.data.payargs) {
                      throw new Error(1000);
                  }

                  //alert("wx.chooseWXPay: 开始");
                  return wx.chooseWXPay({
                      timestamp: parseInt(response.data.payargs.timeStamp),
                      nonceStr: response.data.payargs.nonceStr,
                      package: response.data.payargs.package,
                      signType: response.data.payargs.signType,
                      paySign: response.data.payargs.paySign,
                      success: function (res) {
                         //alert("wx.chooseWXPay: 完成, res" + angular.toJson(res));
	                 $window.location.href = "/node/" + createdPoster.nodes[0];
                      }
                  });
              }, function(response) {
                  var errorMsg = "error:  get " + apiURL + ", status=" + status;
                  console.log(errorMsg);
                  throw new Error(1000, errorMsg);
              });
        }

        var newPoster = {
            "subject" : $scope.myNewPoster.subject 
            , "body" : $scope.myNewPoster.body
            , "tipAmount":  $scope.myNewPoster.tipAmount
        };

        var createdPoster = {};
        JianJianBaoAPISrv.postPoster(newPoster)
        .then(function(poster) {
            createdPoster = poster;
            createWXOrder(poster.id, $window);
        })
    };

});
