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
               /* alert (response);
                alert (JSON.stringify(response));
                alert (response ? response.direction : "Do not know");*/
            }, function(err) {
                alert('Nothing to echo.' + err);
            }, "Echo", "poll", []);
        } else {
            window.myState = true;
            /*cordova.exec(function (response) {
                alert (JSON.stringify(response));
            }, function(err) {
                alert('Nothing to echo.' + err);
            }, "Echo", "init", []);*/
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
        var infoAr = $stateParams.mapId.split("f");
        $scope.mapImageUrl = (infoAr[0] == 1)? '4301':(infoAr == 2)?'4302':'4301';
        $scope.mapImageUrl += 'f' + infoAr[1] + '.png';
        $scope.angle = 0;

        var pollTimer;
        cordova.exec(function (response) {
                alert (JSON.stringify(response));
            }, function(err) {
                alert('Nothing to echo.' + err);
            }, "Echo", "init", []);
        var poll = function() {
            pollTimer = $timeout(function() {
                cordova.exec(function (response) {
                    /*alert (response);
                    alert (JSON.stringify(response));
                    alert (response ? response.direction : "Do not know");*/
                    if (Math.abs($scope.angle - response.degree) > 10)
                        $scope.angle = response.degree;
                }, function(err) {
                    alert('Nothing to echo.' + err);
                }, "Echo", "poll", []);
                poll();
            }, 1000);
        };
        poll();


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
        
        

        $scope.rotate = function() {
            //$scope.angle = $scope.angle + 10;
        };
    });

