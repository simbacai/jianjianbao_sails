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
            resourceSrv.searchResource("ProposalSummary", "poster="+_currentPoster.id + "&sort=createdAt DESC").then(function(response) {
                var proposals = response.data;

                console.log("proposals=" + angular.toJson(proposals));
                _currentPoster.proposalObjs = proposals;
                for(var i=0; i<_currentPoster.proposalObjs.length; i++) {
                    _currentPoster.proposalObjs[i].createdAt = new Date(_currentPoster.proposalObjs[i].createdAt);
                    _currentPoster.proposalObjs[i].updatedAt = new Date(_currentPoster.proposalObjs[i].updatedAt);
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
    
    this.proposeAtCurrentNode = function(solution) {
        if (!_currentNodeId) {
            throw new Error(2000, "_currentNodeId=" + _currentNodeId);
        }
        if (!_currentPoster) {
            throw new Error(2000, "_currentPoster=" + _currentPoster);
        }
        if (!_currentPoster.id) {
            throw new Error(2000, "_currentPoster.id=" + _currentPoster.id);
        }
        
        var newProposal = {}
        newProposal.content = solution;  
        newProposal.poster = _currentPoster.id;
        newProposal.node = _currentNodeId;

        var promise = resourceSrv.createResource("proposal", newProposal);
        
        return promise;
    };

    this.commit =  function(solution) {
        
    }

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
                
    this.createPosterAndUpdateContext = function(newPoster) {
        var promise = resourceSrv.createResource("poster", newPoster).then(function(response) {
            console.log(angular.toJson(response));

            var newPosterReturned = response.data;
            if (!angular.isArray(newPosterReturned.nodes)) {
                throw new Error(2000, "newPosterReturned.nodes=" + newPosterReturned.nodes);
            }
            if (newPosterReturned.nodes.length < 1) {
                throw new Error(2000, "newPosterReturned.nodes.length=" + newPosterReturned.nodes.length);
            }
            if (!newPosterReturned.nodes[0]) {
                throw new Error(2000, "newPosterReturned.nodes[0]=" + newPosterReturned.nodes[0]);
            }

            _currentPoster = newPosterReturned;
            _currentNodeId = newPosterReturned.nodes[0]
            _usersCache = {};
            
            return loadPosterOwner();
        });

        return promise;
    }
});