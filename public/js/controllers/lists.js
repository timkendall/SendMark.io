'use strict';

angular.module('SendMark.lists').controller('ListsController', ['$scope', '$routeParams', '$location', 'Global', 'Lists', function ($scope, $routeParams, $location, Global, Lists) {
    $scope.global = Global;

    $scope.create = function() {
        var list = new Lists({
            name: this.name
        });
        list.$save(function(response) {
            $location.path('lists/' + response._id);
        });

        this.name = '';
    };

    $scope.remove = function(list) {
        if (list) {
            list.$remove();

            for (var i in $scope.lists) {
                if ($scope.lists[i] === list) {
                    $scope.lists.splice(i, 1);
                }
            }
        }
        else {
            $scope.list.$remove();
            $location.path('lists');
        }
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
        console.log("Looking for lists...");
        Lists.query(function(lists) {
            $scope.lists = lists.lists;
        });
    };

    $scope.findOne = function() {
        Lists.get({
            listId: $routeParams.listId
        }, function(list) {
            $scope.list = list;
        });
    };
}]);