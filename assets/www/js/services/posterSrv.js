"use strict";

/* Services */

app.constant('uBaiId', 2);
app.constant('uSuId', 3);
app.constant('uMingId', 4);

app.constant('posterId', 1);

app.constant('nodeBaiId', 1);
app.constant('nodeSuId', 2);
app.constant('nodeMingId', 3);


app.service('userLoginFacker', function($http) {
    this.login = function(userWXOpenId, successCallBack, errorCallBack) {
        
        var apiURL = '/api/v1/user/' + userWXOpenId + '/login';
        $http.get(apiURL)
        .success(function(data, status, headers, config) {
            console.log("success: get " + apiURL);
            if (successCallBack) successCallBack(data);
        })
        .error(function(data, status, headers, config) {
            console.log("error:  get " + apiURL);
            if (errorCallBack) errorCallBack(data, status);
        });
    }
});

app.service('userContextSrv',
            function(nodeSrv, userLoginFacker/*TODO*/, posterSrv, userSrv
                     , $http) {
                
    //私有属性，声明与始初化            
    
    var currentNode = null;
    var currentPoster = null;
    var currentUser = null;
    
    var posterOwner = null;
                
    this.prepareContext = function(currentNodeId, callback) {
        
        console.log("prepareContext(" + currentNodeId + ")");
        
        //steps
        
        var step4_getPosterOwner = function(wxOpenIdOfPosterOwner) {
            userSrv.getUserByWXOpenId(wxOpenIdOfPosterOwner, function(user) {
                    console.log(angular.toJson(user));
                    posterOwner = user;
                    callback();
            }, null);
        };
        
        var step3_getUserAndPoster = function(node) {
            currentNode = node;
            console.log(angular.toJson(node));
            
            if (node.posterid) {
                posterSrv.getPosterById(node.posterid, function(poster) {
                    console.log(angular.toJson(poster));
                    currentPoster = poster;
                    step4_getPosterOwner(poster.create_userid);
                }, null);
            }
            
            if (node.userid) {
                userSrv.getUserByWXOpenId(node.userid, function(user) {
                    console.log(angular.toJson(user));
                    currentUser = user;
                }, null);
            }
        };
        
        var step2_getNode =  function(data){ 
            nodeSrv.getNodeById(currentNodeId, step3_getUserAndPoster, null);
        };
        //step2_getNode(null);
        
        
        var step1_login =  function(){ 
            userLoginFacker.login("ooTyQs-VxOJhrgJd6KxF_z8Y7mQc", step2_getNode, null);
        };
        step1_login();
    }
    
    this.currentUser = function() {
        return currentUser;
    }
    
    this.currentNode = function() {
        return currentNode; 
    }
    
    this.currentPoster = function() {
        return currentPoster; 
    }
    
    this.posterOwner = function() {
        return posterOwner; 
    }
    
    this.isCurrentUserThePosterOwner = function() {
        if (currentPoster && currentNode && currentPoster.create_userid && currentNode.userid) {
            return angular.equals(currentPoster.create_userid, currentNode.userid);
        } else {
            return null;
        }
    };
    
    this.proposeAtCurrentNode = function(solution, successCallBack, errorCallBack) {
        if (!currentNode || !currentNode._id) {
            //TODO throw error
            return null;
        }
        
        return nodeSrv.propose(currentNode._id, solution, function(data){
            if(successCallBack) successCallBack(data)
        }, function(data, status){
            if(errorCallBack) errorCallBack(data, status)
        });
    };
});

app.service('userContextSrvStub',
            function(uBaiId, uSuId, uMingId,
                     nodeBaiId, nodeSuId, nodeMingId,
                     posterId,
                     nodeSrvStub, userSrvStub, posterSrvStub) {
    
    //私有属性，声明与始初化
    
    
    var userContextDB = [{user: userSrvStub.getUerById(uBaiId), node: nodeSrvStub.getNode(nodeBaiId)}
                        , {user: userSrvStub.getUerById(uSuId), node: nodeSrvStub.getNode(nodeSuId)}
                        , {user: userSrvStub.getUerById(uMingId), node: nodeSrvStub.getNode(nodeMingId)}
                        ];
    var currentContextIndex = 0;
    
    
    var currentPoster = posterSrvStub.getPosterById(posterId);
    //currentPoster.extentInfo = {authorNickname: userSrvStub.getUerById(currentPoster.create_userid).nickname};
    
    
    // pulbic接口方法
    
    this.currentUser = function() {
        return userContextDB[currentContextIndex].user;
    }
    
    this.currentNode = function() {
        return userContextDB[currentContextIndex].node; 
    }
    
    this.currentPoster = function() {
        return currentPoster; 
    }
    
    this.changeUserContext = function() {
        currentContextIndex ++;
        if (currentContextIndex >= userContextDB.length) currentContextIndex = 0;
    }
});


