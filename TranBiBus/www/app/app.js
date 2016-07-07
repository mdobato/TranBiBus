(function () {
    "use strict";

    angular.module("myapp", ["ionic", "myapp.controllers", "myapp.services", "myapp.directives", 'uiGmapgoogle-maps', 'LocalStorageModule', 'ionic.contrib.drawer.vertical' ])
        .config(function ($stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider, localStorageServiceProvider) {
            $stateProvider
            .state("app", {
                url: "/app",
                abstract: true,
                templateUrl: "app/templates/view-menu.html",
                controller: "appCtrl"
            })
            .state("app.home", {
                url: "/home",
                templateUrl: "app/templates/view-home.html",
                controller: "homeCtrl"
            })
            .state("app.searchBus", {
                url: "/searchBus",
                templateUrl: "app/templates/view-searchBus.html",
                controller: "searchCtrl"
            })
            .state("app.searchTranvia", {
                url: "/searchTranvia",
                templateUrl: "app/templates/view-searchTranvia.html",
                controller: "searchCtrl"
            })
            .state("app.searchBizi", {
                url: "/searchBizi",
                templateUrl: "app/templates/view-searchBizi.html",
                controller: "searchCtrl"
            })
            .state("app.favorites", {
                url: "/favorites",
                templateUrl: "app/templates/view-favorites.html",
                controller: "favoritesCtrl"
            })
            .state("app.viewLines", {
                url: "/viewLines/:busLine",
                templateUrl: "app/templates/view-busInfoLine.html",
                controller: "viewLinesCtrl"
            })
            .state("app.map", {
                url: "/map",
                templateUrl: "app/templates/view-map.html",
                controller: "mapCtrl"
            })
            ;
            $urlRouterProvider.otherwise("/app/home");

            localStorageServiceProvider.setPrefix('tbb');

            uiGmapGoogleMapApiProvider.configure({
                key: 'AIzaSyCPpMq8_SrtI3RqJDvddV9NDNpOLMTnDAY',
                libraries: 'weather,geometry,visualization',
                v: '3.17'
            });
      
        })
    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });

        String.prototype.normalize = function () {
            var str = this.toLowerCase();
            str = str.replace(/ /g, '');
            str = str.replace(/\./g, '')
            var from = "àáäâèéëêěìíïîòóöôùúüûñçčřšýžďť";
            var to = "aaaaeeeeeiiiioooouuuunccrsyzdt";
            for (var i = 0; i < from.length; i++)
                str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
            return str;
        };

        Array.prototype.getById = function (id) {
            var i = this.length;
            while (i--) {
                if (this[i].id === id) {
                    return this[i];
                }
            }
            return null;
        }

        Array.prototype.getByField = function (fieldName, id) {
            var i = this.length;
            while (i--) {
                if (this[i][fieldName] === id) {
                    return this[i];
                }
            }
            return null;
        }

        Array.prototype.getAllByField = function (fieldName, id) {
            var objs = [];
            var i = this.length;
            while (i--) {
                if (this[i][fieldName] === id) {
                    objs.push(this[i]);
                }
            }
            return objs;
        }



    });

})();