'use strict';

angular.module('SendMark.lists').controller('ListsCtrl', ['$scope', '$routeParams', '$location', '$http', 'Global', 'Lists', '$modal', '$log', function ($scope, $routeParams, $location, $http, Global, Lists, $modal, $log) {
	$scope.global = Global;
	$scope.global.lists;
	$scope.global.list;

	// Highlight Current List
	$scope.isActive = function (listId) {
		return ( '/lists/' + listId ) === $location.path();
	};

	// Socket.io Tests
	/*
	Socket.on('created-remote-test', function (data) {
    alert(data.link);
  });*/


	$scope.create = function () {
		var list = new Lists({
			name: this.name
		});
		list.$save(function(response) {
			$location.path('lists/' + response._id);
			$scope.global.lists.push(list);
		});

		this.name = '';
	};

	$scope.remove = function () {
		// Remove remote
		$scope.global.list.$remove();

		// Remove local
		for (var i = 0; i < $scope.global.lists.length; ++i) {
			if ($scope.global.lists[i]._id === $scope.global.list._id && $scope.global.lists[i].name !== 'Uncategorized') {
				$scope.global.lists.splice(i, 1);
			}
		}

		$location.path('lists');
	};

	$scope.update = function() {
		var list = $scope.global.list;
		if (!list.updated) {
			list.updated = [];
		}
		list.updated.push(new Date().getTime());

		list.$update(function() {
			$location.path('lists/' + list._id);
		});
	};

	$scope.find = function() {

		Lists.query(function (lists) {
			if (!lists) alert('Failed to load lists.');
			$scope.global.lists = lists;
		});

	};

	$scope.findOne = function() {
		Lists.get({
			listId: $routeParams.listId
		}, function (list) {
			$scope.global.list = list;
		});
	};
}]);