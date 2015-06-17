"use strict";

app.service('userLoginFacker', function($http) {
    this.login = function(userWXOpenId, successCallBack, errorCallBack) {
        
        var apiURL = '/api/v1/user/' + userWXOpenId + '/login';
        $http.get(apiURL)
        .success(function(data, status, headers, config) {
            console.log("success: get " + apiURL);
            if (successCallBack) successCallBack(data);
        })
        .error(function(data, status, headers, config) {
            console.log("error:  get " + apiURL);
            if (errorCallBack) errorCallBack(data, status);
        });
    }
});
