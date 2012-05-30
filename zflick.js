/* zflickjs v1.0test */

//zflickjs Class Property
var zflickjs = function(args){
  //debug
  var debug = document.getElementById('debug');
  
  //args
  this.id = document.getElementById(args.id);
  this.contents = document.getElementById(args.contents);
  this.col = this.contents.querySelectorAll('.' + args.col);
  this.margin = (!args.margin || args.margin <= 0)? 0: args.margin;
  
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
  
  //init
  this.init();
}
//zflickjs Class Method
zflickjs.prototype = {
  init: function(){
    this.domload();
    var self = this;
    window.addEventListener('resize',function(){
      self.widthInit(self);
      (self._cNowPos < self.getLastStopPos(self))? self._cNowPos = self.getLastStopPos(self): self._cNowPos = self.getMiddleStopPos(self);
      self.contents.style.webkitTransition = '-webkit-transform 0.4s';
      self.contents.style.webkitTransform = 'translate3d(' + self._cNowPos + 'px, 0, 0)';
    }, false);
  },
  //初期化
  domload: function(){
    //DOM init
    this.widthInit(this);
    var self = this;
    //event
    this.contents.addEventListener('touchstart', function(e){
      self._cStartPos = e.touches[0].pageX;
    }, false);
    this.contents.addEventListener('touchmove', function(e){
      event.preventDefault();
      self._cDistance = self._cStartPos - e.touches[0].pageX;
      self._cHoge = 0;
      //<- plus
      if(self.disX < Math.abs(self._cDistance) && (self._cDistance > 0)){
        self._cHoge = self._cNowPos - Math.abs(self._cDistance);
      }
      //-> minus
      else if(self.disX < Math.abs(self._cDistance) && (self._cDistance < 0)){
        self._cHoge = self._cNowPos + Math.abs(self._cDistance);
      }
      self.contents.style.webkitTransition = 'none';
      self.contents.style.webkitTransform = 'translate3d(' + self._cHoge + 'px, 0, 0)';
    }, false);
    this.contents.addEventListener('touchend', function(e){
      self._cNowPos = self._cHoge;
      //最初にフィットする
      if(self._cNowPos > 0){
        self._cNowPos = self.getStartStopPos(self);
      }
      //最後にフィットする
      else if(self._cNowPos < 0 && Math.abs(self.getLastStopPos(self)) < Math.abs(self._cNowPos)){
        self._cNowPos = self.getLastStopPos(self);
      }
      //中間にフィットする
      else{
        if(self._cNowPos > self.getLastStopPos(self)){
          self._cNowPos = self.getMiddleStopPos(self);
        }
      }
      self.contents.style.webkitTransition = '-webkit-transform 0.4s';
      self.contents.style.webkitTransform = 'translate3d(' + self._cNowPos + 'px, 0, 0)';
      self._cDistance = 0;
      debug.innerHTML = self.num;
    }, false);
  },
  //パーツの横幅をセット
  widthInit: function(obj){
    //param
    obj.id.style.width = 'auto';
    if(!obj.isArgsWidth) obj.idWidth = obj.id.clientWidth;
    obj.length = obj.col.length;
    //id
    obj.id.style.width = obj.idWidth + 'px';
    obj.id.style.overflow = 'hidden';
    //contents
    obj.contents.style.width = obj.getContentsWidth() + 'px';
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