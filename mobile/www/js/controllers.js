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
    })
    .controller('InfoCtrl', function($scope) {
	    $scope.resultInfo = {
		    'name' : 'Santhosh',
		    'floor' : '2.4.5.5.2',
		    'direction' : 'NE Corner',
		    'proximity' : "Close to Anupam's Cube"
	    };
    });
