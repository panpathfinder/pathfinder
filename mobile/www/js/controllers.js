angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('PathFinderCtrl', function($scope) {
})

.controller('InfoCtrl', function($scope) {
	$scope.resultInfo = {
		'name' : 'Santhosh',
		'cubeno': '1.2.3.4.5',
		'building': '4301',
		'floor' : '1',
		'direction' : 'NE Corner',
		'proximity' : "Close to Anupam's Cube"
	};
});
