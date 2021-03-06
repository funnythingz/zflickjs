#zflickjs

iOS, Androidなどのwebkitベースで提供するサービスではjQueryなどのライブラリを使わず、pureなJavaScriptで実装した方がパフォーマンス良いんじゃないかと思って作ってみた

## Install

```sh
% bower install zflickjs
```

## Getting Started
<head>タグ内にzflick.cssとzflick.jsを読み込む。

```html
<link rel="stylesheet" href="zflick.css">
<script type="text/javascript" src="zflick.min.js"></script>
```


### HTML
HTMLを組む。高速化のためにJSで動かす要素はID指定になっている。

```html
<div id="zflickjs" style="margin: 0 auto;">
  <div id="zcontents" class="group contents">
    <div class="zcol"><a href="#" class="zlink"><img src="dummy/0.jpg"></a></div>
    <div class="zcol"><a href="#" class="zlink"><img src="dummy/1.jpg"></a></div>
    <div class="zcol"><a href="#" class="zlink"><img src="dummy/2.jpg"></a></div>
    <div class="zcol"><a href="#" class="zlink"><img src="dummy/3.jpg"></a></div>
    <div class="zcol"><a href="#" class="zlink"><img src="dummy/4.jpg"></a></div>
    <div class="zcol"><a href="#" class="zlink"><img src="dummy/5.jpg"></a></div>
    <div class="zcol"><a href="#" class="zlink"><img src="dummy/6.jpg"></a></div>
    <div class="zcol"><a href="#" class="zlink"><img src="dummy/7.jpg"></a></div>
    <div class="zcol"><a href="#" class="zlink"><img src="dummy/8.jpg"></a></div>
    <div class="zcol"><a href="#" class="zlink"><img src="dummy/9.jpg"></a></div>
  </div>
  <div id="zflickLamp" class="zlamp"></div>
</div>
<div class="group" style="margin-top: 0.5em;">
  <span id="prev" class="zflickClickBtn" style="float: left;">prev</span>
  <span id="next" class="zflickClickBtn" style="float: right;">next</span>
</div>
```

### JS
new zflickjs({})で初期化

```js
var init = function(){
  new zflickjs({
    id: 'zflickjs',
    contents: 'zcontents',
    col: 'zcol',
    width: 280,
    loop: true,
    lamp: 'zflickLamp',
    btn: {
      prev: 'prev',
      next: 'next'
    }
  });
}
window.addEventListener('load', init, false);
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
* loop: true
    * true ... "true" looping!, "false" don't loop

## Credits
<a href="http://www.funnythingz.com">funnythingz</a>
