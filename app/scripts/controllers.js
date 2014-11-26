'use strict';
angular.module('BidiMobile.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  },

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  }
})

.controller('LocationsCtrl', function($scope, $ionicLoading, $ionicModal, $http, API) {
  $scope.locations = [];

  $scope.countDown = function(endDate) {
    var startDate = Date();
    var one_day = 1000 * 60 * 60 * 24;
    var sTime = new Date(startDate).getTime();
    var eTime = new Date(endDate).getTime();
    var out = Math.ceil((eTime - sTime)) / one_day;
    $scope.expired = (out < 0);
    return out;
  };

  $scope.search = function() {
    if ($scope.searchText) {
      $scope.info = "";
      $scope.message = "";
      //Setting URL for the request
      var url = API + '/SearchLocations?text=' + $scope.searchText;

      //Show Loading
      $ionicLoading.show({
        template: 'Searching...'
      });

      //Search Request
      $http.get(url).then(function(res) {
        if (res.data.success) {
          $scope.locations = res.data.data;
          if ($scope.locations.length < 1) {
            $scope.info = "Search complete. No records found";
          };
        } else {
          //Error message from the serve
          $scope.message = res.data.message;
          $scope.locations = [];
        }
        $ionicLoading.hide();
      }, function(error) {
        if (error.status == 500) {
          //Internal Server Error.
          $scope.message = "Service unreachable. Please check your internet connection.";
        } else if (error.status == 401) {
          //Unauthorized Request
          $scope.message = error.data.Message + " Please logout and login again.";
        } else {
          //Any Other Error
          $scope.message = error.message;
        };
        $scope.locations = [];
        $ionicLoading.hide();
      });
    } else {
      $scope.info = "Please enter location name or certificate number to search.";
    };
  };

  $ionicModal.fromTemplateUrl('templates/location.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the location modal to close it
  $scope.close = function() {
    $scope.modal.hide();
  },

  // Open the location modal
  $scope.showLocation = function(location) {
    $scope.location = location;
    $scope.modal.show();
  };

  var fetchingCert = false;
  $scope.pullCertificate = function() {
    var url = API + '/PullCertificate?id=' + $scope.location.Id;

    fetchingCert = true;
    $http.get(url).success(function(res) {
      if (res.success) {
        $scope.location.Certificate = res.data;
      }
      fetchingCert = false;
    });
  };
})

.controller('LocationCtrl', function($scope, $stateParams) {});