app.service('userSrvStub', function(uBaiId, uSuId, uMingId) {
    
    var uBai = {
        _id: uBaiId,
        "nickname":"白润发",
        "headimgurl":"",
        
        wxUserInfo: {
            "openid":"ooTyQs-VxOJhrgJd6KxF_z8Y7mQc",
            "nickname":"黄道奕",
            "sex":1,
            "language":"zh_CN",
            "city":"上海",
            "province":"上海",
            "country":"中国",
            "headimgurl":"http:\/\/wx.qlogo.cn\/mmopen\/VL8EXRZJbFVnOvY8FP1ZXORSdVXibYZyBULI40R5yg6HfUvPjkltuwLUgA9893sXsU4wxGzVEf9YuTNhiaiaQWRicn22DGxSg6b1\/0"
            ,"privilege":[]
            , "unionid": "UNIONID"  //TODO 切到正式号后，使用UINIONID，减少对公众号的依赖，方便开发者有在多个公众号和移动应用之数据迁移
        }
    }
    
    var uSu = {
        _id: uSuId,
        "nickname":"苏快手",
        "headimgurl":"",
        
        wxUserInfo: {
            "openid":"ooTyQs-VxOJhrgJd6KxF_z8Y7mQc",
            "nickname":"黄道奕",
            "sex":1,
            "language":"zh_CN",
            "city":"上海",
            "province":"上海",
            "country":"中国",
            "headimgurl":"http:\/\/wx.qlogo.cn\/mmopen\/VL8EXRZJbFVnOvY8FP1ZXORSdVXibYZyBULI40R5yg6HfUvPjkltuwLUgA9893sXsU4wxGzVEf9YuTNhiaiaQWRicn22DGxSg6b1\/0"
            ,"privilege":[]
            , "unionid": "UNIONID"  //TODO 切到正式号后，使用UINIONID，减少对公众号的依赖，方便开发者有在多个公众号和移动应用之数据迁移
        }
    }
    
    var uMing = {
        _id: uMingId,
        "nickname":"闵一明",
        "headimgurl":"",
        
        wxUserInfo: {
            "openid":"ooTyQs-VxOJhrgJd6KxF_z8Y7mQc",
            "nickname":"黄道奕",
            "sex":1,
            "language":"zh_CN",
            "city":"上海",
            "province":"上海",
            "country":"中国",
            "headimgurl":"http:\/\/wx.qlogo.cn\/mmopen\/VL8EXRZJbFVnOvY8FP1ZXORSdVXibYZyBULI40R5yg6HfUvPjkltuwLUgA9893sXsU4wxGzVEf9YuTNhiaiaQWRicn22DGxSg6b1\/0"
            ,"privilege":[]
            , "unionid": "UNIONID"  //TODO 切到正式号后，使用UINIONID，减少对公众号的依赖，方便开发者有在多个公众号和移动应用之数据迁移
        }
    }
    
    var userDB = {};
    userDB[uBaiId] = uBai;
    userDB[uSuId] = uSu;
    userDB[uMingId] = uMing;
    
    this.getUerById = function(userId) {
        return userDB[userId];
    }
});

app.service('nodeSrvStub', function(uBaiId, uSuId, uMingId
                                      , posterId
                                      , nodeBaiId, nodeSuId, nodeMingId
                                      ) {
    var nodeBai = {
        _id: nodeBaiId,
        "userid" : uBaiId, 
        "posterid" : posterId,
        "actions" : [
            {type: "createPoster"}
        ]
    };
    
    var nodeSu = {
        _id: nodeSuId,
        "userid" : uBaiId, 
        "posterid" : posterId,
        "actions" : []
    };
    
    var nodeMing = {
        _id: nodeMingId,
        "userid" : uBaiId, 
        "posterid" : posterId,
        "actions" : []
    };
    
    var actionNodeDB = {};
    actionNodeDB[nodeBaiId] = nodeBai;
    actionNodeDB[nodeSuId] = nodeSu;
    actionNodeDB[nodeMingId] = nodeMing;
    
    this.getNode = function(nodeId) {
        return actionNodeDB[nodeId];
    }
    
    this.propose = function(action, currentNode) {
    }
    
    this.commit = function(action, currentNode) {
    }
    
    this.getFloors = function(currentNode) {
    }
});

app.service("posterSrvStub", function(posterId, uBaiId) {
    
    var posterInDB = {};
    
    //TODO 移入Service集成测试
    this.mockPoster = function() {
        var newPoster = {
            "subject" : $scope.poster.subject 
            , "body" : $scope.poster.body 
            , "tip" : {
                "method" : "现金红包"
                , "tip_amount" : $scope.poster.tip.tip_amount
                //, "保证帐户收款流水号" : ["1"]
                , "tip_method" : []
            }
            , "create_userid" : "1"
            , "close_status" : "是"
            , "close_timestamp" : null
        };
        
        newPoster.tip.tip_method.push({"userid": "2", "tip_amount": 4.00, "pay_id":["2"]});
        newPoster.tip.tip_method.push({"userid": "3", "tip_amount": 16.00, "pay_id":["3"]});
        
        return newPoster;
    };
    
    // pulbic接口方法:
   
    this.add = function(poster, successCallBack, errorCallBack) {
        posterInDB = poster;
        posterInDB._id = posterId;
        poster.create_userid = uBaiId;
        poster.create_timestamp = new Date();
        if (successCallBack) successCallBack(posterInDB);
        return posterInDB;
    };
    
    this.getPosterById = function(posterId) {
        return posterInDB;
    };
});



app.service("posterSrv", function($http) {
    
    // pulbic接口方法:
    
    this.add = function(poster, successCallBack, errorCallBack) {
        var apiURL = '/api/v1/poster';
        $http.post(apiURL, {newPoster: poster})
        .success(function(data, status, headers, config) {
            var newPoster = data;
            console.log("success: post " + apiURL+ ", " + newPoster._id);
            console.log(angular.toJson(data));
            if (successCallBack) successCallBack(newPoster);
        })
        .error(function(data, status, headers, config) {
            if (errorCallBack) errorCallBack(data, status);
            console.log("error:  post " + apiURL);
        });
    }
    
    this.getPosterById = function(posterId, successCallBack, errorCallBack) {
        var apiURL = '/api/v1/poster/' + posterId; 
        $http.get(apiURL)
        .success(function(data, status, headers, config) {
            var poster = data;
            console.log("success: get " + apiURL);
            if (successCallBack) successCallBack(poster);
        })
        .error(function(data, status, headers, config) {
            if (errorCallBack) errorCallBack(data, status);
            console.log("error:  get " + apiURL);
        });
    }
});