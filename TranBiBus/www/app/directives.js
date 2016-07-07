
(function () {
    "use strict";

    angular.module("myapp.directives", [])

    .directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13 || event.which === 9) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });

                    //event.preventDefault();
                }
            });
        };
    });


})();