(function () {
    "use strict";

        angular.module("myapp.services")

        .factory("StorageService", function (localStorageService) {
            
            var get = {};
            var set = {};

            get.Data = function (id) {
                return localStorageService.get(id);
            }

            set.Data = function (id, data) {
                localStorageService.set(id, data);
            }

            return {
                get: get,
                set: set
            };

        });


})();