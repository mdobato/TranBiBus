(function () {
    "use strict";

        angular.module("myapp.services")

        .factory("GetAllDataService", function (StorageService, ConfigSearchCtrl, DataFormatter, retryHttp) {
            
            var getCacheData = function (view) {
                // Si hay datos y no han expirado recuperarlos de la base de datos local 
                // (ahorrar consumo de datos)
                if (!dataExpired(view)) {
                    var data = getStoredData(view);
                    if (data != undefined && data.length > 0) {
                        return data;
                    }
                }
                return null;
            };
            
            var getData = function (view, resultDelegate, sort) {

                var allData = null;

                retryHttp.get(ConfigSearchCtrl.get.urlAllData(view)).then(
                    function (response) {
                        allData = DataFormatter.get.formattedAllData(view, response.data);

                        if (sort == undefined || sort == false) {
                            // Orden alfabético por title
                            allData = allData.sort(function (a, b) {
                                var itemA = parseInt(a.id);
                                var itemB = parseInt(b.id);
                                if (itemA > itemB) return 1;
                                if (itemA < itemB) return -1;
                                return 0;
                            });
                        }

                        StorageService.set.Data(view, allData);
                        StorageService.set.Data(view + '_time', new Date().getTime());
                        resultDelegate(allData);
                    },
                    function (response) {
                        resultDelegate(null);
                    }
                )
            }

            var getCoordsData = function (view, id, resultDelegate) {

                var data = null;

                retryHttp.get(ConfigSearchCtrl.get.InfoCoordsLine(view, id)).then(
                    function (response) {
                        data = DataFormatter.get.formattedPolylinesInfoLine(view, id, response.data);

                        StorageService.set.Data(view + id, data);
                        StorageService.set.Data(view + id + '_time', new Date().getTime());
                        resultDelegate(data, id);
                    },
                    function (response) {
                        resultDelegate(null);
                    }
                )
            }



            function dataExpired(view) {
                var secExpired = ConfigSearchCtrl.get.SecondsDataExpired(view);
                var lastTime = StorageService.get.Data(view + "_time");
                // si no hay registro de tiempo de la última vez que se solicito datos al servicio
                if (lastTime == undefined) {
                    return true;
                }
                var now = new Date().getTime();
                var secDiff = (now - lastTime) / 1000;
                return (secDiff > secExpired);
            }


            function getStoredData(view) {
                return StorageService.get.Data(view);
            }

            return {
                getData: getData,
                getCacheData: getCacheData,
                getCoordsData: getCoordsData
            };

        });


})();