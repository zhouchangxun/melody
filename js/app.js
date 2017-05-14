console.log('loading app.js');

angular.module('ionicApp', ['ionic'])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
      url: "/app",
      templateUrl: "templates/root.html"
    })
    .state('app.home', {
      url: "/home",
      views: {
        'root': {
          templateUrl: "templates/home.html",
          controller: 'HomeTabCtrl'
        }
      }
    })
   .state('app.search', {
      url: "/search",
      views: {
        'root': {
          templateUrl: "templates/search.html",
          controller: 'SearchTabCtrl'
        }
      }
    })
   .state('app.top10', {
      url: "/top10",
      views: {
        'root': {
          //templateUrl: "templates/top.html",
          templateUrl:"page/about.html",
          controller: 'TopTabCtrl'
        }
      }
    })
    $urlRouterProvider.otherwise("/app/home");
})
.controller('HomeTabCtrl', function($rootScope, $scope, $http, $ionicModal) {
    console.log('HomeTabCtrl');
    $scope.myMusicList=[];
    getMyMusicList();
    function getMyMusicList(){
        var url="api/list.json";
        $http.get(url, {}).then(function success(data){
            $scope.myMusicList = data.data;
            console.log("list:",$scope.myMusicList);
        }, function error(data){
            ;
        });
    }
    $scope.play = function(){
    }
    $ionicModal.fromTemplateUrl('templates/modal.html', {
        scope: $scope
      }).then(function(modal) {
        $rootScope.modal = modal;
});
$rootScope.openModal = function() {
    $scope.modal.show();
};

})
.controller('TopTabCtrl', function($scope) {
  console.log('TopTabCtrl');
})
      .controller('SearchTabCtrl', function($scope) {
  console.log('SearchTabCtrl');
});