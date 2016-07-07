(function () {
    "use strict";


    angular.module("myapp.controllers")
        .controller("viewLinesCtrl", ["$scope", "$state", "$ionicLoading", "ViewInfoService", "StorageService", "retryHttp", "ConfigSearchCtrl", "FormatterService", 
            function ($scope, $state, $ionicLoading, ViewInfoService, StorageService, retryHttp, ConfigSearchCtrl, FormatterService) {

                $scope.lines = {};
                $scope.infoLine = {};
                $scope.selectedLineValue = {};
                $scope.firstTitle = "";
                $scope.lastTitle = "";
                $scope.currentLine;
                $scope.has2Directions = false;


                var dataId = {};
                var direction = "1";

                $scope.init = function (dt) {
                    dataId = dt;
                    fillComboLines();
                    if ($state.params.busLine != undefined) {
                        $scope.selectedLineValue = $state.params.busLine;
                        $scope.getLine($state.params.busLine);
                        $state.params.busLine = null;
                    }
                }

                $scope.directionUp = function () {
                    return (direction == "1");
                }

                $scope.goDataInfo = function (item) {
                    ViewInfoService.viewInfo($scope, dataId, item);
                }

                $scope.toggleDirection = function () {
                    direction = (direction == "1") ? "2" : "1";
                    $scope.getLine($scope.currentLine);
                }


                // Obtener líneas 
                $scope.getLine = function (nLine) {
                    if (nLine == "") return;
                    $scope.currentLine = nLine;
                    var lines = StorageService.get.Data("bus_lines");
                    var fLines = [];

                    // obtener las direcciones de la línea
                    $scope.has2Directions = (lines.getAllByField("Line", nLine).length > 1);

                    // Filtrar por dirección
                    angular.forEach(lines, function (line, key) {
                        if (line.Direction == direction) {
                            fLines.push(line);
                        }
                    });
                    var line = fLines.getByField("Line", nLine);

                    var route = StorageService.get.Data("bus_route_" + nLine);
                    var fRoute = [];

                    // Filtrar polylines
                    angular.forEach(route.result, function (item, key) {
                        if (item.id != undefined) {
                            fRoute.push(item);
                        }
                    });

                    var allData = [];

                    // Encontrar primera y última parada
                    var flagAdd = false;
                    angular.forEach(fRoute, function (item, key) {
                        if(item.id == line.First){
                            flagAdd = true;
                            item.first = true;
                        }
                        if (flagAdd) {
                            allData.push(item)
                        }
                        if (item.id == line.Last && allData.length > 1) {
                            flagAdd = false;
                            item.last = true;
                        }
                    });

                    angular.forEach(fRoute, function (item, key) {
                        if (flagAdd) {
                            allData.push(item)

                            if (item.id == line.Last) {
                                flagAdd = false;
                                item.last = true;
                            }
                        }
                    });

                    // Buscar si se ha encontrado principio y final
                    if (allData[0].first && allData[allData.length - 1].last) {
                        $scope.infoLine = allData;
                        $scope.firstTitle = (direction == "1") ? line.FirstTitle : line.LastTitle;
                        $scope.lastTitle = (direction == "1") ? line.LastTitle : line.FirstTitle;
                    }

                }

                function fillComboLines() {
                    var lines = StorageService.get.Data("bus_lines");
                    var fLines = [];

                    angular.forEach(lines, function (line, key) {
                        if (line.Direction == "1") {
                            fLines.push(line);
                        }
                    });
                    $scope.lines = fLines;
                }                

                function show(text) {
                    $ionicLoading.show({
                        template: '<div class="padding-vertical-8px"><span>' + text +
                            '</span></div><ion-spinner class="padding-2px spinner-light" icon="spiral"></ion-spinner></div>',
                    });
                }

                function hide() {
                    $ionicLoading.hide();
                }

                function displayError(msgError) {

                    $ionicLoading.show({
                        template: msgError
                    });
                    $timeout(function () { $ionicLoading.hide() }, 1500);
                }                
        }])



})();