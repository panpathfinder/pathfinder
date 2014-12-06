angular.module('starter.controllers', [])

    .controller('DashCtrl', function($scope) {
    })

    .controller('FriendsCtrl', function($scope, Friends) {
        $scope.friends = Friends.all();
    })

    .controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
        $scope.friend = Friends.get($stateParams.friendId);
    })
    .controller('PathFinderCtrl', function($scope, LDAP, SearchService) {
        $scope.ldapDB = LDAP.get();

        $scope.data = { "names" : [], "search" : '' };

        $scope.search = function() {
            SearchService.searchNames($scope.data.search).then(
                function(matches) {
                    $scope.data.names = matches;
                }
            )
        }
        
        if (window.myState) {
            cordova.exec(function (response) {
                alert (response);
                alert (JSON.stringify(response));
                alert (response ? response.direction : "Do not know");
            }, function(err) {
                alert('Nothing to echo.' + err);
            }, "Echo", "poll", []);
        } else {
            window.myState = true;
            cordova.exec(function (response) {
                alert (JSON.stringify(response));
            }, function(err) {
                alert('Nothing to echo.' + err);
            }, "Echo", "init", []);
        }
    })
	.controller('InfoCtrl', function($scope, $stateParams) {
        $scope.resultInfo = {};

        $scope.initData = function() {
            var name = $stateParams.name;
            for (var i=0; i<ldapdata.length; i++) {
                if (name == ldapdata[i].name) {
                    $scope.resultInfo = ldapdata[i];
                    return
                }
            }
        };
	})
	.controller('MapCtrl', function($scope, $stateParams, $cordovaDeviceOrientation, $timeout) {
        $scope.truthyVal=false;
        var pollTimer;
        var poll = function() {
            pollTimer = $timeout(function() {
                console.log("polling");
                poll();
            }, 1000);
        };
        //poll();


        /*var locationTimer;
        var drawLocation = function() {
            pollTimer = $timeout(function() {
                console.log($scope.truthyVal);
                ($scope.truthyVal)?$scope.truthyVal=false:$scope.truthyVal=true;
                drawLocation();
            }, 2000);
        };
        drawLocation();
        $scope.$on(
            "$destroy",
            function( event ) {
                $timeout.cancel(pollTimer);
                $timeout.cancel(locationTimer);
            }
        );*/
        var infoAr = $stateParams.mapId.split("f");
        $scope.mapImageUrl = (infoAr[0] == 1)? '4301':(infoAr == 2)?'4302':'4301';
        $scope.mapImageUrl += 'f' + infoAr[1] + '.png';
        $scope.angle = 30;

        $scope.rotate = function() {
            $scope.angle = $scope.angle + 10;
        };
        $cordovaDeviceOrientation.getCurrentHeading().then(function(result) {
            // Success!
        }, function(err) {
            // An error occurred
        });

        var options = { frequency: 1000 }; // Update every 1 second
        var watch = $cordovaDeviceOrientation.watchHeading(options);

        watch.promise.then(function(result) { /* unused */ },
            function(err) {
                // An error occurred
            }, function(position) {
                // Heading comes back in
                // position.magneticHeading
                $scope.angle = 138;
            });

        $cordovaDeviceOrientation.clearWatch(watch.watchId)
            .then(function(result) {
                // Success!
            }, function(err) {
                // An error occurred
            });
    });

