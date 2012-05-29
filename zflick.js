/* zflickjs v1.0test */

//zflickjs Class Property
var zflickjs = function(args){
  //args
  this.id = document.getElementById(args.id);
  this.contents = document.getElementById(args.contents);
  this.col = document.querySelectorAll('.' + args.col);
  this.margin = args.margin;
  
  //param
  this.idWidth = this.id.clientWidth;
  
  //init
  this.init();
}
//zflickjs Class Method
zflickjs.prototype = {
  init: function(){
    this.domload();
  },
  //DOM初期化
  domload: function(){
    //id
    this.id.style.width = this.idWidth + 'px';
    this.id.style.overflow = 'hidden';
    //contents
    this.contents.style.width = this.getContentsWidth() + 'px';
    this.contents.style.webkitTransition = '-webkit-transform 1s';
    this.contents.style.webkitTransform = 'translate3d(' + this.getLastStopPos() + 'px, 0, 0)';
    this.contents.addEventListener('touchstart', this.eventFlickFunc, false);
    this.contents.addEventListener('touchmove', this.eventFlickFunc, false);
    this.contents.addEventListener('touchend', this.eventFlickFunc, false);
  },
  //コンテンツ全体の横幅を取得
  getContentsWidth: function(){
    var totalWidth = 0;
    for(var i = 0, L = this.col.length; i < L; i++){
      var c = this.col[i];
      totalWidth += c.offsetWidth;
    }
    totalWidth += (this.col.length - 1) * this.margin;
    return totalWidth;
  },
  //フリックが止まる位置
  getLastStopPos: function(){
    var rtn = this.idWidth - this.getContentsWidth();
    return (rtn < 0)? rtn: 0;
  },
  eventFlickFunc: function(e){
    
  }
}