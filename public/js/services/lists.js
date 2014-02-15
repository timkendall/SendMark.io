'use strict';

//Lists service used for lists REST endpoint
angular.module('SendMark.lists').factory('Lists', ['$resource', function($resource) {
    return $resource('lists/:listId', {
        listId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);