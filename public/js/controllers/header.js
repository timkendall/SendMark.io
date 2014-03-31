'use strict';

angular.module('SendMark.system').controller('HeaderCtrl', ['$scope', '$location', 'Global', function ($scope, $location, Global) {
  $scope.global = Global;

  // Highlight Current Route
  $scope.isActive = function (route) {
    return route === $location.path();
  };

  $scope.isCollapsed = false;
}]);