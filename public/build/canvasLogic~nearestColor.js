(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["canvasLogic~nearestColor"],{

/***/ "./assets/js/nearestColor.js":
/*!***********************************!*\
  !*** ./assets/js/nearestColor.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {__webpack_require__(/*! core-js/modules/es.symbol */ "./node_modules/core-js/modules/es.symbol.js");

__webpack_require__(/*! core-js/modules/es.symbol.description */ "./node_modules/core-js/modules/es.symbol.description.js");

__webpack_require__(/*! core-js/modules/es.symbol.iterator */ "./node_modules/core-js/modules/es.symbol.iterator.js");

__webpack_require__(/*! core-js/modules/es.array.concat */ "./node_modules/core-js/modules/es.array.concat.js");

__webpack_require__(/*! core-js/modules/es.array.iterator */ "./node_modules/core-js/modules/es.array.iterator.js");

__webpack_require__(/*! core-js/modules/es.array.map */ "./node_modules/core-js/modules/es.array.map.js");

__webpack_require__(/*! core-js/modules/es.date.to-string */ "./node_modules/core-js/modules/es.date.to-string.js");

__webpack_require__(/*! core-js/modules/es.function.name */ "./node_modules/core-js/modules/es.function.name.js");

__webpack_require__(/*! core-js/modules/es.number.constructor */ "./node_modules/core-js/modules/es.number.constructor.js");

__webpack_require__(/*! core-js/modules/es.object.keys */ "./node_modules/core-js/modules/es.object.keys.js");

__webpack_require__(/*! core-js/modules/es.object.to-string */ "./node_modules/core-js/modules/es.object.to-string.js");

__webpack_require__(/*! core-js/modules/es.parse-int */ "./node_modules/core-js/modules/es.parse-int.js");

__webpack_require__(/*! core-js/modules/es.regexp.exec */ "./node_modules/core-js/modules/es.regexp.exec.js");

__webpack_require__(/*! core-js/modules/es.regexp.to-string */ "./node_modules/core-js/modules/es.regexp.to-string.js");

__webpack_require__(/*! core-js/modules/es.string.iterator */ "./node_modules/core-js/modules/es.string.iterator.js");

__webpack_require__(/*! core-js/modules/es.string.match */ "./node_modules/core-js/modules/es.string.match.js");

__webpack_require__(/*! core-js/modules/web.dom-collections.iterator */ "./node_modules/core-js/modules/web.dom-collections.iterator.js");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function (context) {
  /**
   * Defines an available color.
   *
   * @typedef {Object} ColorSpec
   * @property {string=} name A name for the color, e.g., 'red'
   * @property {string} source The hex-based color string, e.g., '#FF0'
   * @property {RGB} rgb The {@link RGB} color values
   */

  /**
   * Describes a matched color.
   *
   * @typedef {Object} ColorMatch
   * @property {string} name The name of the matched color, e.g., 'red'
   * @property {string} value The hex-based color string, e.g., '#FF0'
   * @property {RGB} rgb The {@link RGB} color values.
   */

  /**
   * Provides the RGB breakdown of a color.
   *
   * @typedef {Object} RGB
   * @property {number} r The red component, from 0 to 255
   * @property {number} g The green component, from 0 to 255
   * @property {number} b The blue component, from 0 to 255
   */

  /**
   * Gets the nearest color, from the given list of {@link ColorSpec} objects
   * (which defaults to {@link nearestColor.DEFAULT_COLORS}).
   *
   * Probably you wouldn't call this method directly. Instead you'd get a custom
   * color matcher by calling {@link nearestColor.from}.
   *
   * @public
   * @param {RGB|string} needle Either an {@link RGB} color or a hex-based
   *     string representing one, e.g., '#FF0'
   * @param {Array.<ColorSpec>=} colors An optional list of available colors
   *     (defaults to {@link nearestColor.DEFAULT_COLORS})
   * @return {ColorMatch|string} If the colors in the provided list had names,
   *     then a {@link ColorMatch} object with the name and (hex) value of the
   *     nearest color from the list. Otherwise, simply the hex value.
   *
   * @example
   * nearestColor({ r: 200, g: 50, b: 50 }); // => '#f00'
   * nearestColor('#f11');                   // => '#f00'
   * nearestColor('#f88');                   // => '#f80'
   * nearestColor('#ffe');                   // => '#ff0'
   * nearestColor('#efe');                   // => '#ff0'
   * nearestColor('#abc');                   // => '#808'
   * nearestColor('red');                    // => '#f00'
   * nearestColor('foo');                    // => throws
   */
  function nearestColor(needle, colors) {
    needle = parseColor(needle);

    if (!needle) {
      return null;
    }

    var distanceSq,
        minDistanceSq = Infinity,
        rgb,
        value;
    colors || (colors = nearestColor.DEFAULT_COLORS);

    for (var i = 0; i < colors.length; ++i) {
      rgb = colors[i].rgb;
      distanceSq = Math.pow(needle.r - rgb.r, 2) + Math.pow(needle.g - rgb.g, 2) + Math.pow(needle.b - rgb.b, 2);

      if (distanceSq < minDistanceSq) {
        minDistanceSq = distanceSq;
        value = colors[i];
      }
    }

    if (value.name) {
      return {
        name: value.name,
        value: value.source,
        rgb: value.rgb,
        distance: Math.sqrt(minDistanceSq)
      };
    }

    return value.source;
  }
  /**
   * Provides a matcher to find the nearest color based on the provided list of
   * available colors.
   *
   * @public
   * @param {Array.<string>|Object} availableColors An array of hex-based color
   *     strings, or an object mapping color *names* to hex values.
   * @return {function(string):ColorMatch|string} A function with the same
   *     behavior as {@link nearestColor}, but with the list of colors
   *     predefined.
   *
   * @example
   * var colors = {
   *   'maroon': '#800',
   *   'light yellow': { r: 255, g: 255, b: 51 },
   *   'pale blue': '#def',
   *   'white': 'fff'
   * };
   *
   * var bgColors = [
   *   '#eee',
   *   '#444'
   * ];
   *
   * var invalidColors = {
   *   'invalid': 'foo'
   * };
   *
   * var getColor = nearestColor.from(colors);
   * var getBGColor = getColor.from(bgColors);
   * var getAnyColor = nearestColor.from(colors).or(bgColors);
   *
   * getColor('ffe');
   * // => { name: 'white', value: 'fff', rgb: { r: 255, g: 255, b: 255 }, distance: 17}
   *
   * getColor('#f00');
   * // => { name: 'maroon', value: '#800', rgb: { r: 136, g: 0, b: 0 }, distance: 119}
   *
   * getColor('#ff0');
   * // => { name: 'light yellow', value: '#ffff33', rgb: { r: 255, g: 255, b: 51 }, distance: 51}
   *
   * getBGColor('#fff'); // => '#eee'
   * getBGColor('#000'); // => '#444'
   *
   * getAnyColor('#f00');
   * // => { name: 'maroon', value: '#800', rgb: { r: 136, g: 0, b: 0 }, distance: 119}
   *
   * getAnyColor('#888'); // => '#444'
   *
   * nearestColor.from(invalidColors); // => throws
   */


  nearestColor.from = function from(availableColors) {
    var colors = mapColors(availableColors),
        nearestColorBase = nearestColor;

    var matcher = function nearestColor(hex) {
      return nearestColorBase(hex, colors);
    }; // Keep the 'from' method, to support changing the list of available colors
    // multiple times without needing to keep a reference to the original
    // nearestColor function.


    matcher.from = from; // Also provide a way to combine multiple color lists.

    matcher.or = function or(alternateColors) {
      var extendedColors = colors.concat(mapColors(alternateColors));
      return nearestColor.from(extendedColors);
    };

    return matcher;
  };
  /**
   * Given either an array or object of colors, returns an array of
   * {@link ColorSpec} objects (with {@link RGB} values).
   *
   * @private
   * @param {Array.<string>|Object} colors An array of hex-based color strings, or
   *     an object mapping color *names* to hex values.
   * @return {Array.<ColorSpec>} An array of {@link ColorSpec} objects
   *     representing the same colors passed in.
   */


  function mapColors(colors) {
    if (colors instanceof Array) {
      return colors.map(function (color) {
        return createColorSpec(color);
      });
    }

    return Object.keys(colors).map(function (name) {
      return createColorSpec(colors[name], name);
    });
  }

  ;
  /**
   * Parses a color from a string.
   *
   * @private
   * @param {RGB|string} source
   * @return {RGB}
   *
   * @example
   * parseColor({ r: 3, g: 22, b: 111 }); // => { r: 3, g: 22, b: 111 }
   * parseColor('#f00');                  // => { r: 255, g: 0, b: 0 }
   * parseColor('#04fbc8');               // => { r: 4, g: 251, b: 200 }
   * parseColor('#FF0');                  // => { r: 255, g: 255, b: 0 }
   * parseColor('rgb(3, 10, 100)');       // => { r: 3, g: 10, b: 100 }
   * parseColor('rgb(50%, 0%, 50%)');     // => { r: 128, g: 0, b: 128 }
   * parseColor('aqua');                  // => { r: 0, g: 255, b: 255 }
   * parseColor('fff');                   // => { r: 255, g: 255, b: 255 }
   * parseColor('foo');                   // => throws
   */

  function parseColor(source) {
    var red, green, blue;

    if (_typeof(source) === 'object') {
      return source;
    }

    if (source in nearestColor.STANDARD_COLORS) {
      return parseColor(nearestColor.STANDARD_COLORS[source]);
    }

    var hexMatch = source.match(/^#?((?:[0-9a-f]{3}){1,2})$/i);

    if (hexMatch) {
      hexMatch = hexMatch[1];

      if (hexMatch.length === 3) {
        hexMatch = [hexMatch.charAt(0) + hexMatch.charAt(0), hexMatch.charAt(1) + hexMatch.charAt(1), hexMatch.charAt(2) + hexMatch.charAt(2)];
      } else {
        hexMatch = [hexMatch.substring(0, 2), hexMatch.substring(2, 4), hexMatch.substring(4, 6)];
      }

      red = parseInt(hexMatch[0], 16);
      green = parseInt(hexMatch[1], 16);
      blue = parseInt(hexMatch[2], 16);
      return {
        r: red,
        g: green,
        b: blue
      };
    }

    var rgbMatch = source.match(/^rgb\(\s*(\d{1,3}%?),\s*(\d{1,3}%?),\s*(\d{1,3}%?)\s*\)$/i);

    if (rgbMatch) {
      red = parseComponentValue(rgbMatch[1]);
      green = parseComponentValue(rgbMatch[2]);
      blue = parseComponentValue(rgbMatch[3]);
      return {
        r: red,
        g: green,
        b: blue
      };
    }

    throw Error('"' + source + '" is not a valid color');
  }
  /**
   * Creates a {@link ColorSpec} from either a string or an {@link RGB}.
   *
   * @private
   * @param {string|RGB} input
   * @param {string=} name
   * @return {ColorSpec}
   *
   * @example
   * createColorSpec('#800'); // => {
   *   source: '#800',
   *   rgb: { r: 136, g: 0, b: 0 }
   * }
   *
   * createColorSpec('#800', 'maroon'); // => {
   *   name: 'maroon',
   *   source: '#800',
   *   rgb: { r: 136, g: 0, b: 0 }
   * }
   */


  function createColorSpec(input, name) {
    var color = {};

    if (name) {
      color.name = name;
    }

    if (typeof input === 'string') {
      color.source = input;
      color.rgb = parseColor(input);
    } else if (_typeof(input) === 'object') {
      // This is for if/when we're concatenating lists of colors.
      if (input.source) {
        return createColorSpec(input.source, input.name);
      }

      color.rgb = input;
      color.source = rgbToHex(input);
    }

    return color;
  }
  /**
   * Parses a value between 0-255 from a string.
   *
   * @private
   * @param {string} string
   * @return {number}
   *
   * @example
   * parseComponentValue('100');  // => 100
   * parseComponentValue('100%'); // => 255
   * parseComponentValue('50%');  // => 128
   */


  function parseComponentValue(string) {
    if (string.charAt(string.length - 1) === '%') {
      return Math.round(parseInt(string, 10) * 255 / 100);
    }

    return Number(string);
  }
  /**
   * Converts an {@link RGB} color to its hex representation.
   *
   * @private
   * @param {RGB} rgb
   * @return {string}
   *
   * @example
   * rgbToHex({ r: 255, g: 128, b: 0 }); // => '#ff8000'
   */


  function rgbToHex(rgb) {
    return '#' + leadingZero(rgb.r.toString(16)) + leadingZero(rgb.g.toString(16)) + leadingZero(rgb.b.toString(16));
  }
  /**
   * Puts a 0 in front of a numeric string if it's only one digit. Otherwise
   * nothing (just returns the value passed in).
   *
   * @private
   * @param {string} value
   * @return
   *
   * @example
   * leadingZero('1');  // => '01'
   * leadingZero('12'); // => '12'
   */


  function leadingZero(value) {
    if (value.length === 1) {
      value = '0' + value;
    }

    return value;
  }
  /**
   * A map from the names of standard CSS colors to their hex values.
   */


  nearestColor.STANDARD_COLORS = {
    aqua: '#0ff',
    black: '#000',
    blue: '#00f',
    fuchsia: '#f0f',
    gray: '#808080',
    green: '#008000',
    lime: '#0f0',
    maroon: '#800000',
    navy: '#000080',
    olive: '#808000',
    orange: '#ffa500',
    purple: '#800080',
    red: '#f00',
    silver: '#c0c0c0',
    teal: '#008080',
    white: '#fff',
    yellow: '#ff0'
  };
  /**
   * Default colors. Comprises the colors of the rainbow (good ol' ROY G. BIV).
   * This list will be used for calls to {@nearestColor} that don't specify a list
   * of available colors to match.
   */

  nearestColor.DEFAULT_COLORS = mapColors(['#f00', // r
  '#f80', // o
  '#ff0', // y
  '#0f0', // g
  '#00f', // b
  '#008', // i
  '#808' // v
  ]);
  nearestColor.VERSION = '0.4.4';

  if (( false ? undefined : _typeof(module)) === 'object' && module && module.exports) {
    module.exports = nearestColor;
  } else {
    context.nearestColor = nearestColor;
  }
})(this);
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/module.js */ "./node_modules/webpack/buildin/module.js")(module)))

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvanMvbmVhcmVzdENvbG9yLmpzIl0sIm5hbWVzIjpbImNvbnRleHQiLCJuZWFyZXN0Q29sb3IiLCJuZWVkbGUiLCJjb2xvcnMiLCJwYXJzZUNvbG9yIiwiZGlzdGFuY2VTcSIsIm1pbkRpc3RhbmNlU3EiLCJJbmZpbml0eSIsInJnYiIsInZhbHVlIiwiREVGQVVMVF9DT0xPUlMiLCJpIiwibGVuZ3RoIiwiTWF0aCIsInBvdyIsInIiLCJnIiwiYiIsIm5hbWUiLCJzb3VyY2UiLCJkaXN0YW5jZSIsInNxcnQiLCJmcm9tIiwiYXZhaWxhYmxlQ29sb3JzIiwibWFwQ29sb3JzIiwibmVhcmVzdENvbG9yQmFzZSIsIm1hdGNoZXIiLCJoZXgiLCJvciIsImFsdGVybmF0ZUNvbG9ycyIsImV4dGVuZGVkQ29sb3JzIiwiY29uY2F0IiwiQXJyYXkiLCJtYXAiLCJjb2xvciIsImNyZWF0ZUNvbG9yU3BlYyIsIk9iamVjdCIsImtleXMiLCJyZWQiLCJncmVlbiIsImJsdWUiLCJTVEFOREFSRF9DT0xPUlMiLCJoZXhNYXRjaCIsIm1hdGNoIiwiY2hhckF0Iiwic3Vic3RyaW5nIiwicGFyc2VJbnQiLCJyZ2JNYXRjaCIsInBhcnNlQ29tcG9uZW50VmFsdWUiLCJFcnJvciIsImlucHV0IiwicmdiVG9IZXgiLCJzdHJpbmciLCJyb3VuZCIsIk51bWJlciIsImxlYWRpbmdaZXJvIiwidG9TdHJpbmciLCJhcXVhIiwiYmxhY2siLCJmdWNoc2lhIiwiZ3JheSIsImxpbWUiLCJtYXJvb24iLCJuYXZ5Iiwib2xpdmUiLCJvcmFuZ2UiLCJwdXJwbGUiLCJzaWx2ZXIiLCJ0ZWFsIiwid2hpdGUiLCJ5ZWxsb3ciLCJWRVJTSU9OIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUMsV0FBU0EsT0FBVCxFQUFrQjtBQUVmOzs7Ozs7Ozs7QUFTQTs7Ozs7Ozs7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NUI7QUFDUixRQUpvQyxFQUk1QjtBQUNSLFFBTG9DLEVBSzVCO0FBQ1IsUUFOb0MsRUFNNUI7QUFDUixRQVBvQyxDQU81QjtBQVA0QixHQUFELENBQXZDO0FBVUF2QixjQUFZLENBQUNzRSxPQUFiLEdBQXVCLE9BQXZCOztBQUVBLE1BQUksOEJBQU9DLE1BQVAsT0FBa0IsUUFBbEIsSUFBOEJBLE1BQTlCLElBQXdDQSxNQUFNLENBQUNDLE9BQW5ELEVBQTREO0FBQ3hERCxVQUFNLENBQUNDLE9BQVAsR0FBaUJ4RSxZQUFqQjtBQUNILEdBRkQsTUFFTztBQUNIRCxXQUFPLENBQUNDLFlBQVIsR0FBdUJBLFlBQXZCO0FBQ0g7QUFFSixDQWxaQSxFQWtaQyxJQWxaRCxDQUFELEMiLCJmaWxlIjoiY2FudmFzTG9naWN+bmVhcmVzdENvbG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKGNvbnRleHQpIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIERlZmluZXMgYW4gYXZhaWxhYmxlIGNvbG9yLlxyXG4gICAgICpcclxuICAgICAqIEB0eXBlZGVmIHtPYmplY3R9IENvbG9yU3BlY1xyXG4gICAgICogQHByb3BlcnR5IHtzdHJpbmc9fSBuYW1lIEEgbmFtZSBmb3IgdGhlIGNvbG9yLCBlLmcuLCAncmVkJ1xyXG4gICAgICogQHByb3BlcnR5IHtzdHJpbmd9IHNvdXJjZSBUaGUgaGV4LWJhc2VkIGNvbG9yIHN0cmluZywgZS5nLiwgJyNGRjAnXHJcbiAgICAgKiBAcHJvcGVydHkge1JHQn0gcmdiIFRoZSB7QGxpbmsgUkdCfSBjb2xvciB2YWx1ZXNcclxuICAgICAqL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGVzY3JpYmVzIGEgbWF0Y2hlZCBjb2xvci5cclxuICAgICAqXHJcbiAgICAgKiBAdHlwZWRlZiB7T2JqZWN0fSBDb2xvck1hdGNoXHJcbiAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgbWF0Y2hlZCBjb2xvciwgZS5nLiwgJ3JlZCdcclxuICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB2YWx1ZSBUaGUgaGV4LWJhc2VkIGNvbG9yIHN0cmluZywgZS5nLiwgJyNGRjAnXHJcbiAgICAgKiBAcHJvcGVydHkge1JHQn0gcmdiIFRoZSB7QGxpbmsgUkdCfSBjb2xvciB2YWx1ZXMuXHJcbiAgICAgKi9cclxuXHJcbiAgICAvKipcclxuICAgICAqIFByb3ZpZGVzIHRoZSBSR0IgYnJlYWtkb3duIG9mIGEgY29sb3IuXHJcbiAgICAgKlxyXG4gICAgICogQHR5cGVkZWYge09iamVjdH0gUkdCXHJcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gciBUaGUgcmVkIGNvbXBvbmVudCwgZnJvbSAwIHRvIDI1NVxyXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IGcgVGhlIGdyZWVuIGNvbXBvbmVudCwgZnJvbSAwIHRvIDI1NVxyXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IGIgVGhlIGJsdWUgY29tcG9uZW50LCBmcm9tIDAgdG8gMjU1XHJcbiAgICAgKi9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldHMgdGhlIG5lYXJlc3QgY29sb3IsIGZyb20gdGhlIGdpdmVuIGxpc3Qgb2Yge0BsaW5rIENvbG9yU3BlY30gb2JqZWN0c1xyXG4gICAgICogKHdoaWNoIGRlZmF1bHRzIHRvIHtAbGluayBuZWFyZXN0Q29sb3IuREVGQVVMVF9DT0xPUlN9KS5cclxuICAgICAqXHJcbiAgICAgKiBQcm9iYWJseSB5b3Ugd291bGRuJ3QgY2FsbCB0aGlzIG1ldGhvZCBkaXJlY3RseS4gSW5zdGVhZCB5b3UnZCBnZXQgYSBjdXN0b21cclxuICAgICAqIGNvbG9yIG1hdGNoZXIgYnkgY2FsbGluZyB7QGxpbmsgbmVhcmVzdENvbG9yLmZyb219LlxyXG4gICAgICpcclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqIEBwYXJhbSB7UkdCfHN0cmluZ30gbmVlZGxlIEVpdGhlciBhbiB7QGxpbmsgUkdCfSBjb2xvciBvciBhIGhleC1iYXNlZFxyXG4gICAgICogICAgIHN0cmluZyByZXByZXNlbnRpbmcgb25lLCBlLmcuLCAnI0ZGMCdcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPENvbG9yU3BlYz49fSBjb2xvcnMgQW4gb3B0aW9uYWwgbGlzdCBvZiBhdmFpbGFibGUgY29sb3JzXHJcbiAgICAgKiAgICAgKGRlZmF1bHRzIHRvIHtAbGluayBuZWFyZXN0Q29sb3IuREVGQVVMVF9DT0xPUlN9KVxyXG4gICAgICogQHJldHVybiB7Q29sb3JNYXRjaHxzdHJpbmd9IElmIHRoZSBjb2xvcnMgaW4gdGhlIHByb3ZpZGVkIGxpc3QgaGFkIG5hbWVzLFxyXG4gICAgICogICAgIHRoZW4gYSB7QGxpbmsgQ29sb3JNYXRjaH0gb2JqZWN0IHdpdGggdGhlIG5hbWUgYW5kIChoZXgpIHZhbHVlIG9mIHRoZVxyXG4gICAgICogICAgIG5lYXJlc3QgY29sb3IgZnJvbSB0aGUgbGlzdC4gT3RoZXJ3aXNlLCBzaW1wbHkgdGhlIGhleCB2YWx1ZS5cclxuICAgICAqXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogbmVhcmVzdENvbG9yKHsgcjogMjAwLCBnOiA1MCwgYjogNTAgfSk7IC8vID0+ICcjZjAwJ1xyXG4gICAgICogbmVhcmVzdENvbG9yKCcjZjExJyk7ICAgICAgICAgICAgICAgICAgIC8vID0+ICcjZjAwJ1xyXG4gICAgICogbmVhcmVzdENvbG9yKCcjZjg4Jyk7ICAgICAgICAgICAgICAgICAgIC8vID0+ICcjZjgwJ1xyXG4gICAgICogbmVhcmVzdENvbG9yKCcjZmZlJyk7ICAgICAgICAgICAgICAgICAgIC8vID0+ICcjZmYwJ1xyXG4gICAgICogbmVhcmVzdENvbG9yKCcjZWZlJyk7ICAgICAgICAgICAgICAgICAgIC8vID0+ICcjZmYwJ1xyXG4gICAgICogbmVhcmVzdENvbG9yKCcjYWJjJyk7ICAgICAgICAgICAgICAgICAgIC8vID0+ICcjODA4J1xyXG4gICAgICogbmVhcmVzdENvbG9yKCdyZWQnKTsgICAgICAgICAgICAgICAgICAgIC8vID0+ICcjZjAwJ1xyXG4gICAgICogbmVhcmVzdENvbG9yKCdmb28nKTsgICAgICAgICAgICAgICAgICAgIC8vID0+IHRocm93c1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBuZWFyZXN0Q29sb3IobmVlZGxlLCBjb2xvcnMpIHtcclxuICAgICAgICBuZWVkbGUgPSBwYXJzZUNvbG9yKG5lZWRsZSk7XHJcblxyXG4gICAgICAgIGlmICghbmVlZGxlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGRpc3RhbmNlU3EsXHJcbiAgICAgICAgICAgIG1pbkRpc3RhbmNlU3EgPSBJbmZpbml0eSxcclxuICAgICAgICAgICAgcmdiLFxyXG4gICAgICAgICAgICB2YWx1ZTtcclxuXHJcbiAgICAgICAgY29sb3JzIHx8IChjb2xvcnMgPSBuZWFyZXN0Q29sb3IuREVGQVVMVF9DT0xPUlMpO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbG9ycy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICByZ2IgPSBjb2xvcnNbaV0ucmdiO1xyXG5cclxuICAgICAgICAgICAgZGlzdGFuY2VTcSA9IChcclxuICAgICAgICAgICAgICAgIE1hdGgucG93KG5lZWRsZS5yIC0gcmdiLnIsIDIpICtcclxuICAgICAgICAgICAgICAgIE1hdGgucG93KG5lZWRsZS5nIC0gcmdiLmcsIDIpICtcclxuICAgICAgICAgICAgICAgIE1hdGgucG93KG5lZWRsZS5iIC0gcmdiLmIsIDIpXHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICBpZiAoZGlzdGFuY2VTcSA8IG1pbkRpc3RhbmNlU3EpIHtcclxuICAgICAgICAgICAgICAgIG1pbkRpc3RhbmNlU3EgPSBkaXN0YW5jZVNxO1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBjb2xvcnNbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh2YWx1ZS5uYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiB2YWx1ZS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLnNvdXJjZSxcclxuICAgICAgICAgICAgICAgIHJnYjogdmFsdWUucmdiLFxyXG4gICAgICAgICAgICAgICAgZGlzdGFuY2U6IE1hdGguc3FydChtaW5EaXN0YW5jZVNxKVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHZhbHVlLnNvdXJjZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFByb3ZpZGVzIGEgbWF0Y2hlciB0byBmaW5kIHRoZSBuZWFyZXN0IGNvbG9yIGJhc2VkIG9uIHRoZSBwcm92aWRlZCBsaXN0IG9mXHJcbiAgICAgKiBhdmFpbGFibGUgY29sb3JzLlxyXG4gICAgICpcclxuICAgICAqIEBwdWJsaWNcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz58T2JqZWN0fSBhdmFpbGFibGVDb2xvcnMgQW4gYXJyYXkgb2YgaGV4LWJhc2VkIGNvbG9yXHJcbiAgICAgKiAgICAgc3RyaW5ncywgb3IgYW4gb2JqZWN0IG1hcHBpbmcgY29sb3IgKm5hbWVzKiB0byBoZXggdmFsdWVzLlxyXG4gICAgICogQHJldHVybiB7ZnVuY3Rpb24oc3RyaW5nKTpDb2xvck1hdGNofHN0cmluZ30gQSBmdW5jdGlvbiB3aXRoIHRoZSBzYW1lXHJcbiAgICAgKiAgICAgYmVoYXZpb3IgYXMge0BsaW5rIG5lYXJlc3RDb2xvcn0sIGJ1dCB3aXRoIHRoZSBsaXN0IG9mIGNvbG9yc1xyXG4gICAgICogICAgIHByZWRlZmluZWQuXHJcbiAgICAgKlxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIHZhciBjb2xvcnMgPSB7XHJcbiAgICAgKiAgICdtYXJvb24nOiAnIzgwMCcsXHJcbiAgICAgKiAgICdsaWdodCB5ZWxsb3cnOiB7IHI6IDI1NSwgZzogMjU1LCBiOiA1MSB9LFxyXG4gICAgICogICAncGFsZSBibHVlJzogJyNkZWYnLFxyXG4gICAgICogICAnd2hpdGUnOiAnZmZmJ1xyXG4gICAgICogfTtcclxuICAgICAqXHJcbiAgICAgKiB2YXIgYmdDb2xvcnMgPSBbXHJcbiAgICAgKiAgICcjZWVlJyxcclxuICAgICAqICAgJyM0NDQnXHJcbiAgICAgKiBdO1xyXG4gICAgICpcclxuICAgICAqIHZhciBpbnZhbGlkQ29sb3JzID0ge1xyXG4gICAgICogICAnaW52YWxpZCc6ICdmb28nXHJcbiAgICAgKiB9O1xyXG4gICAgICpcclxuICAgICAqIHZhciBnZXRDb2xvciA9IG5lYXJlc3RDb2xvci5mcm9tKGNvbG9ycyk7XHJcbiAgICAgKiB2YXIgZ2V0QkdDb2xvciA9IGdldENvbG9yLmZyb20oYmdDb2xvcnMpO1xyXG4gICAgICogdmFyIGdldEFueUNvbG9yID0gbmVhcmVzdENvbG9yLmZyb20oY29sb3JzKS5vcihiZ0NvbG9ycyk7XHJcbiAgICAgKlxyXG4gICAgICogZ2V0Q29sb3IoJ2ZmZScpO1xyXG4gICAgICogLy8gPT4geyBuYW1lOiAnd2hpdGUnLCB2YWx1ZTogJ2ZmZicsIHJnYjogeyByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sIGRpc3RhbmNlOiAxN31cclxuICAgICAqXHJcbiAgICAgKiBnZXRDb2xvcignI2YwMCcpO1xyXG4gICAgICogLy8gPT4geyBuYW1lOiAnbWFyb29uJywgdmFsdWU6ICcjODAwJywgcmdiOiB7IHI6IDEzNiwgZzogMCwgYjogMCB9LCBkaXN0YW5jZTogMTE5fVxyXG4gICAgICpcclxuICAgICAqIGdldENvbG9yKCcjZmYwJyk7XHJcbiAgICAgKiAvLyA9PiB7IG5hbWU6ICdsaWdodCB5ZWxsb3cnLCB2YWx1ZTogJyNmZmZmMzMnLCByZ2I6IHsgcjogMjU1LCBnOiAyNTUsIGI6IDUxIH0sIGRpc3RhbmNlOiA1MX1cclxuICAgICAqXHJcbiAgICAgKiBnZXRCR0NvbG9yKCcjZmZmJyk7IC8vID0+ICcjZWVlJ1xyXG4gICAgICogZ2V0QkdDb2xvcignIzAwMCcpOyAvLyA9PiAnIzQ0NCdcclxuICAgICAqXHJcbiAgICAgKiBnZXRBbnlDb2xvcignI2YwMCcpO1xyXG4gICAgICogLy8gPT4geyBuYW1lOiAnbWFyb29uJywgdmFsdWU6ICcjODAwJywgcmdiOiB7IHI6IDEzNiwgZzogMCwgYjogMCB9LCBkaXN0YW5jZTogMTE5fVxyXG4gICAgICpcclxuICAgICAqIGdldEFueUNvbG9yKCcjODg4Jyk7IC8vID0+ICcjNDQ0J1xyXG4gICAgICpcclxuICAgICAqIG5lYXJlc3RDb2xvci5mcm9tKGludmFsaWRDb2xvcnMpOyAvLyA9PiB0aHJvd3NcclxuICAgICAqL1xyXG4gICAgbmVhcmVzdENvbG9yLmZyb20gPSBmdW5jdGlvbiBmcm9tKGF2YWlsYWJsZUNvbG9ycykge1xyXG4gICAgICAgIHZhciBjb2xvcnMgPSBtYXBDb2xvcnMoYXZhaWxhYmxlQ29sb3JzKSxcclxuICAgICAgICAgICAgbmVhcmVzdENvbG9yQmFzZSA9IG5lYXJlc3RDb2xvcjtcclxuXHJcbiAgICAgICAgdmFyIG1hdGNoZXIgPSBmdW5jdGlvbiBuZWFyZXN0Q29sb3IoaGV4KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZWFyZXN0Q29sb3JCYXNlKGhleCwgY29sb3JzKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAvLyBLZWVwIHRoZSAnZnJvbScgbWV0aG9kLCB0byBzdXBwb3J0IGNoYW5naW5nIHRoZSBsaXN0IG9mIGF2YWlsYWJsZSBjb2xvcnNcclxuICAgICAgICAvLyBtdWx0aXBsZSB0aW1lcyB3aXRob3V0IG5lZWRpbmcgdG8ga2VlcCBhIHJlZmVyZW5jZSB0byB0aGUgb3JpZ2luYWxcclxuICAgICAgICAvLyBuZWFyZXN0Q29sb3IgZnVuY3Rpb24uXHJcbiAgICAgICAgbWF0Y2hlci5mcm9tID0gZnJvbTtcclxuXHJcbiAgICAgICAgLy8gQWxzbyBwcm92aWRlIGEgd2F5IHRvIGNvbWJpbmUgbXVsdGlwbGUgY29sb3IgbGlzdHMuXHJcbiAgICAgICAgbWF0Y2hlci5vciA9IGZ1bmN0aW9uIG9yKGFsdGVybmF0ZUNvbG9ycykge1xyXG4gICAgICAgICAgICB2YXIgZXh0ZW5kZWRDb2xvcnMgPSBjb2xvcnMuY29uY2F0KG1hcENvbG9ycyhhbHRlcm5hdGVDb2xvcnMpKTtcclxuICAgICAgICAgICAgcmV0dXJuIG5lYXJlc3RDb2xvci5mcm9tKGV4dGVuZGVkQ29sb3JzKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gbWF0Y2hlcjtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHaXZlbiBlaXRoZXIgYW4gYXJyYXkgb3Igb2JqZWN0IG9mIGNvbG9ycywgcmV0dXJucyBhbiBhcnJheSBvZlxyXG4gICAgICoge0BsaW5rIENvbG9yU3BlY30gb2JqZWN0cyAod2l0aCB7QGxpbmsgUkdCfSB2YWx1ZXMpLlxyXG4gICAgICpcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fE9iamVjdH0gY29sb3JzIEFuIGFycmF5IG9mIGhleC1iYXNlZCBjb2xvciBzdHJpbmdzLCBvclxyXG4gICAgICogICAgIGFuIG9iamVjdCBtYXBwaW5nIGNvbG9yICpuYW1lcyogdG8gaGV4IHZhbHVlcy5cclxuICAgICAqIEByZXR1cm4ge0FycmF5LjxDb2xvclNwZWM+fSBBbiBhcnJheSBvZiB7QGxpbmsgQ29sb3JTcGVjfSBvYmplY3RzXHJcbiAgICAgKiAgICAgcmVwcmVzZW50aW5nIHRoZSBzYW1lIGNvbG9ycyBwYXNzZWQgaW4uXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIG1hcENvbG9ycyhjb2xvcnMpIHtcclxuICAgICAgICBpZiAoY29sb3JzIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbG9ycy5tYXAoZnVuY3Rpb24oY29sb3IpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGVDb2xvclNwZWMoY29sb3IpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhjb2xvcnMpLm1hcChmdW5jdGlvbihuYW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjcmVhdGVDb2xvclNwZWMoY29sb3JzW25hbWVdLCBuYW1lKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBQYXJzZXMgYSBjb2xvciBmcm9tIGEgc3RyaW5nLlxyXG4gICAgICpcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKiBAcGFyYW0ge1JHQnxzdHJpbmd9IHNvdXJjZVxyXG4gICAgICogQHJldHVybiB7UkdCfVxyXG4gICAgICpcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBwYXJzZUNvbG9yKHsgcjogMywgZzogMjIsIGI6IDExMSB9KTsgLy8gPT4geyByOiAzLCBnOiAyMiwgYjogMTExIH1cclxuICAgICAqIHBhcnNlQ29sb3IoJyNmMDAnKTsgICAgICAgICAgICAgICAgICAvLyA9PiB7IHI6IDI1NSwgZzogMCwgYjogMCB9XHJcbiAgICAgKiBwYXJzZUNvbG9yKCcjMDRmYmM4Jyk7ICAgICAgICAgICAgICAgLy8gPT4geyByOiA0LCBnOiAyNTEsIGI6IDIwMCB9XHJcbiAgICAgKiBwYXJzZUNvbG9yKCcjRkYwJyk7ICAgICAgICAgICAgICAgICAgLy8gPT4geyByOiAyNTUsIGc6IDI1NSwgYjogMCB9XHJcbiAgICAgKiBwYXJzZUNvbG9yKCdyZ2IoMywgMTAsIDEwMCknKTsgICAgICAgLy8gPT4geyByOiAzLCBnOiAxMCwgYjogMTAwIH1cclxuICAgICAqIHBhcnNlQ29sb3IoJ3JnYig1MCUsIDAlLCA1MCUpJyk7ICAgICAvLyA9PiB7IHI6IDEyOCwgZzogMCwgYjogMTI4IH1cclxuICAgICAqIHBhcnNlQ29sb3IoJ2FxdWEnKTsgICAgICAgICAgICAgICAgICAvLyA9PiB7IHI6IDAsIGc6IDI1NSwgYjogMjU1IH1cclxuICAgICAqIHBhcnNlQ29sb3IoJ2ZmZicpOyAgICAgICAgICAgICAgICAgICAvLyA9PiB7IHI6IDI1NSwgZzogMjU1LCBiOiAyNTUgfVxyXG4gICAgICogcGFyc2VDb2xvcignZm9vJyk7ICAgICAgICAgICAgICAgICAgIC8vID0+IHRocm93c1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBwYXJzZUNvbG9yKHNvdXJjZSkge1xyXG4gICAgICAgIHZhciByZWQsIGdyZWVuLCBibHVlO1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIHNvdXJjZSA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNvdXJjZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzb3VyY2UgaW4gbmVhcmVzdENvbG9yLlNUQU5EQVJEX0NPTE9SUykge1xyXG4gICAgICAgICAgICByZXR1cm4gcGFyc2VDb2xvcihuZWFyZXN0Q29sb3IuU1RBTkRBUkRfQ09MT1JTW3NvdXJjZV0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGhleE1hdGNoID0gc291cmNlLm1hdGNoKC9eIz8oKD86WzAtOWEtZl17M30pezEsMn0pJC9pKTtcclxuICAgICAgICBpZiAoaGV4TWF0Y2gpIHtcclxuICAgICAgICAgICAgaGV4TWF0Y2ggPSBoZXhNYXRjaFsxXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChoZXhNYXRjaC5sZW5ndGggPT09IDMpIHtcclxuICAgICAgICAgICAgICAgIGhleE1hdGNoID0gW1xyXG4gICAgICAgICAgICAgICAgICAgIGhleE1hdGNoLmNoYXJBdCgwKSArIGhleE1hdGNoLmNoYXJBdCgwKSxcclxuICAgICAgICAgICAgICAgICAgICBoZXhNYXRjaC5jaGFyQXQoMSkgKyBoZXhNYXRjaC5jaGFyQXQoMSksXHJcbiAgICAgICAgICAgICAgICAgICAgaGV4TWF0Y2guY2hhckF0KDIpICsgaGV4TWF0Y2guY2hhckF0KDIpXHJcbiAgICAgICAgICAgICAgICBdO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGhleE1hdGNoID0gW1xyXG4gICAgICAgICAgICAgICAgICAgIGhleE1hdGNoLnN1YnN0cmluZygwLCAyKSxcclxuICAgICAgICAgICAgICAgICAgICBoZXhNYXRjaC5zdWJzdHJpbmcoMiwgNCksXHJcbiAgICAgICAgICAgICAgICAgICAgaGV4TWF0Y2guc3Vic3RyaW5nKDQsIDYpXHJcbiAgICAgICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZWQgPSBwYXJzZUludChoZXhNYXRjaFswXSwgMTYpO1xyXG4gICAgICAgICAgICBncmVlbiA9IHBhcnNlSW50KGhleE1hdGNoWzFdLCAxNik7XHJcbiAgICAgICAgICAgIGJsdWUgPSBwYXJzZUludChoZXhNYXRjaFsyXSwgMTYpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHsgcjogcmVkLCBnOiBncmVlbiwgYjogYmx1ZSB9O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHJnYk1hdGNoID0gc291cmNlLm1hdGNoKC9ecmdiXFwoXFxzKihcXGR7MSwzfSU/KSxcXHMqKFxcZHsxLDN9JT8pLFxccyooXFxkezEsM30lPylcXHMqXFwpJC9pKTtcclxuICAgICAgICBpZiAocmdiTWF0Y2gpIHtcclxuICAgICAgICAgICAgcmVkID0gcGFyc2VDb21wb25lbnRWYWx1ZShyZ2JNYXRjaFsxXSk7XHJcbiAgICAgICAgICAgIGdyZWVuID0gcGFyc2VDb21wb25lbnRWYWx1ZShyZ2JNYXRjaFsyXSk7XHJcbiAgICAgICAgICAgIGJsdWUgPSBwYXJzZUNvbXBvbmVudFZhbHVlKHJnYk1hdGNoWzNdKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7IHI6IHJlZCwgZzogZ3JlZW4sIGI6IGJsdWUgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRocm93IEVycm9yKCdcIicgKyBzb3VyY2UgKyAnXCIgaXMgbm90IGEgdmFsaWQgY29sb3InKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZXMgYSB7QGxpbmsgQ29sb3JTcGVjfSBmcm9tIGVpdGhlciBhIHN0cmluZyBvciBhbiB7QGxpbmsgUkdCfS5cclxuICAgICAqXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd8UkdCfSBpbnB1dFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmc9fSBuYW1lXHJcbiAgICAgKiBAcmV0dXJuIHtDb2xvclNwZWN9XHJcbiAgICAgKlxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGNyZWF0ZUNvbG9yU3BlYygnIzgwMCcpOyAvLyA9PiB7XHJcbiAgICAgKiAgIHNvdXJjZTogJyM4MDAnLFxyXG4gICAgICogICByZ2I6IHsgcjogMTM2LCBnOiAwLCBiOiAwIH1cclxuICAgICAqIH1cclxuICAgICAqXHJcbiAgICAgKiBjcmVhdGVDb2xvclNwZWMoJyM4MDAnLCAnbWFyb29uJyk7IC8vID0+IHtcclxuICAgICAqICAgbmFtZTogJ21hcm9vbicsXHJcbiAgICAgKiAgIHNvdXJjZTogJyM4MDAnLFxyXG4gICAgICogICByZ2I6IHsgcjogMTM2LCBnOiAwLCBiOiAwIH1cclxuICAgICAqIH1cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gY3JlYXRlQ29sb3JTcGVjKGlucHV0LCBuYW1lKSB7XHJcbiAgICAgICAgdmFyIGNvbG9yID0ge307XHJcblxyXG4gICAgICAgIGlmIChuYW1lKSB7XHJcbiAgICAgICAgICAgIGNvbG9yLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgY29sb3Iuc291cmNlID0gaW5wdXQ7XHJcbiAgICAgICAgICAgIGNvbG9yLnJnYiA9IHBhcnNlQ29sb3IoaW5wdXQpO1xyXG5cclxuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgLy8gVGhpcyBpcyBmb3IgaWYvd2hlbiB3ZSdyZSBjb25jYXRlbmF0aW5nIGxpc3RzIG9mIGNvbG9ycy5cclxuICAgICAgICAgICAgaWYgKGlucHV0LnNvdXJjZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZUNvbG9yU3BlYyhpbnB1dC5zb3VyY2UsIGlucHV0Lm5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb2xvci5yZ2IgPSBpbnB1dDtcclxuICAgICAgICAgICAgY29sb3Iuc291cmNlID0gcmdiVG9IZXgoaW5wdXQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbG9yO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUGFyc2VzIGEgdmFsdWUgYmV0d2VlbiAwLTI1NSBmcm9tIGEgc3RyaW5nLlxyXG4gICAgICpcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nXHJcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9XHJcbiAgICAgKlxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIHBhcnNlQ29tcG9uZW50VmFsdWUoJzEwMCcpOyAgLy8gPT4gMTAwXHJcbiAgICAgKiBwYXJzZUNvbXBvbmVudFZhbHVlKCcxMDAlJyk7IC8vID0+IDI1NVxyXG4gICAgICogcGFyc2VDb21wb25lbnRWYWx1ZSgnNTAlJyk7ICAvLyA9PiAxMjhcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gcGFyc2VDb21wb25lbnRWYWx1ZShzdHJpbmcpIHtcclxuICAgICAgICBpZiAoc3RyaW5nLmNoYXJBdChzdHJpbmcubGVuZ3RoIC0gMSkgPT09ICclJykge1xyXG4gICAgICAgICAgICByZXR1cm4gTWF0aC5yb3VuZChwYXJzZUludChzdHJpbmcsIDEwKSAqIDI1NSAvIDEwMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gTnVtYmVyKHN0cmluZyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0cyBhbiB7QGxpbmsgUkdCfSBjb2xvciB0byBpdHMgaGV4IHJlcHJlc2VudGF0aW9uLlxyXG4gICAgICpcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKiBAcGFyYW0ge1JHQn0gcmdiXHJcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAgICAgKlxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIHJnYlRvSGV4KHsgcjogMjU1LCBnOiAxMjgsIGI6IDAgfSk7IC8vID0+ICcjZmY4MDAwJ1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiByZ2JUb0hleChyZ2IpIHtcclxuICAgICAgICByZXR1cm4gJyMnICsgbGVhZGluZ1plcm8ocmdiLnIudG9TdHJpbmcoMTYpKSArXHJcbiAgICAgICAgICAgIGxlYWRpbmdaZXJvKHJnYi5nLnRvU3RyaW5nKDE2KSkgKyBsZWFkaW5nWmVybyhyZ2IuYi50b1N0cmluZygxNikpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUHV0cyBhIDAgaW4gZnJvbnQgb2YgYSBudW1lcmljIHN0cmluZyBpZiBpdCdzIG9ubHkgb25lIGRpZ2l0LiBPdGhlcndpc2VcclxuICAgICAqIG5vdGhpbmcgKGp1c3QgcmV0dXJucyB0aGUgdmFsdWUgcGFzc2VkIGluKS5cclxuICAgICAqXHJcbiAgICAgKiBAcHJpdmF0ZVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlXHJcbiAgICAgKiBAcmV0dXJuXHJcbiAgICAgKlxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGxlYWRpbmdaZXJvKCcxJyk7ICAvLyA9PiAnMDEnXHJcbiAgICAgKiBsZWFkaW5nWmVybygnMTInKTsgLy8gPT4gJzEyJ1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBsZWFkaW5nWmVybyh2YWx1ZSkge1xyXG4gICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICAgICAgdmFsdWUgPSAnMCcgKyB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQSBtYXAgZnJvbSB0aGUgbmFtZXMgb2Ygc3RhbmRhcmQgQ1NTIGNvbG9ycyB0byB0aGVpciBoZXggdmFsdWVzLlxyXG4gICAgICovXHJcbiAgICBuZWFyZXN0Q29sb3IuU1RBTkRBUkRfQ09MT1JTID0ge1xyXG4gICAgICAgIGFxdWE6ICcjMGZmJyxcclxuICAgICAgICBibGFjazogJyMwMDAnLFxyXG4gICAgICAgIGJsdWU6ICcjMDBmJyxcclxuICAgICAgICBmdWNoc2lhOiAnI2YwZicsXHJcbiAgICAgICAgZ3JheTogJyM4MDgwODAnLFxyXG4gICAgICAgIGdyZWVuOiAnIzAwODAwMCcsXHJcbiAgICAgICAgbGltZTogJyMwZjAnLFxyXG4gICAgICAgIG1hcm9vbjogJyM4MDAwMDAnLFxyXG4gICAgICAgIG5hdnk6ICcjMDAwMDgwJyxcclxuICAgICAgICBvbGl2ZTogJyM4MDgwMDAnLFxyXG4gICAgICAgIG9yYW5nZTogJyNmZmE1MDAnLFxyXG4gICAgICAgIHB1cnBsZTogJyM4MDAwODAnLFxyXG4gICAgICAgIHJlZDogJyNmMDAnLFxyXG4gICAgICAgIHNpbHZlcjogJyNjMGMwYzAnLFxyXG4gICAgICAgIHRlYWw6ICcjMDA4MDgwJyxcclxuICAgICAgICB3aGl0ZTogJyNmZmYnLFxyXG4gICAgICAgIHllbGxvdzogJyNmZjAnXHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGVmYXVsdCBjb2xvcnMuIENvbXByaXNlcyB0aGUgY29sb3JzIG9mIHRoZSByYWluYm93IChnb29kIG9sJyBST1kgRy4gQklWKS5cclxuICAgICAqIFRoaXMgbGlzdCB3aWxsIGJlIHVzZWQgZm9yIGNhbGxzIHRvIHtAbmVhcmVzdENvbG9yfSB0aGF0IGRvbid0IHNwZWNpZnkgYSBsaXN0XHJcbiAgICAgKiBvZiBhdmFpbGFibGUgY29sb3JzIHRvIG1hdGNoLlxyXG4gICAgICovXHJcbiAgICBuZWFyZXN0Q29sb3IuREVGQVVMVF9DT0xPUlMgPSBtYXBDb2xvcnMoW1xyXG4gICAgICAgICcjZjAwJywgLy8gclxyXG4gICAgICAgICcjZjgwJywgLy8gb1xyXG4gICAgICAgICcjZmYwJywgLy8geVxyXG4gICAgICAgICcjMGYwJywgLy8gZ1xyXG4gICAgICAgICcjMDBmJywgLy8gYlxyXG4gICAgICAgICcjMDA4JywgLy8gaVxyXG4gICAgICAgICcjODA4JyAgLy8gdlxyXG4gICAgXSk7XHJcblxyXG4gICAgbmVhcmVzdENvbG9yLlZFUlNJT04gPSAnMC40LjQnO1xyXG5cclxuICAgIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgbW9kdWxlLmV4cG9ydHMpIHtcclxuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IG5lYXJlc3RDb2xvcjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29udGV4dC5uZWFyZXN0Q29sb3IgPSBuZWFyZXN0Q29sb3I7XHJcbiAgICB9XHJcblxyXG59KHRoaXMpKTtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==