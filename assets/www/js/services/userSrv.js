"use strict";

app.service("userSrv", function($http) {
    this.getUserByWXOpenId = function(wxOpenId, successCallBack, errorCallBack) {
        var apiURL = '/api/v1/user/' + wxOpenId;
        $http.get(apiURL)
        .success(function(data, status, headers, config) {
            console.log("success: get " + apiURL);
            if (successCallBack) successCallBack(data);
            return data;
        })
        .error(function(data, status, headers, config) {
            console.log("error:  get " + apiURL + ", status=" + status);
            if (errorCallBack) errorCallBack(data, status);
        });
    }
});
