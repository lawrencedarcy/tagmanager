/* */ 
(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;
        if (!u && a)
          return a(o, !0);
        if (i)
          return i(o, !0);
        throw new Error("Cannot find module '" + o + "'");
      }
      var f = n[o] = {exports: {}};
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n ? n : e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = typeof require == "function" && require;
  for (var o = 0; o < r.length; o++)
    s(r[o]);
  return s;
})({
  1: [function(require, module, exports) {
    "use strict";
    var _prototypeProperties = function(child, staticProps, instanceProps) {
      if (staticProps)
        Object.defineProperties(child, staticProps);
      if (instanceProps)
        Object.defineProperties(child.prototype, instanceProps);
    };
    var mixins = require('../../../smart-mixin@1.2.1');
    var mixIntoGameObject = mixins({
      render: mixins.ONCE,
      onClick: mixins.MANY,
      getState: mixins.MANY_MERGED,
      getSomething: mixins.MANY_MERGED_LOOSE,
      countChickens: mixins.REDUCE_LEFT,
      countDucks: mixins.REDUCE_RIGHT,
      onKeyPress: function(left, right, key) {
        left = left || function() {};
        right = right || function() {};
        return function(args, thrower) {
          var event = args[0];
          if (!event)
            thrower(TypeError(key + " called without an event object"));
          var ret = left.apply(this, args);
          if (event && !event.immediatePropagationIsStopped) {
            var ret2 = right.apply(this, args);
          }
          return ret || ret2;
        };
      }
    }, {
      unknownFunction: mixins.ONCE,
      nonFunctionProperty: "INTERNAL"
    });
    var mixin = {getState: function getState(foo) {
        return {bar: foo + 1};
      }};
    var Duck = (function() {
      function Duck() {}
      _prototypeProperties(Duck, null, {
        render: {
          value: function render() {
            console.log(this.getState(5));
          },
          writable: true,
          configurable: true
        },
        getState: {
          value: function getState(foo) {
            return {baz: foo - 1};
          },
          writable: true,
          configurable: true
        }
      });
      return Duck;
    })();
    mixIntoGameObject(Duck.prototype, mixin);
    new Duck().render();
  }, {"../..": 2}],
  2: [function(require, module, exports) {
    "use strict";
    var objToStr = function(x) {
      return Object.prototype.toString.call(x);
    };
    var mixins = module.exports = function makeMixinFunction(rules, _opts) {
      var opts = _opts || {};
      if (!opts.unknownFunction) {
        opts.unknownFunction = mixins.ONCE;
      }
      if (!opts.nonFunctionProperty) {
        opts.nonFunctionProperty = function(left, right, key) {
          if (left !== undefined && right !== undefined) {
            var getTypeName = function(obj) {
              if (obj && obj.constructor && obj.constructor.name) {
                return obj.constructor.name;
              } else {
                return objToStr(obj).slice(8, -1);
              }
            };
            throw new TypeError("Cannot mixin key " + key + " because it is provided by multiple sources, " + "and the types are " + getTypeName(left) + " and " + getTypeName(right));
          }
        };
      }
      var thrower = function(error) {
        throw error;
      };
      return function applyMixin(source, mixin) {
        Object.keys(mixin).forEach(function(key) {
          var left = source[key],
              right = mixin[key],
              rule = rules[key];
          if (left === undefined && right === undefined)
            return;
          var wrapIfFunction = function(thing) {
            return typeof thing !== "function" ? thing : function() {
              return thing.call(this, arguments, thrower);
            };
          };
          if (rule) {
            var fn = rule(left, right, key);
            source[key] = wrapIfFunction(fn);
            return;
          }
          var leftIsFn = typeof left === "function";
          var rightIsFn = typeof right === "function";
          if (leftIsFn && right === undefined || rightIsFn && left === undefined || leftIsFn && rightIsFn) {
            source[key] = wrapIfFunction(opts.unknownFunction(left, right, key));
            return;
          }
          source[key] = opts.nonFunctionProperty(left, right, key);
        });
      };
    };
    mixins.ONCE = function(left, right, key) {
      if (left && right) {
        throw new TypeError("Cannot mixin " + key + " because it has a unique constraint.");
      }
      var fn = left || right;
      return function(args) {
        return fn.apply(this, args);
      };
    };
    mixins.MANY = function(left, right, key) {
      return function(args) {
        if (right)
          right.apply(this, args);
        return left ? left.apply(this, args) : undefined;
      };
    };
    mixins.MANY_MERGED = function(left, right, key) {
      return function(args, thrower) {
        var res1 = right && right.apply(this, args);
        var res2 = left && left.apply(this, args);
        if (res1 && res2) {
          var assertObject = function(obj, obj2) {
            var type = objToStr(obj);
            if (type !== "[object Object]") {
              var displayType = obj.constructor ? obj.constructor.name : "Unknown";
              var displayType2 = obj2.constructor ? obj2.constructor.name : "Unknown";
              thrower("cannot merge returned value of type " + displayType + " with an " + displayType2);
            }
          };
          assertObject(res1, res2);
          assertObject(res2, res1);
          var result = {};
          Object.keys(res1).forEach(function(k) {
            if (Object.prototype.hasOwnProperty.call(res2, k)) {
              thrower("cannot merge returns because both have the " + JSON.stringify(k) + " key");
            }
            result[k] = res1[k];
          });
          Object.keys(res2).forEach(function(k) {
            result[k] = res2[k];
          });
          return result;
        }
        return res2 || res1;
      };
    };
    mixins.REDUCE_LEFT = function(_left, _right, key) {
      var left = _left || function() {
        return x;
      };
      var right = _right || function(x) {
        return x;
      };
      return function(args) {
        return right.call(this, left.apply(this, args));
      };
    };
    mixins.REDUCE_RIGHT = function(_left, _right, key) {
      var left = _left || function() {
        return x;
      };
      var right = _right || function(x) {
        return x;
      };
      return function(args) {
        return left.call(this, right.apply(this, args));
      };
    };
  }, {}]
}, {}, [1]);
