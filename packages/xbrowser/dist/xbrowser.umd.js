(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.xbrowser = {}));
}(this, (function (exports) { 'use strict';

  function formatDate(fmt, date) {
      var ret;
      var opt = {
          "Y+": date.getFullYear().toString(),
          "m+": (date.getMonth() + 1).toString(),
          "d+": date.getDate().toString(),
          "H+": date.getHours().toString(),
          "M+": date.getMinutes().toString(),
          "S+": date.getSeconds().toString(),
      };
      for (var k in opt) {
          ret = new RegExp("(" + k + ")").exec(fmt);
          if (ret) {
              fmt = fmt.replace(ret[1], ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0"));
          }
      }
      return fmt;
  }

  var toFixed = function (num, n) {
      if (n > 20 || n < 0) {
          throw new RangeError("toFixed() digits argument must be between 0 and 20");
      }
      var number = num;
      if (isNaN(number) || number >= Math.pow(10, 21)) {
          return number.toString();
      }
      if (typeof n == "undefined" || n == 0) {
          return Math.round(number).toString();
      }
      var result = number.toString();
      var arr = result.split(".");
      if (arr.length < 2) {
          result += ".";
          for (var i = 0; i < n; i += 1) {
              result += "0";
          }
          return result;
      }
      var integer = arr[0];
      var decimal = arr[1];
      if (decimal.length == n) {
          return result;
      }
      if (decimal.length < n) {
          for (var i = 0; i < n - decimal.length; i += 1) {
              result += "0";
          }
          return result;
      }
      result = integer + "." + decimal.substr(0, n);
      var last = decimal.substr(n, 1);
      if (parseInt(last, 10) >= 5) {
          var x = Math.pow(10, n);
          result = (Math.round(parseFloat(result) * x) + 1) / x;
          result = result.toFixed(n);
      }
      return result;
  };

  var testMobile = function (str) {
      return /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/gi.test(str);
  };
  var matchMobile = function (str) {
      return str.match(/[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}/gi);
  };

  function getQueryByKey(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.search.substr(1).match(reg);
      if (r !== null)
          return decodeURIComponent(r[2]);
      return null;
  }

  exports.formatDate = formatDate;
  exports.getQueryByKey = getQueryByKey;
  exports.matchMobile = matchMobile;
  exports.testMobile = testMobile;
  exports.toFixed = toFixed;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
