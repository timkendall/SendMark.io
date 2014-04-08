'use strict';

angular.module('SendMark.system').directive('action', ['$document', function ($document) {
  return {
    restrict: 'A',

    controller: function ($scope) {

    },

    link: function (scope, element, attrs) {
      // Close with a click anywhere else
      if(scope.global.actionsIsOpen) {
        $document.bind('click',function () {
          if (scope.global.actionsIsOpen === true) {
            console.log('fsdf');
            element.removeClass('visible');
            scope.global.actionsIsOpen = false;
          }
        })
      }
    }
  }
}]);