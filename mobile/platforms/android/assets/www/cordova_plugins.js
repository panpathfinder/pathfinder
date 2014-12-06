cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/org.apache.cordova.device-orientation/www/CompassError.js",
        "id": "org.apache.cordova.device-orientation.CompassError",
        "clobbers": [
            "CompassError"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.device-orientation/www/CompassHeading.js",
        "id": "org.apache.cordova.device-orientation.CompassHeading",
        "clobbers": [
            "CompassHeading"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.device-orientation/www/compass.js",
        "id": "org.apache.cordova.device-orientation.compass",
        "clobbers": [
            "navigator.compass"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.test.echo/www/does-not-run.js",
        "id": "org.apache.cordova.test.echo.does-not-run"
    },
    {
        "file": "plugins/org.apache.cordova.test.echo/www/echo.js",
        "id": "org.apache.cordova.test.echo.echo",
        "clobbers": [
            "cordova.echo"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "org.apache.cordova.device-orientation": "0.3.9",
    "org.apache.cordova.test.echo": "0.1.0"
}
// BOTTOM OF METADATA
});