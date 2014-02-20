'use strict';

angular.module('SendMark.system').controller('LoginCtrl', ['$scope', '$rootScope','Global', function ($scope, $rootScope, Global) {
    $scope.global = Global;

    $scope.loading = false;

    $scope.showLoader = function() {
      $scope.loading = true;
    }
}]);