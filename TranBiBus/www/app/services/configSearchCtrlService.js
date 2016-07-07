(function () {
    "use strict";

    angular.module("myapp.services")

         .factory("ConfigSearchCtrl", function (myConfig) {



             var get = {};

             get.url = function (dataId, id) {
                 var url;

                 switch (dataId) {
                     case "bus_stops": url = myConfig.bus_stops;
                         break;
                     case "bizi_stops": url = myConfig.bizi_stops;
                         break;
                     case "tram_stops": url = myConfig.tram_stops;
                         break;
                     case "bus_lines": url = myConfig.bus_lines;
                         break;
                     case "tranvia_lines": url = myConfig.UrlTranviaLineData;
                         break;
                     case "bus_stops_info": url = myConfig.bus_arrivals + id;
                         break;
                     case "bizi_stops_info": url = myConfig.bizi_availability + id;
                         break;
                     case "tram_stops_info": url = myConfig.tranvia_arrivals + id + ".json?srsname=wgs84";
                         break;
                 }
                 return url;
             };


             get.SecondsDataExpired = function (view) {
                 var seconds;

                 switch (view) {
                     case "bus": seconds = myConfig.SecondsDataExpired;
                         break;
                     case "bizi": seconds = myConfig.SecondsDataExpired;
                         break;
                     case "tranvia": seconds = myConfig.SecondsDataExpired;
                         break;
                     case "bus_lines": seconds = 9999999999;
                 }
                 return seconds;
             }


             get.InfoLine = function (view, urlLine) {
                 var url;

                 switch (view) {
                     case "bus": url = urlLine;
                         break;
                         //case "bizi": url = myConfig.UrlBiziLineData;
                         //    break;
                     case "tranvia": url = myConfig.UrlTranviaLineData;
                         break;
                 }
                 return url;
             }

             get.InfoCoordsLine = function (view, id) {
                 var url;

                 switch (view) {
                     case "bus_routes_": url = myConfig.UrlBusLineCoordsData + id + ".json?srsname=wgs84";
                         break;
                         //case "bizi": url = myConfig.UrlBiziLineData;
                         //    break;
                     case "tranvia": url = myConfig.UrlTranviaLineData;
                         break;
                 }
                 return url;
             }

             return {
                 get: get
             };
         });

})();