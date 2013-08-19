var zflickjs = function (args) {
    this.id = document.getElementById(args.id);
    this.contents = document.getElementById(args.contents);
    this.col = this.contents.getElementsByClassName(args.col);
    this.lamp = (args.lamp) ? document.getElementById(args.lamp) : null;
    this.lampActiveClassName = (args.lampActiveClassName) ? args.lampActiveClassName : 'cur';
    this.btnPrev = (args.btn) ? document.getElementById(args.btn.prev) : null;
    this.btnNext = (args.btn) ? document.getElementById(args.btn.next) : null;
    this.btnActiveClassName = (args.btnActiveClassName) ? args.btnActiveClassName : 'zflickBtnCur';
    this.move = (args.move) ? args.move : false;
    this.loop = (args.loop) ? args.loop : false;
    this.autoChange = (args.autoChange) ? args.autoChange : false;
    this.autoTimer = (args.autoTimer) ? args.autoTimer : 5000;
    this.cur = (args.cur) ? args.cur : 0;
    this.initCallback = (args.initCallback) ? args.initCallback : function () {
    };
    this.moveCallback = (args.moveCallback) ? args.moveCallback : function () {
    };

    this.isArgsWidth = (!args.width || args.width <= 0) ? false : true;
    this.idWidth = (this.isArgsWidth) ? args.width : this.id.clientWidth;
    this.num = 0;
    this.disX = (!args.disX || args.disX <= 0) ? 5 : args.disX;
    this.disY = (!args.disY || args.disY <= 0) ? 5 : args.disY;
    this.length = 0;
    this.carray = [];
    this.warray = [];
    this.lamps = [];
    this.cloneLength = (args.cloneLength) ? args.cloneLength : 3;

    if (this.autoChange) {
        this.autoChangeFlag = true;
        this.autoTimerCache = [];
    }

    this._cNowPos = 0;
    this._cStartPosX = 0;
    this._cStartPosY = 0;
    this._cDistance = 0;
    this._cHoge = 0;
    this._orien = false;
    this._btnFlag = (args.btn) ? true : false;
    this._ua = navigator.userAgent;
    this._initFlag = true;
    this._totalWidth = 0;

    this.init();
};

