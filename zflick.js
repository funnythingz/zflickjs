/* zflickjs v1.0test */

//zflickjs Class Property
var zflickjs = function(args){
  
  //options
  this.id = document.getElementById(args.id);
  this.contents = document.getElementById(args.contents);
  this.col = this.contents.querySelectorAll('.' + args.col);
  this.margin = (!args.margin || args.margin <= 0)? 0: args.margin;
  this.btnPrev = (args.btn)? document.getElementById(args.btn.prev): false;
  this.btnNext = (args.btn)? document.getElementById(args.btn.next): false;
  
  //param
  this.isArgsWidth = (!args.width || args.width <= 0)? false: true;
  this.idWidth = (this.isArgsWidth)? args.width: this.id.clientWidth;
  this.num = 0; //colの順番位置
  this.disX = (!args.disX || args.disX <= 0)? 10: args.disX; //X軸に対してフリックした時のanimationさせるための最低条件距離
  this.length = 0; //colの数
  this.carray = []; //colの横幅
  this.warray = []; //colのleft位置
  
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
    //画面調整
    this.domInit(this);
    //touchイベント登録
    this.touchInit(this);
    //clickイベント登録
    if(this._btnFlag){
      this.clickPrevInit(this);
      this.clickNextInit(this);
    }
    this.animation(this);
  },
  //タッチイベント
  touchInit: function(obj){
    //event
    obj.contents.addEventListener('touchstart', function(e){
      obj._cStartPos = e.touches[0].pageX;
    }, false);
    obj.contents.addEventListener('touchmove', function(e){
      event.preventDefault();
      obj._cDistance = obj._cStartPos - e.touches[0].pageX;
      obj._cHoge = 0;
      //<- plus
      if(obj.disX < Math.abs(obj._cDistance) && (obj._cDistance > 0)){
        obj._cHoge = obj._cNowPos - Math.abs(obj._cDistance);
        obj._orien = true;
      }
      //-> minus
      else if(obj.disX < Math.abs(obj._cDistance) && (obj._cDistance < 0)){
        obj._cHoge = obj._cNowPos + Math.abs(obj._cDistance);
        obj._orien = false;
      }
      if(/iP(hone|od|ad)/.test(obj._ua)){
        obj.contents.style.webkitTransition = 'none';
        obj.contents.style.webkitTransform = 'translate3d(' + obj._cHoge + 'px, 0, 0)';
      }
    }, false);
    obj.contents.addEventListener('touchend', function(e){
      obj._cNowPos = obj._cHoge;
      obj._cNowPos = (obj._orien)? obj._cNowPos - obj.id.clientWidth: obj._cNowPos + obj.id.clientWidth;
      obj.animation(obj);
      obj._cDistance = 0;
    }, false);
  },
  //アニメーション
  animation: function(obj){
    //最初にフィットする
    if(obj._cNowPos >= 0){
      obj._cNowPos = obj.getStartStopPos(obj);
    }
    //最後にフィットする
    else if(obj._cNowPos < 0 && Math.abs(obj.getLastStopPos(obj)) < Math.abs(obj._cNowPos)){
      obj._cNowPos = obj.getLastStopPos(obj);
    }
    //中間にフィットする
    else{
      if(obj._cNowPos > obj.getLastStopPos(obj)){
        obj._cNowPos = obj.getMiddleStopPos(obj);
      }
    }
    obj.contents.style.webkitTransition = '-webkit-transform 0.4s';
    obj.contents.style.webkitTransform = (/iP(hone|od|ad)/.test(obj._ua))? 'translate3d(' + obj._cNowPos + 'px, 0, 0)': 'translate(' + obj._cNowPos + 'px, 0)';
    obj.btnCurrentAction(obj);
  },
  //ボタンのカレント表示切替
  btnCurrentAction: function(obj){
    //最初
    if(obj._cNowPos >= 0){
      if(obj._btnFlag){
        if(obj.btnPrev.className.indexOf('zflickBtnCur') > 0){
          obj.btnPrev.className = obj.btnPrev.className.replace('zflickBtnCur', '');
        }
        if(obj.btnNext.className.indexOf('zflickBtnCur') < 0) obj.btnNext.className += ' zflickBtnCur';
      }
    }
    //最後
    else if(obj._cNowPos === obj.getLastStopPos(obj)){
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
  },
  //クリックイベント prev
  clickPrevInit: function(obj){
    obj.btnPrev.addEventListener('click', function(e){
      obj._cNowPos = obj._cNowPos + obj.id.clientWidth;
      obj.animation(obj);
    });
  },
  //クリックイベント next
  clickNextInit: function(obj){
    obj.btnNext.addEventListener('click', function(e){
      obj._cNowPos = obj._cNowPos - obj.id.clientWidth;
      obj.animation(obj);
    });
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
    obj.id.style.overflow = 'hidden';
    //contents
    obj.contents.style.width = obj.getContentsWidth() + 'px';
    //resize登録
    obj.resizeInit(this);
  },
  //コンテンツ全体の横幅を取得
  getContentsWidth: function(){
    var totalWidth = 0;
    for(var i = 0, L = this.length; i < L; i++){
      var c = this.col[i];
      this.carray[i] = c.offsetWidth + this.margin;
      this.warray[i] = totalWidth;
      totalWidth += c.offsetWidth + this.margin;
    }
    totalWidth -= this.margin;
    return totalWidth;
  },
  //フリックが止まる位置(最初)
  getStartStopPos: function(obj){
    obj.num = 0;
    return 0;
  },
  //フリックが止まる位置(最後尾)
  getLastStopPos: function(obj){
    var rtn = obj.idWidth - obj.getContentsWidth();
    return (rtn < 0)? rtn: 0;
  },
  //フリックが止まる位置(中間)
  getMiddleStopPos: function(obj){
    var rtn = 0;
    for(var i = 0, L = obj.warray.length; i < L; i++){
      if(obj.warray[i] < Math.abs(obj._cNowPos)){
        obj.num = i;
      }
    }
    //colの横幅の中間よりも少ない場合
    if(Math.abs(obj._cNowPos) < (obj.warray[obj.num] + Math.floor(obj.carray[obj.num]/2))){
      rtn = - obj.warray[obj.num];
    }
    //colの横幅の中間よりも多い場合
    else{
      rtn = - obj.warray[obj.num + 1];
    }
    return rtn;
  }
}
