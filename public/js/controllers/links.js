'use strict';

angular.module('SendMark.system').controller('LinksCtrl', ['$scope', '$routeParams', '$location', '$http', 'Global', 'Lists', '$modal', '$log', function ($scope, $routeParams, $location, $http, Global, Lists, $modal, $log) {
  $scope.global = Global;

  $scope.global.actionsIsOpen = false;

  $scope.open = function () {
    console.log('boom');
    $scope.global.actionsIsOpen = true;
  }

}]);