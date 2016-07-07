(function () {
    "use strict";

    angular.module("myapp.config", [])

                .constant("myConfig", {
                    bus_lines: 'http://www.zaragoza.es/api/recurso/urbanismo-infraestructuras/transporte-urbano/linea.json',
                    bus_route_: 'http://www.zaragoza.es/api/recurso/urbanismo-infraestructuras/transporte-urbano/linea/',
                    bizi_ways: 'http://www.zaragoza.es/contenidos/bici/carriles_WGS84.json',
                    bus_stops: 'http://www.dndzgz.com/fetch?service=bus',
                    bizi_stops: 'http://www.dndzgz.com/fetch?service=bizi',
                    tram_stops: 'http://www.zaragoza.es/api/recurso/urbanismo-infraestructuras/tranvia.json?srsname=wgs84',
                    bus_arrivals: 'http://www.dndzgz.com/point?service=bus&id=',
                    bizi_availability: 'http://www.dndzgz.com/point?service=bizi&id=',
                    tranvia_arrivals: 'http://www.zaragoza.es/api/recurso/urbanismo-infraestructuras/tranvia/',
                    SecondsDataExpired: 3000000 // segundos
                })


})();