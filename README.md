# melody
music player based on ionic framwork.

# Music API
## 1.热门搜索列表：
URL : https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg?format=jsonp&jsonpCallback=jsonpCallback

例子：get https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg?format=json
return:
```
{
  "code": 0,
  "data": {
    "hotkey": [
 {
        "k": "别找我麻烦 ",
        "n": 52749
      },
      {
        "k": "夏洛特烦恼 ",
        "n": 52598
      },
      {
        "k": "天空之城 ",
        "n": 51042
      }
    ],
    "special_key": "鹿晗",
    "special_url": "https://y.qq.com/msa/229/9_3330.html"
  },
  "subcode": 0
}
```

##2.搜索歌曲：

https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp?format=jsonp&n=20&w={搜索关键字}&jsonpCallback=jsonpCallback
return :
例子：get https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp?format=json&n=1&w=freeloop
``` js
{
  "code": 0,
  "data": {
    "keyword": "freeloop",
    "priority": 0,
    "qc": [
      {
        "text": "free loop",
        "type": 1
      }
    ],
    "semantic": {
      "curnum": 0,
      "curpage": 1,
      "list": [],
      "totalnum": 0
    },
    "song": {
      "curnum": 2,
      "curpage": 1,
      "list": [
        {
          "albumid": 39599,
          "albummid": "003OCv0N0LnYHf",
          "albumname": "Daniel Powter",
          "albumname_hilight": "Daniel Powter",
          "alertid": 100002,
          "chinesesinger": 0,
          "docid": "4594270248060440308",
          "grp": [],
          "interval": 228,
          "isonly": 1,
          "lyric": "福特轿车广告曲",
          "lyric_hilight": "福特轿车广告曲",
          "msgid": 14,
          "nt": 1388213698,
          "pay": {
            "payalbum": 0,
            "payalbumprice": 0,
            "paydownload": 1,
            "payinfo": 1,
            "payplay": 0,
            "paytrackmouth": 1,
            "paytrackprice": 200
          },
          "preview": {
            "trybegin": 51050,
            "tryend": 80310,
            "trysize": 367385
          },
          "pubtime": 1109001600,
          "pure": 0,
          "singer": [
            {
              "id": 4825,
              "mid": "002OSfGH2iq7wx",
              "name": "Daniel Powter",
              "name_hilight": "Daniel Powter"
            }
          ],
          "size128": 3662201,
          "size320": 9129928,
          "sizeape": 23752203,
          "sizeflac": 24569213,
          "sizeogg": 4658226,
          "songid": 493220,
          "songmid": "003NrOm32ApQkj",
          "songname": "Free Loop",
          "songname_hilight": "Free Loop",
          "stream": 3,
          "switch": 636675,
          "t": 1,
          "tag": 0,
          "type": 0,
          "ver": 0,
          "vid": ""
        },
       ...
      ],
      "totalnum": 29
    },
    "totaltime": 0,
    "zhida": {
      "chinesesinger": 0,
      "type": 0
    }
  },
  "message": "",
  "notice": "",
  "subcode": 0,
  "time": 1494813972,
  "tips": ""
}
```
##3.获取搜索结果的歌曲图片：
https://y.gtimg.cn/music/photo_new/T002R150x150M000{albummid}.jpg?max_age=2592000
例子：
![https://y.gtimg.cn/music/photo_new/T002R150x150M000003OCv0N0LnYHf.jpg?max_age=2592000](https://y.gtimg.cn/music/photo_new/T002R150x150M000003OCv0N0LnYHf.jpg?max_age=2592000)

##4.获取搜索结果中的歌词：
URL : https://api.darlin.me/music/lyric/{songid}/?&callback=jsonpCallback
return:
jsonpCallback({"retcode":0,"code":0,"subcode":0,"type":1,"songt":0,"lyric":"{base64 encoded data}"})

##5.获取搜索结果中的音频文件：
URL: http://ws.stream.qqmusic.qq.com/{songid}.m4a?fromtag=46
例子：
http://ws.stream.qqmusic.qq.com/493220.m4a?fromtag=46
