(function () {
    "use strict";
    angular.module("starter.services", []).factory("starterService", ["$rootScope", "$http", function ($rootScope, $http) {
        var starterService = {};

        //initialize authContact and getTokenForResource
        var authContext = null;
        var getTokenForResource = function (resource, callback) {
            if (!authContext)
                authContext = new O365Auth.Context();

            authContext.getAccessToken(resource).then(function (token) {
                callback(token);
            }, function (err) {
                $rootScope.$broadcast("error", "getting token");
            });
        };

        //starts and stops the application waiting indicator
        starterService.wait = function (wait) {
            $rootScope.$broadcast("wait", wait);
        };

        //gets item by Id
        starterService.indexOf = function (array, id) {
            for (var i = 0; i < array.length; i++)
                if (array[i].Id == id)
                    return i;
            return -1;
        };

        return starterService;
    }]);
})();
