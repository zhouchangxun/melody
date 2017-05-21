App.service('MusicApiService', function ($q, $http) {
	console.log('start MusicApiService...');
	var api={
		getHotSearchList:"https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg?format=jsonp",

	}
	function _jsonp(url, successCallback, errorCallback){
         $.ajax({
	         type: "get",
	         async: true,
	         url:url,
	         dataType: "jsonp",
	         jsonp: "jsonpCallback",//用以获得jsonp回调函数名的参数名(一般默认为:callback)
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
        _jsonp(api.getHotSearchList, 
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

    return {
        'getHotSearchList':getHotSearchList
    }

 });
