/*
 * JianJianBaoAPISrv.js
 *
 */


"use strict";

app

.service('JianJianBaoAPISrv', function(resourceSrv, $q) {
                
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

    this.loadPosterActiveUsers = function(posterId) {
        var url = "/poster/"  + posterId + "/users" ;

        return io.socket.get(url, function(data) {
            _currentPoster.users = data;
        }); 
    }    
                
    this.postPoster = function(newPoster) {
        return resourceSrv.createResource("poster", newPoster).then(function(response) {
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

            return newPosterReturned;
        });
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
                
    this.viewTips = function(posterId) {
        console.log("################# viewTips 开始");

        var query = "poster=" + posterId + "&sort=id ASC";

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

    this.getPoster = function(posterId, currentUserId) {
        var posterRet = {};
        return resourceSrv
        .getResourceById("poster", posterId)
        .then(function(poster) {
          posterRet = poster.data;
          posterRet.commited = false;
          if (posterRet.status == "closed" ) {
              posterRet.commited = true;
          }

          if (posterRet.createdBy && currentUserId) {
              posterRet.ownerIsCurrentUser = angular.equals(String(posterRet.createdBy), String(currentUserId));
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
        .searchResource("ProposalSummary", "proposal=" + proposalId)
        .then(function(response) {
          proposalRet = response.data[0];
          //Todo: fix time issue in mysql
          proposalRet.createdAt = new Date(proposalRet.createdAt);
          return resourceSrv.getResourceById("user", proposalRet.createdBy)
        })
        .then(function (proposalOwner) {
          proposalRet.owner = proposalOwner.data;
          return resourceSrv.getResourceById("proposal", proposalId)
        })
        .then(function(proposal) {
          proposalRet.content = proposal.data.content;
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

    this.postProposal = function(solution, posterId, nodeId) {
        
        var newProposal = {}
        newProposal.content = solution;  
        newProposal.poster = posterId;
        newProposal.node = nodeId;

        return resourceSrv.createResource("proposal", newProposal);
    };
});