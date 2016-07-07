(function () {
    "use strict";

    angular.module("myapp.services")

         .factory("FormatterService", function () {


             var getFormattedData = function (dataId, data, itemId) {
                 var result;

                 switch (dataId) {
                     case "bus_stops":      // Postes autobús
                         var allData = [];
                         angular.forEach(data, function (obj, key) {
                             if (obj.lines != undefined) {
                                 obj.title = obj.title.replace("(" + obj.id + ")", "");
                                 obj.titleNormalized = obj.id + obj.title.replace("(" + obj.id + ")", "").normalize();
                                 allData.push(obj);
                             }
                         });
                         result = allData;

                         break;

                     case "bizi_stops":     // Estaciones bizi
                        var allData = [];
                        angular.forEach(data, function (obj, key) {
                            obj.title = obj.title.replace(obj.id + " - ", "");
                            obj.titleNormalized = obj.id + obj.title.replace(obj.id + " - ", "").normalize();
                            allData.push(obj);
                        });
                        result = allData;

                        break;

                     case "tram_stops":     // Estaciones tranvía

                        var allData = [];
                        angular.forEach(data.result, function (obj, key) {
                            obj.titleNormalized = obj.id + obj.title.normalize();
                            obj.lat = obj.geometry.coordinates[1];
                            obj.lon = obj.geometry.coordinates[0];
                            allData.push(obj);
                        });
                        result = allData;

                        break;

                     case "bus_lines":      // Principio y final de lineas

                         var allItems = [];
                         angular.forEach(data, function (item, key) {
                             item.Line = item.Line.toUpperCase();
                             item.key = item.Line + " - " + item.Title.toUpperCase();
                             item.value = item.Line;
                             var titleParts = item.Title.split(" - ");
                             item.FirstTitle = (titleParts[0] != undefined) ? titleParts[0] : "";
                             item.LastTitle = (titleParts[1] != undefined) ? titleParts[1] : "";
                             item.First = item.First.trim();
                             item.Last = item.Last.trim();
                             item.id = item.Line;
                             allItems.push(item);
                         });
                         result = allItems;

                         break;

                     case "bus_route_":     // Recorridos línea de autobús
                         var allItems = [];
                         angular.forEach(data.result, function (item, key) {
                             if (item.title != undefined) {
                                 var posPoste = item.title.toLowerCase().indexOf("parada ");
                                 if (posPoste != -1 && item.title.length > 7) {
                                     item.title = item.title.substring(7).trim();
                                 }
                                 if (item.description != undefined) {
                                     posPoste = item.description.toLowerCase().indexOf("poste ");
                                     if (posPoste != -1 && item.description.length > 6) {
                                         item.id = item.description.substring(6).trim();
                                     }
                                 }
                                 var lat = parseFloat(item.geometry.coordinates[1]) + 0.001860;
                                 var lon = parseFloat(item.geometry.coordinates[0]) + 0.001370;
                                 item.line = itemId;
                                 item.lat = lat;
                                 item.lon = lon;
                                 allItems.push(item);
                             }
                         });

                         result = allItems;

                         break;

                     case "bus_stops_info":       // Tiempos de llegada

                         if (data.items != undefined && (data.items.length >= 1 && data.items[0][0][0] == "[")) {

                             var allItems = [];

                             angular.forEach(data.items, function (item, key) {
                                 var item0 = item[0].split("] ");
                                 var item1 = item[1].split("Direcci\u00f3n ");
                                 if (item0.length == 2 && item1.length == 2) {
                                     var obj;
                                     if ((obj = allItems.getById(item0[0].replace("[", ""))) != null) {
                                         obj.time.push(item0[1]);
                                     }
                                     else {
                                         obj = { "id": item0[0].replace("[", ""), "time": [item0[1]], "title": item1[1] }
                                         allItems.push(obj);
                                     }
                                 };
                             });

                             result = { "id": data.id, "title": data.title, "items": allItems };
                         }

                         break;s

                     case "bizi_stops_info":      // Disponibilidad

                         var allItems = [];

                         angular.forEach(data.items, function (item, key) {
                             var obj = item[0].split(" ");
                             if (obj.length == 2) {
                                 allItems.push({ "number": obj[0], "description": obj[1].toUpperCase() });
                             }
                         });

                         result = { "id": data.id, "title": data.title, "items": allItems };

                         break;

                     case "tram_stops_info":   // Tiempos de llegada

                         var allItems = [];

                         angular.forEach(data.destinos, function (item, key) {
                             var obj;
                             if ((obj = allItems.getById(item.linea)) != null) {
                                 obj.time.push(item.minutos);
                             }
                             else {
                                 obj = { "id": item.linea, "time": [item.minutos], "title": item.destino }
                                 allItems.push(obj);
                             }
                         });
                         var lat = data.geometry.coordinates[1];
                         var lon = data.geometry.coordinates[0];

                         result = { "id": data.id, "lat": lat, "lon": lon, "title": data.title, "items": allItems };


                         break;

                     case "bus_polyline_":  // Polilíneas de mapa

                         var idx = 0;
                         var polylines = [];
                         var nLine = itemId;

                         angular.forEach(data.result, function (item, key) {
                             if (item.description == undefined) {

                                 var polyline = [];
                                 angular.forEach(item.geometry.coordinates, function (coord, key) {
                                     // Corrección de proyección sin algoritmo
                                     var lat = parseFloat(coord[1]) + 0.001860;
                                     var lon = parseFloat(coord[0]) + 0.001370;
                                     polyline.push({ "latitude": lat.toString(), "longitude": lon.toString() });
                                 });
                                 if (polyline.length > 0) {
                                     polylines.push({ "id": nLine + "-" + idx++, "line": nLine, "path": polyline, "stroke": { "color": "white", "weight": 3, "opacity" : 0.0 } });
                                 }
                             }
                         });

                         result = polylines;

                         break;

                 }

                 return result;
             };
        

             return {
                 getFormattedData: getFormattedData
             };
         })

})();