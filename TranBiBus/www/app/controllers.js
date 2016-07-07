(function () {
    "use strict";

    angular.module("myapp.controllers", ["myapp.config"])

    .controller("appCtrl", ["$scope", function ($scope) {
    }])

    .controller("homeCtrl", ["$scope", "$state", "$ionicLoading", "CacheService", "$timeout",
                    function ($scope, $state, $ionicLoading, CacheService, $timeout) {

                        var responses = 0;

                        $scope.init = function () {
                            show("Iniciando la aplicación ...");
                            CacheService.create(onCreateSuccess, onCreateError);
                        }

                        function onCreateSuccess() {
                            hide();
                        }

                        function onCreateError(results) {
                            console.log("Error en la creación de la caché");
                            displayError("Error al crear la caché");
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

    //errorCtrl managed the display of error messages bubbled up from other controllers, directives, myappService
    .controller("errorCtrl", ["$scope", "myappService", function ($scope, myappService) {
        //public properties that define the error message and if an error is present
        $scope.error = "";
        $scope.activeError = false;

        //function to dismiss an active error
        $scope.dismissError = function () {
            $scope.activeError = false;
        };

        //broadcast event to catch an error and display it in the error section
        $scope.$on("error", function (evt, val) {
            //set the error message and mark activeError to true
            $scope.error = val;
            $scope.activeError = true;

            //stop any waiting indicators (including scroll refreshes)
            myappService.wait(false);
            $scope.$broadcast("scroll.refreshComplete");

            //manually apply given the way this might bubble up async
            $scope.$apply();
        });
    }]);
})();