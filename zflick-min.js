/* zflickjs v1.0a */
var zflickjs=function(a){this.id=document.getElementById(a.id);this.contents=document.getElementById(a.contents);this.col=this.contents.querySelectorAll("."+a.col);this.margin=!a.margin||a.margin<=0?0:a.margin;this.btnPrev=a.btn?document.getElementById(a.btn.prev):false;this.btnNext=a.btn?document.getElementById(a.btn.next):false;this.isArgsWidth=!a.width||a.width<=0?false:true;this.idWidth=this.isArgsWidth?a.width:this.id.clientWidth;this.num=0;this.disX=!a.disX||a.disX<=0?35:a.disX;this.length=0;this.carray=[];this.warray=[];this._cNowPos=0;this._cStartPos=0;this._cDistance=0;this._cHoge=0;this._orien=false;this._btnFlag=a.btn?true:false;this._ua=navigator.userAgent;this.init()};zflickjs.prototype={init:function(){this.domInit(this);this.touchInit(this);if(this._btnFlag){this.clickPrevInit(this);this.clickNextInit(this)}this.animation(this)},touchInit:function(a){var b=false;a.contents.addEventListener("touchstart",function(b){a._cStartPos=b.touches[0].clientX},false);a.contents.addEventListener("touchmove",function(c){event.preventDefault();if(/Android/.test(a._ua)){if(!b){a._cDistance=a._cStartPos-c.touches[0].clientX;a._cHoge=0;if(a.disX<Math.abs(a._cDistance)&&a._cDistance>0){a._cHoge=a._cNowPos-Math.abs(a._cDistance);a._orien=true;b=true}else if(a.disX<Math.abs(a._cDistance)&&a._cDistance<0){a._cHoge=a._cNowPos+Math.abs(a._cDistance);a._orien=false;b=true}}}else if(/iP(hone|od|ad)/.test(a._ua)){a._cDistance=a._cStartPos-c.touches[0].clientX;a._cHoge=0;if(a.disX<Math.abs(a._cDistance)&&a._cDistance>0){a._cHoge=a._cNowPos-Math.abs(a._cDistance);a._orien=true}else if(a.disX<Math.abs(a._cDistance)&&a._cDistance<0){a._cHoge=a._cNowPos+Math.abs(a._cDistance);a._orien=false}a.contents.style.webkitTransition="none";a.contents.style.webkitTransform="translate3d("+a._cHoge+"px, 0, 0)"}if(/Android/.test(a._ua)&&b){a._cNowPos=a._cHoge;a._cNowPos=a._orien?a._cNowPos-a.id.clientWidth:a._cNowPos+a.id.clientWidth;a.animation(a);a._cDistance=0}},false);a.contents.addEventListener("touchend",function(c){b=false;if(/iP(hone|od|ad)/.test(a._ua)){a._cNowPos=a._cHoge;a._cNowPos=a._orien?a._cNowPos-a.id.clientWidth:a._cNowPos+a.id.clientWidth;a.animation(a);a._cDistance=0}},false)},animation:function(a){if(a._cNowPos>=0){a._cNowPos=a.getStartStopPos(a)}else if(a._cNowPos<0&&Math.abs(a.getLastStopPos(a))<Math.abs(a._cNowPos)){a._cNowPos=a.getLastStopPos(a)}else{if(a._cNowPos>a.getLastStopPos(a)){a._cNowPos=a.getMiddleStopPos(a)}}a.contents.style.webkitTransition="-webkit-transform 0.3s ease-in-out";a.contents.style.webkitTransform="translate3d("+a._cNowPos+"px, 0, 0)";a.btnCurrentAction(a)},btnCurrentAction:function(a){if(a._cNowPos>=0){if(a._btnFlag){if(a.btnPrev.className.indexOf("zflickBtnCur")>0){a.btnPrev.className=a.btnPrev.className.replace("zflickBtnCur","")}if(a.btnNext.className.indexOf("zflickBtnCur")<0)a.btnNext.className+=" zflickBtnCur"}}else if(a._cNowPos===a.getLastStopPos(a)){if(a._btnFlag){if(a.btnPrev.className.indexOf("zflickBtnCur")<0)a.btnPrev.className+=" zflickBtnCur";if(a.btnNext.className.indexOf("zflickBtnCur")>0){a.btnNext.className=a.btnNext.className.replace("zflickBtnCur","")}}}else{if(a._btnFlag){if(a.btnPrev.className.indexOf("zflickBtnCur")<0)a.btnPrev.className+=" zflickBtnCur";if(a.btnNext.className.indexOf("zflickBtnCur")<0)a.btnNext.className+=" zflickBtnCur"}}},clickPrevInit:function(a){a.btnPrev.addEventListener("click",function(b){a._cNowPos=a._cNowPos+a.id.clientWidth;a.animation(a)})},clickNextInit:function(a){a.btnNext.addEventListener("click",function(b){a._cNowPos=a._cNowPos-a.id.clientWidth;a.animation(a)})},resizeInit:function(a){var b=a;var c=false;window.addEventListener("resize",function(){if(c!==false){clearTimeout(c)}c=setTimeout(function(){b.domInit(b);b.animation(b)},200)},false)},domInit:function(a){a.id.style.width="auto";if(!a.isArgsWidth)a.idWidth=a.id.clientWidth;a.length=a.col.length;a.id.style.width=a.idWidth+"px";a.id.style.overflow="hidden";a.contents.style.width=a.getContentsWidth()+"px";a.resizeInit(this)},getContentsWidth:function(){var a=0;for(var b=0,c=this.length;b<c;b++){var d=this.col[b];this.carray[b]=d.offsetWidth+this.margin;this.warray[b]=a;a+=d.offsetWidth+this.margin}a-=this.margin;return a},getStartStopPos:function(a){a.num=0;return 0},getLastStopPos:function(a){var b=a.idWidth-a.getContentsWidth();return b<0?b:0},getMiddleStopPos:function(a){var b=0;for(var c=0,d=a.warray.length;c<d;c++){if(a.warray[c]<Math.abs(a._cNowPos)){a.num=c}}if(Math.abs(a._cNowPos)<a.warray[a.num]+Math.floor(a.carray[a.num]/2)){b=-a.warray[a.num]}else{b=-a.warray[a.num+1]}return b}}