'use strict';

angular.module('SendMark.system').directive('action', ['$document', function ($document) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      // Close with a click anywhere else

        $document.bind('click',function () {
          console.log('clicked');
          if (scope.global.actionsIsOpen === true) {
            console.log('closing');
            scope.global.actionsIsOpen = false;
          }
        });
    }
  }
}]);