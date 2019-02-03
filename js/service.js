App.service('MusicApiService', function ($q, $http, $base64) {
	console.log('start MusicApiService...');
	var api={
		getHotSearchList:"http://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg?format=jsonp",
		getsearchUrl:function(keyword){
			return "https://c.y.qq.com/soso/fcgi-bin/client_search_cp?aggr=1&cr=1&flag_qc=0&p=1&n=5&w=" + keyword;
            //return 'http://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp?format=jsonp&n=10&w=' + keyword;
		},
		getPictureUrl:function(albummid){
			return 'http://y.gtimg.cn/music/photo_new/T002R150x150M000'+
				albummid+'.jpg'
		},
		getAudioTokenUrl:function(songid){
            var get_vk="https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg?format=json205361747&platform=yqq"
                +"&cid=205361747&songmid="
                +songid+"&filename=C400"+songid+".m4a&guid=126548448";
            return get_vk;
		},
		getLyricUrl:function(songid){
			return 'http://api.darlin.me/music/lyric/'+
				songid+'?format=jsonp'
		}
	};

	function _jsonp(url, jsonpCallbackKeyName, successCallback, errorCallback){
         $.ajax({
	         type: "get",
	         async: true,
	         url:url,
	         dataType: "jsonp",
	         jsonp: jsonpCallbackKeyName,//用以获得jsonp回调函数名的参数名(一般默认为:callback)
	         jsonpCallback:"jsonpCallback",//自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名，也可以写"?"，jQuery会自动为你处理数据
	         success: function(data){
	             successCallback(data);
	         },
	         error: function(data){
	             errorCallback(data);
	         }
 		});
	}
	
	function getHotSearchList() {
        var deferred = $q.defer();
        var promise = deferred.promise;

        var result = {};
        //ajax请求
        _jsonp(api.getHotSearchList, "jsonpCallback",
            function (response) {
            	if(response.code==0){
                	result = response.data.hotkey;
                    deferred.resolve(result);
                } else {
                    deferred.reject('fail to fetch hot search list');
                }
            },
            function(response){
            	deferred.reject('fail to fetch hot search list2');
            }
        );

        promise.success = function (fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function (fn) {
            promise.then(null, fn);
            return promise;
        }
        return promise;
    }

	function doSearch(keyword) {
        var deferred = $q.defer();
        var promise = deferred.promise;

        var result = {};
        //ajax请求
        _jsonp(api.getsearchUrl(keyword), "jsonpCallback",
            function (response) {
            	if(response.code==0){
                	result = response.data.song.list;
                    deferred.resolve(result);
                } else {
                    deferred.reject('fail to fetch hot search list');
                }
            },
            function(response){
            	deferred.reject('fail to fetch hot search list2');
            }
        );

        promise.success = function (fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function (fn) {
            promise.then(null, fn);
            return promise;
        }
        return promise;
    }

	function getLyric(songid) {
        var deferred = $q.defer();
        var promise = deferred.promise;

        var result = {};
        //ajax请求
        _jsonp(api.getLyricUrl(songid), "callback",
            function (response) {
            	if(response.code==0){
                	var base64_result = response.lyric;
                	result = $base64.decode(base64_result);
                    deferred.resolve(result);
                } else {
                    deferred.reject('fail to fetch lyric');
                }
            },
            function(response){
            	deferred.reject('fail to fetch lyric2');
            }
        );

        promise.success = function (fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function (fn) {
            promise.then(null, fn);
            return promise;
        }
        return promise;
    }

    function getAudioUrl(songid){
        var deferred = $q.defer();
        var promise = deferred.promise;

        var result = {};
        //ajax请求
        get_vk_url = api.getAudioTokenUrl(songid);
        console.log('[start] fetch audio vkey: GET ', get_vk_url);

        _jsonp(get_vk_url, "callback",
            function (response) {
                console.log('[finish] fetch audio vkey, return: ', response);
                if(response.code==0){
                    var vk = response.data.items[0].vkey;
                    console.log('get audio vkey:', vk);
                    var musicURL = "http://ws.stream.qqmusic.qq.com/C400"
                      + songid + ".m4a?fromtag=0&guid=126548448&vkey="+vk;

                    deferred.resolve(musicURL);
                } else {
                    deferred.reject('fail to fetch token');
                }
            },
            function(response){
                deferred.reject('fail to fetch audio token');
            }
        );

        promise.success = function (fn) {
            promise.then(fn);
            return promise;
        }
        promise.error = function (fn) {
            promise.then(null, fn);
            return promise;
        }
        return promise;
    }

    return {
        'getHotSearchList': getHotSearchList,
        'doSearch': doSearch,
        'getLyric': getLyric,
        'getPictureUrl': api.getPictureUrl,
        'getAudioUrl': getAudioUrl
    };

 });

App.constant('$base64', (function() {
 
        // existing version for noConflict()
        var version = "2.1.8";
        // if node.js, we use Buffer
        var buffer;
        if (typeof module !== 'undefined' && module.exports) {
            buffer = require('buffer').Buffer;
        }
        // constants
        var b64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        var b64tab = function(bin) {
            var t = {};
            for (var i = 0,
            l = bin.length; i < l; i++) t[bin.charAt(i)] = i;
            return t;
        } (b64chars);
        var fromCharCode = String.fromCharCode;
        // encoder stuff
        var cb_utob = function(c) {
            if (c.length < 2) {
                var cc = c.charCodeAt(0);
                return cc < 0x80 ? c: cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6)) + fromCharCode(0x80 | (cc & 0x3f))) : (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f)) + fromCharCode(0x80 | ((cc >>> 6) & 0x3f)) + fromCharCode(0x80 | (cc & 0x3f)));
            } else {
                var cc = 0x10000 + (c.charCodeAt(0) - 0xD800) * 0x400 + (c.charCodeAt(1) - 0xDC00);
                return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07)) + fromCharCode(0x80 | ((cc >>> 12) & 0x3f)) + fromCharCode(0x80 | ((cc >>> 6) & 0x3f)) + fromCharCode(0x80 | (cc & 0x3f)));
            }
        };
        var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
        var utob = function(u) {
            return u.replace(re_utob, cb_utob);
        };
        var cb_encode = function(ccc) {
            var padlen = [0, 2, 1][ccc.length % 3],
            ord = ccc.charCodeAt(0) << 16 | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8) | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
            chars = [b64chars.charAt(ord >>> 18), b64chars.charAt((ord >>> 12) & 63), padlen >= 2 ? '=': b64chars.charAt((ord >>> 6) & 63), padlen >= 1 ? '=': b64chars.charAt(ord & 63)];
            return chars.join('');
        };
        var btoa = function(b) {
            return b.replace(/[\s\S]{1,3}/g, cb_encode);
        };
        var _encode = buffer ?
        function(u) {
            return (u.constructor === buffer.constructor ? u: new buffer(u)).toString('base64')
        }: function(u) {
            return btoa(utob(u))
        };
        var encode = function(u, urisafe) {
            return ! urisafe ? _encode(String(u)) : _encode(String(u)).replace(/[+\/]/g,
            function(m0) {
                return m0 == '+' ? '-': '_';
            }).replace(/=/g, '');
        };
        var encodeURI = function(u) {
            return encode(u, true)
        };
        // decoder stuff
        var re_btou = new RegExp(['[\xC0-\xDF][\x80-\xBF]', '[\xE0-\xEF][\x80-\xBF]{2}', '[\xF0-\xF7][\x80-\xBF]{3}'].join('|'), 'g');
        var cb_btou = function(cccc) {
            switch (cccc.length) {
            case 4:
                var cp = ((0x07 & cccc.charCodeAt(0)) << 18) | ((0x3f & cccc.charCodeAt(1)) << 12) | ((0x3f & cccc.charCodeAt(2)) << 6) | (0x3f & cccc.charCodeAt(3)),
                offset = cp - 0x10000;
                return (fromCharCode((offset >>> 10) + 0xD800) + fromCharCode((offset & 0x3FF) + 0xDC00));
            case 3:
                return fromCharCode(((0x0f & cccc.charCodeAt(0)) << 12) | ((0x3f & cccc.charCodeAt(1)) << 6) | (0x3f & cccc.charCodeAt(2)));
            default:
                return fromCharCode(((0x1f & cccc.charCodeAt(0)) << 6) | (0x3f & cccc.charCodeAt(1)));
            }
        };
        var btou = function(b) {
            return b.replace(re_btou, cb_btou);
        };
        var cb_decode = function(cccc) {
            var len = cccc.length,
            padlen = len % 4,
            n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0) | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0) | (len > 2 ? b64tab[cccc.charAt(2)] << 6 : 0) | (len > 3 ? b64tab[cccc.charAt(3)] : 0),
            chars = [fromCharCode(n >>> 16), fromCharCode((n >>> 8) & 0xff), fromCharCode(n & 0xff)];
            chars.length -= [0, 0, 2, 1][padlen];
            return chars.join('');
        };
        var atob = function(a) {
            return a.replace(/[\s\S]{1,4}/g, cb_decode);
        };
        var _decode = buffer ?
        function(a) {
            return (a.constructor === buffer.constructor ? a: new buffer(a, 'base64')).toString();
        }: function(a) {
            return btou(atob(a))
        };
        var decode = function(a) {
            return _decode(String(a).replace(/[-_]/g,
            function(m0) {
                return m0 == '-' ? '+': '/'
            }).replace(/[^A-Za-z0-9\+\/]/g, ''));
        };
 
        return {            
            encode: encode,            
            decode: decode,
        };
})());
