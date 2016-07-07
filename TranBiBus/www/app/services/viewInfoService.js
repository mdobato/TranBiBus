(function () {
    "use strict";


    angular.module("myapp.services")
        .service("ViewInfoService", function ($ionicLoading, ModalService, FavoritesService, retryHttp, PopupService, ConfigSearchCtrl, FormatterService, $timeout) {

            var viewInfo = function ($scope, dataId, item) {

                $scope = $scope;

                $scope.infoStation = {};

                openPopupViewInfo();


                $scope.addFavorite = function (item) {
                    if (!item.favorite) {
                        item.favorite = true;
                        FavoritesService.fav.setnewData(dataId, item);
                    }
                }

                function show(text) {
                    $ionicLoading.show({
                        template: '<div class="padding-vertical-8px"><span>' + text +
                            '</span></div><ion-spinner class="padding-2px spinner-light" icon="spiral"></ion-spinner></div>',
                    });
                }

                function hide () {
                    $ionicLoading.hide();
                }


                function modalViewInfo() {
                    ModalService
                        .init("app/templates/view-" + dataId + "Info.html", $scope)
                        .then(function (modal) {
                            modal.show();
                        });
                }

                function openPopupViewInfo () {
                    $scope.infoStation = {};
                    show("Solicitando información ...");
                    retryHttp.get(ConfigSearchCtrl.get.url(dataId + "_info", item.id)).then(
                        function (response) {
                            hide();
                            $scope.infoStation = FormatterService.getFormattedData(dataId + "_info", response.data);

                            if ($scope.infoStation == null) {
                                displayError("Sin información");
                                return;
                            }

                            $scope.infoStation.title2 = item.title;
                            $scope.infoStation.favorite = (item.favorite == undefined) ? FavoritesService.fav.isFavorite(dataId, response.data) : item.favorite;
                            console.log("Items: " + $scope.infoStation.items.length)
                            modalViewInfo();
                        },
                        function (response) {
                            hide();
                            displayError("Sin respuesta");
                        }
                    );
                }                

                function displayError(msgError) {

                    $ionicLoading.show({
                        template: msgError
                    });
                    $timeout(function () { $ionicLoading.hide() }, 1500);
                }                
            }
        
            return {
                viewInfo: viewInfo
            }
        
    });


})();