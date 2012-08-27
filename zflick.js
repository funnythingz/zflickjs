/**
* zflickjs
* @extend jquery-jcflick.js:http://tpl.funnythingz.com/js/jcflick/
* @version 1.6a
* @author: hiroki ooiwa;
* @url: http://funnythingz.github.com/zflickjs/
* @license MIT (http://www.opensource.org/licenses/mit-license.php)
*/

//zflickjs Class Property
var zflickjs = function(args){
  
  //options
  this.id = document.getElementById(args.id);
  this.contents = document.getElementById(args.contents);
  this.col = this.contents.getElementsByClassName(args.col);
  this.lamp = (args.lamp)? document.getElementById(args.lamp): false;
  this.btnPrev = (args.btn)? document.getElementById(args.btn.prev): false;
  this.btnNext = (args.btn)? document.getElementById(args.btn.next): false;
  this.move = (args.move)? args.move: false;
  this.autoChange = (args.autoChange)? args.autoChange: false;
  this.autoTimer = (args.autoTimer)? args.autoTimer: 5000;
  this.cur = (args.cur)? args.cur: 0;
  this.callback = (args.callback)? args.callback: function(){};
  
  //param
  this.isArgsWidth = (!args.width || args.width <= 0)? false: true;
  this.idWidth = (this.isArgsWidth)? args.width: this.id.clientWidth;
  this.num = 0; //colの順番位置
  this.disX = (!args.disX || args.disX <= 0)? 35: args.disX; //X軸に対してフリックした時のanimationさせるための最低条件距離
  this.length = 0; //colの数
  this.carray = []; //colの横幅
  this.warray = []; //colのleft位置
  this.lamps = []; //lamp要素の入れ物
  
  if(this.autoChange){
    this.autoChangeFlag = true;
    this.autoTimerCache = [];
  }
  
  //_cache
  this._cNowPos = 0;
  this._cStartPos = 0;
  this._cDistance = 0;
  this._cHoge = 0;
  this._orien = false; //false: prev; true: next;
  this._btnFlag = (args.btn)? true: false;
  this._ua = navigator.userAgent;
  
  //init
  this.init();
}
//zflickjs Class Method
zflickjs.prototype = {
  //初期化
  init: function(){
    //DOMセット
    this.domInit(this);
    //touchイベントセット
    this.touchInit(this);
    //clickイベントセット
    if(this._btnFlag){
      this.clickPrevInit(this);
      this.clickNextInit(this);
    }
    //lampセット
    this.createLamp(this);
    //初期位置にセット
    this.animation(this);
    
    //自動切り替えセット
    this.resetAutoChange(this);
  },
  //タッチイベント
  touchInit: function(obj){
    var aflag = false;
    //event
    obj.contents.addEventListener('touchstart', function(e){
      obj._cStartPos = e.touches[0].clientX;
      obj.killAutoChange(obj);
    }, false);
    obj.contents.addEventListener('touchmove', function(e){
      if(/Android/.test(obj._ua)){
        if(!aflag){
          obj._cDistance = obj._cStartPos - e.touches[0].clientX;
          obj._cHoge = obj._cNowPos;
          //<- plus
          if(obj.disX < Math.abs(obj._cDistance) && (obj._cDistance > 0)){
            e.preventDefault();
            obj._cHoge = obj._cNowPos - Math.abs(obj._cDistance);
            obj._orien = true;
            aflag = true;
          }
          //-> minus
          else if(obj.disX < Math.abs(obj._cDistance) && (obj._cDistance < 0)){
            e.preventDefault();
            obj._cHoge = obj._cNowPos + Math.abs(obj._cDistance);
            obj._orien = false;
            aflag = true;
          }
          if(aflag){
            obj.animation(obj);
            obj._cDistance = 0;
            obj.resetAutoChange(obj);
          }
        }
      }
      else if(/iP(hone|od|ad)/.test(obj._ua)){
        obj._cDistance = obj._cStartPos - e.touches[0].clientX;
        obj._cHoge = obj._cNowPos;
        //<- plus
        if(obj.disX < Math.abs(obj._cDistance) && (obj._cDistance > 0)){
          e.preventDefault();
          obj._cHoge = obj._cNowPos - Math.abs(obj._cDistance);
          obj._orien = true;
        }
        //-> minus
        else if(obj.disX < Math.abs(obj._cDistance) && (obj._cDistance < 0)){
          e.preventDefault();
          obj._cHoge = obj._cNowPos + Math.abs(obj._cDistance);
          obj._orien = false;
        }
        obj.noTransAnimate(obj);
      }
    }, false);
    obj.contents.addEventListener('touchend', function(e){
      aflag = false;
      if(/iP(hone|od|ad)/.test(obj._ua)){
        obj.animation(obj);
        obj._cDistance = 0;
        obj.resetAutoChange(obj);
      }
    }, false);
  },
  //アニメーション
  animation: function(obj){
    if(obj._orien){
      if(obj.cur < obj.length - 1){
        obj.cur += 1;
      }else{
        obj.cur = obj.length - 1;
      }
    }else{
      if(obj.cur > 0){
        obj.cur -= 1;
      }else if(obj.cur <= 0){
        obj.cur = 0;
      }
    }
    obj._cNowPos = obj.warray[obj.cur];
    obj.transAnimate(obj);
    obj.btnCurrentAction(obj);
    obj.setLamps(obj,obj.cur);
  },
  //transitionあるときのアニメーション
  transAnimate: function(obj){
    if(/AppleWebKit/.test(obj._ua)){
      obj.contents.style.webkitTransition = '-webkit-transform 0.3s ease-in-out';
      obj.contents.style.webkitTransform = 'translate3d(' + obj._cNowPos + 'px, 0, 0)';
    }
    else if(/Firefox/.test(obj._ua)){
      obj.contents.style.MozTransition = '-moz-transform 0.3s ease-in-out';
      obj.contents.style.MozTransform = 'translate3d(' + obj._cNowPos + 'px, 0, 0)';
    }
    setTimeout(function(){
      obj.callback();
    },300);
  },
  //transition:none;のときのアニメーション
  //主にtouchmoveのときに使う
  noTransAnimate: function(obj){
    if(/AppleWebKit/.test(obj._ua)){
      obj.contents.style.webkitTransition = 'none';
      obj.contents.style.webkitTransform = 'translate3d(' + obj._cHoge + 'px, 0, 0)';
    }
    else if(/Firefox/.test(obj._ua)){
      obj.contents.style.MozTransition = 'none';
      obj.contents.style.MozTransform = 'translate3d(' + obj._cHoge + 'px, 0, 0)';
    }
  },
  //ボタンのカレント表示切替
  btnCurrentAction: function(obj){
    //横幅が足りてない場合、ボタンのカレントを不要とする
    if(obj.id.clientWidth >= obj.contents.clientWidth){
    }
    else{
      //最初
      if(obj.cur <= 0){
        if(obj._btnFlag){
          if(obj.btnPrev.className.indexOf('zflickBtnCur') > 0){
            obj.btnPrev.className = obj.btnPrev.className.replace('zflickBtnCur', '');
          }
          if(obj.btnNext.className.indexOf('zflickBtnCur') < 0) obj.btnNext.className += ' zflickBtnCur';
        }
      }
      //最後
      else if(obj.cur === obj.length - 1){
        if(obj._btnFlag){
          if(obj.btnPrev.className.indexOf('zflickBtnCur') < 0) obj.btnPrev.className += ' zflickBtnCur';
          if(obj.btnNext.className.indexOf('zflickBtnCur') > 0){
            obj.btnNext.className = obj.btnNext.className.replace('zflickBtnCur', '');
          }
        }
      }
      //中間
      else{
        if(obj._btnFlag){
          if(obj.btnPrev.className.indexOf('zflickBtnCur') < 0) obj.btnPrev.className += ' zflickBtnCur';
          if(obj.btnNext.className.indexOf('zflickBtnCur') < 0) obj.btnNext.className += ' zflickBtnCur';
        }
      }
    }
  },
  //クリックイベント prev
  clickPrevInit: function(obj){
    obj.btnPrev.addEventListener('click', function(e){
      obj._orien = false;
      obj.animation(obj);
      obj.killAutoChange(obj);
      setTimeout(function(){
        obj.resetAutoChange(obj);
      }, obj.autoTimer + 1000);
    },false);
  },
  //クリックイベント next
  clickNextInit: function(obj){
    obj.btnNext.addEventListener('click', function(e){
      obj._orien = true;
      obj.animation(obj);
      obj.killAutoChange(obj);
      setTimeout(function(){
        obj.resetAutoChange(obj);
      }, obj.autoTimer + 100);
    },false);
  },
  //リサイズイベント
  resizeInit: function(obj){
    var self = obj;
    var timer = false;
    window.addEventListener('resize',function(){
      if (timer !== false) {
        clearTimeout(timer);
      }
      timer = setTimeout(function(){
        self.domInit(self);
        self.animation(self);
        self.resetAutoChange(self);
      }, 200);
    }, false);
  },
  //パーツの横幅をセット
  domInit: function(obj){
    //param
    obj.id.style.width = 'auto';
    if(!obj.isArgsWidth) obj.idWidth = obj.id.clientWidth;
    obj.length = obj.col.length;
    //id
    obj.id.style.width = obj.idWidth + 'px';
    //obj.id.style.overflow = 'hidden';
    //contents
    obj.contents.style.width = obj.getContentsWidth() + 'px';
    //resize登録
    obj.resizeInit(obj);
  },
  //DOM lampを生成
  createLamp: function(obj){
    if(obj.lamp){
      for(var i = 0; i < obj.length; i++){
        obj.lamps[i] = document.createElement('div');
        obj.lamp.appendChild(obj.lamps[i]);
      }
    }
  },
  //lampの位置セット
  setLamps: function(obj, num){
    if(obj.lamp){
      for(var i = 0; i < obj.length; i++){
        obj.lamps[i].setAttribute('class','');
      }
      obj.lamps[num].setAttribute('class','cur');
    }
  },
  //コンテンツ全体の横幅を取得
  getContentsWidth: function(){
    var totalWidth = 0;
    for(var i = 0, L = this.length; i < L; i++){
      var c = this.col[i];
      this.carray[i] = c.offsetWidth;
      this.warray[i] = - totalWidth;
      totalWidth += c.offsetWidth;
    }
    return totalWidth;
  },
  //自動切り替え
  autoChangeFunc: function(obj){
    if(!obj.autoChangeFlag){
      obj.autoTimerCache.push(
        setInterval(function(){
          obj.autoChangeFlag = true;
          if(obj.cur === obj.length - 1){
            obj._orien = false;
            obj.cur = 0;
          }else{
            obj._orien = true;
          }
          obj.animation(obj);
        },obj.autoTimer)
      );
    }
  },
  //自動切り替え開始メソッド
  resetAutoChange: function(obj){
    if(obj.autoChange){
      obj.killAutoChange(obj);
      obj.autoChangeFunc(obj);
    }
  },
  //自動切り替え停止メソッド
  killAutoChange: function(obj){
    if(this.autoChange){
      obj.autoChangeFlag = false;
      for(var i = 0, L = obj.autoTimerCache.length; i < L; i++){
        clearInterval(obj.autoTimerCache[i]);
        obj.autoTimerCache.splice(i,1);
      }
    }
  }
}
