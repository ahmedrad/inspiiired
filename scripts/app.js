var app = angular.module('myApp', ['ngMaterial']);

app.service('drblSrvc', function($http) {
  this.getTopShots = function(callback) {
    $http.get('https://api.dribbble.com/v1/shots', {"headers": {"Authorization":"Bearer 9c089555241e83f917de5d447799c6090abd19eeac764785bc81a276f37ede78"}})
    .then(callback);
  }
});

app.service('bhncSrvc', function($http) {
  this.getTopProjects = function(callback) {
    $http.get('https://www.behance.net/v2/projects', {"params": {"api_key":"AFw4PRAx13UszkSiWaX7Mhr0hS3hYKN2", "sort": "appreciation"}})
    .then(callback);
  }
});

app.controller('MainCtrl',function($scope, drblSrvc, bhncSrvc) {
  $scope.DrblShots = [];
  $scope.bhncProjects = [];
  drblSrvc.getTopShots(function(response) {
    $scope.drblShots = response.data;
    blah = response.data;
  });

  bhncSrvc.getTopProjects(function(response) {
  $scope.bhncProjects = response.data;
  blah2 = response.data;
});

});
