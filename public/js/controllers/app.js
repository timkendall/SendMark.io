'use strict';

angular.module('SendMark.system').controller('AppCtrl', ['$scope', '$location', 'Global', function ($scope, $location, Global) {
  $scope.global = Global;

  $scope.global.isOpen = false;
}]);