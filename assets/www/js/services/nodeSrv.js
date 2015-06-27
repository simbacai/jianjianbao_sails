"use strict";

app.service("nodeSrv", function($http) {
    
    // pulbic接口方法:
    
    this.getNodeById = function(nodeId, successCallBack, errorCallBack) {
    
        var apiURL = '/api/v1/node/' + nodeId;
        $http.get(apiURL)
        .success(function(data, status, headers, config) {
            var node = data;
            console.log("success: get " + apiURL);
            //console.log(angular.toJson(data));
            if (successCallBack) successCallBack(node["currentNode"]);
        })
        .error(function(data, status, headers, config) {
            console.log("error:  get " + apiURL + ", status=" + status);
            if (errorCallBack) errorCallBack(data, status);
        });
    }
    
    this.propose = function(nodeId, solution, successCallBack) {
        
        var apiURL = "/api/v1/node/" + nodeId + "/propose";
        $http.post(apiURL, {body: solution})
        .success(function(data, status, headers, config) {
            console.log("success: post " + apiURL);
            console.log("data=" + angular.toJson(data));
            if (successCallBack) successCallBack(data);
        })
        .error(function(data, status, headers, config) {
            console.log("error:  post " + apiURL + ", status=" + status);
            if (errorCallBack) errorCallBack(data, status);
        });
    }
    
    this.commit = function(action, currentNode) {
    }
    
    this.getFloors = function(currentNodeId, successCallBack, errorCallBack) {
        
        if (!currentNodeId) {
            console.log("ERROR: !currentNodeId");
            return;
        }
        
        var apiURL = '/api/v1/node/' + currentNodeId + '/floors'; 
        $http.get(apiURL)
        .success(function(data, status, headers, config) {
            console.log("success: get " + apiURL);
            console.log("floors=" + angular.toJson(data));
            if (successCallBack) successCallBack(data);
            return data;
        })
        .error(function(data, status, headers, config) {
            if (errorCallBack) errorCallBack(data, status);
            console.log("error:  get " + apiURL);
        });
    }
});
