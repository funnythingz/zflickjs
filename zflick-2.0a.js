/**
* zflickjs
* @extend jquery-jcflick.js:http://tpl.funnythingz.com/js/jcflick/
* @version 2.0a
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
  this.lampActiveClassName = (args.lampActiveClassName)? args.lampActiveClassName: 'cur';
  this.btnPrev = (args.btn)? document.getElementById(args.btn.prev): false;
  this.btnNext = (args.btn)? document.getElementById(args.btn.next): false;
  this.btnActiveClassName = (args.btnActiveClassName)? args.btnActiveClassName: 'zflickBtnCur';
  this.move = (args.move)? args.move: false;
  this.loop = (args.loop)? args.loop: false;
  this.autoChange = (args.autoChange)? args.autoChange: false;
  this.autoTimer = (args.autoTimer)? args.autoTimer: 5000;
  this.cur = (args.cur)? args.cur: 0;
  this.initCallback = (args.initCallback)? args.initCallback: function(){}; //初期化完了後のコールバック関数
  this.moveCallback = (args.moveCallback)? args.moveCallback: function(){}; //コンテンツが動いたあとのコールバック関数
  
  //param
  this.isArgsWidth = (!args.width || args.width <= 0)? false: true;
  this.idWidth = (this.isArgsWidth)? args.width: this.id.clientWidth;
  this.num = 0; //colの順番位置
  this.disX = (!args.disX || args.disX <= 0)? 5: args.disX; //X軸に対してフリックした時のanimationさせるための最低条件距離
  this.disY = (!args.disY || args.disY <= 0)? 5: args.disY; //Y軸に対してフリックした時のキャンセル処理を行うための条件距離
  this.length = 0; //colの数
  this.carray = []; //colの横幅
  this.warray = []; //colのleft位置
  this.lamps = []; //lamp要素の入れ物
  this.cloneLength = (args.cloneLength)? args.cloneLength: 3;
  
  if(this.autoChange){
    this.autoChangeFlag = true;
    this.autoTimerCache = [];
  }
  
  //_cache
  this._cNowPos = 0;
  this._cStartPosX = 0;
  this._cStartPosY = 0;
  this._cDistance = 0;
  this._cHoge = 0;
  this._orien = false; //false: prev; true: next;
  this._btnFlag = (args.btn)? true: false;
  this._ua = navigator.userAgent;
  this._initFlag = true;
  this._totalWidth = 0;
  
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
    
    //コールバック
    this.initCallback();
    
    //resize登録
    this.resizeInit(this);
  },
  //タッチイベント
  touchInit: function(obj){
    var aflag = false;
    //event
    obj.contents.addEventListener('touchstart', function(e){
      obj._cStartPosX = e.touches[0].clientX;
      obj._cStartPosY = e.touches[0].clientY;
      obj.killAutoChange(obj);
    }, false);
    obj.contents.addEventListener('touchmove', function(e){
      if(Math.abs(obj._cStartPosY - e.touches[0].clientY) > obj.disY){
        //Y軸スクロールの場合フリックをキャンセル
      }else{
        if(!aflag){
          obj._cDistance = obj._cStartPosX - e.touches[0].clientX;
          obj._cHoge = obj._cNowPos;
          //<- plus
          if(obj.disX < Math.abs(obj._cDistance) && (obj._cDistance > 0)){
            e.preventDefault();
            e.stopPropagation();
            obj._cHoge = obj._cNowPos - Math.abs(obj._cDistance);
            obj._orien = true;
            aflag = true;
          }
          //-> minus
          else if(obj.disX < Math.abs(obj._cDistance) && (obj._cDistance < 0)){
            e.preventDefault();
            e.stopPropagation();
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
    }, false);
    obj.contents.addEventListener('touchend', function(e){
      aflag = false;
    }, false);
  },
  //アニメーション
  animation: function(obj){
    if(obj._orien){
      obj.cur += 1;
      if(obj.cur < obj.length){
        if(obj.loop && (obj.cur === (obj.length - 1))){
          obj._cNowPos = (obj.warray[0] + (obj.idWidth * 2));
          obj.noTransAnimate(obj);
          obj._cNowPos = (obj.warray[0] + obj.idWidth);
        }else{
          obj._cNowPos = obj.warray[obj.cur];
        }
      }else{
        if(obj.loop && (obj.cur === obj.length)){
          obj._cNowPos = (obj.warray[0] + obj.idWidth);
          obj.noTransAnimate(obj);
          obj._cNowPos = obj.warray[obj.cur];
        }
        obj.cur = (!obj.loop)? obj.length - 1: 0;
        obj._cNowPos = obj.warray[obj.cur];
      }
    }else{
      obj.cur = (obj._initFlag)? obj.cur: (obj.cur - 1);
      if(obj.cur > 0){
        obj._cNowPos = obj.warray[obj.cur];
        if(obj.loop && (obj.cur === (obj.length - 2))){
          obj._cNowPos = obj.warray[(obj.length - 1)];
          obj.noTransAnimate(obj);
          obj._cNowPos = (obj.warray[obj.cur]);
        }
      }else if(obj.cur <= 0){
        if(obj.loop && (obj.cur < 0)){
          obj.cur = (obj.length - 1);
          obj._cNowPos = (obj.warray[(obj.length - 1)] - obj.idWidth);
          obj.noTransAnimate(obj);
        }else{
          obj.cur = 0;
        }
        obj._cNowPos = obj.warray[obj.cur];
      }
    }
    setTimeout(function(){
      obj.transAnimate(obj);
    },1);
    obj.btnCurrentAction(obj);
    obj.setLamps(obj,obj.cur);
    obj._initFlag = false;
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
      obj.moveCallback();
    },300);
  },
  //transition:none;のときのアニメーション
  //主にtouchmoveのときに使う
  noTransAnimate: function(obj){
    if(/AppleWebKit/.test(obj._ua)){
      obj.contents.style.webkitTransition = 'none';
      obj.contents.style.webkitTransform = 'translate3d(' + obj._cNowPos + 'px, 0, 0)';
    }
    else if(/Firefox/.test(obj._ua)){
      obj.contents.style.MozTransition = 'none';
      obj.contents.style.MozTransform = 'translate3d(' + obj._cNowPos + 'px, 0, 0)';
    }
  },
  //ボタンのカレント表示切替
  btnCurrentAction: function(obj){
    if(obj._btnFlag){
      if(!obj.loop){
        //最初
        if(obj.cur <= 0){
          if(obj.btnPrev.className.indexOf(obj.btnActiveClassName) > 0){
            obj.btnPrev.className = obj.btnPrev.className.replace(obj.btnActiveClassName, '');
          }
          if(obj.btnNext.className.indexOf(obj.btnActiveClassName) < 0) obj.btnNext.className += (' ' + obj.btnActiveClassName);
        }
        //最後
        else if(obj.cur === obj.length - 1){
          if(obj.btnPrev.className.indexOf(obj.btnActiveClassName) < 0) obj.btnPrev.className += (' ' + obj.btnActiveClassName);
          if(obj.btnNext.className.indexOf(obj.btnActiveClassName) > 0){
            obj.btnNext.className = obj.btnNext.className.replace(obj.btnActiveClassName, '');
          }
        }
        //中間
        else{
          if(obj.btnPrev.className.indexOf(obj.btnActiveClassName) < 0) obj.btnPrev.className += (' ' + obj.btnActiveClassName);
          if(obj.btnNext.className.indexOf(obj.btnActiveClassName) < 0) obj.btnNext.className += (' ' + obj.btnActiveClassName);
        }
      }else{
        if(obj.btnNext.className.indexOf(obj.btnActiveClassName) < 0) obj.btnNext.className += (' ' + obj.btnActiveClassName);
        if(obj.btnPrev.className.indexOf(obj.btnActiveClassName) < 0) obj.btnPrev.className += (' ' + obj.btnActiveClassName);
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
      }, obj.autoTimer);
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
      }, obj.autoTimer);
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
    //contents
    if(!obj.loop){
      //default
      obj.contents.style.width = obj.getContentsWidth() + 'px';
    }else{
      //loop init
      obj._totalWidth = obj.getContentsWidth();
      obj.contents.style.width = (obj._totalWidth * obj.cloneLength) + 'px';
      obj.cloneNode(obj.cloneLength);
      obj.loopInitPos();
    }
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
      obj.lamps[num].setAttribute('class',obj.lampActiveClassName);
    }
  },
  //コンテンツ全体の横幅を取得
  getContentsWidth: function(){
    var totalWidth = 0;
    var cloneNode = {};
    for(var i = 0, L = this.length; i < L; i++){
      var c = this.col[i];
      this.carray[i] = this.idWidth;
      this.warray[i] = - (totalWidth);
      totalWidth += this.idWidth;
    }
    return totalWidth;
  },
  //loop時の初期位置を設定
  loopInitPos: function(){
    for(var i = 0, L = this.length; i < L; i++){
      this.warray[i] -= this._totalWidth;
    }
  },
  //コンテンツをクローンして親にappendする
  cloneNode: function(num){
    num = num - 1;
    for(var h = 0; h < num; h++){
      for(var i = 0, L = this.length; i < L; i++){
        cloneNode = this.col[i].cloneNode(true);
        cloneNode.setAttribute('clone', 'clone');
        this.contents.appendChild(cloneNode);
      }
    }
  },
  //自動切り替え
  autoChangeFunc: function(obj){
    if(!obj.autoChangeFlag){
      obj.autoTimerCache.push(
        setInterval(function(){
          obj.autoChangeFlag = true;
          if(!obj.loop){
            if(obj.cur === obj.length - 1){
              obj._orien = false;
              obj.cur = 0;
            }else{
              obj._orien = true;
            }
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
