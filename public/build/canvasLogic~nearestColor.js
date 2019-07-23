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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvanMvbmVhcmVzdENvbG9yLmpzIl0sIm5hbWVzIjpbImNvbnRleHQiLCJuZWFyZXN0Q29sb3IiLCJuZWVkbGUiLCJjb2xvcnMiLCJwYXJzZUNvbG9yIiwiZGlzdGFuY2VTcSIsIm1pbkRpc3RhbmNlU3EiLCJJbmZpbml0eSIsInJnYiIsInZhbHVlIiwiREVGQVVMVF9DT0xPUlMiLCJpIiwibGVuZ3RoIiwiTWF0aCIsInBvdyIsInIiLCJnIiwiYiIsIm5hbWUiLCJzb3VyY2UiLCJkaXN0YW5jZSIsInNxcnQiLCJmcm9tIiwiYXZhaWxhYmxlQ29sb3JzIiwibWFwQ29sb3JzIiwibmVhcmVzdENvbG9yQmFzZSIsIm1hdGNoZXIiLCJoZXgiLCJvciIsImFsdGVybmF0ZUNvbG9ycyIsImV4dGVuZGVkQ29sb3JzIiwiY29uY2F0IiwiQXJyYXkiLCJtYXAiLCJjb2xvciIsImNyZWF0ZUNvbG9yU3BlYyIsIk9iamVjdCIsImtleXMiLCJyZWQiLCJncmVlbiIsImJsdWUiLCJTVEFOREFSRF9DT0xPUlMiLCJoZXhNYXRjaCIsIm1hdGNoIiwiY2hhckF0Iiwic3Vic3RyaW5nIiwicGFyc2VJbnQiLCJyZ2JNYXRjaCIsInBhcnNlQ29tcG9uZW50VmFsdWUiLCJFcnJvciIsImlucHV0IiwicmdiVG9IZXgiLCJzdHJpbmciLCJyb3VuZCIsIk51bWJlciIsImxlYWRpbmdaZXJvIiwidG9TdHJpbmciLCJhcXVhIiwiYmxhY2siLCJmdWNoc2lhIiwiZ3JheSIsImxpbWUiLCJtYXJvb24iLCJuYXZ5Iiwib2xpdmUiLCJvcmFuZ2UiLCJwdXJwbGUiLCJzaWx2ZXIiLCJ0ZWFsIiwid2hpdGUiLCJ5ZWxsb3ciLCJWRVJTSU9OIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUMsV0FBU0EsT0FBVCxFQUFrQjtBQUVmOzs7Ozs7Ozs7QUFTQTs7Ozs7Ozs7O0FBU0E7Ozs7Ozs7OztBQVNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQSxXQUFTQyxZQUFULENBQXNCQyxNQUF0QixFQUE4QkMsTUFBOUIsRUFBc0M7QUFDbENELFVBQU0sR0FBR0UsVUFBVSxDQUFDRixNQUFELENBQW5COztBQUVBLFFBQUksQ0FBQ0EsTUFBTCxFQUFhO0FBQ1QsYUFBTyxJQUFQO0FBQ0g7O0FBRUQsUUFBSUcsVUFBSjtBQUFBLFFBQ0lDLGFBQWEsR0FBR0MsUUFEcEI7QUFBQSxRQUVJQyxHQUZKO0FBQUEsUUFHSUMsS0FISjtBQUtBTixVQUFNLEtBQUtBLE1BQU0sR0FBR0YsWUFBWSxDQUFDUyxjQUEzQixDQUFOOztBQUVBLFNBQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR1IsTUFBTSxDQUFDUyxNQUEzQixFQUFtQyxFQUFFRCxDQUFyQyxFQUF3QztBQUNwQ0gsU0FBRyxHQUFHTCxNQUFNLENBQUNRLENBQUQsQ0FBTixDQUFVSCxHQUFoQjtBQUVBSCxnQkFBVSxHQUNOUSxJQUFJLENBQUNDLEdBQUwsQ0FBU1osTUFBTSxDQUFDYSxDQUFQLEdBQVdQLEdBQUcsQ0FBQ08sQ0FBeEIsRUFBMkIsQ0FBM0IsSUFDQUYsSUFBSSxDQUFDQyxHQUFMLENBQVNaLE1BQU0sQ0FBQ2MsQ0FBUCxHQUFXUixHQUFHLENBQUNRLENBQXhCLEVBQTJCLENBQTNCLENBREEsR0FFQUgsSUFBSSxDQUFDQyxHQUFMLENBQVNaLE1BQU0sQ0FBQ2UsQ0FBUCxHQUFXVCxHQUFHLENBQUNTLENBQXhCLEVBQTJCLENBQTNCLENBSEo7O0FBTUEsVUFBSVosVUFBVSxHQUFHQyxhQUFqQixFQUFnQztBQUM1QkEscUJBQWEsR0FBR0QsVUFBaEI7QUFDQUksYUFBSyxHQUFHTixNQUFNLENBQUNRLENBQUQsQ0FBZDtBQUNIO0FBQ0o7O0FBRUQsUUFBSUYsS0FBSyxDQUFDUyxJQUFWLEVBQWdCO0FBQ1osYUFBTztBQUNIQSxZQUFJLEVBQUVULEtBQUssQ0FBQ1MsSUFEVDtBQUVIVCxhQUFLLEVBQUVBLEtBQUssQ0FBQ1UsTUFGVjtBQUdIWCxXQUFHLEVBQUVDLEtBQUssQ0FBQ0QsR0FIUjtBQUlIWSxnQkFBUSxFQUFFUCxJQUFJLENBQUNRLElBQUwsQ0FBVWYsYUFBVjtBQUpQLE9BQVA7QUFNSDs7QUFFRCxXQUFPRyxLQUFLLENBQUNVLE1BQWI7QUFDSDtBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1EQWxCLGNBQVksQ0FBQ3FCLElBQWIsR0FBb0IsU0FBU0EsSUFBVCxDQUFjQyxlQUFkLEVBQStCO0FBQy9DLFFBQUlwQixNQUFNLEdBQUdxQixTQUFTLENBQUNELGVBQUQsQ0FBdEI7QUFBQSxRQUNJRSxnQkFBZ0IsR0FBR3hCLFlBRHZCOztBQUdBLFFBQUl5QixPQUFPLEdBQUcsU0FBU3pCLFlBQVQsQ0FBc0IwQixHQUF0QixFQUEyQjtBQUNyQyxhQUFPRixnQkFBZ0IsQ0FBQ0UsR0FBRCxFQUFNeEIsTUFBTixDQUF2QjtBQUNILEtBRkQsQ0FKK0MsQ0FRL0M7QUFDQTtBQUNBOzs7QUFDQXVCLFdBQU8sQ0FBQ0osSUFBUixHQUFlQSxJQUFmLENBWCtDLENBYS9DOztBQUNBSSxXQUFPLENBQUNFLEVBQVIsR0FBYSxTQUFTQSxFQUFULENBQVlDLGVBQVosRUFBNkI7QUFDdEMsVUFBSUMsY0FBYyxHQUFHM0IsTUFBTSxDQUFDNEIsTUFBUCxDQUFjUCxTQUFTLENBQUNLLGVBQUQsQ0FBdkIsQ0FBckI7QUFDQSxhQUFPNUIsWUFBWSxDQUFDcUIsSUFBYixDQUFrQlEsY0FBbEIsQ0FBUDtBQUNILEtBSEQ7O0FBS0EsV0FBT0osT0FBUDtBQUNILEdBcEJEO0FBc0JBOzs7Ozs7Ozs7Ozs7QUFVQSxXQUFTRixTQUFULENBQW1CckIsTUFBbkIsRUFBMkI7QUFDdkIsUUFBSUEsTUFBTSxZQUFZNkIsS0FBdEIsRUFBNkI7QUFDekIsYUFBTzdCLE1BQU0sQ0FBQzhCLEdBQVAsQ0FBVyxVQUFTQyxLQUFULEVBQWdCO0FBQzlCLGVBQU9DLGVBQWUsQ0FBQ0QsS0FBRCxDQUF0QjtBQUNILE9BRk0sQ0FBUDtBQUdIOztBQUVELFdBQU9FLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZbEMsTUFBWixFQUFvQjhCLEdBQXBCLENBQXdCLFVBQVNmLElBQVQsRUFBZTtBQUMxQyxhQUFPaUIsZUFBZSxDQUFDaEMsTUFBTSxDQUFDZSxJQUFELENBQVAsRUFBZUEsSUFBZixDQUF0QjtBQUNILEtBRk0sQ0FBUDtBQUdIOztBQUFBO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrQkEsV0FBU2QsVUFBVCxDQUFvQmUsTUFBcEIsRUFBNEI7QUFDeEIsUUFBSW1CLEdBQUosRUFBU0MsS0FBVCxFQUFnQkMsSUFBaEI7O0FBRUEsUUFBSSxRQUFPckIsTUFBUCxNQUFrQixRQUF0QixFQUFnQztBQUM1QixhQUFPQSxNQUFQO0FBQ0g7O0FBRUQsUUFBSUEsTUFBTSxJQUFJbEIsWUFBWSxDQUFDd0MsZUFBM0IsRUFBNEM7QUFDeEMsYUFBT3JDLFVBQVUsQ0FBQ0gsWUFBWSxDQUFDd0MsZUFBYixDQUE2QnRCLE1BQTdCLENBQUQsQ0FBakI7QUFDSDs7QUFFRCxRQUFJdUIsUUFBUSxHQUFHdkIsTUFBTSxDQUFDd0IsS0FBUCxDQUFhLDZCQUFiLENBQWY7O0FBQ0EsUUFBSUQsUUFBSixFQUFjO0FBQ1ZBLGNBQVEsR0FBR0EsUUFBUSxDQUFDLENBQUQsQ0FBbkI7O0FBRUEsVUFBSUEsUUFBUSxDQUFDOUIsTUFBVCxLQUFvQixDQUF4QixFQUEyQjtBQUN2QjhCLGdCQUFRLEdBQUcsQ0FDUEEsUUFBUSxDQUFDRSxNQUFULENBQWdCLENBQWhCLElBQXFCRixRQUFRLENBQUNFLE1BQVQsQ0FBZ0IsQ0FBaEIsQ0FEZCxFQUVQRixRQUFRLENBQUNFLE1BQVQsQ0FBZ0IsQ0FBaEIsSUFBcUJGLFFBQVEsQ0FBQ0UsTUFBVCxDQUFnQixDQUFoQixDQUZkLEVBR1BGLFFBQVEsQ0FBQ0UsTUFBVCxDQUFnQixDQUFoQixJQUFxQkYsUUFBUSxDQUFDRSxNQUFULENBQWdCLENBQWhCLENBSGQsQ0FBWDtBQU1ILE9BUEQsTUFPTztBQUNIRixnQkFBUSxHQUFHLENBQ1BBLFFBQVEsQ0FBQ0csU0FBVCxDQUFtQixDQUFuQixFQUFzQixDQUF0QixDQURPLEVBRVBILFFBQVEsQ0FBQ0csU0FBVCxDQUFtQixDQUFuQixFQUFzQixDQUF0QixDQUZPLEVBR1BILFFBQVEsQ0FBQ0csU0FBVCxDQUFtQixDQUFuQixFQUFzQixDQUF0QixDQUhPLENBQVg7QUFLSDs7QUFFRFAsU0FBRyxHQUFHUSxRQUFRLENBQUNKLFFBQVEsQ0FBQyxDQUFELENBQVQsRUFBYyxFQUFkLENBQWQ7QUFDQUgsV0FBSyxHQUFHTyxRQUFRLENBQUNKLFFBQVEsQ0FBQyxDQUFELENBQVQsRUFBYyxFQUFkLENBQWhCO0FBQ0FGLFVBQUksR0FBR00sUUFBUSxDQUFDSixRQUFRLENBQUMsQ0FBRCxDQUFULEVBQWMsRUFBZCxDQUFmO0FBRUEsYUFBTztBQUFFM0IsU0FBQyxFQUFFdUIsR0FBTDtBQUFVdEIsU0FBQyxFQUFFdUIsS0FBYjtBQUFvQnRCLFNBQUMsRUFBRXVCO0FBQXZCLE9BQVA7QUFDSDs7QUFFRCxRQUFJTyxRQUFRLEdBQUc1QixNQUFNLENBQUN3QixLQUFQLENBQWEsMkRBQWIsQ0FBZjs7QUFDQSxRQUFJSSxRQUFKLEVBQWM7QUFDVlQsU0FBRyxHQUFHVSxtQkFBbUIsQ0FBQ0QsUUFBUSxDQUFDLENBQUQsQ0FBVCxDQUF6QjtBQUNBUixXQUFLLEdBQUdTLG1CQUFtQixDQUFDRCxRQUFRLENBQUMsQ0FBRCxDQUFULENBQTNCO0FBQ0FQLFVBQUksR0FBR1EsbUJBQW1CLENBQUNELFFBQVEsQ0FBQyxDQUFELENBQVQsQ0FBMUI7QUFFQSxhQUFPO0FBQUVoQyxTQUFDLEVBQUV1QixHQUFMO0FBQVV0QixTQUFDLEVBQUV1QixLQUFiO0FBQW9CdEIsU0FBQyxFQUFFdUI7QUFBdkIsT0FBUDtBQUNIOztBQUVELFVBQU1TLEtBQUssQ0FBQyxNQUFNOUIsTUFBTixHQUFlLHdCQUFoQixDQUFYO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQSxXQUFTZ0IsZUFBVCxDQUF5QmUsS0FBekIsRUFBZ0NoQyxJQUFoQyxFQUFzQztBQUNsQyxRQUFJZ0IsS0FBSyxHQUFHLEVBQVo7O0FBRUEsUUFBSWhCLElBQUosRUFBVTtBQUNOZ0IsV0FBSyxDQUFDaEIsSUFBTixHQUFhQSxJQUFiO0FBQ0g7O0FBRUQsUUFBSSxPQUFPZ0MsS0FBUCxLQUFpQixRQUFyQixFQUErQjtBQUMzQmhCLFdBQUssQ0FBQ2YsTUFBTixHQUFlK0IsS0FBZjtBQUNBaEIsV0FBSyxDQUFDMUIsR0FBTixHQUFZSixVQUFVLENBQUM4QyxLQUFELENBQXRCO0FBRUgsS0FKRCxNQUlPLElBQUksUUFBT0EsS0FBUCxNQUFpQixRQUFyQixFQUErQjtBQUNsQztBQUNBLFVBQUlBLEtBQUssQ0FBQy9CLE1BQVYsRUFBa0I7QUFDZCxlQUFPZ0IsZUFBZSxDQUFDZSxLQUFLLENBQUMvQixNQUFQLEVBQWUrQixLQUFLLENBQUNoQyxJQUFyQixDQUF0QjtBQUNIOztBQUVEZ0IsV0FBSyxDQUFDMUIsR0FBTixHQUFZMEMsS0FBWjtBQUNBaEIsV0FBSyxDQUFDZixNQUFOLEdBQWVnQyxRQUFRLENBQUNELEtBQUQsQ0FBdkI7QUFDSDs7QUFFRCxXQUFPaEIsS0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7Ozs7O0FBWUEsV0FBU2MsbUJBQVQsQ0FBNkJJLE1BQTdCLEVBQXFDO0FBQ2pDLFFBQUlBLE1BQU0sQ0FBQ1IsTUFBUCxDQUFjUSxNQUFNLENBQUN4QyxNQUFQLEdBQWdCLENBQTlCLE1BQXFDLEdBQXpDLEVBQThDO0FBQzFDLGFBQU9DLElBQUksQ0FBQ3dDLEtBQUwsQ0FBV1AsUUFBUSxDQUFDTSxNQUFELEVBQVMsRUFBVCxDQUFSLEdBQXVCLEdBQXZCLEdBQTZCLEdBQXhDLENBQVA7QUFDSDs7QUFFRCxXQUFPRSxNQUFNLENBQUNGLE1BQUQsQ0FBYjtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7OztBQVVBLFdBQVNELFFBQVQsQ0FBa0IzQyxHQUFsQixFQUF1QjtBQUNuQixXQUFPLE1BQU0rQyxXQUFXLENBQUMvQyxHQUFHLENBQUNPLENBQUosQ0FBTXlDLFFBQU4sQ0FBZSxFQUFmLENBQUQsQ0FBakIsR0FDSEQsV0FBVyxDQUFDL0MsR0FBRyxDQUFDUSxDQUFKLENBQU13QyxRQUFOLENBQWUsRUFBZixDQUFELENBRFIsR0FDK0JELFdBQVcsQ0FBQy9DLEdBQUcsQ0FBQ1MsQ0FBSixDQUFNdUMsUUFBTixDQUFlLEVBQWYsQ0FBRCxDQURqRDtBQUVIO0FBRUQ7Ozs7Ozs7Ozs7Ozs7O0FBWUEsV0FBU0QsV0FBVCxDQUFxQjlDLEtBQXJCLEVBQTRCO0FBQ3hCLFFBQUlBLEtBQUssQ0FBQ0csTUFBTixLQUFpQixDQUFyQixFQUF3QjtBQUNwQkgsV0FBSyxHQUFHLE1BQU1BLEtBQWQ7QUFDSDs7QUFDRCxXQUFPQSxLQUFQO0FBQ0g7QUFFRDs7Ozs7QUFHQVIsY0FBWSxDQUFDd0MsZUFBYixHQUErQjtBQUMzQmdCLFFBQUksRUFBRSxNQURxQjtBQUUzQkMsU0FBSyxFQUFFLE1BRm9CO0FBRzNCbEIsUUFBSSxFQUFFLE1BSHFCO0FBSTNCbUIsV0FBTyxFQUFFLE1BSmtCO0FBSzNCQyxRQUFJLEVBQUUsU0FMcUI7QUFNM0JyQixTQUFLLEVBQUUsU0FOb0I7QUFPM0JzQixRQUFJLEVBQUUsTUFQcUI7QUFRM0JDLFVBQU0sRUFBRSxTQVJtQjtBQVMzQkMsUUFBSSxFQUFFLFNBVHFCO0FBVTNCQyxTQUFLLEVBQUUsU0FWb0I7QUFXM0JDLFVBQU0sRUFBRSxTQVhtQjtBQVkzQkMsVUFBTSxFQUFFLFNBWm1CO0FBYTNCNUIsT0FBRyxFQUFFLE1BYnNCO0FBYzNCNkIsVUFBTSxFQUFFLFNBZG1CO0FBZTNCQyxRQUFJLEVBQUUsU0FmcUI7QUFnQjNCQyxTQUFLLEVBQUUsTUFoQm9CO0FBaUIzQkMsVUFBTSxFQUFFO0FBakJtQixHQUEvQjtBQW9CQTs7Ozs7O0FBS0FyRSxjQUFZLENBQUNTLGNBQWIsR0FBOEJjLFNBQVMsQ0FBQyxDQUNwQyxNQURvQyxFQUM1QjtBQUNSLFFBRm9DLEVBRTVCO0FBQ1IsUUFIb0MsRUFHNUI7QUFDUixRQUpvQyxFQUk1QjtBQUNSLFFBTG9DLEVBSzVCO0FBQ1IsUUFOb0MsRUFNNUI7QUFDUixRQVBvQyxDQU81QjtBQVA0QixHQUFELENBQXZDO0FBVUF2QixjQUFZLENBQUNzRSxPQUFiLEdBQXVCLE9BQXZCOztBQUVBLE1BQUksOEJBQU9DLE1BQVAsT0FBa0IsUUFBbEIsSUFBOEJBLE1BQTlCLElBQXdDQSxNQUFNLENBQUNDLE9BQW5ELEVBQTREO0FBQ3hERCxVQUFNLENBQUNDLE9BQVAsR0FBaUJ4RSxZQUFqQjtBQUNILEdBRkQsTUFFTztBQUNIRCxXQUFPLENBQUNDLFlBQVIsR0FBdUJBLFlBQXZCO0FBQ0g7QUFFSixDQWxaQSxFQWtaQyxJQWxaRCxDQUFELEMiLCJmaWxlIjoiY2FudmFzTG9naWN+bmVhcmVzdENvbG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKGNvbnRleHQpIHtcblxuICAgIC8qKlxuICAgICAqIERlZmluZXMgYW4gYXZhaWxhYmxlIGNvbG9yLlxuICAgICAqXG4gICAgICogQHR5cGVkZWYge09iamVjdH0gQ29sb3JTcGVjXG4gICAgICogQHByb3BlcnR5IHtzdHJpbmc9fSBuYW1lIEEgbmFtZSBmb3IgdGhlIGNvbG9yLCBlLmcuLCAncmVkJ1xuICAgICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBzb3VyY2UgVGhlIGhleC1iYXNlZCBjb2xvciBzdHJpbmcsIGUuZy4sICcjRkYwJ1xuICAgICAqIEBwcm9wZXJ0eSB7UkdCfSByZ2IgVGhlIHtAbGluayBSR0J9IGNvbG9yIHZhbHVlc1xuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogRGVzY3JpYmVzIGEgbWF0Y2hlZCBjb2xvci5cbiAgICAgKlxuICAgICAqIEB0eXBlZGVmIHtPYmplY3R9IENvbG9yTWF0Y2hcbiAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgbWF0Y2hlZCBjb2xvciwgZS5nLiwgJ3JlZCdcbiAgICAgKiBAcHJvcGVydHkge3N0cmluZ30gdmFsdWUgVGhlIGhleC1iYXNlZCBjb2xvciBzdHJpbmcsIGUuZy4sICcjRkYwJ1xuICAgICAqIEBwcm9wZXJ0eSB7UkdCfSByZ2IgVGhlIHtAbGluayBSR0J9IGNvbG9yIHZhbHVlcy5cbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIFByb3ZpZGVzIHRoZSBSR0IgYnJlYWtkb3duIG9mIGEgY29sb3IuXG4gICAgICpcbiAgICAgKiBAdHlwZWRlZiB7T2JqZWN0fSBSR0JcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gciBUaGUgcmVkIGNvbXBvbmVudCwgZnJvbSAwIHRvIDI1NVxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBnIFRoZSBncmVlbiBjb21wb25lbnQsIGZyb20gMCB0byAyNTVcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gYiBUaGUgYmx1ZSBjb21wb25lbnQsIGZyb20gMCB0byAyNTVcbiAgICAgKi9cblxuICAgIC8qKlxuICAgICAqIEdldHMgdGhlIG5lYXJlc3QgY29sb3IsIGZyb20gdGhlIGdpdmVuIGxpc3Qgb2Yge0BsaW5rIENvbG9yU3BlY30gb2JqZWN0c1xuICAgICAqICh3aGljaCBkZWZhdWx0cyB0byB7QGxpbmsgbmVhcmVzdENvbG9yLkRFRkFVTFRfQ09MT1JTfSkuXG4gICAgICpcbiAgICAgKiBQcm9iYWJseSB5b3Ugd291bGRuJ3QgY2FsbCB0aGlzIG1ldGhvZCBkaXJlY3RseS4gSW5zdGVhZCB5b3UnZCBnZXQgYSBjdXN0b21cbiAgICAgKiBjb2xvciBtYXRjaGVyIGJ5IGNhbGxpbmcge0BsaW5rIG5lYXJlc3RDb2xvci5mcm9tfS5cbiAgICAgKlxuICAgICAqIEBwdWJsaWNcbiAgICAgKiBAcGFyYW0ge1JHQnxzdHJpbmd9IG5lZWRsZSBFaXRoZXIgYW4ge0BsaW5rIFJHQn0gY29sb3Igb3IgYSBoZXgtYmFzZWRcbiAgICAgKiAgICAgc3RyaW5nIHJlcHJlc2VudGluZyBvbmUsIGUuZy4sICcjRkYwJ1xuICAgICAqIEBwYXJhbSB7QXJyYXkuPENvbG9yU3BlYz49fSBjb2xvcnMgQW4gb3B0aW9uYWwgbGlzdCBvZiBhdmFpbGFibGUgY29sb3JzXG4gICAgICogICAgIChkZWZhdWx0cyB0byB7QGxpbmsgbmVhcmVzdENvbG9yLkRFRkFVTFRfQ09MT1JTfSlcbiAgICAgKiBAcmV0dXJuIHtDb2xvck1hdGNofHN0cmluZ30gSWYgdGhlIGNvbG9ycyBpbiB0aGUgcHJvdmlkZWQgbGlzdCBoYWQgbmFtZXMsXG4gICAgICogICAgIHRoZW4gYSB7QGxpbmsgQ29sb3JNYXRjaH0gb2JqZWN0IHdpdGggdGhlIG5hbWUgYW5kIChoZXgpIHZhbHVlIG9mIHRoZVxuICAgICAqICAgICBuZWFyZXN0IGNvbG9yIGZyb20gdGhlIGxpc3QuIE90aGVyd2lzZSwgc2ltcGx5IHRoZSBoZXggdmFsdWUuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIG5lYXJlc3RDb2xvcih7IHI6IDIwMCwgZzogNTAsIGI6IDUwIH0pOyAvLyA9PiAnI2YwMCdcbiAgICAgKiBuZWFyZXN0Q29sb3IoJyNmMTEnKTsgICAgICAgICAgICAgICAgICAgLy8gPT4gJyNmMDAnXG4gICAgICogbmVhcmVzdENvbG9yKCcjZjg4Jyk7ICAgICAgICAgICAgICAgICAgIC8vID0+ICcjZjgwJ1xuICAgICAqIG5lYXJlc3RDb2xvcignI2ZmZScpOyAgICAgICAgICAgICAgICAgICAvLyA9PiAnI2ZmMCdcbiAgICAgKiBuZWFyZXN0Q29sb3IoJyNlZmUnKTsgICAgICAgICAgICAgICAgICAgLy8gPT4gJyNmZjAnXG4gICAgICogbmVhcmVzdENvbG9yKCcjYWJjJyk7ICAgICAgICAgICAgICAgICAgIC8vID0+ICcjODA4J1xuICAgICAqIG5lYXJlc3RDb2xvcigncmVkJyk7ICAgICAgICAgICAgICAgICAgICAvLyA9PiAnI2YwMCdcbiAgICAgKiBuZWFyZXN0Q29sb3IoJ2ZvbycpOyAgICAgICAgICAgICAgICAgICAgLy8gPT4gdGhyb3dzXG4gICAgICovXG4gICAgZnVuY3Rpb24gbmVhcmVzdENvbG9yKG5lZWRsZSwgY29sb3JzKSB7XG4gICAgICAgIG5lZWRsZSA9IHBhcnNlQ29sb3IobmVlZGxlKTtcblxuICAgICAgICBpZiAoIW5lZWRsZSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZGlzdGFuY2VTcSxcbiAgICAgICAgICAgIG1pbkRpc3RhbmNlU3EgPSBJbmZpbml0eSxcbiAgICAgICAgICAgIHJnYixcbiAgICAgICAgICAgIHZhbHVlO1xuXG4gICAgICAgIGNvbG9ycyB8fCAoY29sb3JzID0gbmVhcmVzdENvbG9yLkRFRkFVTFRfQ09MT1JTKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbG9ycy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgcmdiID0gY29sb3JzW2ldLnJnYjtcblxuICAgICAgICAgICAgZGlzdGFuY2VTcSA9IChcbiAgICAgICAgICAgICAgICBNYXRoLnBvdyhuZWVkbGUuciAtIHJnYi5yLCAyKSArXG4gICAgICAgICAgICAgICAgTWF0aC5wb3cobmVlZGxlLmcgLSByZ2IuZywgMikgK1xuICAgICAgICAgICAgICAgIE1hdGgucG93KG5lZWRsZS5iIC0gcmdiLmIsIDIpXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBpZiAoZGlzdGFuY2VTcSA8IG1pbkRpc3RhbmNlU3EpIHtcbiAgICAgICAgICAgICAgICBtaW5EaXN0YW5jZVNxID0gZGlzdGFuY2VTcTtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGNvbG9yc1tpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2YWx1ZS5uYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIG5hbWU6IHZhbHVlLm5hbWUsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlLnNvdXJjZSxcbiAgICAgICAgICAgICAgICByZ2I6IHZhbHVlLnJnYixcbiAgICAgICAgICAgICAgICBkaXN0YW5jZTogTWF0aC5zcXJ0KG1pbkRpc3RhbmNlU3EpXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlLnNvdXJjZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQcm92aWRlcyBhIG1hdGNoZXIgdG8gZmluZCB0aGUgbmVhcmVzdCBjb2xvciBiYXNlZCBvbiB0aGUgcHJvdmlkZWQgbGlzdCBvZlxuICAgICAqIGF2YWlsYWJsZSBjb2xvcnMuXG4gICAgICpcbiAgICAgKiBAcHVibGljXG4gICAgICogQHBhcmFtIHtBcnJheS48c3RyaW5nPnxPYmplY3R9IGF2YWlsYWJsZUNvbG9ycyBBbiBhcnJheSBvZiBoZXgtYmFzZWQgY29sb3JcbiAgICAgKiAgICAgc3RyaW5ncywgb3IgYW4gb2JqZWN0IG1hcHBpbmcgY29sb3IgKm5hbWVzKiB0byBoZXggdmFsdWVzLlxuICAgICAqIEByZXR1cm4ge2Z1bmN0aW9uKHN0cmluZyk6Q29sb3JNYXRjaHxzdHJpbmd9IEEgZnVuY3Rpb24gd2l0aCB0aGUgc2FtZVxuICAgICAqICAgICBiZWhhdmlvciBhcyB7QGxpbmsgbmVhcmVzdENvbG9yfSwgYnV0IHdpdGggdGhlIGxpc3Qgb2YgY29sb3JzXG4gICAgICogICAgIHByZWRlZmluZWQuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHZhciBjb2xvcnMgPSB7XG4gICAgICogICAnbWFyb29uJzogJyM4MDAnLFxuICAgICAqICAgJ2xpZ2h0IHllbGxvdyc6IHsgcjogMjU1LCBnOiAyNTUsIGI6IDUxIH0sXG4gICAgICogICAncGFsZSBibHVlJzogJyNkZWYnLFxuICAgICAqICAgJ3doaXRlJzogJ2ZmZidcbiAgICAgKiB9O1xuICAgICAqXG4gICAgICogdmFyIGJnQ29sb3JzID0gW1xuICAgICAqICAgJyNlZWUnLFxuICAgICAqICAgJyM0NDQnXG4gICAgICogXTtcbiAgICAgKlxuICAgICAqIHZhciBpbnZhbGlkQ29sb3JzID0ge1xuICAgICAqICAgJ2ludmFsaWQnOiAnZm9vJ1xuICAgICAqIH07XG4gICAgICpcbiAgICAgKiB2YXIgZ2V0Q29sb3IgPSBuZWFyZXN0Q29sb3IuZnJvbShjb2xvcnMpO1xuICAgICAqIHZhciBnZXRCR0NvbG9yID0gZ2V0Q29sb3IuZnJvbShiZ0NvbG9ycyk7XG4gICAgICogdmFyIGdldEFueUNvbG9yID0gbmVhcmVzdENvbG9yLmZyb20oY29sb3JzKS5vcihiZ0NvbG9ycyk7XG4gICAgICpcbiAgICAgKiBnZXRDb2xvcignZmZlJyk7XG4gICAgICogLy8gPT4geyBuYW1lOiAnd2hpdGUnLCB2YWx1ZTogJ2ZmZicsIHJnYjogeyByOiAyNTUsIGc6IDI1NSwgYjogMjU1IH0sIGRpc3RhbmNlOiAxN31cbiAgICAgKlxuICAgICAqIGdldENvbG9yKCcjZjAwJyk7XG4gICAgICogLy8gPT4geyBuYW1lOiAnbWFyb29uJywgdmFsdWU6ICcjODAwJywgcmdiOiB7IHI6IDEzNiwgZzogMCwgYjogMCB9LCBkaXN0YW5jZTogMTE5fVxuICAgICAqXG4gICAgICogZ2V0Q29sb3IoJyNmZjAnKTtcbiAgICAgKiAvLyA9PiB7IG5hbWU6ICdsaWdodCB5ZWxsb3cnLCB2YWx1ZTogJyNmZmZmMzMnLCByZ2I6IHsgcjogMjU1LCBnOiAyNTUsIGI6IDUxIH0sIGRpc3RhbmNlOiA1MX1cbiAgICAgKlxuICAgICAqIGdldEJHQ29sb3IoJyNmZmYnKTsgLy8gPT4gJyNlZWUnXG4gICAgICogZ2V0QkdDb2xvcignIzAwMCcpOyAvLyA9PiAnIzQ0NCdcbiAgICAgKlxuICAgICAqIGdldEFueUNvbG9yKCcjZjAwJyk7XG4gICAgICogLy8gPT4geyBuYW1lOiAnbWFyb29uJywgdmFsdWU6ICcjODAwJywgcmdiOiB7IHI6IDEzNiwgZzogMCwgYjogMCB9LCBkaXN0YW5jZTogMTE5fVxuICAgICAqXG4gICAgICogZ2V0QW55Q29sb3IoJyM4ODgnKTsgLy8gPT4gJyM0NDQnXG4gICAgICpcbiAgICAgKiBuZWFyZXN0Q29sb3IuZnJvbShpbnZhbGlkQ29sb3JzKTsgLy8gPT4gdGhyb3dzXG4gICAgICovXG4gICAgbmVhcmVzdENvbG9yLmZyb20gPSBmdW5jdGlvbiBmcm9tKGF2YWlsYWJsZUNvbG9ycykge1xuICAgICAgICB2YXIgY29sb3JzID0gbWFwQ29sb3JzKGF2YWlsYWJsZUNvbG9ycyksXG4gICAgICAgICAgICBuZWFyZXN0Q29sb3JCYXNlID0gbmVhcmVzdENvbG9yO1xuXG4gICAgICAgIHZhciBtYXRjaGVyID0gZnVuY3Rpb24gbmVhcmVzdENvbG9yKGhleCkge1xuICAgICAgICAgICAgcmV0dXJuIG5lYXJlc3RDb2xvckJhc2UoaGV4LCBjb2xvcnMpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIEtlZXAgdGhlICdmcm9tJyBtZXRob2QsIHRvIHN1cHBvcnQgY2hhbmdpbmcgdGhlIGxpc3Qgb2YgYXZhaWxhYmxlIGNvbG9yc1xuICAgICAgICAvLyBtdWx0aXBsZSB0aW1lcyB3aXRob3V0IG5lZWRpbmcgdG8ga2VlcCBhIHJlZmVyZW5jZSB0byB0aGUgb3JpZ2luYWxcbiAgICAgICAgLy8gbmVhcmVzdENvbG9yIGZ1bmN0aW9uLlxuICAgICAgICBtYXRjaGVyLmZyb20gPSBmcm9tO1xuXG4gICAgICAgIC8vIEFsc28gcHJvdmlkZSBhIHdheSB0byBjb21iaW5lIG11bHRpcGxlIGNvbG9yIGxpc3RzLlxuICAgICAgICBtYXRjaGVyLm9yID0gZnVuY3Rpb24gb3IoYWx0ZXJuYXRlQ29sb3JzKSB7XG4gICAgICAgICAgICB2YXIgZXh0ZW5kZWRDb2xvcnMgPSBjb2xvcnMuY29uY2F0KG1hcENvbG9ycyhhbHRlcm5hdGVDb2xvcnMpKTtcbiAgICAgICAgICAgIHJldHVybiBuZWFyZXN0Q29sb3IuZnJvbShleHRlbmRlZENvbG9ycyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG1hdGNoZXI7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEdpdmVuIGVpdGhlciBhbiBhcnJheSBvciBvYmplY3Qgb2YgY29sb3JzLCByZXR1cm5zIGFuIGFycmF5IG9mXG4gICAgICoge0BsaW5rIENvbG9yU3BlY30gb2JqZWN0cyAod2l0aCB7QGxpbmsgUkdCfSB2YWx1ZXMpLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fE9iamVjdH0gY29sb3JzIEFuIGFycmF5IG9mIGhleC1iYXNlZCBjb2xvciBzdHJpbmdzLCBvclxuICAgICAqICAgICBhbiBvYmplY3QgbWFwcGluZyBjb2xvciAqbmFtZXMqIHRvIGhleCB2YWx1ZXMuXG4gICAgICogQHJldHVybiB7QXJyYXkuPENvbG9yU3BlYz59IEFuIGFycmF5IG9mIHtAbGluayBDb2xvclNwZWN9IG9iamVjdHNcbiAgICAgKiAgICAgcmVwcmVzZW50aW5nIHRoZSBzYW1lIGNvbG9ycyBwYXNzZWQgaW4uXG4gICAgICovXG4gICAgZnVuY3Rpb24gbWFwQ29sb3JzKGNvbG9ycykge1xuICAgICAgICBpZiAoY29sb3JzIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIHJldHVybiBjb2xvcnMubWFwKGZ1bmN0aW9uKGNvbG9yKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNyZWF0ZUNvbG9yU3BlYyhjb2xvcik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBPYmplY3Qua2V5cyhjb2xvcnMpLm1hcChmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gY3JlYXRlQ29sb3JTcGVjKGNvbG9yc1tuYW1lXSwgbmFtZSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBQYXJzZXMgYSBjb2xvciBmcm9tIGEgc3RyaW5nLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge1JHQnxzdHJpbmd9IHNvdXJjZVxuICAgICAqIEByZXR1cm4ge1JHQn1cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogcGFyc2VDb2xvcih7IHI6IDMsIGc6IDIyLCBiOiAxMTEgfSk7IC8vID0+IHsgcjogMywgZzogMjIsIGI6IDExMSB9XG4gICAgICogcGFyc2VDb2xvcignI2YwMCcpOyAgICAgICAgICAgICAgICAgIC8vID0+IHsgcjogMjU1LCBnOiAwLCBiOiAwIH1cbiAgICAgKiBwYXJzZUNvbG9yKCcjMDRmYmM4Jyk7ICAgICAgICAgICAgICAgLy8gPT4geyByOiA0LCBnOiAyNTEsIGI6IDIwMCB9XG4gICAgICogcGFyc2VDb2xvcignI0ZGMCcpOyAgICAgICAgICAgICAgICAgIC8vID0+IHsgcjogMjU1LCBnOiAyNTUsIGI6IDAgfVxuICAgICAqIHBhcnNlQ29sb3IoJ3JnYigzLCAxMCwgMTAwKScpOyAgICAgICAvLyA9PiB7IHI6IDMsIGc6IDEwLCBiOiAxMDAgfVxuICAgICAqIHBhcnNlQ29sb3IoJ3JnYig1MCUsIDAlLCA1MCUpJyk7ICAgICAvLyA9PiB7IHI6IDEyOCwgZzogMCwgYjogMTI4IH1cbiAgICAgKiBwYXJzZUNvbG9yKCdhcXVhJyk7ICAgICAgICAgICAgICAgICAgLy8gPT4geyByOiAwLCBnOiAyNTUsIGI6IDI1NSB9XG4gICAgICogcGFyc2VDb2xvcignZmZmJyk7ICAgICAgICAgICAgICAgICAgIC8vID0+IHsgcjogMjU1LCBnOiAyNTUsIGI6IDI1NSB9XG4gICAgICogcGFyc2VDb2xvcignZm9vJyk7ICAgICAgICAgICAgICAgICAgIC8vID0+IHRocm93c1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIHBhcnNlQ29sb3Ioc291cmNlKSB7XG4gICAgICAgIHZhciByZWQsIGdyZWVuLCBibHVlO1xuXG4gICAgICAgIGlmICh0eXBlb2Ygc291cmNlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgcmV0dXJuIHNvdXJjZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzb3VyY2UgaW4gbmVhcmVzdENvbG9yLlNUQU5EQVJEX0NPTE9SUykge1xuICAgICAgICAgICAgcmV0dXJuIHBhcnNlQ29sb3IobmVhcmVzdENvbG9yLlNUQU5EQVJEX0NPTE9SU1tzb3VyY2VdKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBoZXhNYXRjaCA9IHNvdXJjZS5tYXRjaCgvXiM/KCg/OlswLTlhLWZdezN9KXsxLDJ9KSQvaSk7XG4gICAgICAgIGlmIChoZXhNYXRjaCkge1xuICAgICAgICAgICAgaGV4TWF0Y2ggPSBoZXhNYXRjaFsxXTtcblxuICAgICAgICAgICAgaWYgKGhleE1hdGNoLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgICAgICAgIGhleE1hdGNoID0gW1xuICAgICAgICAgICAgICAgICAgICBoZXhNYXRjaC5jaGFyQXQoMCkgKyBoZXhNYXRjaC5jaGFyQXQoMCksXG4gICAgICAgICAgICAgICAgICAgIGhleE1hdGNoLmNoYXJBdCgxKSArIGhleE1hdGNoLmNoYXJBdCgxKSxcbiAgICAgICAgICAgICAgICAgICAgaGV4TWF0Y2guY2hhckF0KDIpICsgaGV4TWF0Y2guY2hhckF0KDIpXG4gICAgICAgICAgICAgICAgXTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBoZXhNYXRjaCA9IFtcbiAgICAgICAgICAgICAgICAgICAgaGV4TWF0Y2guc3Vic3RyaW5nKDAsIDIpLFxuICAgICAgICAgICAgICAgICAgICBoZXhNYXRjaC5zdWJzdHJpbmcoMiwgNCksXG4gICAgICAgICAgICAgICAgICAgIGhleE1hdGNoLnN1YnN0cmluZyg0LCA2KVxuICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJlZCA9IHBhcnNlSW50KGhleE1hdGNoWzBdLCAxNik7XG4gICAgICAgICAgICBncmVlbiA9IHBhcnNlSW50KGhleE1hdGNoWzFdLCAxNik7XG4gICAgICAgICAgICBibHVlID0gcGFyc2VJbnQoaGV4TWF0Y2hbMl0sIDE2KTtcblxuICAgICAgICAgICAgcmV0dXJuIHsgcjogcmVkLCBnOiBncmVlbiwgYjogYmx1ZSB9O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHJnYk1hdGNoID0gc291cmNlLm1hdGNoKC9ecmdiXFwoXFxzKihcXGR7MSwzfSU/KSxcXHMqKFxcZHsxLDN9JT8pLFxccyooXFxkezEsM30lPylcXHMqXFwpJC9pKTtcbiAgICAgICAgaWYgKHJnYk1hdGNoKSB7XG4gICAgICAgICAgICByZWQgPSBwYXJzZUNvbXBvbmVudFZhbHVlKHJnYk1hdGNoWzFdKTtcbiAgICAgICAgICAgIGdyZWVuID0gcGFyc2VDb21wb25lbnRWYWx1ZShyZ2JNYXRjaFsyXSk7XG4gICAgICAgICAgICBibHVlID0gcGFyc2VDb21wb25lbnRWYWx1ZShyZ2JNYXRjaFszXSk7XG5cbiAgICAgICAgICAgIHJldHVybiB7IHI6IHJlZCwgZzogZ3JlZW4sIGI6IGJsdWUgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRocm93IEVycm9yKCdcIicgKyBzb3VyY2UgKyAnXCIgaXMgbm90IGEgdmFsaWQgY29sb3InKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEge0BsaW5rIENvbG9yU3BlY30gZnJvbSBlaXRoZXIgYSBzdHJpbmcgb3IgYW4ge0BsaW5rIFJHQn0uXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfFJHQn0gaW5wdXRcbiAgICAgKiBAcGFyYW0ge3N0cmluZz19IG5hbWVcbiAgICAgKiBAcmV0dXJuIHtDb2xvclNwZWN9XG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIGNyZWF0ZUNvbG9yU3BlYygnIzgwMCcpOyAvLyA9PiB7XG4gICAgICogICBzb3VyY2U6ICcjODAwJyxcbiAgICAgKiAgIHJnYjogeyByOiAxMzYsIGc6IDAsIGI6IDAgfVxuICAgICAqIH1cbiAgICAgKlxuICAgICAqIGNyZWF0ZUNvbG9yU3BlYygnIzgwMCcsICdtYXJvb24nKTsgLy8gPT4ge1xuICAgICAqICAgbmFtZTogJ21hcm9vbicsXG4gICAgICogICBzb3VyY2U6ICcjODAwJyxcbiAgICAgKiAgIHJnYjogeyByOiAxMzYsIGc6IDAsIGI6IDAgfVxuICAgICAqIH1cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBjcmVhdGVDb2xvclNwZWMoaW5wdXQsIG5hbWUpIHtcbiAgICAgICAgdmFyIGNvbG9yID0ge307XG5cbiAgICAgICAgaWYgKG5hbWUpIHtcbiAgICAgICAgICAgIGNvbG9yLm5hbWUgPSBuYW1lO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGNvbG9yLnNvdXJjZSA9IGlucHV0O1xuICAgICAgICAgICAgY29sb3IucmdiID0gcGFyc2VDb2xvcihpbnB1dCk7XG5cbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgaW5wdXQgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAvLyBUaGlzIGlzIGZvciBpZi93aGVuIHdlJ3JlIGNvbmNhdGVuYXRpbmcgbGlzdHMgb2YgY29sb3JzLlxuICAgICAgICAgICAgaWYgKGlucHV0LnNvdXJjZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjcmVhdGVDb2xvclNwZWMoaW5wdXQuc291cmNlLCBpbnB1dC5uYW1lKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29sb3IucmdiID0gaW5wdXQ7XG4gICAgICAgICAgICBjb2xvci5zb3VyY2UgPSByZ2JUb0hleChpbnB1dCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29sb3I7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUGFyc2VzIGEgdmFsdWUgYmV0d2VlbiAwLTI1NSBmcm9tIGEgc3RyaW5nLlxuICAgICAqXG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nXG4gICAgICogQHJldHVybiB7bnVtYmVyfVxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBwYXJzZUNvbXBvbmVudFZhbHVlKCcxMDAnKTsgIC8vID0+IDEwMFxuICAgICAqIHBhcnNlQ29tcG9uZW50VmFsdWUoJzEwMCUnKTsgLy8gPT4gMjU1XG4gICAgICogcGFyc2VDb21wb25lbnRWYWx1ZSgnNTAlJyk7ICAvLyA9PiAxMjhcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBwYXJzZUNvbXBvbmVudFZhbHVlKHN0cmluZykge1xuICAgICAgICBpZiAoc3RyaW5nLmNoYXJBdChzdHJpbmcubGVuZ3RoIC0gMSkgPT09ICclJykge1xuICAgICAgICAgICAgcmV0dXJuIE1hdGgucm91bmQocGFyc2VJbnQoc3RyaW5nLCAxMCkgKiAyNTUgLyAxMDApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIE51bWJlcihzdHJpbmcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvbnZlcnRzIGFuIHtAbGluayBSR0J9IGNvbG9yIHRvIGl0cyBoZXggcmVwcmVzZW50YXRpb24uXG4gICAgICpcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEBwYXJhbSB7UkdCfSByZ2JcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIHJnYlRvSGV4KHsgcjogMjU1LCBnOiAxMjgsIGI6IDAgfSk7IC8vID0+ICcjZmY4MDAwJ1xuICAgICAqL1xuICAgIGZ1bmN0aW9uIHJnYlRvSGV4KHJnYikge1xuICAgICAgICByZXR1cm4gJyMnICsgbGVhZGluZ1plcm8ocmdiLnIudG9TdHJpbmcoMTYpKSArXG4gICAgICAgICAgICBsZWFkaW5nWmVybyhyZ2IuZy50b1N0cmluZygxNikpICsgbGVhZGluZ1plcm8ocmdiLmIudG9TdHJpbmcoMTYpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBQdXRzIGEgMCBpbiBmcm9udCBvZiBhIG51bWVyaWMgc3RyaW5nIGlmIGl0J3Mgb25seSBvbmUgZGlnaXQuIE90aGVyd2lzZVxuICAgICAqIG5vdGhpbmcgKGp1c3QgcmV0dXJucyB0aGUgdmFsdWUgcGFzc2VkIGluKS5cbiAgICAgKlxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHZhbHVlXG4gICAgICogQHJldHVyblxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBsZWFkaW5nWmVybygnMScpOyAgLy8gPT4gJzAxJ1xuICAgICAqIGxlYWRpbmdaZXJvKCcxMicpOyAvLyA9PiAnMTInXG4gICAgICovXG4gICAgZnVuY3Rpb24gbGVhZGluZ1plcm8odmFsdWUpIHtcbiAgICAgICAgaWYgKHZhbHVlLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgdmFsdWUgPSAnMCcgKyB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQSBtYXAgZnJvbSB0aGUgbmFtZXMgb2Ygc3RhbmRhcmQgQ1NTIGNvbG9ycyB0byB0aGVpciBoZXggdmFsdWVzLlxuICAgICAqL1xuICAgIG5lYXJlc3RDb2xvci5TVEFOREFSRF9DT0xPUlMgPSB7XG4gICAgICAgIGFxdWE6ICcjMGZmJyxcbiAgICAgICAgYmxhY2s6ICcjMDAwJyxcbiAgICAgICAgYmx1ZTogJyMwMGYnLFxuICAgICAgICBmdWNoc2lhOiAnI2YwZicsXG4gICAgICAgIGdyYXk6ICcjODA4MDgwJyxcbiAgICAgICAgZ3JlZW46ICcjMDA4MDAwJyxcbiAgICAgICAgbGltZTogJyMwZjAnLFxuICAgICAgICBtYXJvb246ICcjODAwMDAwJyxcbiAgICAgICAgbmF2eTogJyMwMDAwODAnLFxuICAgICAgICBvbGl2ZTogJyM4MDgwMDAnLFxuICAgICAgICBvcmFuZ2U6ICcjZmZhNTAwJyxcbiAgICAgICAgcHVycGxlOiAnIzgwMDA4MCcsXG4gICAgICAgIHJlZDogJyNmMDAnLFxuICAgICAgICBzaWx2ZXI6ICcjYzBjMGMwJyxcbiAgICAgICAgdGVhbDogJyMwMDgwODAnLFxuICAgICAgICB3aGl0ZTogJyNmZmYnLFxuICAgICAgICB5ZWxsb3c6ICcjZmYwJ1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBEZWZhdWx0IGNvbG9ycy4gQ29tcHJpc2VzIHRoZSBjb2xvcnMgb2YgdGhlIHJhaW5ib3cgKGdvb2Qgb2wnIFJPWSBHLiBCSVYpLlxuICAgICAqIFRoaXMgbGlzdCB3aWxsIGJlIHVzZWQgZm9yIGNhbGxzIHRvIHtAbmVhcmVzdENvbG9yfSB0aGF0IGRvbid0IHNwZWNpZnkgYSBsaXN0XG4gICAgICogb2YgYXZhaWxhYmxlIGNvbG9ycyB0byBtYXRjaC5cbiAgICAgKi9cbiAgICBuZWFyZXN0Q29sb3IuREVGQVVMVF9DT0xPUlMgPSBtYXBDb2xvcnMoW1xuICAgICAgICAnI2YwMCcsIC8vIHJcbiAgICAgICAgJyNmODAnLCAvLyBvXG4gICAgICAgICcjZmYwJywgLy8geVxuICAgICAgICAnIzBmMCcsIC8vIGdcbiAgICAgICAgJyMwMGYnLCAvLyBiXG4gICAgICAgICcjMDA4JywgLy8gaVxuICAgICAgICAnIzgwOCcgIC8vIHZcbiAgICBdKTtcblxuICAgIG5lYXJlc3RDb2xvci5WRVJTSU9OID0gJzAuNC40JztcblxuICAgIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBuZWFyZXN0Q29sb3I7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgY29udGV4dC5uZWFyZXN0Q29sb3IgPSBuZWFyZXN0Q29sb3I7XG4gICAgfVxuXG59KHRoaXMpKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=