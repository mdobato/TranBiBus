(function () {
    "use strict";

    angular.module('myapp.services')
    .factory('retryHttp', function ($http, $timeout) {

        var createRetryHttpServiceInstance = function (url, maxAttempts, interval, useXml) {

            var attempts = 0;

            var onSuccess = function (response) {
                return response;
            };

            var onFailed = function (response) {
                if (attempts < maxAttempts)
                    return $timeout(get, interval);

                throw response;
            };

            var get = function () {
                attempts += 1;

                var config = (useXml == undefined) ? {} : {
                    transformResponse: function (data) {
                        // string -> XML document object
                        return $.parseXML(data);
                    }
                };

                return $http.get(url, config)
                  .then(onSuccess, onFailed);
            };

            return {
                get: get
            };
        };

        var maxAttempts = 3;
        var delay = 1000;

        var setDefaults = function (newMaxAttempts, newDelay) {
            maxAttempts = newMaxAttempts;
            delay = newDelay;
        };

        var getDefaults = function () {
            return {
                maxAttempts: maxAttempts,
                delay: delay
            };
        };

        var get = function (url, useXml) {
            var getter = createRetryHttpServiceInstance(url, maxAttempts, delay, useXml);

            return getter.get();
        };

        return {
            get: get,
            setDefaults: setDefaults,
            getDefaults: getDefaults
        };
    });

})();