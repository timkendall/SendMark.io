'use strict';

angular.module('SendMark.system').controller('HeaderController', ['$scope', 'Global', function ($scope, Global) {
    $scope.global = Global;

    $scope.menu = [{
        'title': 'Lists',
        'link': 'lists'
    }, {
        'title': 'Create New List',
        'link': 'lists/create'
    }];

    $scope.isCollapsed = false;
}]);