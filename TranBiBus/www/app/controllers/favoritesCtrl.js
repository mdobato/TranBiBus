(function () {
    "use strict";



    angular.module("myapp.controllers")

        .controller("favoritesCtrl", ["$scope", "$state", "$ionicLoading", "retryHttp", "ViewInfoService", "PopupService", "ConfigSearchCtrl", "FavoritesService", "ModalService", "myConfig", "$controller", "$timeout",
                    function ($scope, $state, $ionicLoading, retryHttp, ViewInfoService, PopupService, ConfigSearchCtrl, FavoritesService, ModalService, myConfig, $controller, $timeout) {

                        $scope.busFavorites = [];
                        $scope.biziFavorites = [];
                        $scope.tranviaFavorites = [];

                        $scope.init = function () {
                            $scope.busFavorites = FavoritesService.fav.getallData("bus_stops");
                            $scope.biziFavorites = FavoritesService.fav.getallData("bizi_stops");
                            $scope.tranviaFavorites = FavoritesService.fav.getallData("tram_stops");
                        }

                        $scope.removeFavorite = function (dataId, id) {
                            PopupService.get.showConfirm("Atención", "¿Borrar el elemento?").then(
                                function(res) {
                                    if(res){
                                        FavoritesService.fav.removeData(dataId, id);
                                        $scope.init();
                                    }
                                });
                        }
                        
                        $scope.viewInfo = function (dataId, item) {
                            ViewInfoService.viewInfo($scope, dataId, item);
                        };


                    }])

})();