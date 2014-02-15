'use strict';

angular.module('SendMark.system').controller('IndexCtrl', ['$scope', '$rootScope','Global', function ($scope, $rootScope, Global) {
    $scope.global = Global;


    console.log('User authorized: ' + $rootScope.user.authorized);
}]);