/**
 * Created by jxie on 12/6/14.
 */

angular.module('ngCordova', [
    'ngCordova.plugins'
]);

angular.module('ngCordova.plugins', [
    'deviceMotion',
    'deviceOrientation'
]);

//#### Begin Individual Plugin Code####

// install   :     cordova plugin add org.apache.cordova.device-motion
// link      :     https://github.com/apache/cordova-plugin-device-motion/blob/master/doc/index.md

angular.module('ngCordova.plugins.deviceMotion', [])

    .factory('$cordovaDeviceMotion', ['$q', function ($q) {

        return {
            getCurrentAcceleration: function () {
                var q = $q.defer();

                navigator.accelerometer.getCurrentAcceleration(function (result) {
                    q.resolve(result);
                }, function (err) {
                    q.reject(err);
                });

                return q.promise;
            },

            watchAcceleration: function (options) {
                var q = $q.defer();

                var watchId = navigator.accelerometer.watchAcceleration(function (result) {
                    //q.resolve(watchID);
                    q.notify(result);
                }, function (err) {
                    q.reject(err);
                }, options);

                return {
                    watchId: watchId,
                    promise: q.promise
                };
            },

            clearWatch: function (watchID) {
                return navigator.accelerometer.clearWatch(watchID);
            }
        };
    }]);
// install   :     cordova plugin add org.apache.cordova.device-orientation
// link      :     https://github.com/apache/cordova-plugin-device-orientation/blob/master/doc/index.md

angular.module('ngCordova.plugins.deviceOrientation', [])

    .factory('$cordovaDeviceOrientation', ['$q', function ($q) {

        return {
            getCurrentHeading: function () {
                var q = $q.defer();

                navigator.compass.getCurrentHeading(function (heading) {
                    q.resolve(heading);
                }, function (err) {
                    q.reject(err);
                });

                return q.promise;
            },

            watchHeading: function (options) {
                var q = $q.defer();

                var watchId = navigator.compass.watchHeading(function (result) {
                    q.notify(result);
                }, function (err) {
                    q.reject(err);
                }, options);

                return {
                    watchId: watchId,
                    promise: q.promise
                };
            },

            clearWatch: function (watchID) {
                navigator.compass.clearWatch(watchID);
            }
        };
    }]);
