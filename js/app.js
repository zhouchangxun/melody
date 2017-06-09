
var App = angular.module('App', ['ionic'])  
    .controller('rootCtrl', function($rootScope, $scope, $state,$ionicModal, $ionicNavBarDelegate) {
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
        $rootScope.back = function () {
            $ionicNavBarDelegate.back()
        }
        $rootScope.gotoHome = function () {
            console.log('go home')
            $state.go('app.home')
        }
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
        $ionicModal.fromTemplateUrl('page/about.html', {
            scope: $scope,
            animation: 'slide-in-up'
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
.controller('ListTabCtrl', function($rootScope, $scope, $http, MusicApiService) {
    console.log('ListTabCtrl');
    $scope.myMusicList=[];
    getMyMusicList();
    function getMyMusicList(){
        var url="api/list.json";
        $http.get(url, {}).then(function success(data){
            $scope.myMusicList = data.data;
            var music = $scope.myMusicList[0];
            console.log("default music:");
            // $scope.$emit('switchMusic', {'musicInfo':music});
        }, function error(data){
            ;
        });
    }
    $scope.play = function(music){
        console.log('play:',music);
        var lyric_wrap = $(".lyric_wrap"),
            lyric = lyric_wrap.find("#lyric");
        lyric.html("<li style='text-align: center' id='loading-lyric-text'>正在加载歌词 ...</li>");
        MusicApiService.getLyric(music.songid)
            .success(function(data){
                //console.log('lyric:',data);
                $rootScope.lyric=data;
            })
            .error(function(data){
                $rootScope.lyric="";
                console.info('lyric: no found! music:',music);
            });
        $scope.$emit('switchMusic', {'musicInfo':music});

    }

})
.controller('playController', function($scope) {
  $scope.currentMusic = {name:'当前无播放歌曲',singer:''}
  $scope.isPlay=false;
  var $player = $('#audio');
  $player.bind("ended",function (event) {
      console.log('music end...',$scope.isPlay)
      $scope.isPlay=false;
  });
  console.log('playController');
  $scope.play1=function  (needPlay) {
      console.log('isPlay?...',$scope.isPlay)
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
.controller('lyricController', function($scope) {
    console.log('lyricController');
    $scope.$watch("lyric", function (newVal, oldVal) {
        if(!$scope.lyric) return;
        var music={};
        $player.music=music;
        music.lyric = parseLyric($scope.lyric);
        renderLyric(music);
        console.log('switch lyric');
    })
    ///
    var $player = $("#audio"),
        player = $player.get(0),
        lyric_wrap = $(".lyric_wrap"),
        lyric = lyric_wrap.find("#lyric"),
        text_temp;
    function parseLyric(lrc) {
        var lyrics = lrc.split("\n");
        var lrcObj = {};
        for(var i=0;i<lyrics.length;i++){
            var lyric = decodeURIComponent(lyrics[i]);
            var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
            var timeRegExpArr = lyric.match(timeReg);
            if(!timeRegExpArr)continue;
            var clause = lyric.replace(timeReg,'');

            for(var k = 0,h = timeRegExpArr.length;k < h;k++) {
                var t = timeRegExpArr[k];
                var min = Number(String(t.match(/\[\d*/i)).slice(1)),
                    sec = Number(String(t.match(/\:\d*/i)).slice(1));
                var time = min * 60 + sec;
                lrcObj[time] = clause;
            }
        }
        return lrcObj;
    }

    function renderLyric(music){

        lyric.html("");
        var lyricLineHeight = 27,
            offset = lyric_wrap.offset().top*0.4;
        console.log('offset:',offset);
        var data = music.lyric;
        if(data){
            music.lyric.parsed = {};
            var i = 0;
            for(var k in data){
                var txt = data[k];
                if(!txt)txt = " ";
                music.lyric.parsed[k] = {
                    index:i++,
                    text:txt,
                    top: i*lyricLineHeight-offset
                };
                var li = $("<li>"+txt+"</li>");
                lyric.append(li);
            }
            $player.bind("timeupdate",updateLyric);

        }else{
            lyric.html("<li style='text-align: center'>歌词加载失败 -_-!</li>");
        }
    }

    function updateLyric(){
        var data = $player.music.lyric.parsed;
        if(!data)return;
        var currentTime = Math.round(this.currentTime);
        var lrc = data[currentTime];
        if(!lrc)return;
        var text = lrc.text;
        if(text != text_temp){
            locationLrc(lrc);
            text_temp = text;
        }
        function locationLrc(lrc){
            //console.log('current:',lrc);
            lyric_wrap.find(" .on").removeClass("on");

            var li = lyric_wrap.find("li:nth-child("+(lrc.index+1)+")");

            li.addClass("on");

            var top = Math.min(-50,-lrc.top)+50;

            //lyric.css({"-webkit-transform":"translate(0,-"+lrc.top+"px)"});
            //console.log('top',top);
            lyric.css({"margin-top":top});
        }
    }

    ///
})
.controller('SearchTabCtrl', function($scope,$rootScope, MusicApiService) {
  console.log('SearchTabCtrl');
  $scope.HotSearchList = [];
  $scope.SearchResultList = [];
  $scope.keyword='';

  $scope.enter = function(event, keyword){
    if(event.keyCode == 13) {//enter
      console.log('enter:', keyword);
      doSearch(keyword);
    }
  };
  $scope.clickHotKeyword = function(keyword){
      console.log('click keyword:', keyword)
      doSearch(keyword);
  };
  $scope.getPictureUrl=function(albummid){
    return MusicApiService.getPictureUrl(albummid)
  };
  $scope.getAudioUrl=function(songid){
    return MusicApiService.getAudioUrl(songid)
  };
  $scope.switchMusic = function(music){
      var musicInfo={
        name:music.songname,
        singer:music.singer[0].name,
        songid:music.songid,
        img:MusicApiService.getPictureUrl(music.albummid),
      };
      var lyric_wrap = $(".lyric_wrap"),
          lyric = lyric_wrap.find("#lyric");
      lyric.html("<li style='text-align: center' id='loading-lyric-text'>正在加载歌词 ...</li>");
      MusicApiService.getLyric(music.songid)
      .success(function(data){
        //console.log('lyric:',data);
        $rootScope.lyric=data;
      });

      console.log('switch search music:',musicInfo);
      $scope.$emit('switchMusic', {'musicInfo':musicInfo});

  };
  function doSearch(keyword){
    console.log('start search ',keyword)
    MusicApiService.doSearch(keyword)
      .success(function(data){
        $scope.SearchResultList=data;
        console.log('search result: ',data)
    })
  }
  MusicApiService.getHotSearchList()
    .success(function(data){
      $scope.HotSearchList=data;
      if(data.length>6)
        $scope.HotSearchList=data.splice(0,6);
    })
});