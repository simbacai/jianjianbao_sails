"use strict";

app.service("resourceSrv", function($http, $q) {

    this.createResource = function(resourceName, resourceObject) {

        if (!resourceObject) throw new Error(2000, "resourceObject=" + resourceObject); 

        var apiURL = '/' + resourceName;

        return 
            $http.post(apiURL, resourceObject).then(function(response) {
                var resourceObject = response.data;
                console.log("success: post " + apiURL + ", obj=" + angular.toJson(resourceObject));
                if (!resourceObject) {
                    throw new Error(1000, "resourceObject=" + resourceObject);
                }
            }, function(response) {
                var errorMsg = "error:  post " + apiURL + ", status=" + status + ", response=" + angular.toJson(data);
                console.log(errorMsg);
                throw new Error(1000, errorMsg);
            });
    }

    this.getResourceById = function(resourceName, id) {

        if (!id) throw new Error(2000, "id=" + id); 
        if (!resourceName) throw new Error(2000, "resourceName=" + resourceName);

        var apiURL = '/' + resourceName +  '/' + id;

        var promise = 
            $http.get(apiURL).then(function(response) {
                console.log("success: get " + apiURL);
                var resourceObject = response.data;
                if (!resourceObject) {
                    throw new Error(1000, "resourceObject=" + resourceObject);
                }
                return response;
            }, function(response) {
                //TODO
                var errorMsg = "error:  get " + apiURL + ", status=" + status;
                console.log(errorMsg);
                throw new Error(1000, errorMsg);
            });

        return promise; 
    }

    /*
     * 参数: search, 形如"poster=a101", 不带"?"
     */
    this.searchResource = function(resourceName, search) {

        if (!search) throw new Error(2000, "search=" + search);
        if (!resourceName) throw new Error(2000, "resourceName=" + resourceName);

        var apiURL = '/' + resourceName +  '?' + search;

        var promise = 
            $http.get(apiURL).then(function(response) {
                console.log("success: get " + apiURL);
                var resourceArray = response.data;
                if (!angular.isArray(resourceArray)) {
                    throw new Error(1000, "resourceArray=" + resourceArray);
                }
                return response;
            }, function(response) {
                //TODO
                var errorMsg = "error:  get " + apiURL + ", status=" + status;
                console.log(errorMsg);
                throw new Error(1000, errorMsg);
            });
        return promise;
    }

});