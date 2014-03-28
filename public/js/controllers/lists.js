'use strict';

angular.module('SendMark.lists').controller('ListsCtrl', ['$scope', '$routeParams', '$location', '$http', 'Global', 'Lists', function ($scope, $routeParams, $location, $http, Global, Lists) {
	$scope.global = Global;
	$scope.lists = [];
	$scope.list = null;

	// Highlight Current List
	$scope.isActive = function (listId) {
		return ( '/lists/' + listId ) === $location.path();
	};

	// Socket.io Tests
	/*
	Socket.on('created-remote-test', function (data) {
    alert(data.link);
  });*/


	$scope.create = function() {
		var list = new Lists({
			name: this.name
		});
		list.$save(function(response) {
			$location.path('lists/' + response._id);
		});

		this.name = '';
	};

	$scope.remove = function () {
		// Remove remote
		$scope.list.$remove();

		// Remove local
		for (var i = 0; i < $scope.lists.length; ++i) {
			if ($scope.lists[i]._id === $scope.list._id && $scope.lists[i].name !== 'Uncategorized') {
				$scope.lists.splice(i, 1);
			}
		}

		$location.path('lists');
	};

	$scope.update = function() {
		var list = $scope.list;
		if (!list.updated) {
			list.updated = [];
		}
		list.updated.push(new Date().getTime());

		list.$update(function() {
			$location.path('lists/' + list._id);
		});
	};

	$scope.find = function() {

		/*
		Lists.query(function(lists) {
			$scope.lists = lists.lists;
		});
		*/
		$http({method: 'GET', url: '/lists'}).
			success(function(data, status, headers, config) {
				//The API call to the back-end was successful (i.e. a valid session)
				$scope.lists = data;
			}).
			error(function(data, status, headers, config) {
				//alert("The API call to the back-end was NOT successful (i.e. an invalid session).");
			});
	};

	$scope.findOne = function() {
		Lists.get({
			listId: $routeParams.listId
		}, function (list) {
			$scope.list = list;
		});
	};
}]);