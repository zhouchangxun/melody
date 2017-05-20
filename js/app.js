
var App = angular.module('App', ['ionic'])  
    .controller('rootCtrl', function($rootScope, $scope, $state,$ionicModal) {
      $rootScope.screenWidth = window.screen.availWidth;
            $rootScope.screenHeight = window.screen.availHeight;
            $rootScope.AppTitle="音乐播放器";
               $rootScope.toggleMenu = function(menu) {
        if ($rootScope.isMenuShown(menu)) {
            $rootScope.shownMenu = null;
        } else {
            $rootScope.shownMenu = menu;
        }
    };

    $rootScope.isMenuShown = function(menu) {
        return $rootScope.shownMenu === menu;
    };
    $rootScope.menus=
        [{
            name:'首页',
            state:'app.home',
            icon:'ion-home'
        },{
            name:'关于我',
            state:'about',
            icon:'ion-home'
        }];
      //////////
  $ionicModal.fromTemplateUrl('templates/modal.html', {
    scope: $scope
  }).then(function(modal) {
    $rootScope.modal = modal;
  });
    $rootScope.openModal = function() {
    $scope.modal.show();
  };
  //////

      console.log('root controller started.');
    });
App.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
      url: "/app",
      abstract:true,
      controller: 'mainCtrl',
      templateUrl: "page/main.html"
    })
    .state('about', {
      url: "/about",
      templateUrl: "page/about.html"
    })
    .state('app.home', {
      url: "/home",
      views: {
        'tab1': {
          templateUrl: "page/musicList.html",
          controller: 'ListTabCtrl'
        }
      }
    })
   .state('app.search', {
      url: "/search",
      views: {
        'tab3': {
          templateUrl: "page/search.html",
          controller: 'SearchTabCtrl'
        }
      }
    })
   .state('app.top10', {
      url: "/top10",
      views: {
        'tab2': {
          //templateUrl: "templates/top.html",
          templateUrl:"page/about.html",
          controller: 'TopTabCtrl'
        }
      }
    })
    $urlRouterProvider.otherwise("/app/home");
})
.controller('ListTabCtrl', function($rootScope, $scope, $http, $ionicModal) {
    console.log('ListTabCtrl');
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
    $scope.play = function(musicName){
      console.log('play:',musicName);
      $scope.$emit('switchMusic', {'musicInfo':musicName});

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
.controller('playController', function($scope) {
  $scope.currentMusic = {name:'empty',singer:'empty'}
  $scope.isPlay=false;
  console.log('playController');
  $scope.play1=function  (needPlay) {
    var audio = document.getElementById('audio');

    if(needPlay)
      audio.play()
    else
      audio.pause()
  };
  $scope.$on('onMusicChange', function (event, args) {
     $scope.currentMusic = args.musicInfo;
    var audio = document.getElementById('audio');
    $scope.currentMusic.musicURL = 'http://ws.stream.qqmusic.qq.com/'+$scope.currentMusic.songid+'.m4a?fromtag=46'
    console.log('onMusicChange',$scope.currentMusic); 
    $('#audio').attr("src",$scope.currentMusic.musicURL);
    audio.play()
    $scope.isPlay=true;
 });
})
.controller('mainCtrl', function($scope, $state) {
    console.log('mainCtrl');
    $scope.$on('switchMusic', function (event, args) {
       $scope.musicInfo = args.musicInfo;
       console.log('switch music:',$scope.musicInfo);
       $scope.$broadcast('onMusicChange',args)
    });

})
.controller('TopTabCtrl', function($scope) {
  console.log('TopTabCtrl');
})
  .controller('SearchTabCtrl', function($scope) {
  console.log('SearchTabCtrl');
});