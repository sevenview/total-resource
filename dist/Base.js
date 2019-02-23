"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _inflection = _interopRequireDefault(require("inflection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classPrivateFieldGet(receiver, privateMap) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } var descriptor = privateMap.get(receiver); if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to set private field on non-instance"); } var descriptor = privateMap.get(receiver); if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

var Base =
/*#__PURE__*/
function () {
  _createClass(Base, null, [{
    key: "echo",
    value: function echo(text) {
      console.log(text);
    }
  }]);

  function Base(_params2) {
    _classCallCheck(this, Base);

    _params.set(this, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(this, _params, _params2);
  }

  _createClass(Base, [{
    key: "attributes",
    value: function attributes(_attributes) {
      var _this = this;

      _attributes.forEach(function (attribute) {
        _this[attribute] = _classPrivateFieldGet(_this, _params)[attribute];
      });
    }
  }, {
    key: "hasMany",
    value: function hasMany(resource, Model) {
      var _this2 = this;

      if (_classPrivateFieldGet(this, _params)[resource]) {
        this[resource] = [];

        _classPrivateFieldGet(this, _params)[resource].forEach(function (item) {
          _this2[resource].push(new Model(item));
        });
      }
    }
  }, {
    key: "belongsTo",
    value: function belongsTo(resource, Model) {
      if (_classPrivateFieldGet(this, _params)[resource]) {
        this[resource] = new Model(_classPrivateFieldGet(this, _params)[resource]);
      }
    }
  }], [{
    key: "find",
    value: function () {
      var _find = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(id) {
        var _this3 = this;

        var resource;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                console.log('FOOFY', this.resourceName);
                resource = null;
                _context.next = 4;
                return axios.get("/".concat(this.resourceNamePlural, "/").concat(id)).then(function (response) {
                  resource = new _this3(response.data[_this3.resourceName]);
                });

              case 4:
                return _context.abrupt("return", resource);

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function find(_x) {
        return _find.apply(this, arguments);
      }

      return find;
    }()
  }, {
    key: "all",
    value: function () {
      var _all = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2() {
        var _this4 = this;

        var resources;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                console.log('FOOFY', this.resourceName);
                resources = [];
                _context2.next = 4;
                return axios.get("/".concat(this.resourceNamePlural)).then(function (response) {
                  response.data[_this4.resourceNamePlural].forEach(function (item) {
                    resources.push(new _this4(item));
                  });
                });

              case 4:
                return _context2.abrupt("return", resources);

              case 5:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function all() {
        return _all.apply(this, arguments);
      }

      return all;
    }()
  }, {
    key: "resourceName",
    get: function get() {
      return this.className.toLowerCase();
    }
  }, {
    key: "resourceNamePlural",
    get: function get() {
      return _inflection.default.pluralize(this.resourceName);
    }
  }]);

  return Base;
}();

var _params = new WeakMap();

var _default = Base;
exports.default = _default;