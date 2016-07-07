(function () {
    "use strict";

    angular.module("myapp.directives")
        .directive('ngClick', function ($timeout) {
            var delay = 200;

            return {
                restrict: 'A',
                priority: -1,
                link: function (scope, elem) {
                    var disabled = false;

                    function onClick(evt) {
                        if (disabled) {
                            evt.preventDefault();
                            evt.stopImmediatePropagation();
                        } else {
                            disabled = true;
                            $timeout(function () { disabled = false; }, delay, false);
                        }
                    }

                    scope.$on('$destroy', function () { elem.off('click', onClick); });
                    elem.on('click', onClick);
                }
            };
        });


})();