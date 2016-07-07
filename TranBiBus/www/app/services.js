(function () {
    "use strict";

    angular.module("myapp.services", [])
        .factory('FilterDataService', function ($q, $timeout) {
            var dataMatches = function (allData, searchFilter) {
                console.log('buscando por ' + searchFilter);

                var deferred = $q.defer();
                var matches = allData.filter(function (data) {
                    if (data.titleNormalized.indexOf(searchFilter.normalize()) !== -1) return true;
                });

                $timeout(function () { deferred.resolve(matches); }, 100);
                return deferred.promise;
            };
            return { dataMatches: dataMatches }
        })

        .factory("myappService", ["$rootScope", "$http", "$q", function ($rootScope, $http, $q) {
        var myappService = {};

        //starts and stops the application waiting indicator
        myappService.wait = function (show) {
            if (show)
                $(".spinner").show();
            else
                $(".spinner").hide();
        };


        return myappService;
    }]);
})();