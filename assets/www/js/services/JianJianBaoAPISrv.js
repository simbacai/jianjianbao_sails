/*
 * JianJianBaoAPISrv.js
 *
 */


"use strict";

app

.service('JianJianBaoAPISrv', function(resourceSrv, $q, $rootScope) {
                
    //私有属性：声明与始初化            
    
    var _currentNodeId = null;
    var _currentUserId = null
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
            resourceSrv.searchResource("ProposalSummary", "poster="+_currentPoster.id + "&sort=id DESC").then(function(response) {
                var proposals = response.data;

                console.log("proposals=" + angular.toJson(proposals));
                _currentPoster.proposalObjs = proposals;
                for(var i=0; i<_currentPoster.proposalObjs.length; i++) {
                    _currentPoster.proposalObjs[i].createdAt = new Date(_currentPoster.proposalObjs[i].createdAt);
                    _currentPoster.proposalObjs[i].updatedAt = new Date(_currentPoster.proposalObjs[i].updatedAt);

                    _currentPoster.proposalObjs[i].actionPermits = {};
                    if (_currentPoster.status == "created") {
                        //_currentPoster.proposalObjs[i].actionPermits.commit = true; 
                        _currentPoster.proposalObjs[i].actionPermits.tipsCalc = true;
                        _currentPoster.proposalObjs[i].actionPermits.commit = false;
                    }
                    if (_currentPoster.status == "closed") {
                        _currentPoster.proposalObjs[i].actionPermits.viewTips = true; 
                    }
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
                proposal.contentVisable = true;
                console.log("################# loadContentForAllProposals 子循环完成, proposal＝" + proposal.proposal + ", content=" + proposal.content);
                return;
            }).catch(function(error) {
                console.log("################# loadContentForAllProposals 子循环出错, proposal＝" + proposal.proposal);
                if (error.message == "5001") {
                    proposal.contentVisable = false;
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

    var loadUserForAllTips = function(tips) {
        console.log("################# loadUserForAllTips 开始");

        if (!tips) {
            throw new Error(2000, "tips=" + tips);
        }
        if (!angular.isArray(tips)) {
            throw new Error(2000, "tips=" + tips);
        }

        var promises = tips.map(function(tip) {
            console.log("################# loadUserForAllTips 子循环开始, tip.user=" + tip.user);

            return resourceSrv.getResourceById("user", tip.user).then(function(response) {
                _usersCache[tip.user] = response.data;
                tip.userObj = _usersCache[tip.user];

                if ("propose" == tip.action) {
                    tip.actionLabel = "提交解决方案";
                } else if ("forward" == tip.action) {
                    tip.actionLabel = "转发";
                } 
                console.log("################# loadUserForAllTips 子循环完成, tip.user=" + tip.user);
                return;
            });
        });
 
        return $q.all(promises);
    }



    var loadPoster = function(posterId) {
        console.log("################# loadPoster 开始");
        var promise = 
            resourceSrv.getResourceById("poster", posterId).then(function(response) {
                _currentPoster = response.data;

                _currentPoster.commited = false;
                if (_currentPoster.status == "closed" ) {
                    _currentPoster.commited = true;
                }


                if (_currentPoster.createdBy && _currentUserId) {
                    _currentPoster.ownerIsCurrentUser = angular.equals(String(_currentPoster.createdBy), String(_currentUserId));
                } else {
                    throw new Error(2000);
                }

                console.log("################# loadPoster 完成");
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

    var loadPosterActiveUsers = function(posterId) {
        var url = "/poster/"  + posterId + "/users" ;

        return io.socket.get(url, function(data) {
            _currentPoster.users = data;
        }); 
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

    this.reloadPosterAndFloors = function() {
        var currentPosterId = _currentPoster.id; 
        var promise = reloadPoster().then(function() {
            return loadPosterOwner();
        }).then(function() {
            return loadProposalSummary();
        }).then(function() {
            return loadUserForAllProposals();
        }).then(function() {
            return loadContentForAllProposals();
        }).then(function() {
            return loadPosterActiveUsers(currentPosterId);
        });

        return promise;
    };
                
    this.prepareContext = function(currentNodeId, currentPosterId, currentUserId) {
        _currentNodeId = currentNodeId;
        _currentUserId = currentUserId;

        var promise = loadPoster(currentPosterId).then(function() {
            return loadPosterOwner();
        }).then(function() {
            return loadProposalSummary();
        }).then(function() {
            return loadUserForAllProposals();
        }).then(function() {
            return loadContentForAllProposals();
        }).then(function() {
            return loadPosterActiveUsers(currentPosterId);
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
            _currentNodeId = newPosterReturned.nodes[0];
            _currentPoster.ownerIsCurrentUser = true;
            _usersCache = {};
            
            return loadPosterOwner();
        });

        return promise;
    }
                
    this.commitProposal = function(proposalId) {
        console.log("################# commitProposal 开始");

        if (!proposalId) {
            throw new Error(2000);
        }

        var url = "/proposal/" + proposalId + "/commit";

        var promise = resourceSrv.post(url, null).then(function() {
            console.log("################# commitProposal 完成");
            return;
        });

        return promise;
    };
                
    this.viewTips = function() {
        console.log("################# viewTips 开始");

        var query = "poster=" + _currentPoster.id + "&sort=id ASC";

        var promise = resourceSrv.searchResource("tip", query).then(function(response) {
            var tips = response.data;

            for (var i=0; i< tips.length; i++) {
                tips[i].userObj = _usersCache[tips[i].user]; 
            }

            console.log("################# viewTips 完成");

            return tips;
        });

        return promise;
    };
                
    this.tipsCalc = function(proposalId) {

        if (!proposalId) {
            throw new Error(2000);
        }

        var url = "/proposal/" + proposalId + "/precalc";
        var tips;

        var promise = resourceSrv.post(url, null).then(function(response) {
            tips = response.data;
            return loadUserForAllTips(tips);
        }).then(function() {
            return tips;
        });

        return promise;
    };

    this.getPoster = function(posterId) {
        var posterRet = {};
        return resourceSrv
        .getResourceById("poster", posterId)
        .then(function(poster) {
          posterRet = poster.data;
          posterRet.commited = false;
          if (posterRet.status == "closed" ) {
              posterRet.commited = true;
          }

          if (posterRet.createdBy && $rootScope.user) {
              posterRet.ownerIsCurrentUser = angular.equals(String(posterRet.createdBy), String($rootScope.user));
          } else {
              throw new Error(2000);
          }

          return resourceSrv.getResourceById("user", posterRet.createdBy);
        })
        .then(function (posterOwner) {
          posterRet.owner = posterOwner.data;
          return posterRet;
        });
    };


    this.getProposal = function(proposalId) {
        var proposalRet = {};
        return resourceSrv
        .getResourceById("proposalSummary", proposalId)
        .then(function(response) {
          proposalRet = response.data;
          return resourceSrv.getResourceById("user", proposalRet.createdBy)
        })
        .then(function (proposalOwner) {
          proposalRet.owner = proposalOwner.data;
          return resourceSrv.getResourceById("proposal", proposalId)
        })
        .then(function(proposal) {
          proposalRet.content = proposal.data.content;
          proposalRet.createdAt = proposal.data.createdAt;
          proposalRet.contentVisable = true;
          return proposalRet;
        })
        .catch(function (err) {
          if (err.message == "5001") {
            proposalRet.contentVisable = false;
            return proposalRet;
          } else {
            throw err;
          }
        });
    };

    this.getUser = function(userId) {
        return  resourceSrv.getResourceById("user", userId).then(function(response) {
                return response.data;
            });
    };
});