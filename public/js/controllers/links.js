'use strict';

angular.module('SendMark.links').controller('LinksCtrl', ['$scope', '$routeParams', '$location', '$http', 'Global', 'Link', function ($scope, $routeParams, $location, $http, Global, Link) {
  $scope.global = Global;
  $scope.test = true;

  $scope.global.actionsIsOpen = false;
  // Open the custom actions modal
  $scope.open = function () {
    $scope.global.actionsIsOpen = true;
  }

  $scope.remove = function () {

    var oldLinks = $scope.global.list._items;
    $scope.global.list._items = [];

    angular.forEach(oldLinks, function (link) {
      if (link.selected) {
        var temp = new Link({_id: link._id});
        temp.$remove();
      } else {
        $scope.global.list._items.push(link);
      }
    });
  };

}]);