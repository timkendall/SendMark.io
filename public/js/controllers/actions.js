'use strict';

angular.module('SendMark.system').controller('ActionsCtrl', ['$scope', 'Global', function ($scope, Global) {
  $scope.global = Global;

  $scope.global.isOpen = false;
}]);