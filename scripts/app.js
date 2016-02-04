var app = angular.module('myApp', ['ngMaterial']);

app.service('drblSrvc', function($http) {
  this.getTopShots = function(callback, page) {
    $http.get('https://api.dribbble.com/v1/shots', {"headers": {"Authorization":"Bearer 9c089555241e83f917de5d447799c6090abd19eeac764785bc81a276f37ede78"}, "params": {"page": page},
  })
    .then(callback);
  };
});

app.service('bhncSrvc', function($http) {
  this.getTopProjects = function(callback, page) {
    $http.get('https://www.behance.net/v2/projects', {"params": {"api_key":"AFw4PRAx13UszkSiWaX7Mhr0hS3hYKN2", "sort": "appreciation", "page": page}})
    .then(callback);
  };
});

app.controller('MainCtrl',function($scope, $filter, drblSrvc, bhncSrvc) {
  $scope.normalizeApiObject = function(obj, api) {
    var normalizedObj = {
      "behance": function() {
        return {
              "user": {
                "name": obj.owners[0].display_name, //change later to handle multiple owners
                "avatarUrl": obj.owners[0].images["50"],
                "url": obj.owners[0].url
              },
              "project": {
                "name": obj.name,
                "url": obj.url,
                "imageUrl": obj.covers["404"],
                "commentsCount": obj.stats.comments,
                "likesCount": obj.stats.appreciations,
                "viewsCount": obj.stats.views,
                "createdAt": obj.created_at,
                "description": obj.description,
              },
              "source": {
                "name": "behance",
                "logo": "img/behance-grey.png",
              }
            };
      },
      "dribbble": function() {
        return {
              "user": {
                "name": obj.user.name,
                "avatarUrl": obj.user.avatar_url,
                "url": obj.user.html_url
              },
              "project": {
                "name": obj.title,
                "url": obj.html_url,
                "imageUrl": obj.images.hidpi || obj.images.normal,
                "commentsCount": obj.comments_count,
                "likesCount": obj.likes_count,
                "viewsCount": obj.views_count,
                "createdAt": obj.created_at,
                "description": obj.description,
              },
              "source": {
                "name": "dribbble",
                "logoUrl": "img/dribbble-grey.png",
              }
            };
      }
    };
    return normalizedObj[api]();
  };

  $scope.page = 1;
  $scope.results = [];
  $scope.drblShots = [];
  $scope.bhncProjects = [];
  $scope.getDrblShots = function(page) {
    drblSrvc.getTopShots(function(response) {
      $scope.drblShots = response.data;
      angular.forEach($scope.drblShots, function(v, i, obj) {
        var result = $scope.normalizeApiObject(v, "dribbble");
        this.push(result);
      }, $scope.results );
      dribbble = response.data;
    }, page);
  };

  $scope.getDrblShots($scope.page);

  $scope.getbhncProjects = function(page) {
    bhncSrvc.getTopProjects(function(response) {
      $scope.bhncProjects = response.data.projects;
      angular.forEach($scope.bhncProjects, function(v, i) {
        var result = $scope.normalizeApiObject(v, "behance");
        this.push(result);
      }, $scope.results );
      behance = response.data;
    }, page);
  };

  $scope.getbhncProjects($scope.page);

  $scope.loadMore = function() {
    $scope.page++;
    $scope.getDrblShots($scope.page);
    $scope.getbhncProjects($scope.page);
    // $filter('orderBy')($scope.results, "+project.likesCount");
  };
});
