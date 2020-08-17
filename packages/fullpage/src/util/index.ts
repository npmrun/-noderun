export function Scroll(up: Function, down: Function) {
  //兼容性写法，该函数也是网上别人写的，不过找不到出处了，蛮好的，所有我也没有必要修改了
  //判断鼠标滚轮滚动方向
  if (window.addEventListener) {
    //FF,火狐浏览器会识别该方法
    window.addEventListener("DOMMouseScroll", wheel, false);
  }
  window.onmousewheel = (<any>document).onmousewheel = wheel; //W3C
  //统一处理滚轮滚动事件
  function wheel(event: any) {
    var delta = 0;
    if (!event) event = window.event;
    if (event.wheelDelta) {
      //IE、chrome浏览器使用的是wheelDelta，并且值为“正负120”
      delta = event.wheelDelta / 120;
      if ((<any>window).opera) delta = -delta; //因为IE、chrome等向下滚动是负值，FF是正值，为了处理一致性，在此取反处理
    } else if (event.detail) {
      //FF浏览器使用的是detail,其值为“正负3”
      delta = -event.detail / 3;
    }
    if (delta) handle(delta);
  }
  //上下滚动时的具体处理函数
  function handle(delta: number) {
    if (delta < 0) {
      //向下滚动
      down(delta);
    } 
    if (delta > 0) {
      //向上滚动
      up(delta);
    }
  }
}

export function debounce(fn:Function,context: any, delay:number) {
  var delay = delay || 200;
  var timer:NodeJS.Timeout|null;
  return function() {
    var args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function() {
      timer = null;
      fn.apply(context, args);
    }, delay);
  };
},

export function throttle(
  method: Function,
  context: any,
  delay: number
): Function {
  let wait = false;
  return function (...args: []) {
    if (!wait) {
      method.apply(context, args);
      wait = true;
      setTimeout(() => {
        wait = false;
      }, delay);
    }
  };
}

export function onresize(fn:Function, context:any) {
  window.addEventListener(
    "resize",
    function () {
      fn.apply(context);
    },
    false
  );
}

export function touch(up: Function, down: Function) {
  let toTop = 0;
  let toMove = 0;
  window.addEventListener(
    "touchstart",
    function (event) {
      toTop = event.touches[0].clientY; // 距离顶部高度
    },
    false
  );
  window.addEventListener(
    "touchmove",
    function (event) {
      toMove = event.touches[0].clientY;
      let delta = toMove - toTop;
      if (Math.abs(delta) > 50) {
        if (delta < 0) {
          //向下滚动
          down(delta);
        } else {
          //向上滚动
          up(delta);
        }
      }
    },
    false
  );
}
