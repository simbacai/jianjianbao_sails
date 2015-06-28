"use strict";

app.service('userContextSrv', function(resourceSrv, $q) {
                
    //私有属性：声明与始初化            
    
    var _currentNodeId = null;
    var _currentUserId = null;
    var _currentPoster = null;
    var _usersCache = {};

    //私有方法：定义  

    var loadProposalSummary = function() {
        console.log("################# loadProposalSummary 开始");
        if (!_currentPoster) {
            throw new Error(2000, "currentPoster=" + _currentPoster);
        }
        if (!_currentPoster.id) {
            throw new Error(2000, "currentPoster.id=" + _currentPoster.id);
        }

        var promise = 
            resourceSrv.searchResource("ProposalSummary", "poster="+_currentPoster.id).then(function(response) {
                var proposals = response.data;

                console.log("proposals=" + angular.toJson(proposals));
                _currentPoster.proposalObjs = proposals.reverse();
                for(var i=0; i<_currentPoster.proposalObjs.length; i++) {
                    var userId = _currentPoster.proposalObjs[i].createdBy;
                    _currentPoster.proposalObjs[i].createdByUserObj = _usersCache[userId];
                }
                console.log("################# loadProposalSummary 完成");
            });

        return promise;
    }

    var loadContentForAllProposals = function() {
        console.log("################# loadContentForAllProposals 开始");

        if (!_currentPoster) {
            throw new Error(2000, "currentPoster=" + _currentPoster);
        }

        var promises = _currentPoster.proposalObjs.map(function(proposal) {
            console.log("################# loadContentForAllProposals 子循环开始, proposal＝" + proposal.proposal);

            return resourceSrv.getResourceById("proposal", proposal.proposal).then(function(response) {
                var proposalContent = response.data;
                proposal.content = proposalContent.content;
                proposal.contentProtected = false;
                console.log("################# loadContentForAllProposals 子循环完成, proposal＝" + proposal.proposal + ", content=" + proposal.content);
                return;
            }).catch(function(error) {
                console.log("################# loadContentForAllProposals 子循环出错, proposal＝" + proposal.proposal);
                if (error.message == "5001") {
                    proposal.contentProtected = true;
                } else {
                    throw error;
                }
            });
        });

        return $q.all(promises);
    }

    var loadUserForAllProposals = function() {
        console.log("################# loadUserForAllProposals 开始");

        if (!_currentPoster) {
            throw new Error(2000, "currentPoster=" + _currentPoster);
        }

        var promises = _currentPoster.proposalObjs.map(function(proposal) {
            console.log("################# loadUserForAllProposals 子循环开始, proposal＝" + proposal.proposal);

            return resourceSrv.getResourceById("user", proposal.createdBy).then(function(response) {
                _usersCache[proposal.createdBy] = response.data;
                proposal.createdByUserObj = _usersCache[proposal.createdBy];
                console.log("################# loadUserForAllProposals 子循环完成, proposal＝" + proposal.proposal);
                return;
            });
        });

        return $q.all(promises);
    }

    var putUserIntoCache = function(userId) {

        resourceSrv.getResourceById("user", userId).then(function(response) {

            var user = response.data;
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
        console.log("################# loadPoster 开始");
        var promise = 
            resourceSrv.getResourceById("poster", posterId).then(function(response) {
                _currentPoster = response.data;
                console.log("################# loadPoster 完成");
            });

        return promise;
    }

    var loadPosterOwner = function() {
        console.log("################# loadPosterOwner 开始");

        if (!_currentPoster.createdBy) {
            throw new Error(2000, "_currentPoster.createdBy=" + _currentPoster.createdBy);
        }

        var promise = resourceSrv.getResourceById("user", _currentPoster.createdBy).then(function(response) {
            _usersCache[_currentPoster.createdBy] = response.data;
            _currentPoster.createdByUserObj = _usersCache[_currentPoster.createdBy];
            console.log("################# loadPosterOwner 完成");
        });

        return promise;

    }

    var reloadPoster = function() {
        if (!_currentPoster) {
            throw new Error(2000, "_currentPoster=" + _currentPoster);
        }
        if (!_currentPoster.id) {
            throw new Error(2000, "_currentPoster.id=" + _currentPoster.id);
        }

        return loadPoster(_currentPoster.id);
    }

    //公开方法：定义
    
    this.currentPoster = function() {
        return _currentPoster; 
    }

    this.currentNodeId = function() {
        return _currentNodeId;
    }
    
    this.usersCache = function() {
        return _usersCache; 
    }
    
    this.posterOwner = function() {
        return _usersCache[_currentPoster.createdBy];
    }
    
    this.currentUser = function() {
        //TODO
        return null;
    }
    
    this.isCurrentUserThePosterOwner = function() {
        //TODO
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
        var promise = reloadPoster().then(function() {
            return loadPosterOwner();
        }).then(function() {
            return loadProposalSummary();
        }).then(function() {
            return loadUserForAllProposals();
        }).then(function() {
            return loadContentForAllProposals();
        });

        return promise;
    };
                
    this.prepareContext = function(currentNodeId, currentPosterId, currentUserId) {
        _currentNodeId = currentNodeId;

        var promise = loadPoster(currentPosterId).then(function() {
            return loadPosterOwner();
        }).then(function() {
            return loadProposalSummary();
        }).then(function() {
            return loadUserForAllProposals();
        }).then(function() {
            return loadContentForAllProposals();
        });

        return promise;
    }
                
    this.createPosterAndUpdateContext = function(newPoster, callback) {
        posterSrv.create(newPoster, function(newPosterResult, newRootNodeId) {
            currentNode = newRootNodeId;
            currentPoster = newPosterResult;
            if (callback) callback();
        });
    }
});