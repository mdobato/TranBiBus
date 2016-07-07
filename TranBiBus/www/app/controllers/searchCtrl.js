(function () {
    "use strict";



    angular.module("myapp.controllers")

        .controller("searchCtrl", ["$scope", "$state", "$ionicLoading", "CacheService", "ViewInfoService", "StorageService", "FilterDataService", "ConfigSearchCtrl", "FavoritesService", "ModalService", "$controller", "$timeout",
                    function ($scope, $state, $ionicLoading, CacheService, ViewInfoService, StorageService, FilterDataService, ConfigSearchCtrl, FavoritesService, ModalService, $controller, $timeout) {

                        $scope.txtSearch = null;
                        $scope.results = [];

                        var dataId = {};
                        var allData = [];

                        // identificar la vista que controla por el dato que maneja
                        $scope.init = function (dt) {
                            dataId = dt;
                            allData = CacheService.get(dataId);
                        }

                        $scope.viewLines = function () {
                            $state.go('app.viewLines');
                        }

                        $scope.refresh = function () {
                            // refresh binding
                            $scope.$broadcast("scroll.refreshComplete");
                        };

                        $scope.cleanSearch = function () {
                            $scope.txtSearch = null;
                            $scope.results = [];
                        }


                        $scope.search = function (txtSearch) {
                            FilterDataService.dataMatches(allData, txtSearch).then(
                              function (matches) {
                                  $scope.results = matches;
                              }
                            )
                        }

                        $scope.viewInfo = function (item) {
                            ViewInfoService.viewInfo($scope, dataId, item);
                        };





                    }])



})();