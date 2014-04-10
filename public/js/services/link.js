'use strict';

//Lists service used for lists REST endpoint
angular.module('SendMark.links').factory('Link', ['$resource', function ($resource) {
    return $resource('links/:linkId', { linkId: '@_id' },
    {
      update: {
            method: 'PUT'
        }
    });
}]);