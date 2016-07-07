(function () {
    "use strict";

        angular.module("myapp.services")

        .factory("FavoritesService", function (localStorageService) {
            
            var fav = {};

            fav.getallData = function (dataId) {
                return localStorageService.get(dataId + "_fav");
            }

            fav.setnewData = function (dataId, data) {
                var allData = localStorageService.get(dataId + "_fav");
                if (allData == null) {
                    allData = [];
                }
                allData.push(data);
                localStorageService.set(dataId + "_fav", allData);
            }

            fav.isFavorite = function (dataId, data) {
                //localStorageService.set(view, [])
                var allData = localStorageService.get(dataId + "_fav");
                return (allData != null && allData.getById(data.id) != null);                
            }

            fav.removeData = function (dataId, data) {
                var allData = localStorageService.get(dataId + "_fav");
                if (allData != null) {
                    var delData = allData.getById(data.id);
                    var index = allData.indexOf(delData);
                    allData.splice(index, 1);
                    localStorageService.set(dataId + "_fav", allData);
                }
            }

            return {
                fav: fav
            };

        });


})();