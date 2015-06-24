"use strict";

//TODO 移入Service集成测试
//console.log("currentUser.nickname=" + userContextSrvStub.currentUser().nickname);
//console.log("currentNode=" + userContextSrvStub.currentNode().actions[0].type);

app.service('userContextSrv', function(nodeSrv, posterSrv, userSrv) {
                
    //私有属性，声明与始初化            
    
    var currentNode = null;
    var currentPoster = null;
    var currentUser = null;
    
    var posterOwner = null;
    var floorOwnerCashe = {};

    var loadFloors = function(successCallBack, errorCallBack) {
        if (!currentNode) {
            console.log("ERROR: currentNode is not init");
            //TODO
            return;
        }
       nodeSrv.getFloors(currentNode._id, function(data) {
            
            if (!angular.isArray(data)) {
                console.log("ERROR: data is not Array");
                //TODO
                return;
            }
            var floors = data;
            var floorOwnerCashe = {};
            
            //TODO 待优化
            
            for (var i = 0; i < floors.length; i++) {
                
                if (!angular.isString(floors[i].user)) {
                    console.log("ERROR: floors[" + i + "].user is not String");
                    //TODO
                    return;
                }
                
                //console.log("floors[" + i + "].user=" + floors[i].user);
                var userId = floors[i].user;
                if (!floorOwnerCashe[userId]) {
                    userSrv.getUserByWXOpenId(userId, function(user) {
                        console.log(angular.toJson(user));
                        floorOwnerCashe[userId] = user;
                    }, null);
                }
            }
            if (successCallBack) successCallBack(floors, floorOwnerCashe);
        }, function(data, status) {
            if (errorCallBack) errorCallBack();
        });
    }

    var loadPoster = function(successCallBack, errorCallBack) {
        if (!currentNode || !currentNode.posterid) {
            console.log("ERROR: currentNode is not init");
            //TODO
            return;
        }

        posterSrv.getPosterById(currentNode.posterid, function(poster) {
            //console.log(angular.toJson(poster));
            currentPoster = poster;
            var wxOpenIdOfPosterOwner = poster.create_userid;
            userSrv.getUserByWXOpenId(wxOpenIdOfPosterOwner, function(user) {
                //console.log(angular.toJson(user));
                posterOwner = user;
                if (successCallBack) successCallBack(currentPoster, posterOwner);
            }, null);
        }, null);
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
    
    this.floorOwnerCashe = function() {
        return floorOwnerCashe; 
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
    

    this.loadPosterAndFloors = function(successCallBack, errorCallBack) {
        loadPoster(function(currentPoster, posterOwner) {
            loadFloors(function(floors, floorOwnerCashe) {
                if (successCallBack) successCallBack(currentPoster, posterOwner, floors, floorOwnerCashe);
            });
        }, errorCallBack);
    };
                
    this.prepareContext = function(currentNodeId, currentPosterId, currentUserId, callback) {
        
        //console.log("prepareContext(" + currentNodeId + ", " + currentPosterId + ", " + currentUserId + ")");
        currentNode = currentNodeId;

        posterSrv.getPosterById(currentPosterId, function(poster) {
            //console.log("prepareContext: poster=" + angular.toJson(poster))
            currentPoster = poster;
            if (callback) callback();
        });
        
        var step3_getPosterAndFloors = function(node) {
            
            //console.log(angular.toJson(node));

            if (node.userid) {
                userSrv.getUserByWXOpenId(node.userid, function(user) {
                    //console.log(angular.toJson(user));
                    currentUser = user;
                    loadPoster(function(currentPoster, posterOwner) {
                        loadFloors(function(floors, floorOwnerCashe) {
                            if (callback) callback(currentPoster, posterOwner, floors, floorOwnerCashe);
                        });
                    }, null);

                }, null);
            }
        };
    }
                
    this.createPosterAndUpdateContext = function(newPoster, callback) {
        posterSrv.create(newPoster, function(newPosterResult, newRootNodeId) {
            currentNode = newRootNodeId;
            currentPoster = newPosterResult;
            if (callback) callback();
        });
    }
});