'use strict';

angular.module('SendMark.system').directive('scroll', function ($window) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      // Shouldn't do this; hardcoded next element selector
      var scrollable = element.next('article');

      scrollable.bind('scroll', function () {
        if (scrollable.prop('scrollTop') > 0) {
          element.addClass('shadow');
        } else {
          element.removeClass('shadow');
        }
        scope.$apply();
      });
    }
  }
});