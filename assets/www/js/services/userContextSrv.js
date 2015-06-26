"use strict";

app.service('userContextSrv', function(nodeSrv, posterSrv, userSrv, apiHelper, $q) {
                
    //私有属性，声明与始初化            
    
    var currentNode = null;
    var currentPoster = null;
    var currentUser = null;
    
    var posterOwner = null;

    //TODO
    var usersCache = {
        "558a92b411e92001882d58ec": {
            "owner": "558a92b411e92001882d58ec",
            "openid": "ooTyQsx4QRx_d8y21n7I-AVoUB1E",
            "nickname": "白润发",
            "sex": "1",
            "language": "zh_CN",
            "city": "Pudong New District",
            "province": "Shanghai",
            "country": "CN",
            "headimgurl": "http://wx.qlogo.cn/mmopen/ajNVdqHZLLA37ZzicZYNnSabo0tnXs1kZjiaqmQfEeQczc1Wlg5XWYYItXd5Z0k0fZjpgpicX3UIQQQ1UCSUTZjOg/0",
            "privilege": "",
            "username": "ooTyQsx4QRx_d8y21n7I-AVoUB1E",
            "createdAt": "2015-06-24T11:21:24.166Z",
            "updatedAt": "2015-06-24T11:21:24.271Z",
            "id": "558a92b411e92001882d58ec"
        }, 
        "558a926511e92001882d58e8": {
            "owner": "558a926511e92001882d58e8",
            "openid": "ooTyQs-VxOJhrgJd6KxF_z8Y7mQc",
            "nickname": "黄道奕",
            "sex": "1",
            "language": "zh_CN",
            "city": "Pudong New District",
            "province": "Shanghai",
            "country": "CN",
            "headimgurl": "http://wx.qlogo.cn/mmopen/VL8EXRZJbFVnOvY8FP1ZXORSdVXibYZyBULI40R5yg6HfUvPjkltuwLUgA9893sXsU4wxGzVEf9YuTNhiaiaQWRicn22DGxSg6b1/0",
            "privilege": "",
            "username": "ooTyQsx4QRx_d8y21n7I-AVoUB1E",
            "createdAt": "2015-06-24T11:21:24.166Z",
            "updatedAt": "2015-06-24T11:21:24.271Z",
            "id": "558a926511e92001882d58e8"
        }
    };

    var loadFloors = function(callBack) {
        if (!currentPoster) {
            throw new Error(2000, "currentPoster=" + currentPoster);
        }
        if (!currentPoster.id) {
            throw new Error(2000, "currentPoster.id=" + currentPoster.id);
        }

        apiHelper.searchResource("proposal", "poster="+currentPoster.id, function(proposals) {
            console.log("proposals" + angular.toJson(proposals));
            currentPoster.proposalObjs = proposals.reverse();
            for(var i=0; i<currentPoster.proposalObjs.length; i++) {
                var userId = currentPoster.proposalObjs[i].createdBy;
                currentPoster.proposalObjs[i].createdByUserObj = usersCache[userId];
            }
            if (callBack) callBack();
        });
    }

    //TODO
    var putUserToCache = function(userId, callback) {

        apiHelper.getResourceById(userId, "user", function(user) {
            console.log("user=" + angular.toJson(user));
            console.log("user.id=" + user.id);
            console.log("user.nickname=" + user.nickname);
            console.log("user.headimgurl=" + user.headimgurl);
            
            if (!user.id) {
                throw new Error(2000, "user.id=" + user.id);
            }

            usersCache[user.id] = user;

        });
    }

    var loadPoster = function(posterId) {

        return posterSrv.getPosterById(posterId, 
            function(response) {
                console.log("################# 3")
                currentPoster = response.data;

                if (!currentPoster.createdBy) {
                    throw new Error(2000, "currentPoster.createdBy=" + currentPoster.createdBy);
                }

                //TODO
                currentPoster.createdByUserObj = usersCache[currentPoster.createdBy];
                //putUserToCache(currentPoster.createdBy, callback);

                //loadFloors(callback);
            }
        );
    }

    var reloadPoster = function() {
        if (!currentPoster) {
            throw new Error(2000, "currentPoster=" + currentPoster);
        }
        if (!currentPoster.id) {
            throw new Error(2000, "currentPoster.id=" + currentPoster.id);
        }

        return loadPoster(currentPoster.id);
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
    
    this.usersCache = function() {
        return usersCache; 
    }
    
    this.isCurrentUserThePosterOwner = function() {
        if (currentPoster && currentNode && currentPoster.create_userid && currentNode.userid) {
            return angular.equals(currentPoster.create_userid, currentNode.userid);
        } else {
            return null;
        }
    };
    
    this.proposeAtCurrentNode = function(solution, callBack) {
        if (!currentNode) {
            throw new Error(2000, "currentNode=" + currentNode);
        }
        if (!currentPoster) {
            throw new Error(2000, "currentPoster=" + currentPoster);
        }
        if (!currentPoster.id) {
            throw new Error(2000, "currentPoster.id=" + currentPoster.id);
        }
        
        var newProposal = {
            "content": solution
        }
        newProposal.poster = currentPoster.id;
        newProposal.node = currentNode;
        
        apiHelper.createResource("proposal", newProposal, callBack);
    };
    

    this.reloadPosterAndFloors = function() {
        return reloadPoster(callBack);
    };
                
    this.prepareContext = function(currentNodeId, currentPosterId, currentUserId) {
        
        //console.log("prepareContext(" + currentNodeId + ", " + currentPosterId + ", " + currentUserId + ")");
        currentNode = currentNodeId;

        return loadPoster(currentPosterId);
    }
                
    this.createPosterAndUpdateContext = function(newPoster, callback) {
        posterSrv.create(newPoster, function(newPosterResult, newRootNodeId) {
            currentNode = newRootNodeId;
            currentPoster = newPosterResult;
            if (callback) callback();
        });
    }
});