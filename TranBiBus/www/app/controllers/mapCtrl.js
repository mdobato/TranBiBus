(function () {
    "use strict";



    angular.module("myapp.controllers")

        .controller("mapCtrl", ["$scope", "$state", "$compile", "ConfigSearchCtrl", "FormatterService", "$ionicLoading", "retryHttp", 'uiGmapGoogleMapApi', 'uiGmapIsReady', "ModalService", "myConfig", "$controller", "$timeout", "CacheService", "ViewInfoService", "$ionDrawerVerticalDelegate",
                    function ($scope, $state, $compile, ConfigSearchCtrl, FormatterService, $ionicLoading, retryHttp, uiGmapGoogleMapApi, uiGmapIsReady, ModalService, myConfig, $controller, $timeout, CacheService, ViewInfoService, $ionDrawerVerticalDelegate) {

                        
                        $scope.places = [];
                        $scope.markers = [];
                        $scope.busLines = [];
                        $scope.routes = [];
                        $scope.busOn = false;
                        $scope.biziOn = false;
                        $scope.tranviaOn = false;


                        var polylines = {};
                        var colors = [
                            { "color": "red", "line": null },
                            { "color": "#9b0101", "line": null },
                            { "color": "#984f01", "line": null }
                        ];
                        var busStops = getBusStops();

                        function getBusStops() {
                            return CacheService.get("bus_stops");
                        }

                        $scope.init = function () {
                            $scope.busLines = getBusLines();
                        }

                        $scope.clickBtn = function (view, switchOn) {

                            // Para bus abrir botonera
                            if (view == "bus") {
                                $ionDrawerVerticalDelegate.toggleDrawer();
                                return;
                            }

                            // Para tranvía y bizi mostrar directamente
                            if (switchOn) {
                                addMarkers(view);
                            }
                            else {
                                removeMarkers(view);
                            }
                        }

                        $scope.clickBusLineBtn = function (line) {

                            $ionDrawerVerticalDelegate.toggleDrawer();                            

                            if (line.swtOn) {

                                if (countSelectedLines($scope.busLines) > 3) {
                                    line.swtOn = false;
                                    displayError("visible 3 líneas de autobus máx.");
                                    return;
                                }
                                var color = popColor(line.id);
                                addRoute('bus', line.id, color)
                                addBusMarkers(line.id, color);
                            }
                            else {
                                pushColor(line.id);
                                removeRoute(line.id);
                                removeMarkers('bus', line.id);
                            }
                        }


                        // Obtener líneas de autobús para contruir la botonera del bus
                        function getBusLines() {
                            var lines = CacheService.get("bus_lines");
                            var fLines = [];

                            angular.forEach(lines, function (line, key) {
                                if (line.Direction == "1") {
                                    line.swtOn = false;
                                    line.id = line.Line;
                                    line.key = line.Line;
                                    line.value = line.Line;
                                    fLines.push(line);
                                }
                            });

                            return fLines;
                        }

                        

                        function addRoute(view, nLine, color) {
                            var dataId = view + "_route_" + nLine;
                            var data = CacheService.get(dataId);
                            polylines[nLine] = FormatterService.getFormattedData("bus_polyline_", data, nLine);
                            angular.forEach(polylines[nLine], function (polyline, key) {
                                polyline.stroke.color = color;
                                polyline.stroke.opacity = 0.4;
                            });

                            updateRoutes();
                        }

                        function resultGetData(data, nLine) {
                            if (data != null) {
                                polylines[nLine] = data;
                                updateRoutes();
                            }
                        }




                        function updateRoutes() {
                            $scope.routes = [];
                            angular.forEach(polylines, function (nLine, key) {
                                if (nLine != null) {
                                    $scope.routes = $scope.routes.concat(nLine);
                                }
                            });
                        }

                        function updatePlaces() {
                            $scope.markers["bus"] = $scope.markers["bus"] || [];
                            $scope.places = $scope.markers["bus"].concat($scope.markers["bizi"] || []).concat($scope.markers["tram"] || []);
                        }

                        function gotoInfo(item) {
                            ViewInfoService.viewInfo($scope, item.view + "_stops", item);
                        }
                        function gotoLine(line) {                            
                            $state.go('app.viewLines', { busLine: line });
                        }

                        function addMarkers(view, color) {
                            var data = CacheService.get(view + "_stops");
                            _setMarkers(view, data, color);
                        }

                        function addBusMarkers(nLine, color) {

                            var dataId = "bus_route_" + nLine;
                            var data = CacheService.get(dataId);
                            data = FormatterService.getFormattedData("bus_route_", data, nLine);
                            _setMarkers('bus', data, color);
                        }

                        function _setMarkers(view, data, color) {
                            if ($scope.markers[view] == undefined) {
                                $scope.markers[view] = [];
                            }
                            angular.forEach(data, function (item, key) {

                                var marker = {
                                    options: {
                                        labelContent: getLabelMarker(view, color, item),
                                        labelAnchor: '5 5',
                                        labelClass: 'marker-labels1',
                                        labelVisible: true
                                    },
                                    idKey: item.id + "_" + view,
                                    id: item.id,
                                    view: view,
                                    latitude: item.lat,
                                    longitude: item.lon,
                                    title: item.title,
                                    line: item.line,
                                    icon: " "
                                }
                                if (view == 'bus') {
                                    var stop = busStops.getById(item.id);
                                    if (stop != undefined) {
                                        marker.lines = stop.lines;
                                    }
                                }

                                $scope.markers[view].push(marker);
                            });
                            updatePlaces();
                        }


                        function removeMarkers(view, line) {

                            if (view == 'bus') {
                                var markers = []
                                angular.forEach($scope.markers[view], function (item, key) {
                                    if (item.line != line) {
                                        markers.push(item);
                                    }
                                });
                                $scope.markers[view] = markers;
                            }
                            else {
                                $scope.markers[view] = [];
                            }

                            updatePlaces();
                        }


                        function removeRoute(nLine) {
                            polylines[nLine] = null;
                            updateRoutes();
                        }

                        function anyButtonOn(lines) {
                            var swtOn = false;
                            angular.forEach(lines, function (item, key) {
                                if(item.swtOn) {
                                    swtOn = true;
                                }
                            });
                            return swtOn;
                        }


                        function countSelectedLines(fLines, nLine) {
                            var result = 0;

                            angular.forEach(fLines, function (fline, key) {
                                if (fline.swtOn) {
                                    result++;
                                }
                            });
                            return result;
                        }



                        function islineSelected(fline) {
                            var exists = false;
                            angular.forEach($scope.busLines, function (line, key) {
                                if (line.key == fline && line.swtOn) {
                                    exists = true;
                                }
                            });
                            return exists;
                        }


                        function getLabelMarker(view, color, stop) {
                            var icon;

                            switch (view) {
                                case "bus":
                                    icon = "icon ion-android-bus font-1-4em";
                                    var line = $scope.busLines.getByField("Line", stop.line);
                                    if (line != undefined) {
                                        if (line.First == stop.id) {
                                            icon = "icon ion-stop font-2em";
                                        }
                                        else if (line.Last == stop.id) {
                                            icon = "icon ion-stop font-2em";
                                        }
                                    }

                                    break;
                                case "bizi":
                                    icon = "icon ion-android-bicycle font-1-4em";
                                    color = "green";
                                    break;
                                case "tram":
                                    icon = "icon ion-android-subway font-1-4em";
                                    color = "blue";
                                    break;
                            }
                            return '<i class="' + icon + '" style="color: ' + color + '; opacity: 0.6;"></i>';
                        }

                        function popColor(line) {
                            for (var i = 0; i < colors.length; i++) {
                                if (colors[i].line == null) {
                                    colors[i].line = line;
                                    return colors[i].color;
                                }
                            }
                        }
                        function pushColor(line) {
                            for (var i = 0; i < colors.length; i++) {
                                if (colors[i].line == line) {
                                    colors[i].line = null;
                                }
                            }
                        }







                        $scope.drawerIs = function (state) {
                            return $ionDrawerVerticalDelegate.getState() == state;
                        }

                        $scope.map = {
                            center: { latitude: 41.6488226, longitude: -0.8890853000000334 },
                            control: {},
                            zoom: 12,
                            options: { streetViewControl: false, zoomControl: true, mapTypeControl: false },
                            markersEvents: {
                                click: function (marker, eventName, model) {
                                    $scope.map.center.latitude = parseFloat(model.latitude);
                                    $scope.map.center.longitude = parseFloat(model.longitude);
                                    $scope.map.window.model = model;
                                    $scope.map.window.show = true;
                                }
                            },
                            window: {
                                model: {},
                                marker: {},
                                show: false,
                                closeClick: function () {
                                    this.show = false;
                                },
                                goInfo: function (item) {
                                    return gotoInfo(item);
                                },
                                goLine: function (item) {
                                    return gotoLine(item);
                                },
                                options: {} // define when map is ready
                            }
                        };

                        uiGmapGoogleMapApi.then(function (maps) {
                            maps.visualRefresh = true;
                            // offset to fit the custom icon
                            $scope.map.window.options.pixelOffset = new google.maps.Size(0, -35, 'px', 'px');

                        });
                        uiGmapIsReady.promise().then(function (maps) {
                        });

                        $scope.show = function (text) {
                            $ionicLoading.show({
                                template: '<div class="padding-vertical-8px"><span>' + text +
                                    '</span></div><ion-spinner class="padding-2px spinner-light" icon="spiral"></ion-spinner></div>',
                            });
                        };
                        $scope.hide = function () {
                            $ionicLoading.hide();
                        };


                        function displayError(msgError) {

                            $ionicLoading.show({
                                template: msgError
                            });
                            $timeout(function () { $ionicLoading.hide() }, 1500);
                        };

                        

                    }])

})();