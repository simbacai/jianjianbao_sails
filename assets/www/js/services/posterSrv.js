"use strict";

app.service("posterSrv", function(apiHelper) {
    
    // pulbic接口方法:
    
    this.create = function(poster, successCallBack) {

        console.log("posterSrv.create()");

        /*
        var newPoster = {
            "subject": "Ｔ1"
            , "body": "BBBB-1"
            //, "tipAmount": 35
        }
        */

        apiHelper.createResource("poster", poster, function(newPosterResult) {
            if (!newPosterResult)  throw new Error(2000, "newPosterResult=" + newPosterResult); 
            if (!angular.isArray(newPosterResult.nodes))  {
                throw new Error(2000, "newPosterResult.nodes=" + newPosterResult.nodes);
            }
            if (newPosterResult.nodes.length<1)  {
                throw new Error(2000, "newPosterResult.nodes.length=" + newPosterResult.nodes.length);
            }
            if (!newPosterResult.nodes[0])  throw new Error(2000, "newPosterResult.nodes[0]=" + newPosterResult.nodes[0]);
            if (!newPosterResult.id)  throw new Error(2000, "newPosterResult.id=" + newPosterResult.id);
            
            var newRootNodeId = newPosterResult.nodes[0];
            if (successCallBack) successCallBack(newPosterResult, newRootNodeId);
        });
    }
    
    this.getPosterById = function(posterId, successCallBack) {
        apiHelper.getResourceById(posterId, "poster", successCallBack);
    }


    
});


app.service("apiHelper", function($http) {

    this.createResource = function(resourceName, resourceObject, successCallBack) {

        if (!resourceObject) throw new Error(2000, "resourceObject=" + resourceObject); 

        var apiURL = '/' + resourceName;
        $http.post(apiURL, resourceObject)
        .success(function(data, status, headers, config) {
            var resourceObject = data;
            console.log("success: post " + apiURL + ", obj=" + angular.toJson(resourceObject));
            if (successCallBack) successCallBack(resourceObject);
        })
        .error(function(data, status, headers, config) {
            var errorMsg = "error:  post " + apiURL + ", status=" + status + ", response=" + angular.toJson(data);
            console.log(errorMsg);
            throw new Error(1000, errorMsg);
        });
    }

    this.getResourceById = function(id, resourceName, successCallBack) {

        if (!id) throw new Error(2000, "id=" + id); 
        if (!resourceName) throw new Error(2000, "resourceName=" + resourceName);

        var apiURL = '/' + resourceName +  '/' + id;
        $http.get(apiURL)
        .success(function(data, status, headers, config) {
            var resourceObject = data;
            console.log("success: get " + apiURL);
            if (successCallBack) successCallBack(resourceObject);
        })
        .error(function(data, status, headers, config) {
            var errorMsg = "error:  get " + apiURL + ", status=" + status;
            console.log(errorMsg);
            throw new Error(1000, errorMsg);
        });
    }

});