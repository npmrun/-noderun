'use strict';

function Scroll(up, down) {
    if (window.addEventListener) {
        window.addEventListener("DOMMouseScroll", wheel, false);
    }
    window.onmousewheel = document.onmousewheel = wheel;
    function wheel(event) {
        var delta = 0;
        if (!event)
            event = window.event;
        if (event.wheelDelta) {
            delta = event.wheelDelta / 120;
            if (window.opera)
                delta = -delta;
        }
        else if (event.detail) {
            delta = -event.detail / 3;
        }
        if (delta)
            handle(delta);
    }
    function handle(delta) {
        if (delta < 0) {
            down(delta);
        }
        else {
            up(delta);
        }
    }
}
function debounce(fn, context, delay) {
    var delay = delay || 200;
    var timer;
    return function () {
        var args = arguments;
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(function () {
            timer = null;
            fn.apply(context, args);
        }, delay);
    };
}
function throttle(method, context, delay) {
    var wait = false;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!wait) {
            method.apply(context, args);
            wait = true;
            setTimeout(function () {
                wait = false;
            }, delay);
        }
    };
}
function onresize(fn, context) {
    window.addEventListener("resize", function () {
        fn.apply(context);
    }, false);
}
function touch(up, down) {
    var toTop = 0;
    var toMove = 0;
    window.addEventListener("touchstart", function (event) {
        toTop = event.touches[0].clientY;
    }, false);
    window.addEventListener("touchmove", function (event) {
        toMove = event.touches[0].clientY;
        var delta = toMove - toTop;
        if (Math.abs(delta) > 50) {
            if (delta < 0) {
                down(delta);
            }
            else {
                up(delta);
            }
        }
    }, false);
}
//# sourceMappingURL=index.js.map

var FullScroll = (function () {
    function FullScroll(config) {
        this.el = null;
        this.config = { el: '', scrollCB: function () { } };
        this.cb = function () { };
        this.indicatorElement = null;
        this.width = 0;
        this.height = 0;
        this.current = 0;
        this.pages = 0;
        this.debounceInit = debounce(this.init, this, 200);
        this.el = document.querySelector(config.el + '>.box');
        this.config = config;
        if (!this.el) {
            throw new Error("不存在该元素！");
        }
        this.cb = config.scrollCB;
        this.debounceInit();
        var tup = throttle(this.up, this, 500);
        var tdown = throttle(this.down, this, 500);
        Scroll(tup, tdown);
        touch(tup, tdown);
        onresize(this.debounceInit, this);
    }
    FullScroll.prototype.initIndicator = function () {
        var config = this.config;
        this.indicatorElement = document.querySelector(config.el + "> .indicator");
        if (!this.indicatorElement) {
            return;
        }
        var len = this.pages;
        console.log(len);
        for (var i = 0; i < len; i++) {
            this.indicatorElement.appendChild(document.createElement("div"));
        }
    };
    FullScroll.prototype.init = function () {
        var _this = this;
        this.pages = 0;
        this.height = 0;
        this.width = 0;
        setTimeout(function () {
            document.body.style.overflow = "hidden";
            _this.width = document.documentElement.clientWidth;
            _this.height = document.documentElement.clientHeight;
            console.log(_this.height);
            _this.el.style.height = _this.height + "px";
            _this.el.style.transition = "transform .5s";
            var child = _this.el.querySelectorAll(".block");
            for (var i = 0; i < child.length; i++) {
                var element = child[i];
                element.style.height = "100%";
                element.style.width = "100%";
            }
            _this.pages = child.length;
            _this.initIndicator();
            _this.el.style.transform = "translateY(-" + _this.height * _this.current + "px)";
            _this.cb(_this.current, _this.current);
        }, 200);
    };
    FullScroll.prototype.up = function (delta) {
        var last = this.current;
        var next = (this.current = this.current - 1);
        if (next >= this.pages)
            this.current = this.pages - 1;
        if (next < 0)
            this.current = 0;
        if (last != this.current) {
            this.el.style.transform = "translateY(-" + this.height * this.current + "px)";
            this.cb(this.current, last);
        }
    };
    FullScroll.prototype.down = function (delta) {
        var last = this.current;
        var next = (this.current = this.current + 1);
        if (next >= this.pages)
            this.current = this.pages - 1;
        if (next < 0)
            this.current = 0;
        if (last != this.current) {
            this.el.style.transform = "translateY(-" + this.height * this.current + "px)";
            this.cb(this.current, last);
        }
    };
    return FullScroll;
}());

module.exports = FullScroll;
