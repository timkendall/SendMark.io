'use strict';

angular.module('SendMark.lists').controller('ModalCreateListCtrl', ['$scope', '$modal', '$log', 'Global', function ($scope, $modal, $log, Global) {
  $scope.global = Global;

  $scope.open = function () {
    // Please note that $modalInstance represents a modal window (instance) dependency.
    // It is not the same as the $modal service used above.

    var ModalInstanceCtrl = function ($scope, $modalInstance) {
      $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  };

  var modalInstance = $modal.open({
    templateUrl: 'views/lists/create.html',
    controller: ModalInstanceCtrl,
    resolve: {
      }
  });

  modalInstance.result.then(function () {
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

}]);