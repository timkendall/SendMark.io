'use strict';

// Scoket.io wrapper
angular.module('SendMark.system').factory('Socket', ['$rootScope', function($rootScope) {
    var socket = io.connect('http://127.0.0.1:3000/');
    return {
      on: function(eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      emit: function(eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        })
      }
  };
}]);