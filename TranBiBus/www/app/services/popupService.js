(function () {
    "use strict";

    angular.module("myapp.services")

        .factory('PopupService', function ($ionicPopup) {

            var get = {};
            

             // A confirm dialog
            get.showConfirm = function (caption, message) {
                 return $ionicPopup.confirm({
                     template: '<span>' + message + '</span>',
                     title: caption
                 });
             };


            return { get: get };
         });













})();