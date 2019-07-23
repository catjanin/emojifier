(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["emojiList"],{

/***/ "./assets/js/emojiList.js":
/*!********************************!*\
  !*** ./assets/js/emojiList.js ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! core-js/modules/es.object.to-string */ "./node_modules/core-js/modules/es.object.to-string.js");

__webpack_require__(/*! core-js/modules/es.promise */ "./node_modules/core-js/modules/es.promise.js");

__webpack_require__(/*! regenerator-runtime/runtime */ "../../../node_modules/regenerator-runtime/runtime.js");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

module.exports = function () {
  this.getEmojis = function () {
    var request =
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var response, json;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return fetch('/getEmojis');

              case 2:
                response = _context.sent;
                _context.next = 5;
                return response.json();

              case 5:
                json = _context.sent;
                console.log(json);

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function request() {
        return _ref.apply(this, arguments);
      };
    }();

    request();
  };
};

/***/ })

},[["./assets/js/emojiList.js","runtime","vendors~canvasLogic~emojiGet~emojiList~emojiSearch~gallerySearch~modalUpload~nearestColor~numInc","vendors~canvasLogic~emojiList~emojiSearch~modalUpload","vendors~emojiList"]]]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvanMvZW1vamlMaXN0LmpzIl0sIm5hbWVzIjpbIm1vZHVsZSIsImV4cG9ydHMiLCJnZXRFbW9qaXMiLCJyZXF1ZXN0IiwiZmV0Y2giLCJyZXNwb25zZSIsImpzb24iLCJjb25zb2xlIiwibG9nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUFBLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQixZQUFXO0FBRXhCLE9BQUtDLFNBQUwsR0FBaUIsWUFBTTtBQUVuQixRQUFNQyxPQUFPO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSw4QkFBRztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHVCQUNXQyxLQUFLLENBQUMsWUFBRCxDQURoQjs7QUFBQTtBQUNOQyx3QkFETTtBQUFBO0FBQUEsdUJBRU9BLFFBQVEsQ0FBQ0MsSUFBVCxFQUZQOztBQUFBO0FBRU5BLG9CQUZNO0FBR1pDLHVCQUFPLENBQUNDLEdBQVIsQ0FBWUYsSUFBWjs7QUFIWTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxPQUFIOztBQUFBLHNCQUFQSCxPQUFPO0FBQUE7QUFBQTtBQUFBLE9BQWI7O0FBTUFBLFdBQU87QUFFVixHQVZEO0FBV0gsQ0FiRCxDIiwiZmlsZSI6ImVtb2ppTGlzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG5cbiAgICB0aGlzLmdldEVtb2ppcyA9ICgpID0+IHtcblxuICAgICAgICBjb25zdCByZXF1ZXN0ID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCgnL2dldEVtb2ppcycpO1xuICAgICAgICAgICAgY29uc3QganNvbiA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGpzb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVxdWVzdCgpO1xuXG4gICAgfVxufTtcblxuIl0sInNvdXJjZVJvb3QiOiIifQ==