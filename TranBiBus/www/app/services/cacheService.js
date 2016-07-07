(function () {
    "use strict";

        angular.module("myapp.services")

        .factory("CacheService", function (StorageService, ConfigSearchCtrl, FormatterService, $http) {
            
            // recupera los datos locales
            var get = function (dataId) {
                var data = getStoredData(dataId);
                if (data != undefined) {
                    return data;
                }
                return null;
            };

            // Crea la base de datos de la aplicación
            var create = function (delegateOk, delegateError) {
                var items = 0;
                var serviceUrl = "";
                var now = new Date().getTime();
                items++;
                $http.get(serviceUrl + "app/json/bus/lineas.json")          // Info principio/final de linea
                    .success(function (results) {
                        var dataId = "bus_lines";
                        var data = FormatterService.getFormattedData(dataId, results);
                        StorageService.set.Data(dataId, data);
                        StorageService.set.Data(dataId + "_time", now);
                        createOK();
                    }).error(function (results) {
                        delegateError(results);
                    });

                items++;
                $http.get(serviceUrl + "app/json/bus/postes.json")          // Postes bus
                    .success(function (results) {
                        var dataId = "bus_stops";
                        var data = FormatterService.getFormattedData(dataId, results);
                        data = data.sort(function (a, b) {
                            var itemA = parseInt(a.id);
                            var itemB = parseInt(b.id);
                            if (itemA > itemB) return 1;
                            if (itemA < itemB) return -1;
                            return 0;
                        });
                        StorageService.set.Data(dataId, data);
                        StorageService.set.Data(dataId + "_time", now);
                        createOK();
                    }).error(function (results) {
                        delegateError(results);
                    });

                var lines = ["C1", "C4", "CI1", "CI2", "21", "22", "23", "24", "25", "28", "29", "30",
                            "31", "32", "33", "34", "35", "36", "38", "39", "40", "41", "42", "43", "44",
                            "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "N1", "N2", "N3",
                            "N4", "N5", "N6", "N7"];
                angular.forEach(lines, function (line, key) {
                    items++;
                    $http.get(serviceUrl + "app/json/bus/recorridos/" + line + ".json")
                        .success(function (results) {
                            var dataId = "bus_route_" + line;
                            var data = FormatterService.getFormattedData("bus_route_", results);
                            StorageService.set.Data(dataId, results);
                            StorageService.set.Data(dataId + "_time", now);
                            createOK();
                        }).error(function (results) {
                            delegateError(results);
                        });
                });

                items++;
                $http.get(serviceUrl + "app/json/bizi/postes.json")         // Estaciones bizi
                    .success(function (results) {
                        var dataId = "bizi_stops";
                        var data = FormatterService.getFormattedData(dataId, results);
                        data = data.sort(function (a, b) {
                            var itemA = parseInt(a.id);
                            var itemB = parseInt(b.id);
                            if (itemA > itemB) return 1;
                            if (itemA < itemB) return -1;
                            return 0;
                        });
                        StorageService.set.Data(dataId, data);
                        StorageService.set.Data(dataId + "_time", now);
                        createOK();
                    }).error(function (results) {
                        delegateError(results);
                    });

                items++;
                $http.get(serviceUrl + "app/json/bizi/carriles.json")
                    .success(function (results) {
                        var dataId = "bizi_ways";
                        StorageService.set.Data(dataId, results);
                        StorageService.set.Data(dataId + "_time", now);
                        createOK();
                    }).error(function (results) {
                        delegateError(results);
                    });

                items++;
                $http.get(serviceUrl + "app/json/tranvia/postes.json")      // Estaciones tranvía
                    .success(function (results) {
                        var dataId = "tram_stops";
                        var data = FormatterService.getFormattedData(dataId, results);
                        data = data.sort(function (a, b) {
                            var itemA = parseInt(a.id);
                            var itemB = parseInt(b.id);
                            if (itemA > itemB) return 1;
                            if (itemA < itemB) return -1;
                            return 0;
                        });
                        StorageService.set.Data(dataId, data);
                        StorageService.set.Data(dataId + "_time", now);
                        createOK();
                    }).error(function (results) {
                        delegateError(results);
                    });



                function createOK() {
                    if (--items == 0) {
                        delegateOk();
                    }
                }



            }


            function isDataExpired(dataId) {
                var secExpired = ConfigSearchCtrl.get.SecondsDataExpired(dataId);
                var lastTime = StorageService.get.Data(dataId + "_time");
                // si no hay registro de tiempo de la última vez que se solicito datos al servicio
                if (lastTime == undefined) {
                    return true;
                }
                var now = new Date().getTime();
                var secDiff = (now - lastTime) / 1000;
                return (secDiff > secExpired);
            }


            function getStoredData(dataId) {
                return StorageService.get.Data(dataId);
            }

            return {
                get: get,
                create: create
            };

        });


})();