"use strict";

/* Services */

app.constant('uBaiId', 2);
app.constant('uSuId', 3);
app.constant('uMingId', 4);

app.constant('posterId', 1);

app.constant('nodeBaiId', 1);
app.constant('nodeSuId', 2);
app.constant('nodeMingId', 3);

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


    

