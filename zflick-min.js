/**
* zflickjs(min)
* @extend jquery-jcflick.js:http://tpl.funnythingz.com/js/jcflick/
* @version 1.5a
* @author: hiroki ooiwa;
* @url: http://funnythingz.github.com/zflickjs/
* @license MIT (http://www.opensource.org/licenses/mit-license.php)
*/
var zflickjs=function(args){this.id=document.getElementById(args.id);this.contents=document.getElementById(args.contents);this.col=this.contents.getElementsByClassName(args.col);this.lamp=(args.lamp)?document.getElementById(args.lamp):false;this.btnPrev=(args.btn)?document.getElementById(args.btn.prev):false;this.btnNext=(args.btn)?document.getElementById(args.btn.next):false;this.move=(args.move)?args.move:false;this.autoChange=(args.autoChange)?args.autoChange:false;this.autoTimer=(args.autoTimer)?args.autoTimer:5000;this.cur=(args.cur)?args.cur:0;this.callback=(args.callback)?args.callback:function(){};this.isArgsWidth=(!args.width||args.width<=0)?false:true;this.idWidth=(this.isArgsWidth)?args.width:this.id.clientWidth;this.num=0;this.disX=(!args.disX||args.disX<=0)?35:args.disX;this.length=0;this.carray=[];this.warray=[];this.lamps=[];if(this.autoChange){this.autoChangeFlag=true;this.autoTimerCache=[]}this._cNowPos=0;this._cStartPos=0;this._cDistance=0;this._cHoge=0;this._orien=false;this._btnFlag=(args.btn)?true:false;this._ua=navigator.userAgent;this.init()}zflickjs.prototype={init:function(){this.domInit(this);this.touchInit(this);if(this._btnFlag){this.clickPrevInit(this);this.clickNextInit(this)}this.createLamp(this);this.animation(this);this.resetAutoChange(this)},touchInit:function(obj){var aflag=false;obj.contents.addEventListener('touchstart',function(e){obj._cStartPos=e.touches[0].clientX;obj.killAutoChange(obj)},false);obj.contents.addEventListener('touchmove',function(e){if(/Android/.test(obj._ua)){e.preventDefault();if(!aflag){obj._cDistance=obj._cStartPos-e.touches[0].clientX;obj._cHoge=obj._cNowPos;if(obj.disX<Math.abs(obj._cDistance)&&(obj._cDistance>0)){obj._cHoge=obj._cNowPos-Math.abs(obj._cDistance);obj._orien=true;aflag=true}else if(obj.disX<Math.abs(obj._cDistance)&&(obj._cDistance<0)){obj._cHoge=obj._cNowPos+Math.abs(obj._cDistance);obj._orien=false;aflag=true}if(aflag){obj.animation(obj);obj._cDistance=0;obj.resetAutoChange(obj)}}}else if(/iP(hone|od|ad)/.test(obj._ua)){obj._cDistance=obj._cStartPos-e.touches[0].clientX;obj._cHoge=obj._cNowPos;if(obj.disX<Math.abs(obj._cDistance)&&(obj._cDistance>0)){e.preventDefault();obj._cHoge=obj._cNowPos-Math.abs(obj._cDistance);obj._orien=true}else if(obj.disX<Math.abs(obj._cDistance)&&(obj._cDistance<0)){e.preventDefault();obj._cHoge=obj._cNowPos+Math.abs(obj._cDistance);obj._orien=false}obj.noTransAnimate(obj)}},false);obj.contents.addEventListener('touchend',function(e){aflag=false;if(/iP(hone|od|ad)/.test(obj._ua)){obj.animation(obj);obj._cDistance=0;obj.resetAutoChange(obj)}},false)},animation:function(obj){if(obj._orien){if(obj.cur<obj.length-1){obj.cur+=1}else{obj.cur=obj.length-1}}else{if(obj.cur>0){obj.cur-=1}else if(obj.cur<=0){obj.cur=0}}obj._cNowPos=obj.warray[obj.cur];obj.transAnimate(obj);obj.btnCurrentAction(obj);obj.setLamps(obj,obj.cur)},transAnimate:function(obj){if(/AppleWebKit/.test(obj._ua)){obj.contents.style.webkitTransition='-webkit-transform 0.3s ease-in-out';obj.contents.style.webkitTransform='translate3d('+obj._cNowPos+'px, 0, 0)'}else if(/Firefox/.test(obj._ua)){obj.contents.style.MozTransition='-moz-transform 0.3s ease-in-out';obj.contents.style.MozTransform='translate3d('+obj._cNowPos+'px, 0, 0)'}setTimeout(function(){obj.callback()},300)},noTransAnimate:function(obj){if(/AppleWebKit/.test(obj._ua)){obj.contents.style.webkitTransition='none';obj.contents.style.webkitTransform='translate3d('+obj._cHoge+'px, 0, 0)'}else if(/Firefox/.test(obj._ua)){obj.contents.style.MozTransition='none';obj.contents.style.MozTransform='translate3d('+obj._cHoge+'px, 0, 0)'}setTimeout(function(){obj.callback()},300)},btnCurrentAction:function(obj){if(obj.id.clientWidth>=obj.contents.clientWidth){}else{if(obj.cur<=0){if(obj._btnFlag){if(obj.btnPrev.className.indexOf('zflickBtnCur')>0){obj.btnPrev.className=obj.btnPrev.className.replace('zflickBtnCur','')}if(obj.btnNext.className.indexOf('zflickBtnCur')<0)obj.btnNext.className+=' zflickBtnCur'}}else if(obj.cur===obj.length-1){if(obj._btnFlag){if(obj.btnPrev.className.indexOf('zflickBtnCur')<0)obj.btnPrev.className+=' zflickBtnCur';if(obj.btnNext.className.indexOf('zflickBtnCur')>0){obj.btnNext.className=obj.btnNext.className.replace('zflickBtnCur','')}}}else{if(obj._btnFlag){if(obj.btnPrev.className.indexOf('zflickBtnCur')<0)obj.btnPrev.className+=' zflickBtnCur';if(obj.btnNext.className.indexOf('zflickBtnCur')<0)obj.btnNext.className+=' zflickBtnCur'}}}},clickPrevInit:function(obj){obj.btnPrev.addEventListener('click',function(e){obj._orien=false;obj.animation(obj);obj.killAutoChange(obj);setTimeout(function(){obj.resetAutoChange(obj)},obj.autoTimer+1000)},false)},clickNextInit:function(obj){obj.btnNext.addEventListener('click',function(e){obj._orien=true;obj.animation(obj);obj.killAutoChange(obj);setTimeout(function(){obj.resetAutoChange(obj)},obj.autoTimer+100)},false)},resizeInit:function(obj){var self=obj;var timer=false;window.addEventListener('resize',function(){if(timer!==false){clearTimeout(timer)}timer=setTimeout(function(){self.domInit(self);self.animation(self);self.resetAutoChange(this)},200)},false)},domInit:function(obj){obj.id.style.width='auto';if(!obj.isArgsWidth)obj.idWidth=obj.id.clientWidth;obj.length=obj.col.length;obj.id.style.width=obj.idWidth+'px';obj.id.style.overflow='hidden';obj.contents.style.width=obj.getContentsWidth()+'px';obj.contents.style.width=obj.getContentsWidth()+'px';obj.resizeInit(this)},createLamp:function(obj){if(obj.lamp){for(var i=0;i<obj.length;i++){obj.lamps[i]=document.createElement('div');obj.lamp.appendChild(obj.lamps[i])}}},setLamps:function(obj,num){if(obj.lamp){for(var i=0;i<obj.length;i++){obj.lamps[i].setAttribute('class','')}obj.lamps[num].setAttribute('class','cur')}},getContentsWidth:function(){var totalWidth=0;for(var i=0,L=this.length;i<L;i++){var c=this.col[i];this.carray[i]=c.offsetWidth;this.warray[i]=-totalWidth;totalWidth+=c.offsetWidth}return totalWidth},autoChangeFunc:function(obj){if(!obj.autoChangeFlag){obj.autoTimerCache.push(setInterval(function(){obj.autoChangeFlag=true;if(obj.cur===obj.length-1){obj._orien=false;obj.cur=0}else{obj._orien=true}obj.animation(obj)},obj.autoTimer))}},resetAutoChange:function(obj){if(obj.autoChange){obj.killAutoChange(obj);obj.autoChangeFunc(obj)}},killAutoChange:function(obj){if(this.autoChange){obj.autoChangeFlag=false;for(var i=0,L=obj.autoTimerCache.length;i<L;i++){clearInterval(obj.autoTimerCache[i]);obj.autoTimerCache.splice(i,1)}}}}