#zflickjs v1.8


iOS, Androidなどのwebkitベースで提供するサービスではjQueryなどのライブラリを使わず、pureなJavaScriptで実装した方がパフォーマンス良いんじゃないかと思って作ってみた

## Usage
<head>タグ内にzflick.cssとzflick.jsを読み込む。
```
<link rel="stylesheet" href="zflick.css">
<script type="text/javascript" src="zflick.js"></script>
```


### HTML
HTMLを組む。高速化のためにJSで動かす要素はID指定になっている。

```
<div id="zflickjs">
  <div id="zcontents" class="group contents">
    <div class="zcol"><a href="#" class="zlink"><img src="dummy/48x48.gif"></a></div>
    <div class="zcol"><a href="#" class="zlink"><img src="dummy/48x48.gif"></a></div>
    <div class="zcol"><a href="#" class="zlink"><img src="dummy/48x48.gif"></a></div>
    <div class="zcol"><a href="#" class="zlink"><img src="dummy/126x48.gif"></a></div>
    <div class="zcol"><a href="#" class="zlink"><img src="dummy/48x48.gif"></a></div>
    <div class="zcol"><a href="#" class="zlink"><img src="dummy/126x48.gif"></a></div>
    <div class="zcol"><a href="#" class="zlink"><img src="dummy/48x48.gif"></a></div>
    <div class="zcol"><a href="#" class="zlink"><img src="dummy/126x48.gif"></a></div>
    <div class="zcol"><a href="#" class="zlink"><img src="dummy/126x48.gif"></a></div>
    <div class="zcol"><a href="#" class="zlink"><img src="dummy/48x48.gif"></a></div>
    <div class="zcol"><a href="#" class="zlink"><img src="dummy/48x48.gif"></a></div>
    <div class="zcol"><a href="#" class="zlink"><img src="dummy/48x48.gif"></a></div>
  </div>
</div>
<div class="group" style="margin-top: 0.5em;">
  <span id="prev" class="zflickClickBtn" style="float: left;">prev</span>
  <span id="next" class="zflickClickBtn" style="float: right;">next</span>
</div>
```

### JS
new zflickjs({})で初期化
```
<script>
var init = function(){
  new zflickjs({
    id: 'zflickjs',
    contents: 'zcontents',
    col: 'zcol',
    width: 280,
    btn: {
      prev: 'prev',
      next: 'next'
    }
  });
}
window.addEventListener('load', init, false);
</script>
```

## Options

* width: number
    * 280 ... width move
* autoChange: boolean
    * true ... "true" auto move element, "false" don't move
* autoTimer: number
    * 4000 ... millisecond
* lamp: string ID
    * 'zflickLamp' ... lamp element ID
* initCallback: function
    * function(){console.log('inited')} ... inited callback method
* moveCallback: function
    * function(){console.log('moved')} ... moved callback method
* btn: object
    * {prev: 'prevBtn', next: 'nextBtn'} ... click event element


## Credits
<a href="http://www.funnythingz.com">funnythingz</a>