zflickjs.prototype = {
    init: function () {
        this.domInit();

        this.touchInit();

        if (this._btnFlag) {
            this.clickPrevInit();
            this.clickNextInit();
        }

        this.createLamp();

        this.animation(this);

        this.resetAutoChange();

        this.initCallback();
    },
    touchInit: function () {
        var aflag = false;
        var self = this;

        this.contents.addEventListener('touchstart', function (e) {
            self._cStartPosX = e.touches[0].clientX;
            self._cStartPosY = e.touches[0].clientY;
            self.killAutoChange();
        }, false);
        this.contents.addEventListener('touchmove', function (e) {
            if (Math.abs(self._cStartPosY - e.touches[0].clientY) > self.disY) {
            } else {
                if (!aflag) {
                    self._cDistance = self._cStartPosX - e.touches[0].clientX;
                    self._cHoge = self._cNowPos;

                    if (self.disX < Math.abs(self._cDistance) && (self._cDistance > 0)) {
                        e.preventDefault();
                        e.stopPropagation();
                        self._cHoge = self._cNowPos - Math.abs(self._cDistance);
                        self._orien = true;
                        aflag = true;
                    } else if (self.disX < Math.abs(self._cDistance) && (self._cDistance < 0)) {
                        e.preventDefault();
                        e.stopPropagation();
                        self._cHoge = self._cNowPos + Math.abs(self._cDistance);
                        self._orien = false;
                        aflag = true;
                    }
                    if (aflag) {
                        self.animation(self);
                        self._cDistance = 0;
                        self.resetAutoChange();
                    }
                }
            }
        }, false);
        this.contents.addEventListener('touchend', function (e) {
            aflag = false;
        }, false);
    },
    animation: function (args) {
        if (args._orien) {
            args.cur += 1;
            if (args.cur < args.length) {
                if (args.loop && (args.cur === (args.length - 1))) {
                    args._cNowPos = (args.warray[0] + (args.idWidth * 2));
                    args.noTransAnimate(args);
                    args._cNowPos = (args.warray[0] + args.idWidth);
                } else {
                    args._cNowPos = args.warray[args.cur];
                }
            } else {
                if (args.loop && (args.cur === args.length)) {
                    args._cNowPos = (args.warray[0] + args.idWidth);
                    args.noTransAnimate(args);
                    args._cNowPos = args.warray[args.cur];
                }
                args.cur = (!args.loop) ? args.length - 1 : 0;
                args._cNowPos = args.warray[args.cur];
            }
        } else {
            args.cur = (args._initFlag) ? args.cur : (args.cur - 1);
            if (args.cur > 0) {
                args._cNowPos = args.warray[args.cur];
                if (args.loop && (args.cur === (args.length - 2))) {
                    args._cNowPos = args.warray[(args.length - 1)];
                    args.noTransAnimate(args);
                    args._cNowPos = (args.warray[args.cur]);
                }
            } else if (args.cur <= 0) {
                if (args.loop && (args.cur < 0)) {
                    args.cur = (args.length - 1);
                    args._cNowPos = (args.warray[(args.length - 1)] - args.idWidth);
                    args.noTransAnimate(args);
                } else {
                    args.cur = 0;
                }
                args._cNowPos = args.warray[args.cur];
            }
        }
        setTimeout(function () {
            args.transAnimate(args);
        }, 1);
        args.btnCurrentAction();
        args.setLamps(args.cur);
        args._initFlag = false;
    },
    transAnimate: function (args) {
        if (/AppleWebKit/.test(args._ua)) {
            args.contents.style.webkitTransition = '-webkit-transform 0.3s ease-in-out';
            args.contents.style.webkitTransform = 'translate3d(' + args._cNowPos + 'px, 0, 0)';
        } else if (/Firefox/.test(args._ua)) {
            args.contents.style.MozTransition = '-moz-transform 0.3s ease-in-out';
            args.contents.style.MozTransform = 'translate3d(' + args._cNowPos + 'px, 0, 0)';
        }
        setTimeout(function () {
            args.moveCallback();
        }, 300);
    },
    noTransAnimate: function (args) {
        if (/AppleWebKit/.test(args._ua)) {
            args.contents.style.webkitTransition = 'none';
            args.contents.style.webkitTransform = 'translate3d(' + args._cNowPos + 'px, 0, 0)';
        } else if (/Firefox/.test(args._ua)) {
            args.contents.style.MozTransition = 'none';
            args.contents.style.MozTransform = 'translate3d(' + args._cNowPos + 'px, 0, 0)';
        }
    },
    btnCurrentAction: function () {
        if (this._btnFlag) {
            if (!this.loop) {
                if (this.cur <= 0) {
                    if (this.btnPrev.className.indexOf(this.btnActiveClassName) > 0) {
                        this.btnPrev.className = this.btnPrev.className.replace(this.btnActiveClassName, '');
                    }
                    if (this.btnNext.className.indexOf(this.btnActiveClassName) < 0)
                        this.btnNext.className += (' ' + this.btnActiveClassName);
                } else if (this.cur === this.length - 1) {
                    if (this.btnPrev.className.indexOf(this.btnActiveClassName) < 0)
                        this.btnPrev.className += (' ' + this.btnActiveClassName);
                    if (this.btnNext.className.indexOf(this.btnActiveClassName) > 0) {
                        this.btnNext.className = this.btnNext.className.replace(this.btnActiveClassName, '');
                    }
                } else {
                    if (this.btnPrev.className.indexOf(this.btnActiveClassName) < 0)
                        this.btnPrev.className += (' ' + this.btnActiveClassName);
                    if (this.btnNext.className.indexOf(this.btnActiveClassName) < 0)
                        this.btnNext.className += (' ' + this.btnActiveClassName);
                }
            } else {
                if (this.btnNext.className.indexOf(this.btnActiveClassName) < 0)
                    this.btnNext.className += (' ' + this.btnActiveClassName);
                if (this.btnPrev.className.indexOf(this.btnActiveClassName) < 0)
                    this.btnPrev.className += (' ' + this.btnActiveClassName);
            }
        }
    },
    clickPrevInit: function () {
        var self = this;
        this.btnPrev.addEventListener('click', function (e) {
            self._orien = false;
            self.animation(self);
            self.killAutoChange();
            setTimeout(function () {
                self.resetAutoChange();
            }, self.autoTimer);
        }, false);
    },
    clickNextInit: function () {
        var self = this;
        this.btnNext.addEventListener('click', function (e) {
            self._orien = true;
            self.animation(self);
            self.killAutoChange();
            setTimeout(function () {
                self.resetAutoChange();
            }, self.autoTimer);
        }, false);
    },
    resizeInit: function () {
        var self = this;
        var timer = false;
        window.addEventListener('resize', function () {
            if (timer !== false) {
                clearTimeout(timer);
            }
            timer = setTimeout(function () {
                self.domInit();
                self.animation(self);
                self.resetAutoChange();
            }, 200);
        }, false);
    },
    domInit: function () {
        this.id.style.width = 'auto';
        if (!this.isArgsWidth)
            this.idWidth = this.id.clientWidth;
        this.length = this.col.length;

        this.id.style.width = this.idWidth + 'px';

        if (!this.loop) {
            this.contents.style.width = this.getContentsWidth() + 'px';
        } else {
            this._totalWidth = this.getContentsWidth();
            this.contents.style.width = (this._totalWidth * this.cloneLength) + 'px';
            this.cloneNode(this.cloneLength);
            this.loopInitPos();
        }
    },
    createLamp: function () {
        var self = this;
        if (this.lamp) {
            for (var i = 0; i < this.length; i++) {
                this.lamps[i] = document.createElement('div');

                (function (l) {
                    self.lamps[l].addEventListener('click', function () {
                        if (self.autoChange)
                            self.killAutoChange();
                        self.cur = (self._orien) ? l - 1 : l + 1;
                        self.animation(self);
                        self.btnCurrentAction();
                        self.setLamps(self.cur);
                        if (self.autoChange)
                            self.autoChangeFunc();
                    }, false);
                })(i);

                this.lamp.appendChild(this.lamps[i]);
            }
        }
    },
    setLamps: function (num) {
        if (this.lamp) {
            for (var i = 0; i < this.length; i++) {
                this.lamps[i].setAttribute('class', '');
            }
            this.lamps[num].setAttribute('class', this.lampActiveClassName);
        }
    },
    getContentsWidth: function () {
        var totalWidth = 0;
        var cloneNode = {};
        for (var i = 0, L = this.length; i < L; i++) {
            var c = this.col[i];
            this.carray[i] = this.idWidth;
            this.warray[i] = -(totalWidth);
            totalWidth += this.idWidth;
        }
        return totalWidth;
    },
    loopInitPos: function () {
        for (var i = 0, L = this.length; i < L; i++) {
            this.warray[i] -= this._totalWidth;
        }
    },
    cloneNode: function (cloneNum) {
        cloneNum -= 1;
        for (var h = 0; h < cloneNum; h++) {
            for (var i = 0, L = this.length; i < L; i++) {
                var cloneElm = this.col[i].cloneNode(true);
                cloneElm.setAttribute('clone', 'clone');
                this.contents.appendChild(cloneElm);
            }
        }
    },
    autoChangeFunc: function () {
        if (!this.autoChangeFlag) {
            var self = this;
            this.autoTimerCache.push(setInterval(function () {
                self.autoChangeFlag = true;
                if (!self.loop) {
                    if (self.cur === self.length - 1) {
                        self._orien = false;
                        self.cur = 0;
                    } else {
                        self._orien = true;
                    }
                } else {
                    self._orien = true;
                }
                self.animation(self);
            }, this.autoTimer));
        }
    },
    resetAutoChange: function () {
        if (this.autoChange) {
            this.killAutoChange();
            this.autoChangeFunc();
        }
    },
    killAutoChange: function () {
        if (this.autoChange) {
            this.autoChangeFlag = false;
            for (var i = 0, L = this.autoTimerCache.length; i < L; i++) {
                clearInterval(this.autoTimerCache[i]);
                this.autoTimerCache.splice(i, 1);
            }
        }
    }
};
