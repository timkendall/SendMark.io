'use strict';

angular.module('SendMark.system').directive('item', function () {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      element.bind('click', function () {
        element.addClass('selected');
        // Call the specified function
        //scope.$apply(attrs.action);
        //$scope.open();
      });
    }
  }
});