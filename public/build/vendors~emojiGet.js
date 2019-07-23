(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendors~emojiGet"],{

/***/ "./node_modules/core-js/internals/fix-regexp-well-known-symbol-logic.js":
/*!******************************************************************************!*\
  !*** ./node_modules/core-js/internals/fix-regexp-well-known-symbol-logic.js ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var hide = __webpack_require__(/*! ../internals/hide */ "./node_modules/core-js/internals/hide.js");
var redefine = __webpack_require__(/*! ../internals/redefine */ "./node_modules/core-js/internals/redefine.js");
var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");
var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");
var regexpExec = __webpack_require__(/*! ../internals/regexp-exec */ "./node_modules/core-js/internals/regexp-exec.js");

var SPECIES = wellKnownSymbol('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
// Weex JS has frozen built-in prototypes, so use try / catch wrapper
var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
});

module.exports = function (KEY, length, exec, sham) {
  var SYMBOL = wellKnownSymbol(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;
    re.exec = function () { execCalled = true; return null; };

    if (KEY === 'split') {
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
    }

    re[SYMBOL]('');
    return !execCalled;
  });

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
      if (regexp.exec === regexpExec) {
        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
          // The native String method already delegates to @@method (this
          // polyfilled function), leasing to infinite recursion.
          // We avoid it by directly calling the native @@method method.
          return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
        }
        return { done: true, value: nativeMethod.call(str, regexp, arg2) };
      }
      return { done: false };
    });
    var stringMethod = methods[0];
    var regexMethod = methods[1];

    redefine(String.prototype, KEY, stringMethod);
    redefine(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return regexMethod.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return regexMethod.call(string, this); }
    );
    if (sham) hide(RegExp.prototype[SYMBOL], 'sham', true);
  }
};


/***/ }),

/***/ "./node_modules/core-js/internals/regexp-exec-abstract.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/internals/regexp-exec-abstract.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(/*! ./classof-raw */ "./node_modules/core-js/internals/classof-raw.js");
var regexpExec = __webpack_require__(/*! ./regexp-exec */ "./node_modules/core-js/internals/regexp-exec.js");

// `RegExpExec` abstract operation
// https://tc39.github.io/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }

  if (classof(R) !== 'RegExp') {
    throw TypeError('RegExp#exec called on incompatible receiver');
  }

  return regexpExec.call(R, S);
};



/***/ }),

/***/ "./node_modules/core-js/internals/regexp-exec.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/internals/regexp-exec.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var regexpFlags = __webpack_require__(/*! ./regexp-flags */ "./node_modules/core-js/internals/regexp-flags.js");

var nativeExec = RegExp.prototype.exec;
// This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.
var nativeReplace = String.prototype.replace;

var patchedExec = nativeExec;

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/;
  var re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
})();

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + re.source + '$(?!\\s)', regexpFlags.call(re));
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

    match = nativeExec.call(re, str);

    if (UPDATES_LAST_INDEX_WRONG && match) {
      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

module.exports = patchedExec;


/***/ }),

/***/ "./node_modules/core-js/internals/regexp-flags.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/regexp-flags.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");

// `RegExp.prototype.flags` getter implementation
// https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.dotAll) result += 's';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};


/***/ }),

/***/ "./node_modules/core-js/internals/same-value.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/same-value.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// `SameValue` abstract operation
// https://tc39.github.io/ecma262/#sec-samevalue
module.exports = Object.is || function is(x, y) {
  // eslint-disable-next-line no-self-compare
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};


/***/ }),

/***/ "./node_modules/core-js/modules/es.regexp.exec.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/modules/es.regexp.exec.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var exec = __webpack_require__(/*! ../internals/regexp-exec */ "./node_modules/core-js/internals/regexp-exec.js");

$({ target: 'RegExp', proto: true, forced: /./.exec !== exec }, {
  exec: exec
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.string.search.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/modules/es.string.search.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fixRegExpWellKnownSymbolLogic = __webpack_require__(/*! ../internals/fix-regexp-well-known-symbol-logic */ "./node_modules/core-js/internals/fix-regexp-well-known-symbol-logic.js");
var anObject = __webpack_require__(/*! ../internals/an-object */ "./node_modules/core-js/internals/an-object.js");
var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js/internals/require-object-coercible.js");
var sameValue = __webpack_require__(/*! ../internals/same-value */ "./node_modules/core-js/internals/same-value.js");
var regExpExec = __webpack_require__(/*! ../internals/regexp-exec-abstract */ "./node_modules/core-js/internals/regexp-exec-abstract.js");

// @@search logic
fixRegExpWellKnownSymbolLogic('search', 1, function (SEARCH, nativeSearch, maybeCallNative) {
  return [
    // `String.prototype.search` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.search
    function search(regexp) {
      var O = requireObjectCoercible(this);
      var searcher = regexp == undefined ? undefined : regexp[SEARCH];
      return searcher !== undefined ? searcher.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
    },
    // `RegExp.prototype[@@search]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@search
    function (regexp) {
      var res = maybeCallNative(nativeSearch, regexp, this);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);

      var previousLastIndex = rx.lastIndex;
      if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
      var result = regExpExec(rx, S);
      if (!sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
      return result === null ? -1 : result.index;
    }
  ];
});


/***/ }),

/***/ "./node_modules/lodash.toarray/index.js":
/*!**********************************************!*\
  !*** ./node_modules/lodash.toarray/index.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f\\ufe20-\\ufe23',
    rsComboSymbolsRange = '\\u20d0-\\u20f0',
    rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsAstral = '[' + rsAstralRange + ']',
    rsCombo = '[' + rsComboMarksRange + rsComboSymbolsRange + ']',
    rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    rsNonAstral = '[^' + rsAstralRange + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsZWJ = '\\u200d';

/** Used to compose unicode regexes. */
var reOptMod = rsModifier + '?',
    rsOptVar = '[' + rsVarRange + ']?',
    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboMarksRange + rsComboSymbolsRange + rsVarRange + ']');

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

/**
 * Converts an ASCII `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function asciiToArray(string) {
  return string.split('');
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * The base implementation of `_.values` and `_.valuesIn` which creates an
 * array of `object` property values corresponding to the property names
 * of `props`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the array of property values.
 */
function baseValues(object, props) {
  return arrayMap(props, function(key) {
    return object[key];
  });
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `string` contains Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a symbol is found, else `false`.
 */
function hasUnicode(string) {
  return reHasUnicode.test(string);
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Converts `iterator` to an array.
 *
 * @private
 * @param {Object} iterator The iterator to convert.
 * @returns {Array} Returns the converted array.
 */
function iteratorToArray(iterator) {
  var data,
      result = [];

  while (!(data = iterator.next()).done) {
    result.push(data.value);
  }
  return result;
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/**
 * Converts `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function stringToArray(string) {
  return hasUnicode(string)
    ? unicodeToArray(string)
    : asciiToArray(string);
}

/**
 * Converts a Unicode `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function unicodeToArray(string) {
  return string.match(reUnicode) || [];
}

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Symbol = root.Symbol,
    iteratorSymbol = Symbol ? Symbol.iterator : undefined,
    propertyIsEnumerable = objectProto.propertyIsEnumerable;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = overArg(Object.keys, Object);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
    Map = getNative(root, 'Map'),
    Promise = getNative(root, 'Promise'),
    Set = getNative(root, 'Set'),
    WeakMap = getNative(root, 'WeakMap');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = (isArray(value) || isArguments(value))
    ? baseTimes(value.length, String)
    : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * The base implementation of `getTag`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  return objectToString.call(value);
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge < 14, and promises in Node.js.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = objectToString.call(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : undefined;

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a string, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString(value) {
  return typeof value == 'string' ||
    (!isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag);
}

/**
 * Converts `value` to an array.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Array} Returns the converted array.
 * @example
 *
 * _.toArray({ 'a': 1, 'b': 2 });
 * // => [1, 2]
 *
 * _.toArray('abc');
 * // => ['a', 'b', 'c']
 *
 * _.toArray(1);
 * // => []
 *
 * _.toArray(null);
 * // => []
 */
function toArray(value) {
  if (!value) {
    return [];
  }
  if (isArrayLike(value)) {
    return isString(value) ? stringToArray(value) : copyArray(value);
  }
  if (iteratorSymbol && value[iteratorSymbol]) {
    return iteratorToArray(value[iteratorSymbol]());
  }
  var tag = getTag(value),
      func = tag == mapTag ? mapToArray : (tag == setTag ? setToArray : values);

  return func(value);
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * Creates an array of the own enumerable string keyed property values of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property values.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.values(new Foo);
 * // => [1, 2] (iteration order is not guaranteed)
 *
 * _.values('hi');
 * // => ['h', 'i']
 */
function values(object) {
  return object ? baseValues(object, keys(object)) : [];
}

module.exports = toArray;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/node-emoji/index.js":
/*!******************************************!*\
  !*** ./node_modules/node-emoji/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./lib/emoji */ "./node_modules/node-emoji/lib/emoji.js");

/***/ }),

/***/ "./node_modules/node-emoji/lib/emoji.js":
/*!**********************************************!*\
  !*** ./node_modules/node-emoji/lib/emoji.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*jslint node: true*/
var toArray = __webpack_require__(/*! lodash.toarray */ "./node_modules/lodash.toarray/index.js");
var emojiByName = __webpack_require__(/*! ./emoji.json */ "./node_modules/node-emoji/lib/emoji.json");

"use strict";

/**
 * regex to parse emoji in a string - finds emoji, e.g. :coffee:
 */
var emojiNameRegex = /:([a-zA-Z0-9_\-\+]+):/g;

/**
 * regex to trim whitespace
 * use instead of String.prototype.trim() for IE8 support
 */
var trimSpaceRegex = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

/**
 * Removes colons on either side
 * of the string if present
 * @param  {string} str
 * @return {string}
 */
function stripColons (str) {
  var colonIndex = str.indexOf(':');
  if (colonIndex > -1) {
    // :emoji: (http://www.emoji-cheat-sheet.com/)
    if (colonIndex === str.length - 1) {
      str = str.substring(0, colonIndex);
      return stripColons(str);
    } else {
      str = str.substr(colonIndex + 1);
      return stripColons(str);
    }
  }

  return str;
}

/**
 * Adds colons to either side
 * of the string
 * @param {string} str
 * @return {string}
 */
function wrapColons (str) {
  return (typeof str === 'string' && str.length > 0) ? ':' + str + ':' : str;
}

/**
 * Ensure that the word is wrapped in colons
 * by only adding them, if they are not there.
 * @param {string} str
 * @return {string}
 */
function ensureColons (str) {
  return (typeof str === 'string' && str[0] !== ':') ? wrapColons(str) : str;
}

// Non spacing mark, some emoticons have them. It's the 'Variant Form',
// which provides more information so that emoticons can be rendered as
// more colorful graphics. FE0E is a unicode text version, where as FE0F
// should be rendered as a graphical version. The code gracefully degrades.
var NON_SPACING_MARK = String.fromCharCode(65039); // 65039 - '️' - 0xFE0F;
var nonSpacingRegex = new RegExp(NON_SPACING_MARK, 'g')

// Remove the non-spacing-mark from the code, never send a stripped version
// to the client, as it kills graphical emoticons.
function stripNSB (code) {
  return code.replace(nonSpacingRegex, '');
};

// Reversed hash table, where as emojiByName contains a { heart: '❤' }
// dictionary emojiByCode contains { ❤: 'heart' }. The codes are normalized
// to the text version.
var emojiByCode = Object.keys(emojiByName).reduce(function(h,k) {
  h[stripNSB(emojiByName[k])] = k;
  return h;
}, {});

/**
 * Emoji namespace
 */
var Emoji = {
  emoji: emojiByName,
};

/**
 * get emoji code from name
 * @param  {string} emoji
 * @return {string}
 */
Emoji._get = function _get (emoji) {
  if (emojiByName.hasOwnProperty(emoji)) {
    return emojiByName[emoji];
  }

  return ensureColons(emoji);
};

/**
 * get emoji code from :emoji: string or name
 * @param  {string} emoji
 * @return {string}
 */
Emoji.get = function get (emoji) {
  emoji = stripColons(emoji);

  return Emoji._get(emoji);
};

/**
 * find the emoji by either code or name
 * @param {string} nameOrCode The emoji to find, either `coffee`, `:coffee:` or `☕`;
 * @return {object}
 */
Emoji.find = function find (nameOrCode) {
  return Emoji.findByName(nameOrCode) || Emoji.findByCode(nameOrCode);
};

/**
 * find the emoji by name
 * @param {string} name The emoji to find either `coffee` or `:coffee:`;
 * @return {object}
 */
Emoji.findByName = function findByName (name) {
  var stripped = stripColons(name);
  var emoji = emojiByName[stripped];

  return emoji ? ({ emoji: emoji, key: stripped }) : undefined;
};

/**
 * find the emoji by code (emoji)
 * @param {string} code The emoji to find; for example `☕` or `☔`
 * @return {object}
 */
Emoji.findByCode = function findByCode (code) {
  var stripped = stripNSB(code);
  var name = emojiByCode[stripped];

  // lookup emoji to ensure the Variant Form is returned
  return name ? ({ emoji: emojiByName[name], key: name }) : undefined;
};


/**
 * Check if an emoji is known by this library
 * @param {string} nameOrCode The emoji to validate, either `coffee`, `:coffee:` or `☕`;
 * @return {object}
 */
Emoji.hasEmoji = function hasEmoji (nameOrCode) {
  return Emoji.hasEmojiByName(nameOrCode) || Emoji.hasEmojiByCode(nameOrCode);
};

/**
 * Check if an emoji with given name is known by this library
 * @param {string} name The emoji to validate either `coffee` or `:coffee:`;
 * @return {object}
 */
Emoji.hasEmojiByName = function hasEmojiByName (name) {
  var result = Emoji.findByName(name);
  return !!result && result.key === stripColons(name);
};

/**
 * Check if a given emoji is known by this library
 * @param {string} code The emoji to validate; for example `☕` or `☔`
 * @return {object}
 */
Emoji.hasEmojiByCode = function hasEmojiByCode (code) {
  var result = Emoji.findByCode(code);
  return !!result && stripNSB(result.emoji) === stripNSB(code);
};

/**
 * get emoji name from code
 * @param  {string} emoji
 * @param  {boolean} includeColons should the result include the ::
 * @return {string}
 */
Emoji.which = function which (emoji_code, includeColons) {
  var code = stripNSB(emoji_code);
  var word = emojiByCode[code];

  return includeColons ? wrapColons(word) : word;
};

/**
 * emojify a string (replace :emoji: with an emoji)
 * @param  {string} str
 * @param  {function} on_missing (gets emoji name without :: and returns a proper emoji if no emoji was found)
 * @param  {function} format (wrap the returned emoji in a custom element)
 * @return {string}
 */
Emoji.emojify = function emojify (str, on_missing, format) {
  if (!str) return '';

  return str.split(emojiNameRegex) // parse emoji via regex
            .map(function parseEmoji(s, i) {
              // every second element is an emoji, e.g. "test :fast_forward:" -> [ "test ", "fast_forward" ]
              if (i % 2 === 0) return s;
              var emoji = Emoji._get(s);
              var isMissing = emoji.indexOf(':') > -1;

              if (isMissing && typeof on_missing === 'function') {
                return on_missing(s);
              }

              if (!isMissing && typeof format === 'function') {
                return format(emoji, s);
              }

              return emoji;
            })
            .join('') // convert back to string
  ;
};

/**
 * return a random emoji
 * @return {string}
 */
Emoji.random = function random () {
  var emojiKeys = Object.keys(emojiByName);
  var randomIndex = Math.floor(Math.random() * emojiKeys.length);
  var key = emojiKeys[randomIndex];
  var emoji = Emoji._get(key);
  return { key: key, emoji: emoji };
}

/**
 *  return an collection of potential emoji matches
 *  @param {string} str
 *  @return {Array.<Object>}
 */
Emoji.search = function search (str) {
  var emojiKeys = Object.keys(emojiByName);
  var matcher = stripColons(str)
  var matchingKeys = emojiKeys.filter(function(key) {
    return key.toString().indexOf(matcher) === 0;
  });
  return matchingKeys.map(function(key) {
    return {
      key: key,
      emoji: Emoji._get(key),
    };
  });
}

/**
 * unemojify a string (replace emoji with :emoji:)
 * @param  {string} str
 * @return {string}
 */
Emoji.unemojify = function unemojify (str) {
  if (!str) return '';
  var words = toArray(str);

  return words.map(function(word) {
    return Emoji.which(word, true) || word;
  }).join('');
};

/**
 * replace emojis with replacement value
 * @param {string} str
 * @param {function|string} the string or callback function to replace the emoji with
 * @param {boolean} should trailing whitespaces be cleaned? Defaults false
 * @return {string}
 */
Emoji.replace = function replace (str, replacement, cleanSpaces) {
  if (!str) return '';

  var replace = typeof replacement === 'function' ? replacement : function() { return replacement; };
  var words = toArray(str);

  var replaced = words.map(function(word, idx) {
    var emoji = Emoji.findByCode(word);
    
    if (emoji && cleanSpaces && words[idx + 1] === ' ') {
      words[idx + 1] = '';
    }

    return emoji ? replace(emoji) : word;
  }).join('');

  return cleanSpaces ? replaced.replace(trimSpaceRegex, '') : replaced;
};


/**
 * remove all emojis from a string
 * @param {string} str
 * @return {string}
 */
Emoji.strip = function strip (str) {
  return Emoji.replace(str, '', true);
};

module.exports = Emoji;


/***/ }),

/***/ "./node_modules/node-emoji/lib/emoji.json":
/*!************************************************!*\
  !*** ./node_modules/node-emoji/lib/emoji.json ***!
  \************************************************/
/*! exports provided: 100, 1234, umbrella_with_rain_drops, coffee, aries, taurus, sagittarius, capricorn, aquarius, pisces, anchor, white_check_mark, sparkles, question, grey_question, grey_exclamation, exclamation, heavy_exclamation_mark, heavy_plus_sign, heavy_minus_sign, heavy_division_sign, hash, keycap_star, zero, one, two, three, four, five, six, seven, eight, nine, copyright, registered, mahjong, black_joker, a, b, o2, parking, ab, cl, cool, free, id, new, ng, ok, sos, up, vs, flag-ac, flag-ad, flag-ae, flag-af, flag-ag, flag-ai, flag-al, flag-am, flag-ao, flag-aq, flag-ar, flag-as, flag-at, flag-au, flag-aw, flag-ax, flag-az, flag-ba, flag-bb, flag-bd, flag-be, flag-bf, flag-bg, flag-bh, flag-bi, flag-bj, flag-bl, flag-bm, flag-bn, flag-bo, flag-bq, flag-br, flag-bs, flag-bt, flag-bv, flag-bw, flag-by, flag-bz, flag-ca, flag-cc, flag-cd, flag-cf, flag-cg, flag-ch, flag-ci, flag-ck, flag-cl, flag-cm, cn, flag-cn, flag-co, flag-cp, flag-cr, flag-cu, flag-cv, flag-cw, flag-cx, flag-cy, flag-cz, de, flag-de, flag-dg, flag-dj, flag-dk, flag-dm, flag-do, flag-dz, flag-ea, flag-ec, flag-ee, flag-eg, flag-eh, flag-er, es, flag-es, flag-et, flag-eu, flag-fi, flag-fj, flag-fk, flag-fm, flag-fo, fr, flag-fr, flag-ga, gb, uk, flag-gb, flag-gd, flag-ge, flag-gf, flag-gg, flag-gh, flag-gi, flag-gl, flag-gm, flag-gn, flag-gp, flag-gq, flag-gr, flag-gs, flag-gt, flag-gu, flag-gw, flag-gy, flag-hk, flag-hm, flag-hn, flag-hr, flag-ht, flag-hu, flag-ic, flag-id, flag-ie, flag-il, flag-im, flag-in, flag-io, flag-iq, flag-ir, flag-is, it, flag-it, flag-je, flag-jm, flag-jo, jp, flag-jp, flag-ke, flag-kg, flag-kh, flag-ki, flag-km, flag-kn, flag-kp, kr, flag-kr, flag-kw, flag-ky, flag-kz, flag-la, flag-lb, flag-lc, flag-li, flag-lk, flag-lr, flag-ls, flag-lt, flag-lu, flag-lv, flag-ly, flag-ma, flag-mc, flag-md, flag-me, flag-mf, flag-mg, flag-mh, flag-mk, flag-ml, flag-mm, flag-mn, flag-mo, flag-mp, flag-mq, flag-mr, flag-ms, flag-mt, flag-mu, flag-mv, flag-mw, flag-mx, flag-my, flag-mz, flag-na, flag-nc, flag-ne, flag-nf, flag-ng, flag-ni, flag-nl, flag-no, flag-np, flag-nr, flag-nu, flag-nz, flag-om, flag-pa, flag-pe, flag-pf, flag-pg, flag-ph, flag-pk, flag-pl, flag-pm, flag-pn, flag-pr, flag-ps, flag-pt, flag-pw, flag-py, flag-qa, flag-re, flag-ro, flag-rs, ru, flag-ru, flag-rw, flag-sa, flag-sb, flag-sc, flag-sd, flag-se, flag-sg, flag-sh, flag-si, flag-sj, flag-sk, flag-sl, flag-sm, flag-sn, flag-so, flag-sr, flag-ss, flag-st, flag-sv, flag-sx, flag-sy, flag-sz, flag-ta, flag-tc, flag-td, flag-tf, flag-tg, flag-th, flag-tj, flag-tk, flag-tl, flag-tm, flag-tn, flag-to, flag-tr, flag-tt, flag-tv, flag-tw, flag-tz, flag-ua, flag-ug, flag-um, flag-un, us, flag-us, flag-uy, flag-uz, flag-va, flag-vc, flag-ve, flag-vg, flag-vi, flag-vn, flag-vu, flag-wf, flag-ws, flag-xk, flag-ye, flag-yt, flag-za, flag-zm, flag-zw, koko, sa, u7121, u6307, u7981, u7a7a, u5408, u6e80, u6709, u6708, u7533, u5272, u55b6, ideograph_advantage, accept, cyclone, foggy, closed_umbrella, night_with_stars, sunrise_over_mountains, sunrise, city_sunset, city_sunrise, rainbow, bridge_at_night, ocean, volcano, milky_way, earth_africa, earth_americas, earth_asia, globe_with_meridians, new_moon, waxing_crescent_moon, first_quarter_moon, moon, waxing_gibbous_moon, full_moon, waning_gibbous_moon, last_quarter_moon, waning_crescent_moon, crescent_moon, new_moon_with_face, first_quarter_moon_with_face, last_quarter_moon_with_face, full_moon_with_face, sun_with_face, star2, stars, thermometer, mostly_sunny, sun_small_cloud, barely_sunny, sun_behind_cloud, partly_sunny_rain, sun_behind_rain_cloud, rain_cloud, snow_cloud, lightning, lightning_cloud, tornado, tornado_cloud, fog, wind_blowing_face, hotdog, taco, burrito, chestnut, seedling, evergreen_tree, deciduous_tree, palm_tree, cactus, hot_pepper, tulip, cherry_blossom, rose, hibiscus, sunflower, blossom, corn, ear_of_rice, herb, four_leaf_clover, maple_leaf, fallen_leaf, leaves, mushroom, tomato, eggplant, grapes, melon, watermelon, tangerine, lemon, banana, pineapple, apple, green_apple, pear, peach, cherries, strawberry, hamburger, pizza, meat_on_bone, poultry_leg, rice_cracker, rice_ball, rice, curry, ramen, spaghetti, bread, fries, sweet_potato, dango, oden, sushi, fried_shrimp, fish_cake, icecream, shaved_ice, ice_cream, doughnut, cookie, chocolate_bar, candy, lollipop, custard, honey_pot, cake, bento, stew, fried_egg, cooking, fork_and_knife, tea, sake, wine_glass, cocktail, tropical_drink, beer, beers, baby_bottle, knife_fork_plate, champagne, popcorn, ribbon, gift, birthday, jack_o_lantern, christmas_tree, santa, fireworks, sparkler, balloon, tada, confetti_ball, tanabata_tree, crossed_flags, bamboo, dolls, flags, wind_chime, rice_scene, school_satchel, mortar_board, medal, reminder_ribbon, studio_microphone, level_slider, control_knobs, film_frames, admission_tickets, carousel_horse, ferris_wheel, roller_coaster, fishing_pole_and_fish, microphone, movie_camera, cinema, headphones, art, tophat, circus_tent, ticket, clapper, performing_arts, video_game, dart, slot_machine, 8ball, game_die, bowling, flower_playing_cards, musical_note, notes, saxophone, guitar, musical_keyboard, trumpet, violin, musical_score, running_shirt_with_sash, tennis, ski, basketball, checkered_flag, snowboarder, woman-running, man-running, runner, running, woman-surfing, man-surfing, surfer, sports_medal, trophy, horse_racing, football, rugby_football, woman-swimming, man-swimming, swimmer, woman-lifting-weights, man-lifting-weights, weight_lifter, woman-golfing, man-golfing, golfer, racing_motorcycle, racing_car, cricket_bat_and_ball, volleyball, field_hockey_stick_and_ball, ice_hockey_stick_and_puck, table_tennis_paddle_and_ball, snow_capped_mountain, camping, beach_with_umbrella, building_construction, house_buildings, cityscape, derelict_house_building, classical_building, desert, desert_island, national_park, stadium, house, house_with_garden, office, post_office, european_post_office, hospital, bank, atm, hotel, love_hotel, convenience_store, school, department_store, factory, izakaya_lantern, lantern, japanese_castle, european_castle, rainbow-flag, waving_white_flag, flag-england, flag-scotland, flag-wales, waving_black_flag, rosette, label, badminton_racquet_and_shuttlecock, bow_and_arrow, amphora, skin-tone-2, skin-tone-3, skin-tone-4, skin-tone-5, skin-tone-6, rat, mouse2, ox, water_buffalo, cow2, tiger2, leopard, rabbit2, cat2, dragon, crocodile, whale2, snail, snake, racehorse, ram, goat, sheep, monkey, rooster, chicken, dog2, pig2, boar, elephant, octopus, shell, bug, ant, bee, honeybee, beetle, fish, tropical_fish, blowfish, turtle, hatching_chick, baby_chick, hatched_chick, bird, penguin, koala, poodle, dromedary_camel, camel, dolphin, flipper, mouse, cow, tiger, rabbit, cat, dragon_face, whale, horse, monkey_face, dog, pig, frog, hamster, wolf, bear, panda_face, pig_nose, feet, paw_prints, chipmunk, eyes, eye-in-speech-bubble, eye, ear, nose, lips, tongue, point_up_2, point_down, point_left, point_right, facepunch, punch, wave, ok_hand, +1, thumbsup, -1, thumbsdown, clap, open_hands, crown, womans_hat, eyeglasses, necktie, shirt, tshirt, jeans, dress, kimono, bikini, womans_clothes, purse, handbag, pouch, mans_shoe, shoe, athletic_shoe, high_heel, sandal, boot, footprints, bust_in_silhouette, busts_in_silhouette, boy, girl, male-farmer, male-cook, male-student, male-singer, male-artist, male-teacher, male-factory-worker, man-boy-boy, man-boy, man-girl-boy, man-girl-girl, man-girl, man-man-boy, man-man-boy-boy, man-man-girl, man-man-girl-boy, man-man-girl-girl, man-woman-boy, family, man-woman-boy-boy, man-woman-girl, man-woman-girl-boy, man-woman-girl-girl, male-technologist, male-office-worker, male-mechanic, male-scientist, male-astronaut, male-firefighter, male-doctor, male-judge, male-pilot, man-heart-man, man-kiss-man, man, female-farmer, female-cook, female-student, female-singer, female-artist, female-teacher, female-factory-worker, woman-boy-boy, woman-boy, woman-girl-boy, woman-girl-girl, woman-girl, woman-woman-boy, woman-woman-boy-boy, woman-woman-girl, woman-woman-girl-boy, woman-woman-girl-girl, female-technologist, female-office-worker, female-mechanic, female-scientist, female-astronaut, female-firefighter, female-doctor, female-judge, female-pilot, woman-heart-man, couple_with_heart, woman-heart-woman, woman-kiss-man, couplekiss, woman-kiss-woman, woman, couple, man_and_woman_holding_hands, two_men_holding_hands, two_women_holding_hands, female-police-officer, male-police-officer, cop, woman-with-bunny-ears-partying, dancers, man-with-bunny-ears-partying, bride_with_veil, blond-haired-woman, blond-haired-man, person_with_blond_hair, man_with_gua_pi_mao, woman-wearing-turban, man-wearing-turban, man_with_turban, older_man, older_woman, baby, female-construction-worker, male-construction-worker, construction_worker, princess, japanese_ogre, japanese_goblin, ghost, angel, alien, space_invader, imp, skull, woman-tipping-hand, information_desk_person, man-tipping-hand, female-guard, male-guard, guardsman, dancer, lipstick, nail_care, woman-getting-massage, massage, man-getting-massage, woman-getting-haircut, haircut, man-getting-haircut, barber, syringe, pill, kiss, love_letter, ring, gem, bouquet, wedding, heartbeat, broken_heart, two_hearts, sparkling_heart, heartpulse, cupid, blue_heart, green_heart, yellow_heart, purple_heart, gift_heart, revolving_hearts, heart_decoration, diamond_shape_with_a_dot_inside, bulb, anger, bomb, zzz, boom, collision, sweat_drops, droplet, dash, hankey, poop, shit, muscle, dizzy, speech_balloon, thought_balloon, white_flower, moneybag, currency_exchange, heavy_dollar_sign, credit_card, yen, dollar, euro, pound, money_with_wings, chart, seat, computer, briefcase, minidisc, floppy_disk, cd, dvd, file_folder, open_file_folder, page_with_curl, page_facing_up, date, calendar, card_index, chart_with_upwards_trend, chart_with_downwards_trend, bar_chart, clipboard, pushpin, round_pushpin, paperclip, straight_ruler, triangular_ruler, bookmark_tabs, ledger, notebook, notebook_with_decorative_cover, closed_book, book, open_book, green_book, blue_book, orange_book, books, name_badge, scroll, memo, pencil, telephone_receiver, pager, fax, satellite_antenna, loudspeaker, mega, outbox_tray, inbox_tray, package, e-mail, incoming_envelope, envelope_with_arrow, mailbox_closed, mailbox, mailbox_with_mail, mailbox_with_no_mail, postbox, postal_horn, newspaper, iphone, calling, vibration_mode, mobile_phone_off, no_mobile_phones, signal_strength, camera, camera_with_flash, video_camera, tv, radio, vhs, film_projector, prayer_beads, twisted_rightwards_arrows, repeat, repeat_one, arrows_clockwise, arrows_counterclockwise, low_brightness, high_brightness, mute, speaker, sound, loud_sound, battery, electric_plug, mag, mag_right, lock_with_ink_pen, closed_lock_with_key, key, lock, unlock, bell, no_bell, bookmark, link, radio_button, back, end, on, soon, top, underage, keycap_ten, capital_abcd, abcd, symbols, abc, fire, flashlight, wrench, hammer, nut_and_bolt, hocho, knife, gun, microscope, telescope, crystal_ball, six_pointed_star, beginner, trident, black_square_button, white_square_button, red_circle, large_blue_circle, large_orange_diamond, large_blue_diamond, small_orange_diamond, small_blue_diamond, small_red_triangle, small_red_triangle_down, arrow_up_small, arrow_down_small, om_symbol, dove_of_peace, kaaba, mosque, synagogue, menorah_with_nine_branches, clock1, clock2, clock3, clock4, clock5, clock6, clock7, clock8, clock9, clock10, clock11, clock12, clock130, clock230, clock330, clock430, clock530, clock630, clock730, clock830, clock930, clock1030, clock1130, clock1230, candle, mantelpiece_clock, hole, man_in_business_suit_levitating, female-detective, male-detective, sleuth_or_spy, dark_sunglasses, spider, spider_web, joystick, man_dancing, linked_paperclips, lower_left_ballpoint_pen, lower_left_fountain_pen, lower_left_paintbrush, lower_left_crayon, raised_hand_with_fingers_splayed, middle_finger, reversed_hand_with_middle_finger_extended, spock-hand, black_heart, desktop_computer, printer, three_button_mouse, trackball, frame_with_picture, card_index_dividers, card_file_box, file_cabinet, wastebasket, spiral_note_pad, spiral_calendar_pad, compression, old_key, rolled_up_newspaper, dagger_knife, speaking_head_in_silhouette, left_speech_bubble, right_anger_bubble, ballot_box_with_ballot, world_map, mount_fuji, tokyo_tower, statue_of_liberty, japan, moyai, grinning, grin, joy, smiley, smile, sweat_smile, laughing, satisfied, innocent, smiling_imp, wink, blush, yum, relieved, heart_eyes, sunglasses, smirk, neutral_face, expressionless, unamused, sweat, pensive, confused, confounded, kissing, kissing_heart, kissing_smiling_eyes, kissing_closed_eyes, stuck_out_tongue, stuck_out_tongue_winking_eye, stuck_out_tongue_closed_eyes, disappointed, worried, angry, rage, cry, persevere, triumph, disappointed_relieved, frowning, anguished, fearful, weary, sleepy, tired_face, grimacing, sob, open_mouth, hushed, cold_sweat, scream, astonished, flushed, sleeping, dizzy_face, no_mouth, mask, smile_cat, joy_cat, smiley_cat, heart_eyes_cat, smirk_cat, kissing_cat, pouting_cat, crying_cat_face, scream_cat, slightly_frowning_face, slightly_smiling_face, upside_down_face, face_with_rolling_eyes, woman-gesturing-no, no_good, man-gesturing-no, woman-gesturing-ok, ok_woman, man-gesturing-ok, woman-bowing, man-bowing, bow, see_no_evil, hear_no_evil, speak_no_evil, woman-raising-hand, raising_hand, man-raising-hand, raised_hands, woman-frowning, person_frowning, man-frowning, woman-pouting, person_with_pouting_face, man-pouting, pray, rocket, helicopter, steam_locomotive, railway_car, bullettrain_side, bullettrain_front, train2, metro, light_rail, station, tram, train, bus, oncoming_bus, trolleybus, busstop, minibus, ambulance, fire_engine, police_car, oncoming_police_car, taxi, oncoming_taxi, car, red_car, oncoming_automobile, blue_car, truck, articulated_lorry, tractor, monorail, mountain_railway, suspension_railway, mountain_cableway, aerial_tramway, ship, woman-rowing-boat, man-rowing-boat, rowboat, speedboat, traffic_light, vertical_traffic_light, construction, rotating_light, triangular_flag_on_post, door, no_entry_sign, smoking, no_smoking, put_litter_in_its_place, do_not_litter, potable_water, non-potable_water, bike, no_bicycles, woman-biking, man-biking, bicyclist, woman-mountain-biking, man-mountain-biking, mountain_bicyclist, woman-walking, man-walking, walking, no_pedestrians, children_crossing, mens, womens, restroom, baby_symbol, toilet, wc, shower, bath, bathtub, passport_control, customs, baggage_claim, left_luggage, couch_and_lamp, sleeping_accommodation, shopping_bags, bellhop_bell, bed, place_of_worship, octagonal_sign, shopping_trolley, hammer_and_wrench, shield, oil_drum, motorway, railway_track, motor_boat, small_airplane, airplane_departure, airplane_arriving, satellite, passenger_ship, scooter, motor_scooter, canoe, sled, flying_saucer, zipper_mouth_face, money_mouth_face, face_with_thermometer, nerd_face, thinking_face, face_with_head_bandage, robot_face, hugging_face, the_horns, sign_of_the_horns, call_me_hand, raised_back_of_hand, left-facing_fist, right-facing_fist, handshake, crossed_fingers, hand_with_index_and_middle_fingers_crossed, i_love_you_hand_sign, face_with_cowboy_hat, clown_face, nauseated_face, rolling_on_the_floor_laughing, drooling_face, lying_face, woman-facepalming, man-facepalming, face_palm, sneezing_face, face_with_raised_eyebrow, face_with_one_eyebrow_raised, star-struck, grinning_face_with_star_eyes, zany_face, grinning_face_with_one_large_and_one_small_eye, shushing_face, face_with_finger_covering_closed_lips, face_with_symbols_on_mouth, serious_face_with_symbols_covering_mouth, face_with_hand_over_mouth, smiling_face_with_smiling_eyes_and_hand_covering_mouth, face_vomiting, face_with_open_mouth_vomiting, exploding_head, shocked_face_with_exploding_head, pregnant_woman, breast-feeding, palms_up_together, selfie, prince, man_in_tuxedo, mrs_claus, mother_christmas, woman-shrugging, man-shrugging, shrug, woman-cartwheeling, man-cartwheeling, person_doing_cartwheel, woman-juggling, man-juggling, juggling, fencer, woman-wrestling, man-wrestling, wrestlers, woman-playing-water-polo, man-playing-water-polo, water_polo, woman-playing-handball, man-playing-handball, handball, wilted_flower, drum_with_drumsticks, clinking_glasses, tumbler_glass, spoon, goal_net, first_place_medal, second_place_medal, third_place_medal, boxing_glove, martial_arts_uniform, curling_stone, croissant, avocado, cucumber, bacon, potato, carrot, baguette_bread, green_salad, shallow_pan_of_food, stuffed_flatbread, egg, glass_of_milk, peanuts, kiwifruit, pancakes, dumpling, fortune_cookie, takeout_box, chopsticks, bowl_with_spoon, cup_with_straw, coconut, broccoli, pie, pretzel, cut_of_meat, sandwich, canned_food, crab, lion_face, scorpion, turkey, unicorn_face, eagle, duck, bat, shark, owl, fox_face, butterfly, deer, gorilla, lizard, rhinoceros, shrimp, squid, giraffe_face, zebra_face, hedgehog, sauropod, t-rex, cricket, cheese_wedge, face_with_monocle, adult, child, older_adult, bearded_person, person_with_headscarf, woman_in_steamy_room, man_in_steamy_room, person_in_steamy_room, woman_climbing, person_climbing, man_climbing, woman_in_lotus_position, person_in_lotus_position, man_in_lotus_position, female_mage, mage, male_mage, female_fairy, fairy, male_fairy, female_vampire, vampire, male_vampire, mermaid, merman, merperson, female_elf, male_elf, elf, female_genie, male_genie, genie, female_zombie, male_zombie, zombie, brain, orange_heart, billed_cap, scarf, gloves, coat, socks, bangbang, interrobang, tm, information_source, left_right_arrow, arrow_up_down, arrow_upper_left, arrow_upper_right, arrow_lower_right, arrow_lower_left, leftwards_arrow_with_hook, arrow_right_hook, watch, hourglass, keyboard, eject, fast_forward, rewind, arrow_double_up, arrow_double_down, black_right_pointing_double_triangle_with_vertical_bar, black_left_pointing_double_triangle_with_vertical_bar, black_right_pointing_triangle_with_double_vertical_bar, alarm_clock, stopwatch, timer_clock, hourglass_flowing_sand, double_vertical_bar, black_square_for_stop, black_circle_for_record, m, black_small_square, white_small_square, arrow_forward, arrow_backward, white_medium_square, black_medium_square, white_medium_small_square, black_medium_small_square, sunny, cloud, umbrella, snowman, comet, phone, telephone, ballot_box_with_check, shamrock, point_up, skull_and_crossbones, radioactive_sign, biohazard_sign, orthodox_cross, star_and_crescent, peace_symbol, yin_yang, wheel_of_dharma, white_frowning_face, relaxed, female_sign, male_sign, gemini, cancer, leo, virgo, libra, scorpius, spades, clubs, hearts, diamonds, hotsprings, recycle, wheelchair, hammer_and_pick, crossed_swords, medical_symbol, staff_of_aesculapius, scales, alembic, gear, atom_symbol, fleur_de_lis, warning, zap, white_circle, black_circle, coffin, funeral_urn, soccer, baseball, snowman_without_snow, partly_sunny, thunder_cloud_and_rain, ophiuchus, pick, helmet_with_white_cross, chains, no_entry, shinto_shrine, church, mountain, umbrella_on_ground, fountain, golf, ferry, boat, sailboat, skier, ice_skate, woman-bouncing-ball, man-bouncing-ball, person_with_ball, tent, fuelpump, scissors, airplane, email, envelope, fist, hand, raised_hand, v, writing_hand, pencil2, black_nib, heavy_check_mark, heavy_multiplication_x, latin_cross, star_of_david, eight_spoked_asterisk, eight_pointed_black_star, snowflake, sparkle, x, negative_squared_cross_mark, heavy_heart_exclamation_mark_ornament, heart, arrow_right, curly_loop, loop, arrow_heading_up, arrow_heading_down, arrow_left, arrow_up, arrow_down, black_large_square, white_large_square, star, o, wavy_dash, part_alternation_mark, congratulations, secret, default */
/***/ (function(module) {

module.exports = JSON.parse("{\"100\":\"💯\",\"1234\":\"🔢\",\"umbrella_with_rain_drops\":\"☔\",\"coffee\":\"☕\",\"aries\":\"♈\",\"taurus\":\"♉\",\"sagittarius\":\"♐\",\"capricorn\":\"♑\",\"aquarius\":\"♒\",\"pisces\":\"♓\",\"anchor\":\"⚓\",\"white_check_mark\":\"✅\",\"sparkles\":\"✨\",\"question\":\"❓\",\"grey_question\":\"❔\",\"grey_exclamation\":\"❕\",\"exclamation\":\"❗\",\"heavy_exclamation_mark\":\"❗\",\"heavy_plus_sign\":\"➕\",\"heavy_minus_sign\":\"➖\",\"heavy_division_sign\":\"➗\",\"hash\":\"#️⃣\",\"keycap_star\":\"*️⃣\",\"zero\":\"0️⃣\",\"one\":\"1️⃣\",\"two\":\"2️⃣\",\"three\":\"3️⃣\",\"four\":\"4️⃣\",\"five\":\"5️⃣\",\"six\":\"6️⃣\",\"seven\":\"7️⃣\",\"eight\":\"8️⃣\",\"nine\":\"9️⃣\",\"copyright\":\"©️\",\"registered\":\"®️\",\"mahjong\":\"🀄\",\"black_joker\":\"🃏\",\"a\":\"🅰️\",\"b\":\"🅱️\",\"o2\":\"🅾️\",\"parking\":\"🅿️\",\"ab\":\"🆎\",\"cl\":\"🆑\",\"cool\":\"🆒\",\"free\":\"🆓\",\"id\":\"🆔\",\"new\":\"🆕\",\"ng\":\"🆖\",\"ok\":\"🆗\",\"sos\":\"🆘\",\"up\":\"🆙\",\"vs\":\"🆚\",\"flag-ac\":\"🇦🇨\",\"flag-ad\":\"🇦🇩\",\"flag-ae\":\"🇦🇪\",\"flag-af\":\"🇦🇫\",\"flag-ag\":\"🇦🇬\",\"flag-ai\":\"🇦🇮\",\"flag-al\":\"🇦🇱\",\"flag-am\":\"🇦🇲\",\"flag-ao\":\"🇦🇴\",\"flag-aq\":\"🇦🇶\",\"flag-ar\":\"🇦🇷\",\"flag-as\":\"🇦🇸\",\"flag-at\":\"🇦🇹\",\"flag-au\":\"🇦🇺\",\"flag-aw\":\"🇦🇼\",\"flag-ax\":\"🇦🇽\",\"flag-az\":\"🇦🇿\",\"flag-ba\":\"🇧🇦\",\"flag-bb\":\"🇧🇧\",\"flag-bd\":\"🇧🇩\",\"flag-be\":\"🇧🇪\",\"flag-bf\":\"🇧🇫\",\"flag-bg\":\"🇧🇬\",\"flag-bh\":\"🇧🇭\",\"flag-bi\":\"🇧🇮\",\"flag-bj\":\"🇧🇯\",\"flag-bl\":\"🇧🇱\",\"flag-bm\":\"🇧🇲\",\"flag-bn\":\"🇧🇳\",\"flag-bo\":\"🇧🇴\",\"flag-bq\":\"🇧🇶\",\"flag-br\":\"🇧🇷\",\"flag-bs\":\"🇧🇸\",\"flag-bt\":\"🇧🇹\",\"flag-bv\":\"🇧🇻\",\"flag-bw\":\"🇧🇼\",\"flag-by\":\"🇧🇾\",\"flag-bz\":\"🇧🇿\",\"flag-ca\":\"🇨🇦\",\"flag-cc\":\"🇨🇨\",\"flag-cd\":\"🇨🇩\",\"flag-cf\":\"🇨🇫\",\"flag-cg\":\"🇨🇬\",\"flag-ch\":\"🇨🇭\",\"flag-ci\":\"🇨🇮\",\"flag-ck\":\"🇨🇰\",\"flag-cl\":\"🇨🇱\",\"flag-cm\":\"🇨🇲\",\"cn\":\"🇨🇳\",\"flag-cn\":\"🇨🇳\",\"flag-co\":\"🇨🇴\",\"flag-cp\":\"🇨🇵\",\"flag-cr\":\"🇨🇷\",\"flag-cu\":\"🇨🇺\",\"flag-cv\":\"🇨🇻\",\"flag-cw\":\"🇨🇼\",\"flag-cx\":\"🇨🇽\",\"flag-cy\":\"🇨🇾\",\"flag-cz\":\"🇨🇿\",\"de\":\"🇩🇪\",\"flag-de\":\"🇩🇪\",\"flag-dg\":\"🇩🇬\",\"flag-dj\":\"🇩🇯\",\"flag-dk\":\"🇩🇰\",\"flag-dm\":\"🇩🇲\",\"flag-do\":\"🇩🇴\",\"flag-dz\":\"🇩🇿\",\"flag-ea\":\"🇪🇦\",\"flag-ec\":\"🇪🇨\",\"flag-ee\":\"🇪🇪\",\"flag-eg\":\"🇪🇬\",\"flag-eh\":\"🇪🇭\",\"flag-er\":\"🇪🇷\",\"es\":\"🇪🇸\",\"flag-es\":\"🇪🇸\",\"flag-et\":\"🇪🇹\",\"flag-eu\":\"🇪🇺\",\"flag-fi\":\"🇫🇮\",\"flag-fj\":\"🇫🇯\",\"flag-fk\":\"🇫🇰\",\"flag-fm\":\"🇫🇲\",\"flag-fo\":\"🇫🇴\",\"fr\":\"🇫🇷\",\"flag-fr\":\"🇫🇷\",\"flag-ga\":\"🇬🇦\",\"gb\":\"🇬🇧\",\"uk\":\"🇬🇧\",\"flag-gb\":\"🇬🇧\",\"flag-gd\":\"🇬🇩\",\"flag-ge\":\"🇬🇪\",\"flag-gf\":\"🇬🇫\",\"flag-gg\":\"🇬🇬\",\"flag-gh\":\"🇬🇭\",\"flag-gi\":\"🇬🇮\",\"flag-gl\":\"🇬🇱\",\"flag-gm\":\"🇬🇲\",\"flag-gn\":\"🇬🇳\",\"flag-gp\":\"🇬🇵\",\"flag-gq\":\"🇬🇶\",\"flag-gr\":\"🇬🇷\",\"flag-gs\":\"🇬🇸\",\"flag-gt\":\"🇬🇹\",\"flag-gu\":\"🇬🇺\",\"flag-gw\":\"🇬🇼\",\"flag-gy\":\"🇬🇾\",\"flag-hk\":\"🇭🇰\",\"flag-hm\":\"🇭🇲\",\"flag-hn\":\"🇭🇳\",\"flag-hr\":\"🇭🇷\",\"flag-ht\":\"🇭🇹\",\"flag-hu\":\"🇭🇺\",\"flag-ic\":\"🇮🇨\",\"flag-id\":\"🇮🇩\",\"flag-ie\":\"🇮🇪\",\"flag-il\":\"🇮🇱\",\"flag-im\":\"🇮🇲\",\"flag-in\":\"🇮🇳\",\"flag-io\":\"🇮🇴\",\"flag-iq\":\"🇮🇶\",\"flag-ir\":\"🇮🇷\",\"flag-is\":\"🇮🇸\",\"it\":\"🇮🇹\",\"flag-it\":\"🇮🇹\",\"flag-je\":\"🇯🇪\",\"flag-jm\":\"🇯🇲\",\"flag-jo\":\"🇯🇴\",\"jp\":\"🇯🇵\",\"flag-jp\":\"🇯🇵\",\"flag-ke\":\"🇰🇪\",\"flag-kg\":\"🇰🇬\",\"flag-kh\":\"🇰🇭\",\"flag-ki\":\"🇰🇮\",\"flag-km\":\"🇰🇲\",\"flag-kn\":\"🇰🇳\",\"flag-kp\":\"🇰🇵\",\"kr\":\"🇰🇷\",\"flag-kr\":\"🇰🇷\",\"flag-kw\":\"🇰🇼\",\"flag-ky\":\"🇰🇾\",\"flag-kz\":\"🇰🇿\",\"flag-la\":\"🇱🇦\",\"flag-lb\":\"🇱🇧\",\"flag-lc\":\"🇱🇨\",\"flag-li\":\"🇱🇮\",\"flag-lk\":\"🇱🇰\",\"flag-lr\":\"🇱🇷\",\"flag-ls\":\"🇱🇸\",\"flag-lt\":\"🇱🇹\",\"flag-lu\":\"🇱🇺\",\"flag-lv\":\"🇱🇻\",\"flag-ly\":\"🇱🇾\",\"flag-ma\":\"🇲🇦\",\"flag-mc\":\"🇲🇨\",\"flag-md\":\"🇲🇩\",\"flag-me\":\"🇲🇪\",\"flag-mf\":\"🇲🇫\",\"flag-mg\":\"🇲🇬\",\"flag-mh\":\"🇲🇭\",\"flag-mk\":\"🇲🇰\",\"flag-ml\":\"🇲🇱\",\"flag-mm\":\"🇲🇲\",\"flag-mn\":\"🇲🇳\",\"flag-mo\":\"🇲🇴\",\"flag-mp\":\"🇲🇵\",\"flag-mq\":\"🇲🇶\",\"flag-mr\":\"🇲🇷\",\"flag-ms\":\"🇲🇸\",\"flag-mt\":\"🇲🇹\",\"flag-mu\":\"🇲🇺\",\"flag-mv\":\"🇲🇻\",\"flag-mw\":\"🇲🇼\",\"flag-mx\":\"🇲🇽\",\"flag-my\":\"🇲🇾\",\"flag-mz\":\"🇲🇿\",\"flag-na\":\"🇳🇦\",\"flag-nc\":\"🇳🇨\",\"flag-ne\":\"🇳🇪\",\"flag-nf\":\"🇳🇫\",\"flag-ng\":\"🇳🇬\",\"flag-ni\":\"🇳🇮\",\"flag-nl\":\"🇳🇱\",\"flag-no\":\"🇳🇴\",\"flag-np\":\"🇳🇵\",\"flag-nr\":\"🇳🇷\",\"flag-nu\":\"🇳🇺\",\"flag-nz\":\"🇳🇿\",\"flag-om\":\"🇴🇲\",\"flag-pa\":\"🇵🇦\",\"flag-pe\":\"🇵🇪\",\"flag-pf\":\"🇵🇫\",\"flag-pg\":\"🇵🇬\",\"flag-ph\":\"🇵🇭\",\"flag-pk\":\"🇵🇰\",\"flag-pl\":\"🇵🇱\",\"flag-pm\":\"🇵🇲\",\"flag-pn\":\"🇵🇳\",\"flag-pr\":\"🇵🇷\",\"flag-ps\":\"🇵🇸\",\"flag-pt\":\"🇵🇹\",\"flag-pw\":\"🇵🇼\",\"flag-py\":\"🇵🇾\",\"flag-qa\":\"🇶🇦\",\"flag-re\":\"🇷🇪\",\"flag-ro\":\"🇷🇴\",\"flag-rs\":\"🇷🇸\",\"ru\":\"🇷🇺\",\"flag-ru\":\"🇷🇺\",\"flag-rw\":\"🇷🇼\",\"flag-sa\":\"🇸🇦\",\"flag-sb\":\"🇸🇧\",\"flag-sc\":\"🇸🇨\",\"flag-sd\":\"🇸🇩\",\"flag-se\":\"🇸🇪\",\"flag-sg\":\"🇸🇬\",\"flag-sh\":\"🇸🇭\",\"flag-si\":\"🇸🇮\",\"flag-sj\":\"🇸🇯\",\"flag-sk\":\"🇸🇰\",\"flag-sl\":\"🇸🇱\",\"flag-sm\":\"🇸🇲\",\"flag-sn\":\"🇸🇳\",\"flag-so\":\"🇸🇴\",\"flag-sr\":\"🇸🇷\",\"flag-ss\":\"🇸🇸\",\"flag-st\":\"🇸🇹\",\"flag-sv\":\"🇸🇻\",\"flag-sx\":\"🇸🇽\",\"flag-sy\":\"🇸🇾\",\"flag-sz\":\"🇸🇿\",\"flag-ta\":\"🇹🇦\",\"flag-tc\":\"🇹🇨\",\"flag-td\":\"🇹🇩\",\"flag-tf\":\"🇹🇫\",\"flag-tg\":\"🇹🇬\",\"flag-th\":\"🇹🇭\",\"flag-tj\":\"🇹🇯\",\"flag-tk\":\"🇹🇰\",\"flag-tl\":\"🇹🇱\",\"flag-tm\":\"🇹🇲\",\"flag-tn\":\"🇹🇳\",\"flag-to\":\"🇹🇴\",\"flag-tr\":\"🇹🇷\",\"flag-tt\":\"🇹🇹\",\"flag-tv\":\"🇹🇻\",\"flag-tw\":\"🇹🇼\",\"flag-tz\":\"🇹🇿\",\"flag-ua\":\"🇺🇦\",\"flag-ug\":\"🇺🇬\",\"flag-um\":\"🇺🇲\",\"flag-un\":\"🇺🇳\",\"us\":\"🇺🇸\",\"flag-us\":\"🇺🇸\",\"flag-uy\":\"🇺🇾\",\"flag-uz\":\"🇺🇿\",\"flag-va\":\"🇻🇦\",\"flag-vc\":\"🇻🇨\",\"flag-ve\":\"🇻🇪\",\"flag-vg\":\"🇻🇬\",\"flag-vi\":\"🇻🇮\",\"flag-vn\":\"🇻🇳\",\"flag-vu\":\"🇻🇺\",\"flag-wf\":\"🇼🇫\",\"flag-ws\":\"🇼🇸\",\"flag-xk\":\"🇽🇰\",\"flag-ye\":\"🇾🇪\",\"flag-yt\":\"🇾🇹\",\"flag-za\":\"🇿🇦\",\"flag-zm\":\"🇿🇲\",\"flag-zw\":\"🇿🇼\",\"koko\":\"🈁\",\"sa\":\"🈂️\",\"u7121\":\"🈚\",\"u6307\":\"🈯\",\"u7981\":\"🈲\",\"u7a7a\":\"🈳\",\"u5408\":\"🈴\",\"u6e80\":\"🈵\",\"u6709\":\"🈶\",\"u6708\":\"🈷️\",\"u7533\":\"🈸\",\"u5272\":\"🈹\",\"u55b6\":\"🈺\",\"ideograph_advantage\":\"🉐\",\"accept\":\"🉑\",\"cyclone\":\"🌀\",\"foggy\":\"🌁\",\"closed_umbrella\":\"🌂\",\"night_with_stars\":\"🌃\",\"sunrise_over_mountains\":\"🌄\",\"sunrise\":\"🌅\",\"city_sunset\":\"🌆\",\"city_sunrise\":\"🌇\",\"rainbow\":\"🌈\",\"bridge_at_night\":\"🌉\",\"ocean\":\"🌊\",\"volcano\":\"🌋\",\"milky_way\":\"🌌\",\"earth_africa\":\"🌍\",\"earth_americas\":\"🌎\",\"earth_asia\":\"🌏\",\"globe_with_meridians\":\"🌐\",\"new_moon\":\"🌑\",\"waxing_crescent_moon\":\"🌒\",\"first_quarter_moon\":\"🌓\",\"moon\":\"🌔\",\"waxing_gibbous_moon\":\"🌔\",\"full_moon\":\"🌕\",\"waning_gibbous_moon\":\"🌖\",\"last_quarter_moon\":\"🌗\",\"waning_crescent_moon\":\"🌘\",\"crescent_moon\":\"🌙\",\"new_moon_with_face\":\"🌚\",\"first_quarter_moon_with_face\":\"🌛\",\"last_quarter_moon_with_face\":\"🌜\",\"full_moon_with_face\":\"🌝\",\"sun_with_face\":\"🌞\",\"star2\":\"🌟\",\"stars\":\"🌠\",\"thermometer\":\"🌡️\",\"mostly_sunny\":\"🌤️\",\"sun_small_cloud\":\"🌤️\",\"barely_sunny\":\"🌥️\",\"sun_behind_cloud\":\"🌥️\",\"partly_sunny_rain\":\"🌦️\",\"sun_behind_rain_cloud\":\"🌦️\",\"rain_cloud\":\"🌧️\",\"snow_cloud\":\"🌨️\",\"lightning\":\"🌩️\",\"lightning_cloud\":\"🌩️\",\"tornado\":\"🌪️\",\"tornado_cloud\":\"🌪️\",\"fog\":\"🌫️\",\"wind_blowing_face\":\"🌬️\",\"hotdog\":\"🌭\",\"taco\":\"🌮\",\"burrito\":\"🌯\",\"chestnut\":\"🌰\",\"seedling\":\"🌱\",\"evergreen_tree\":\"🌲\",\"deciduous_tree\":\"🌳\",\"palm_tree\":\"🌴\",\"cactus\":\"🌵\",\"hot_pepper\":\"🌶️\",\"tulip\":\"🌷\",\"cherry_blossom\":\"🌸\",\"rose\":\"🌹\",\"hibiscus\":\"🌺\",\"sunflower\":\"🌻\",\"blossom\":\"🌼\",\"corn\":\"🌽\",\"ear_of_rice\":\"🌾\",\"herb\":\"🌿\",\"four_leaf_clover\":\"🍀\",\"maple_leaf\":\"🍁\",\"fallen_leaf\":\"🍂\",\"leaves\":\"🍃\",\"mushroom\":\"🍄\",\"tomato\":\"🍅\",\"eggplant\":\"🍆\",\"grapes\":\"🍇\",\"melon\":\"🍈\",\"watermelon\":\"🍉\",\"tangerine\":\"🍊\",\"lemon\":\"🍋\",\"banana\":\"🍌\",\"pineapple\":\"🍍\",\"apple\":\"🍎\",\"green_apple\":\"🍏\",\"pear\":\"🍐\",\"peach\":\"🍑\",\"cherries\":\"🍒\",\"strawberry\":\"🍓\",\"hamburger\":\"🍔\",\"pizza\":\"🍕\",\"meat_on_bone\":\"🍖\",\"poultry_leg\":\"🍗\",\"rice_cracker\":\"🍘\",\"rice_ball\":\"🍙\",\"rice\":\"🍚\",\"curry\":\"🍛\",\"ramen\":\"🍜\",\"spaghetti\":\"🍝\",\"bread\":\"🍞\",\"fries\":\"🍟\",\"sweet_potato\":\"🍠\",\"dango\":\"🍡\",\"oden\":\"🍢\",\"sushi\":\"🍣\",\"fried_shrimp\":\"🍤\",\"fish_cake\":\"🍥\",\"icecream\":\"🍦\",\"shaved_ice\":\"🍧\",\"ice_cream\":\"🍨\",\"doughnut\":\"🍩\",\"cookie\":\"🍪\",\"chocolate_bar\":\"🍫\",\"candy\":\"🍬\",\"lollipop\":\"🍭\",\"custard\":\"🍮\",\"honey_pot\":\"🍯\",\"cake\":\"🍰\",\"bento\":\"🍱\",\"stew\":\"🍲\",\"fried_egg\":\"🍳\",\"cooking\":\"🍳\",\"fork_and_knife\":\"🍴\",\"tea\":\"🍵\",\"sake\":\"🍶\",\"wine_glass\":\"🍷\",\"cocktail\":\"🍸\",\"tropical_drink\":\"🍹\",\"beer\":\"🍺\",\"beers\":\"🍻\",\"baby_bottle\":\"🍼\",\"knife_fork_plate\":\"🍽️\",\"champagne\":\"🍾\",\"popcorn\":\"🍿\",\"ribbon\":\"🎀\",\"gift\":\"🎁\",\"birthday\":\"🎂\",\"jack_o_lantern\":\"🎃\",\"christmas_tree\":\"🎄\",\"santa\":\"🎅\",\"fireworks\":\"🎆\",\"sparkler\":\"🎇\",\"balloon\":\"🎈\",\"tada\":\"🎉\",\"confetti_ball\":\"🎊\",\"tanabata_tree\":\"🎋\",\"crossed_flags\":\"🎌\",\"bamboo\":\"🎍\",\"dolls\":\"🎎\",\"flags\":\"🎏\",\"wind_chime\":\"🎐\",\"rice_scene\":\"🎑\",\"school_satchel\":\"🎒\",\"mortar_board\":\"🎓\",\"medal\":\"🎖️\",\"reminder_ribbon\":\"🎗️\",\"studio_microphone\":\"🎙️\",\"level_slider\":\"🎚️\",\"control_knobs\":\"🎛️\",\"film_frames\":\"🎞️\",\"admission_tickets\":\"🎟️\",\"carousel_horse\":\"🎠\",\"ferris_wheel\":\"🎡\",\"roller_coaster\":\"🎢\",\"fishing_pole_and_fish\":\"🎣\",\"microphone\":\"🎤\",\"movie_camera\":\"🎥\",\"cinema\":\"🎦\",\"headphones\":\"🎧\",\"art\":\"🎨\",\"tophat\":\"🎩\",\"circus_tent\":\"🎪\",\"ticket\":\"🎫\",\"clapper\":\"🎬\",\"performing_arts\":\"🎭\",\"video_game\":\"🎮\",\"dart\":\"🎯\",\"slot_machine\":\"🎰\",\"8ball\":\"🎱\",\"game_die\":\"🎲\",\"bowling\":\"🎳\",\"flower_playing_cards\":\"🎴\",\"musical_note\":\"🎵\",\"notes\":\"🎶\",\"saxophone\":\"🎷\",\"guitar\":\"🎸\",\"musical_keyboard\":\"🎹\",\"trumpet\":\"🎺\",\"violin\":\"🎻\",\"musical_score\":\"🎼\",\"running_shirt_with_sash\":\"🎽\",\"tennis\":\"🎾\",\"ski\":\"🎿\",\"basketball\":\"🏀\",\"checkered_flag\":\"🏁\",\"snowboarder\":\"🏂\",\"woman-running\":\"🏃‍♀️\",\"man-running\":\"🏃‍♂️\",\"runner\":\"🏃‍♂️\",\"running\":\"🏃‍♂️\",\"woman-surfing\":\"🏄‍♀️\",\"man-surfing\":\"🏄‍♂️\",\"surfer\":\"🏄‍♂️\",\"sports_medal\":\"🏅\",\"trophy\":\"🏆\",\"horse_racing\":\"🏇\",\"football\":\"🏈\",\"rugby_football\":\"🏉\",\"woman-swimming\":\"🏊‍♀️\",\"man-swimming\":\"🏊‍♂️\",\"swimmer\":\"🏊‍♂️\",\"woman-lifting-weights\":\"🏋️‍♀️\",\"man-lifting-weights\":\"🏋️‍♂️\",\"weight_lifter\":\"🏋️‍♂️\",\"woman-golfing\":\"🏌️‍♀️\",\"man-golfing\":\"🏌️‍♂️\",\"golfer\":\"🏌️‍♂️\",\"racing_motorcycle\":\"🏍️\",\"racing_car\":\"🏎️\",\"cricket_bat_and_ball\":\"🏏\",\"volleyball\":\"🏐\",\"field_hockey_stick_and_ball\":\"🏑\",\"ice_hockey_stick_and_puck\":\"🏒\",\"table_tennis_paddle_and_ball\":\"🏓\",\"snow_capped_mountain\":\"🏔️\",\"camping\":\"🏕️\",\"beach_with_umbrella\":\"🏖️\",\"building_construction\":\"🏗️\",\"house_buildings\":\"🏘️\",\"cityscape\":\"🏙️\",\"derelict_house_building\":\"🏚️\",\"classical_building\":\"🏛️\",\"desert\":\"🏜️\",\"desert_island\":\"🏝️\",\"national_park\":\"🏞️\",\"stadium\":\"🏟️\",\"house\":\"🏠\",\"house_with_garden\":\"🏡\",\"office\":\"🏢\",\"post_office\":\"🏣\",\"european_post_office\":\"🏤\",\"hospital\":\"🏥\",\"bank\":\"🏦\",\"atm\":\"🏧\",\"hotel\":\"🏨\",\"love_hotel\":\"🏩\",\"convenience_store\":\"🏪\",\"school\":\"🏫\",\"department_store\":\"🏬\",\"factory\":\"🏭\",\"izakaya_lantern\":\"🏮\",\"lantern\":\"🏮\",\"japanese_castle\":\"🏯\",\"european_castle\":\"🏰\",\"rainbow-flag\":\"🏳️‍🌈\",\"waving_white_flag\":\"🏳️\",\"flag-england\":\"🏴󠁧󠁢󠁥󠁮󠁧󠁿\",\"flag-scotland\":\"🏴󠁧󠁢󠁳󠁣󠁴󠁿\",\"flag-wales\":\"🏴󠁧󠁢󠁷󠁬󠁳󠁿\",\"waving_black_flag\":\"🏴\",\"rosette\":\"🏵️\",\"label\":\"🏷️\",\"badminton_racquet_and_shuttlecock\":\"🏸\",\"bow_and_arrow\":\"🏹\",\"amphora\":\"🏺\",\"skin-tone-2\":\"🏻\",\"skin-tone-3\":\"🏼\",\"skin-tone-4\":\"🏽\",\"skin-tone-5\":\"🏾\",\"skin-tone-6\":\"🏿\",\"rat\":\"🐀\",\"mouse2\":\"🐁\",\"ox\":\"🐂\",\"water_buffalo\":\"🐃\",\"cow2\":\"🐄\",\"tiger2\":\"🐅\",\"leopard\":\"🐆\",\"rabbit2\":\"🐇\",\"cat2\":\"🐈\",\"dragon\":\"🐉\",\"crocodile\":\"🐊\",\"whale2\":\"🐋\",\"snail\":\"🐌\",\"snake\":\"🐍\",\"racehorse\":\"🐎\",\"ram\":\"🐏\",\"goat\":\"🐐\",\"sheep\":\"🐑\",\"monkey\":\"🐒\",\"rooster\":\"🐓\",\"chicken\":\"🐔\",\"dog2\":\"🐕\",\"pig2\":\"🐖\",\"boar\":\"🐗\",\"elephant\":\"🐘\",\"octopus\":\"🐙\",\"shell\":\"🐚\",\"bug\":\"🐛\",\"ant\":\"🐜\",\"bee\":\"🐝\",\"honeybee\":\"🐝\",\"beetle\":\"🐞\",\"fish\":\"🐟\",\"tropical_fish\":\"🐠\",\"blowfish\":\"🐡\",\"turtle\":\"🐢\",\"hatching_chick\":\"🐣\",\"baby_chick\":\"🐤\",\"hatched_chick\":\"🐥\",\"bird\":\"🐦\",\"penguin\":\"🐧\",\"koala\":\"🐨\",\"poodle\":\"🐩\",\"dromedary_camel\":\"🐪\",\"camel\":\"🐫\",\"dolphin\":\"🐬\",\"flipper\":\"🐬\",\"mouse\":\"🐭\",\"cow\":\"🐮\",\"tiger\":\"🐯\",\"rabbit\":\"🐰\",\"cat\":\"🐱\",\"dragon_face\":\"🐲\",\"whale\":\"🐳\",\"horse\":\"🐴\",\"monkey_face\":\"🐵\",\"dog\":\"🐶\",\"pig\":\"🐷\",\"frog\":\"🐸\",\"hamster\":\"🐹\",\"wolf\":\"🐺\",\"bear\":\"🐻\",\"panda_face\":\"🐼\",\"pig_nose\":\"🐽\",\"feet\":\"🐾\",\"paw_prints\":\"🐾\",\"chipmunk\":\"🐿️\",\"eyes\":\"👀\",\"eye-in-speech-bubble\":\"👁️‍🗨️\",\"eye\":\"👁️\",\"ear\":\"👂\",\"nose\":\"👃\",\"lips\":\"👄\",\"tongue\":\"👅\",\"point_up_2\":\"👆\",\"point_down\":\"👇\",\"point_left\":\"👈\",\"point_right\":\"👉\",\"facepunch\":\"👊\",\"punch\":\"👊\",\"wave\":\"👋\",\"ok_hand\":\"👌\",\"+1\":\"👍\",\"thumbsup\":\"👍\",\"-1\":\"👎\",\"thumbsdown\":\"👎\",\"clap\":\"👏\",\"open_hands\":\"👐\",\"crown\":\"👑\",\"womans_hat\":\"👒\",\"eyeglasses\":\"👓\",\"necktie\":\"👔\",\"shirt\":\"👕\",\"tshirt\":\"👕\",\"jeans\":\"👖\",\"dress\":\"👗\",\"kimono\":\"👘\",\"bikini\":\"👙\",\"womans_clothes\":\"👚\",\"purse\":\"👛\",\"handbag\":\"👜\",\"pouch\":\"👝\",\"mans_shoe\":\"👞\",\"shoe\":\"👞\",\"athletic_shoe\":\"👟\",\"high_heel\":\"👠\",\"sandal\":\"👡\",\"boot\":\"👢\",\"footprints\":\"👣\",\"bust_in_silhouette\":\"👤\",\"busts_in_silhouette\":\"👥\",\"boy\":\"👦\",\"girl\":\"👧\",\"male-farmer\":\"👨‍🌾\",\"male-cook\":\"👨‍🍳\",\"male-student\":\"👨‍🎓\",\"male-singer\":\"👨‍🎤\",\"male-artist\":\"👨‍🎨\",\"male-teacher\":\"👨‍🏫\",\"male-factory-worker\":\"👨‍🏭\",\"man-boy-boy\":\"👨‍👦‍👦\",\"man-boy\":\"👨‍👦\",\"man-girl-boy\":\"👨‍👧‍👦\",\"man-girl-girl\":\"👨‍👧‍👧\",\"man-girl\":\"👨‍👧\",\"man-man-boy\":\"👨‍👨‍👦\",\"man-man-boy-boy\":\"👨‍👨‍👦‍👦\",\"man-man-girl\":\"👨‍👨‍👧\",\"man-man-girl-boy\":\"👨‍👨‍👧‍👦\",\"man-man-girl-girl\":\"👨‍👨‍👧‍👧\",\"man-woman-boy\":\"👨‍👩‍👦\",\"family\":\"👨‍👩‍👦\",\"man-woman-boy-boy\":\"👨‍👩‍👦‍👦\",\"man-woman-girl\":\"👨‍👩‍👧\",\"man-woman-girl-boy\":\"👨‍👩‍👧‍👦\",\"man-woman-girl-girl\":\"👨‍👩‍👧‍👧\",\"male-technologist\":\"👨‍💻\",\"male-office-worker\":\"👨‍💼\",\"male-mechanic\":\"👨‍🔧\",\"male-scientist\":\"👨‍🔬\",\"male-astronaut\":\"👨‍🚀\",\"male-firefighter\":\"👨‍🚒\",\"male-doctor\":\"👨‍⚕️\",\"male-judge\":\"👨‍⚖️\",\"male-pilot\":\"👨‍✈️\",\"man-heart-man\":\"👨‍❤️‍👨\",\"man-kiss-man\":\"👨‍❤️‍💋‍👨\",\"man\":\"👨\",\"female-farmer\":\"👩‍🌾\",\"female-cook\":\"👩‍🍳\",\"female-student\":\"👩‍🎓\",\"female-singer\":\"👩‍🎤\",\"female-artist\":\"👩‍🎨\",\"female-teacher\":\"👩‍🏫\",\"female-factory-worker\":\"👩‍🏭\",\"woman-boy-boy\":\"👩‍👦‍👦\",\"woman-boy\":\"👩‍👦\",\"woman-girl-boy\":\"👩‍👧‍👦\",\"woman-girl-girl\":\"👩‍👧‍👧\",\"woman-girl\":\"👩‍👧\",\"woman-woman-boy\":\"👩‍👩‍👦\",\"woman-woman-boy-boy\":\"👩‍👩‍👦‍👦\",\"woman-woman-girl\":\"👩‍👩‍👧\",\"woman-woman-girl-boy\":\"👩‍👩‍👧‍👦\",\"woman-woman-girl-girl\":\"👩‍👩‍👧‍👧\",\"female-technologist\":\"👩‍💻\",\"female-office-worker\":\"👩‍💼\",\"female-mechanic\":\"👩‍🔧\",\"female-scientist\":\"👩‍🔬\",\"female-astronaut\":\"👩‍🚀\",\"female-firefighter\":\"👩‍🚒\",\"female-doctor\":\"👩‍⚕️\",\"female-judge\":\"👩‍⚖️\",\"female-pilot\":\"👩‍✈️\",\"woman-heart-man\":\"👩‍❤️‍👨\",\"couple_with_heart\":\"👩‍❤️‍👨\",\"woman-heart-woman\":\"👩‍❤️‍👩\",\"woman-kiss-man\":\"👩‍❤️‍💋‍👨\",\"couplekiss\":\"👩‍❤️‍💋‍👨\",\"woman-kiss-woman\":\"👩‍❤️‍💋‍👩\",\"woman\":\"👩\",\"couple\":\"👫\",\"man_and_woman_holding_hands\":\"👫\",\"two_men_holding_hands\":\"👬\",\"two_women_holding_hands\":\"👭\",\"female-police-officer\":\"👮‍♀️\",\"male-police-officer\":\"👮‍♂️\",\"cop\":\"👮‍♂️\",\"woman-with-bunny-ears-partying\":\"👯‍♀️\",\"dancers\":\"👯‍♀️\",\"man-with-bunny-ears-partying\":\"👯‍♂️\",\"bride_with_veil\":\"👰\",\"blond-haired-woman\":\"👱‍♀️\",\"blond-haired-man\":\"👱‍♂️\",\"person_with_blond_hair\":\"👱‍♂️\",\"man_with_gua_pi_mao\":\"👲\",\"woman-wearing-turban\":\"👳‍♀️\",\"man-wearing-turban\":\"👳‍♂️\",\"man_with_turban\":\"👳‍♂️\",\"older_man\":\"👴\",\"older_woman\":\"👵\",\"baby\":\"👶\",\"female-construction-worker\":\"👷‍♀️\",\"male-construction-worker\":\"👷‍♂️\",\"construction_worker\":\"👷‍♂️\",\"princess\":\"👸\",\"japanese_ogre\":\"👹\",\"japanese_goblin\":\"👺\",\"ghost\":\"👻\",\"angel\":\"👼\",\"alien\":\"👽\",\"space_invader\":\"👾\",\"imp\":\"👿\",\"skull\":\"💀\",\"woman-tipping-hand\":\"💁‍♀️\",\"information_desk_person\":\"💁‍♀️\",\"man-tipping-hand\":\"💁‍♂️\",\"female-guard\":\"💂‍♀️\",\"male-guard\":\"💂‍♂️\",\"guardsman\":\"💂‍♂️\",\"dancer\":\"💃\",\"lipstick\":\"💄\",\"nail_care\":\"💅\",\"woman-getting-massage\":\"💆‍♀️\",\"massage\":\"💆‍♀️\",\"man-getting-massage\":\"💆‍♂️\",\"woman-getting-haircut\":\"💇‍♀️\",\"haircut\":\"💇‍♀️\",\"man-getting-haircut\":\"💇‍♂️\",\"barber\":\"💈\",\"syringe\":\"💉\",\"pill\":\"💊\",\"kiss\":\"💋\",\"love_letter\":\"💌\",\"ring\":\"💍\",\"gem\":\"💎\",\"bouquet\":\"💐\",\"wedding\":\"💒\",\"heartbeat\":\"💓\",\"broken_heart\":\"💔\",\"two_hearts\":\"💕\",\"sparkling_heart\":\"💖\",\"heartpulse\":\"💗\",\"cupid\":\"💘\",\"blue_heart\":\"💙\",\"green_heart\":\"💚\",\"yellow_heart\":\"💛\",\"purple_heart\":\"💜\",\"gift_heart\":\"💝\",\"revolving_hearts\":\"💞\",\"heart_decoration\":\"💟\",\"diamond_shape_with_a_dot_inside\":\"💠\",\"bulb\":\"💡\",\"anger\":\"💢\",\"bomb\":\"💣\",\"zzz\":\"💤\",\"boom\":\"💥\",\"collision\":\"💥\",\"sweat_drops\":\"💦\",\"droplet\":\"💧\",\"dash\":\"💨\",\"hankey\":\"💩\",\"poop\":\"💩\",\"shit\":\"💩\",\"muscle\":\"💪\",\"dizzy\":\"💫\",\"speech_balloon\":\"💬\",\"thought_balloon\":\"💭\",\"white_flower\":\"💮\",\"moneybag\":\"💰\",\"currency_exchange\":\"💱\",\"heavy_dollar_sign\":\"💲\",\"credit_card\":\"💳\",\"yen\":\"💴\",\"dollar\":\"💵\",\"euro\":\"💶\",\"pound\":\"💷\",\"money_with_wings\":\"💸\",\"chart\":\"💹\",\"seat\":\"💺\",\"computer\":\"💻\",\"briefcase\":\"💼\",\"minidisc\":\"💽\",\"floppy_disk\":\"💾\",\"cd\":\"💿\",\"dvd\":\"📀\",\"file_folder\":\"📁\",\"open_file_folder\":\"📂\",\"page_with_curl\":\"📃\",\"page_facing_up\":\"📄\",\"date\":\"📅\",\"calendar\":\"📆\",\"card_index\":\"📇\",\"chart_with_upwards_trend\":\"📈\",\"chart_with_downwards_trend\":\"📉\",\"bar_chart\":\"📊\",\"clipboard\":\"📋\",\"pushpin\":\"📌\",\"round_pushpin\":\"📍\",\"paperclip\":\"📎\",\"straight_ruler\":\"📏\",\"triangular_ruler\":\"📐\",\"bookmark_tabs\":\"📑\",\"ledger\":\"📒\",\"notebook\":\"📓\",\"notebook_with_decorative_cover\":\"📔\",\"closed_book\":\"📕\",\"book\":\"📖\",\"open_book\":\"📖\",\"green_book\":\"📗\",\"blue_book\":\"📘\",\"orange_book\":\"📙\",\"books\":\"📚\",\"name_badge\":\"📛\",\"scroll\":\"📜\",\"memo\":\"📝\",\"pencil\":\"📝\",\"telephone_receiver\":\"📞\",\"pager\":\"📟\",\"fax\":\"📠\",\"satellite_antenna\":\"📡\",\"loudspeaker\":\"📢\",\"mega\":\"📣\",\"outbox_tray\":\"📤\",\"inbox_tray\":\"📥\",\"package\":\"📦\",\"e-mail\":\"📧\",\"incoming_envelope\":\"📨\",\"envelope_with_arrow\":\"📩\",\"mailbox_closed\":\"📪\",\"mailbox\":\"📫\",\"mailbox_with_mail\":\"📬\",\"mailbox_with_no_mail\":\"📭\",\"postbox\":\"📮\",\"postal_horn\":\"📯\",\"newspaper\":\"📰\",\"iphone\":\"📱\",\"calling\":\"📲\",\"vibration_mode\":\"📳\",\"mobile_phone_off\":\"📴\",\"no_mobile_phones\":\"📵\",\"signal_strength\":\"📶\",\"camera\":\"📷\",\"camera_with_flash\":\"📸\",\"video_camera\":\"📹\",\"tv\":\"📺\",\"radio\":\"📻\",\"vhs\":\"📼\",\"film_projector\":\"📽️\",\"prayer_beads\":\"📿\",\"twisted_rightwards_arrows\":\"🔀\",\"repeat\":\"🔁\",\"repeat_one\":\"🔂\",\"arrows_clockwise\":\"🔃\",\"arrows_counterclockwise\":\"🔄\",\"low_brightness\":\"🔅\",\"high_brightness\":\"🔆\",\"mute\":\"🔇\",\"speaker\":\"🔈\",\"sound\":\"🔉\",\"loud_sound\":\"🔊\",\"battery\":\"🔋\",\"electric_plug\":\"🔌\",\"mag\":\"🔍\",\"mag_right\":\"🔎\",\"lock_with_ink_pen\":\"🔏\",\"closed_lock_with_key\":\"🔐\",\"key\":\"🔑\",\"lock\":\"🔒\",\"unlock\":\"🔓\",\"bell\":\"🔔\",\"no_bell\":\"🔕\",\"bookmark\":\"🔖\",\"link\":\"🔗\",\"radio_button\":\"🔘\",\"back\":\"🔙\",\"end\":\"🔚\",\"on\":\"🔛\",\"soon\":\"🔜\",\"top\":\"🔝\",\"underage\":\"🔞\",\"keycap_ten\":\"🔟\",\"capital_abcd\":\"🔠\",\"abcd\":\"🔡\",\"symbols\":\"🔣\",\"abc\":\"🔤\",\"fire\":\"🔥\",\"flashlight\":\"🔦\",\"wrench\":\"🔧\",\"hammer\":\"🔨\",\"nut_and_bolt\":\"🔩\",\"hocho\":\"🔪\",\"knife\":\"🔪\",\"gun\":\"🔫\",\"microscope\":\"🔬\",\"telescope\":\"🔭\",\"crystal_ball\":\"🔮\",\"six_pointed_star\":\"🔯\",\"beginner\":\"🔰\",\"trident\":\"🔱\",\"black_square_button\":\"🔲\",\"white_square_button\":\"🔳\",\"red_circle\":\"🔴\",\"large_blue_circle\":\"🔵\",\"large_orange_diamond\":\"🔶\",\"large_blue_diamond\":\"🔷\",\"small_orange_diamond\":\"🔸\",\"small_blue_diamond\":\"🔹\",\"small_red_triangle\":\"🔺\",\"small_red_triangle_down\":\"🔻\",\"arrow_up_small\":\"🔼\",\"arrow_down_small\":\"🔽\",\"om_symbol\":\"🕉️\",\"dove_of_peace\":\"🕊️\",\"kaaba\":\"🕋\",\"mosque\":\"🕌\",\"synagogue\":\"🕍\",\"menorah_with_nine_branches\":\"🕎\",\"clock1\":\"🕐\",\"clock2\":\"🕑\",\"clock3\":\"🕒\",\"clock4\":\"🕓\",\"clock5\":\"🕔\",\"clock6\":\"🕕\",\"clock7\":\"🕖\",\"clock8\":\"🕗\",\"clock9\":\"🕘\",\"clock10\":\"🕙\",\"clock11\":\"🕚\",\"clock12\":\"🕛\",\"clock130\":\"🕜\",\"clock230\":\"🕝\",\"clock330\":\"🕞\",\"clock430\":\"🕟\",\"clock530\":\"🕠\",\"clock630\":\"🕡\",\"clock730\":\"🕢\",\"clock830\":\"🕣\",\"clock930\":\"🕤\",\"clock1030\":\"🕥\",\"clock1130\":\"🕦\",\"clock1230\":\"🕧\",\"candle\":\"🕯️\",\"mantelpiece_clock\":\"🕰️\",\"hole\":\"🕳️\",\"man_in_business_suit_levitating\":\"🕴️\",\"female-detective\":\"🕵️‍♀️\",\"male-detective\":\"🕵️‍♂️\",\"sleuth_or_spy\":\"🕵️‍♂️\",\"dark_sunglasses\":\"🕶️\",\"spider\":\"🕷️\",\"spider_web\":\"🕸️\",\"joystick\":\"🕹️\",\"man_dancing\":\"🕺\",\"linked_paperclips\":\"🖇️\",\"lower_left_ballpoint_pen\":\"🖊️\",\"lower_left_fountain_pen\":\"🖋️\",\"lower_left_paintbrush\":\"🖌️\",\"lower_left_crayon\":\"🖍️\",\"raised_hand_with_fingers_splayed\":\"🖐️\",\"middle_finger\":\"🖕\",\"reversed_hand_with_middle_finger_extended\":\"🖕\",\"spock-hand\":\"🖖\",\"black_heart\":\"🖤\",\"desktop_computer\":\"🖥️\",\"printer\":\"🖨️\",\"three_button_mouse\":\"🖱️\",\"trackball\":\"🖲️\",\"frame_with_picture\":\"🖼️\",\"card_index_dividers\":\"🗂️\",\"card_file_box\":\"🗃️\",\"file_cabinet\":\"🗄️\",\"wastebasket\":\"🗑️\",\"spiral_note_pad\":\"🗒️\",\"spiral_calendar_pad\":\"🗓️\",\"compression\":\"🗜️\",\"old_key\":\"🗝️\",\"rolled_up_newspaper\":\"🗞️\",\"dagger_knife\":\"🗡️\",\"speaking_head_in_silhouette\":\"🗣️\",\"left_speech_bubble\":\"🗨️\",\"right_anger_bubble\":\"🗯️\",\"ballot_box_with_ballot\":\"🗳️\",\"world_map\":\"🗺️\",\"mount_fuji\":\"🗻\",\"tokyo_tower\":\"🗼\",\"statue_of_liberty\":\"🗽\",\"japan\":\"🗾\",\"moyai\":\"🗿\",\"grinning\":\"😀\",\"grin\":\"😁\",\"joy\":\"😂\",\"smiley\":\"😃\",\"smile\":\"😄\",\"sweat_smile\":\"😅\",\"laughing\":\"😆\",\"satisfied\":\"😆\",\"innocent\":\"😇\",\"smiling_imp\":\"😈\",\"wink\":\"😉\",\"blush\":\"😊\",\"yum\":\"😋\",\"relieved\":\"😌\",\"heart_eyes\":\"😍\",\"sunglasses\":\"😎\",\"smirk\":\"😏\",\"neutral_face\":\"😐\",\"expressionless\":\"😑\",\"unamused\":\"😒\",\"sweat\":\"😓\",\"pensive\":\"😔\",\"confused\":\"😕\",\"confounded\":\"😖\",\"kissing\":\"😗\",\"kissing_heart\":\"😘\",\"kissing_smiling_eyes\":\"😙\",\"kissing_closed_eyes\":\"😚\",\"stuck_out_tongue\":\"😛\",\"stuck_out_tongue_winking_eye\":\"😜\",\"stuck_out_tongue_closed_eyes\":\"😝\",\"disappointed\":\"😞\",\"worried\":\"😟\",\"angry\":\"😠\",\"rage\":\"😡\",\"cry\":\"😢\",\"persevere\":\"😣\",\"triumph\":\"😤\",\"disappointed_relieved\":\"😥\",\"frowning\":\"😦\",\"anguished\":\"😧\",\"fearful\":\"😨\",\"weary\":\"😩\",\"sleepy\":\"😪\",\"tired_face\":\"😫\",\"grimacing\":\"😬\",\"sob\":\"😭\",\"open_mouth\":\"😮\",\"hushed\":\"😯\",\"cold_sweat\":\"😰\",\"scream\":\"😱\",\"astonished\":\"😲\",\"flushed\":\"😳\",\"sleeping\":\"😴\",\"dizzy_face\":\"😵\",\"no_mouth\":\"😶\",\"mask\":\"😷\",\"smile_cat\":\"😸\",\"joy_cat\":\"😹\",\"smiley_cat\":\"😺\",\"heart_eyes_cat\":\"😻\",\"smirk_cat\":\"😼\",\"kissing_cat\":\"😽\",\"pouting_cat\":\"😾\",\"crying_cat_face\":\"😿\",\"scream_cat\":\"🙀\",\"slightly_frowning_face\":\"🙁\",\"slightly_smiling_face\":\"🙂\",\"upside_down_face\":\"🙃\",\"face_with_rolling_eyes\":\"🙄\",\"woman-gesturing-no\":\"🙅‍♀️\",\"no_good\":\"🙅‍♀️\",\"man-gesturing-no\":\"🙅‍♂️\",\"woman-gesturing-ok\":\"🙆‍♀️\",\"ok_woman\":\"🙆‍♀️\",\"man-gesturing-ok\":\"🙆‍♂️\",\"woman-bowing\":\"🙇‍♀️\",\"man-bowing\":\"🙇‍♂️\",\"bow\":\"🙇‍♂️\",\"see_no_evil\":\"🙈\",\"hear_no_evil\":\"🙉\",\"speak_no_evil\":\"🙊\",\"woman-raising-hand\":\"🙋‍♀️\",\"raising_hand\":\"🙋‍♀️\",\"man-raising-hand\":\"🙋‍♂️\",\"raised_hands\":\"🙌\",\"woman-frowning\":\"🙍‍♀️\",\"person_frowning\":\"🙍‍♀️\",\"man-frowning\":\"🙍‍♂️\",\"woman-pouting\":\"🙎‍♀️\",\"person_with_pouting_face\":\"🙎‍♀️\",\"man-pouting\":\"🙎‍♂️\",\"pray\":\"🙏\",\"rocket\":\"🚀\",\"helicopter\":\"🚁\",\"steam_locomotive\":\"🚂\",\"railway_car\":\"🚃\",\"bullettrain_side\":\"🚄\",\"bullettrain_front\":\"🚅\",\"train2\":\"🚆\",\"metro\":\"🚇\",\"light_rail\":\"🚈\",\"station\":\"🚉\",\"tram\":\"🚊\",\"train\":\"🚋\",\"bus\":\"🚌\",\"oncoming_bus\":\"🚍\",\"trolleybus\":\"🚎\",\"busstop\":\"🚏\",\"minibus\":\"🚐\",\"ambulance\":\"🚑\",\"fire_engine\":\"🚒\",\"police_car\":\"🚓\",\"oncoming_police_car\":\"🚔\",\"taxi\":\"🚕\",\"oncoming_taxi\":\"🚖\",\"car\":\"🚗\",\"red_car\":\"🚗\",\"oncoming_automobile\":\"🚘\",\"blue_car\":\"🚙\",\"truck\":\"🚚\",\"articulated_lorry\":\"🚛\",\"tractor\":\"🚜\",\"monorail\":\"🚝\",\"mountain_railway\":\"🚞\",\"suspension_railway\":\"🚟\",\"mountain_cableway\":\"🚠\",\"aerial_tramway\":\"🚡\",\"ship\":\"🚢\",\"woman-rowing-boat\":\"🚣‍♀️\",\"man-rowing-boat\":\"🚣‍♂️\",\"rowboat\":\"🚣‍♂️\",\"speedboat\":\"🚤\",\"traffic_light\":\"🚥\",\"vertical_traffic_light\":\"🚦\",\"construction\":\"🚧\",\"rotating_light\":\"🚨\",\"triangular_flag_on_post\":\"🚩\",\"door\":\"🚪\",\"no_entry_sign\":\"🚫\",\"smoking\":\"🚬\",\"no_smoking\":\"🚭\",\"put_litter_in_its_place\":\"🚮\",\"do_not_litter\":\"🚯\",\"potable_water\":\"🚰\",\"non-potable_water\":\"🚱\",\"bike\":\"🚲\",\"no_bicycles\":\"🚳\",\"woman-biking\":\"🚴‍♀️\",\"man-biking\":\"🚴‍♂️\",\"bicyclist\":\"🚴‍♂️\",\"woman-mountain-biking\":\"🚵‍♀️\",\"man-mountain-biking\":\"🚵‍♂️\",\"mountain_bicyclist\":\"🚵‍♂️\",\"woman-walking\":\"🚶‍♀️\",\"man-walking\":\"🚶‍♂️\",\"walking\":\"🚶‍♂️\",\"no_pedestrians\":\"🚷\",\"children_crossing\":\"🚸\",\"mens\":\"🚹\",\"womens\":\"🚺\",\"restroom\":\"🚻\",\"baby_symbol\":\"🚼\",\"toilet\":\"🚽\",\"wc\":\"🚾\",\"shower\":\"🚿\",\"bath\":\"🛀\",\"bathtub\":\"🛁\",\"passport_control\":\"🛂\",\"customs\":\"🛃\",\"baggage_claim\":\"🛄\",\"left_luggage\":\"🛅\",\"couch_and_lamp\":\"🛋️\",\"sleeping_accommodation\":\"🛌\",\"shopping_bags\":\"🛍️\",\"bellhop_bell\":\"🛎️\",\"bed\":\"🛏️\",\"place_of_worship\":\"🛐\",\"octagonal_sign\":\"🛑\",\"shopping_trolley\":\"🛒\",\"hammer_and_wrench\":\"🛠️\",\"shield\":\"🛡️\",\"oil_drum\":\"🛢️\",\"motorway\":\"🛣️\",\"railway_track\":\"🛤️\",\"motor_boat\":\"🛥️\",\"small_airplane\":\"🛩️\",\"airplane_departure\":\"🛫\",\"airplane_arriving\":\"🛬\",\"satellite\":\"🛰️\",\"passenger_ship\":\"🛳️\",\"scooter\":\"🛴\",\"motor_scooter\":\"🛵\",\"canoe\":\"🛶\",\"sled\":\"🛷\",\"flying_saucer\":\"🛸\",\"zipper_mouth_face\":\"🤐\",\"money_mouth_face\":\"🤑\",\"face_with_thermometer\":\"🤒\",\"nerd_face\":\"🤓\",\"thinking_face\":\"🤔\",\"face_with_head_bandage\":\"🤕\",\"robot_face\":\"🤖\",\"hugging_face\":\"🤗\",\"the_horns\":\"🤘\",\"sign_of_the_horns\":\"🤘\",\"call_me_hand\":\"🤙\",\"raised_back_of_hand\":\"🤚\",\"left-facing_fist\":\"🤛\",\"right-facing_fist\":\"🤜\",\"handshake\":\"🤝\",\"crossed_fingers\":\"🤞\",\"hand_with_index_and_middle_fingers_crossed\":\"🤞\",\"i_love_you_hand_sign\":\"🤟\",\"face_with_cowboy_hat\":\"🤠\",\"clown_face\":\"🤡\",\"nauseated_face\":\"🤢\",\"rolling_on_the_floor_laughing\":\"🤣\",\"drooling_face\":\"🤤\",\"lying_face\":\"🤥\",\"woman-facepalming\":\"🤦‍♀️\",\"man-facepalming\":\"🤦‍♂️\",\"face_palm\":\"🤦\",\"sneezing_face\":\"🤧\",\"face_with_raised_eyebrow\":\"🤨\",\"face_with_one_eyebrow_raised\":\"🤨\",\"star-struck\":\"🤩\",\"grinning_face_with_star_eyes\":\"🤩\",\"zany_face\":\"🤪\",\"grinning_face_with_one_large_and_one_small_eye\":\"🤪\",\"shushing_face\":\"🤫\",\"face_with_finger_covering_closed_lips\":\"🤫\",\"face_with_symbols_on_mouth\":\"🤬\",\"serious_face_with_symbols_covering_mouth\":\"🤬\",\"face_with_hand_over_mouth\":\"🤭\",\"smiling_face_with_smiling_eyes_and_hand_covering_mouth\":\"🤭\",\"face_vomiting\":\"🤮\",\"face_with_open_mouth_vomiting\":\"🤮\",\"exploding_head\":\"🤯\",\"shocked_face_with_exploding_head\":\"🤯\",\"pregnant_woman\":\"🤰\",\"breast-feeding\":\"🤱\",\"palms_up_together\":\"🤲\",\"selfie\":\"🤳\",\"prince\":\"🤴\",\"man_in_tuxedo\":\"🤵\",\"mrs_claus\":\"🤶\",\"mother_christmas\":\"🤶\",\"woman-shrugging\":\"🤷‍♀️\",\"man-shrugging\":\"🤷‍♂️\",\"shrug\":\"🤷\",\"woman-cartwheeling\":\"🤸‍♀️\",\"man-cartwheeling\":\"🤸‍♂️\",\"person_doing_cartwheel\":\"🤸\",\"woman-juggling\":\"🤹‍♀️\",\"man-juggling\":\"🤹‍♂️\",\"juggling\":\"🤹\",\"fencer\":\"🤺\",\"woman-wrestling\":\"🤼‍♀️\",\"man-wrestling\":\"🤼‍♂️\",\"wrestlers\":\"🤼\",\"woman-playing-water-polo\":\"🤽‍♀️\",\"man-playing-water-polo\":\"🤽‍♂️\",\"water_polo\":\"🤽\",\"woman-playing-handball\":\"🤾‍♀️\",\"man-playing-handball\":\"🤾‍♂️\",\"handball\":\"🤾\",\"wilted_flower\":\"🥀\",\"drum_with_drumsticks\":\"🥁\",\"clinking_glasses\":\"🥂\",\"tumbler_glass\":\"🥃\",\"spoon\":\"🥄\",\"goal_net\":\"🥅\",\"first_place_medal\":\"🥇\",\"second_place_medal\":\"🥈\",\"third_place_medal\":\"🥉\",\"boxing_glove\":\"🥊\",\"martial_arts_uniform\":\"🥋\",\"curling_stone\":\"🥌\",\"croissant\":\"🥐\",\"avocado\":\"🥑\",\"cucumber\":\"🥒\",\"bacon\":\"🥓\",\"potato\":\"🥔\",\"carrot\":\"🥕\",\"baguette_bread\":\"🥖\",\"green_salad\":\"🥗\",\"shallow_pan_of_food\":\"🥘\",\"stuffed_flatbread\":\"🥙\",\"egg\":\"🥚\",\"glass_of_milk\":\"🥛\",\"peanuts\":\"🥜\",\"kiwifruit\":\"🥝\",\"pancakes\":\"🥞\",\"dumpling\":\"🥟\",\"fortune_cookie\":\"🥠\",\"takeout_box\":\"🥡\",\"chopsticks\":\"🥢\",\"bowl_with_spoon\":\"🥣\",\"cup_with_straw\":\"🥤\",\"coconut\":\"🥥\",\"broccoli\":\"🥦\",\"pie\":\"🥧\",\"pretzel\":\"🥨\",\"cut_of_meat\":\"🥩\",\"sandwich\":\"🥪\",\"canned_food\":\"🥫\",\"crab\":\"🦀\",\"lion_face\":\"🦁\",\"scorpion\":\"🦂\",\"turkey\":\"🦃\",\"unicorn_face\":\"🦄\",\"eagle\":\"🦅\",\"duck\":\"🦆\",\"bat\":\"🦇\",\"shark\":\"🦈\",\"owl\":\"🦉\",\"fox_face\":\"🦊\",\"butterfly\":\"🦋\",\"deer\":\"🦌\",\"gorilla\":\"🦍\",\"lizard\":\"🦎\",\"rhinoceros\":\"🦏\",\"shrimp\":\"🦐\",\"squid\":\"🦑\",\"giraffe_face\":\"🦒\",\"zebra_face\":\"🦓\",\"hedgehog\":\"🦔\",\"sauropod\":\"🦕\",\"t-rex\":\"🦖\",\"cricket\":\"🦗\",\"cheese_wedge\":\"🧀\",\"face_with_monocle\":\"🧐\",\"adult\":\"🧑\",\"child\":\"🧒\",\"older_adult\":\"🧓\",\"bearded_person\":\"🧔\",\"person_with_headscarf\":\"🧕\",\"woman_in_steamy_room\":\"🧖‍♀️\",\"man_in_steamy_room\":\"🧖‍♂️\",\"person_in_steamy_room\":\"🧖‍♂️\",\"woman_climbing\":\"🧗‍♀️\",\"person_climbing\":\"🧗‍♀️\",\"man_climbing\":\"🧗‍♂️\",\"woman_in_lotus_position\":\"🧘‍♀️\",\"person_in_lotus_position\":\"🧘‍♀️\",\"man_in_lotus_position\":\"🧘‍♂️\",\"female_mage\":\"🧙‍♀️\",\"mage\":\"🧙‍♀️\",\"male_mage\":\"🧙‍♂️\",\"female_fairy\":\"🧚‍♀️\",\"fairy\":\"🧚‍♀️\",\"male_fairy\":\"🧚‍♂️\",\"female_vampire\":\"🧛‍♀️\",\"vampire\":\"🧛‍♀️\",\"male_vampire\":\"🧛‍♂️\",\"mermaid\":\"🧜‍♀️\",\"merman\":\"🧜‍♂️\",\"merperson\":\"🧜‍♂️\",\"female_elf\":\"🧝‍♀️\",\"male_elf\":\"🧝‍♂️\",\"elf\":\"🧝‍♂️\",\"female_genie\":\"🧞‍♀️\",\"male_genie\":\"🧞‍♂️\",\"genie\":\"🧞‍♂️\",\"female_zombie\":\"🧟‍♀️\",\"male_zombie\":\"🧟‍♂️\",\"zombie\":\"🧟‍♂️\",\"brain\":\"🧠\",\"orange_heart\":\"🧡\",\"billed_cap\":\"🧢\",\"scarf\":\"🧣\",\"gloves\":\"🧤\",\"coat\":\"🧥\",\"socks\":\"🧦\",\"bangbang\":\"‼️\",\"interrobang\":\"⁉️\",\"tm\":\"™️\",\"information_source\":\"ℹ️\",\"left_right_arrow\":\"↔️\",\"arrow_up_down\":\"↕️\",\"arrow_upper_left\":\"↖️\",\"arrow_upper_right\":\"↗️\",\"arrow_lower_right\":\"↘️\",\"arrow_lower_left\":\"↙️\",\"leftwards_arrow_with_hook\":\"↩️\",\"arrow_right_hook\":\"↪️\",\"watch\":\"⌚\",\"hourglass\":\"⌛\",\"keyboard\":\"⌨️\",\"eject\":\"⏏️\",\"fast_forward\":\"⏩\",\"rewind\":\"⏪\",\"arrow_double_up\":\"⏫\",\"arrow_double_down\":\"⏬\",\"black_right_pointing_double_triangle_with_vertical_bar\":\"⏭️\",\"black_left_pointing_double_triangle_with_vertical_bar\":\"⏮️\",\"black_right_pointing_triangle_with_double_vertical_bar\":\"⏯️\",\"alarm_clock\":\"⏰\",\"stopwatch\":\"⏱️\",\"timer_clock\":\"⏲️\",\"hourglass_flowing_sand\":\"⏳\",\"double_vertical_bar\":\"⏸️\",\"black_square_for_stop\":\"⏹️\",\"black_circle_for_record\":\"⏺️\",\"m\":\"Ⓜ️\",\"black_small_square\":\"▪️\",\"white_small_square\":\"▫️\",\"arrow_forward\":\"▶️\",\"arrow_backward\":\"◀️\",\"white_medium_square\":\"◻️\",\"black_medium_square\":\"◼️\",\"white_medium_small_square\":\"◽\",\"black_medium_small_square\":\"◾\",\"sunny\":\"☀️\",\"cloud\":\"☁️\",\"umbrella\":\"☂️\",\"snowman\":\"☃️\",\"comet\":\"☄️\",\"phone\":\"☎️\",\"telephone\":\"☎️\",\"ballot_box_with_check\":\"☑️\",\"shamrock\":\"☘️\",\"point_up\":\"☝️\",\"skull_and_crossbones\":\"☠️\",\"radioactive_sign\":\"☢️\",\"biohazard_sign\":\"☣️\",\"orthodox_cross\":\"☦️\",\"star_and_crescent\":\"☪️\",\"peace_symbol\":\"☮️\",\"yin_yang\":\"☯️\",\"wheel_of_dharma\":\"☸️\",\"white_frowning_face\":\"☹️\",\"relaxed\":\"☺️\",\"female_sign\":\"♀️\",\"male_sign\":\"♂️\",\"gemini\":\"♊\",\"cancer\":\"♋\",\"leo\":\"♌\",\"virgo\":\"♍\",\"libra\":\"♎\",\"scorpius\":\"♏\",\"spades\":\"♠️\",\"clubs\":\"♣️\",\"hearts\":\"♥️\",\"diamonds\":\"♦️\",\"hotsprings\":\"♨️\",\"recycle\":\"♻️\",\"wheelchair\":\"♿\",\"hammer_and_pick\":\"⚒️\",\"crossed_swords\":\"⚔️\",\"medical_symbol\":\"⚕️\",\"staff_of_aesculapius\":\"⚕️\",\"scales\":\"⚖️\",\"alembic\":\"⚗️\",\"gear\":\"⚙️\",\"atom_symbol\":\"⚛️\",\"fleur_de_lis\":\"⚜️\",\"warning\":\"⚠️\",\"zap\":\"⚡\",\"white_circle\":\"⚪\",\"black_circle\":\"⚫\",\"coffin\":\"⚰️\",\"funeral_urn\":\"⚱️\",\"soccer\":\"⚽\",\"baseball\":\"⚾\",\"snowman_without_snow\":\"⛄\",\"partly_sunny\":\"⛅\",\"thunder_cloud_and_rain\":\"⛈️\",\"ophiuchus\":\"⛎\",\"pick\":\"⛏️\",\"helmet_with_white_cross\":\"⛑️\",\"chains\":\"⛓️\",\"no_entry\":\"⛔\",\"shinto_shrine\":\"⛩️\",\"church\":\"⛪\",\"mountain\":\"⛰️\",\"umbrella_on_ground\":\"⛱️\",\"fountain\":\"⛲\",\"golf\":\"⛳\",\"ferry\":\"⛴️\",\"boat\":\"⛵\",\"sailboat\":\"⛵\",\"skier\":\"⛷️\",\"ice_skate\":\"⛸️\",\"woman-bouncing-ball\":\"⛹️‍♀️\",\"man-bouncing-ball\":\"⛹️‍♂️\",\"person_with_ball\":\"⛹️‍♂️\",\"tent\":\"⛺\",\"fuelpump\":\"⛽\",\"scissors\":\"✂️\",\"airplane\":\"✈️\",\"email\":\"✉️\",\"envelope\":\"✉️\",\"fist\":\"✊\",\"hand\":\"✋\",\"raised_hand\":\"✋\",\"v\":\"✌️\",\"writing_hand\":\"✍️\",\"pencil2\":\"✏️\",\"black_nib\":\"✒️\",\"heavy_check_mark\":\"✔️\",\"heavy_multiplication_x\":\"✖️\",\"latin_cross\":\"✝️\",\"star_of_david\":\"✡️\",\"eight_spoked_asterisk\":\"✳️\",\"eight_pointed_black_star\":\"✴️\",\"snowflake\":\"❄️\",\"sparkle\":\"❇️\",\"x\":\"❌\",\"negative_squared_cross_mark\":\"❎\",\"heavy_heart_exclamation_mark_ornament\":\"❣️\",\"heart\":\"❤️\",\"arrow_right\":\"➡️\",\"curly_loop\":\"➰\",\"loop\":\"➿\",\"arrow_heading_up\":\"⤴️\",\"arrow_heading_down\":\"⤵️\",\"arrow_left\":\"⬅️\",\"arrow_up\":\"⬆️\",\"arrow_down\":\"⬇️\",\"black_large_square\":\"⬛\",\"white_large_square\":\"⬜\",\"star\":\"⭐\",\"o\":\"⭕\",\"wavy_dash\":\"〰️\",\"part_alternation_mark\":\"〽️\",\"congratulations\":\"㊗️\",\"secret\":\"㊙️\"}");

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZml4LXJlZ2V4cC13ZWxsLWtub3duLXN5bWJvbC1sb2dpYy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvcmVnZXhwLWV4ZWMtYWJzdHJhY3QuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3JlZ2V4cC1leGVjLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9yZWdleHAtZmxhZ3MuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3NhbWUtdmFsdWUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5yZWdleHAuZXhlYy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzLnN0cmluZy5zZWFyY2guanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2xvZGFzaC50b2FycmF5L2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9ub2RlLWVtb2ppL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9ub2RlLWVtb2ppL2xpYi9lbW9qaS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQWE7QUFDYixXQUFXLG1CQUFPLENBQUMsbUVBQW1CO0FBQ3RDLGVBQWUsbUJBQU8sQ0FBQywyRUFBdUI7QUFDOUMsWUFBWSxtQkFBTyxDQUFDLHFFQUFvQjtBQUN4QyxzQkFBc0IsbUJBQU8sQ0FBQyw2RkFBZ0M7QUFDOUQsaUJBQWlCLG1CQUFPLENBQUMsaUZBQTBCOztBQUVuRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFD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Q0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEVBQUU7QUFDYixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLGtCQUFrQixFQUFFO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxFQUFFO0FBQ2IsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLEVBQUU7QUFDYixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxFQUFFO0FBQ2IsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsRUFBRTtBQUNiLGFBQWEsUUFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxFQUFFO0FBQ2IsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7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QUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0EsWUFBWSxPQUFPO0FBQ25CLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEIsV0FBVyxnQkFBZ0I7QUFDM0IsV0FBVyxRQUFRO0FBQ25CLFlBQVk7QUFDWjtBQUNBO0FBQ0E7O0FBRUEsOEVBQThFLG9CQUFvQjtBQUNsRzs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTs7O0FBR0E7QUFDQTtBQUNBLFdBQVcsT0FBTztBQUNsQixZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7O0FBRUEiLCJmaWxlIjoidmVuZG9yc35lbW9qaUdldC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcbnZhciBoaWRlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hpZGUnKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9yZWRlZmluZScpO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG52YXIgd2VsbEtub3duU3ltYm9sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sJyk7XG52YXIgcmVnZXhwRXhlYyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9yZWdleHAtZXhlYycpO1xuXG52YXIgU1BFQ0lFUyA9IHdlbGxLbm93blN5bWJvbCgnc3BlY2llcycpO1xuXG52YXIgUkVQTEFDRV9TVVBQT1JUU19OQU1FRF9HUk9VUFMgPSAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICAvLyAjcmVwbGFjZSBuZWVkcyBidWlsdC1pbiBzdXBwb3J0IGZvciBuYW1lZCBncm91cHMuXG4gIC8vICNtYXRjaCB3b3JrcyBmaW5lIGJlY2F1c2UgaXQganVzdCByZXR1cm4gdGhlIGV4ZWMgcmVzdWx0cywgZXZlbiBpZiBpdCBoYXNcbiAgLy8gYSBcImdyb3BzXCIgcHJvcGVydHkuXG4gIHZhciByZSA9IC8uLztcbiAgcmUuZXhlYyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgcmVzdWx0Lmdyb3VwcyA9IHsgYTogJzcnIH07XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgcmV0dXJuICcnLnJlcGxhY2UocmUsICckPGE+JykgIT09ICc3Jztcbn0pO1xuXG4vLyBDaHJvbWUgNTEgaGFzIGEgYnVnZ3kgXCJzcGxpdFwiIGltcGxlbWVudGF0aW9uIHdoZW4gUmVnRXhwI2V4ZWMgIT09IG5hdGl2ZUV4ZWNcbi8vIFdlZXggSlMgaGFzIGZyb3plbiBidWlsdC1pbiBwcm90b3R5cGVzLCBzbyB1c2UgdHJ5IC8gY2F0Y2ggd3JhcHBlclxudmFyIFNQTElUX1dPUktTX1dJVEhfT1ZFUldSSVRURU5fRVhFQyA9ICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gIHZhciByZSA9IC8oPzopLztcbiAgdmFyIG9yaWdpbmFsRXhlYyA9IHJlLmV4ZWM7XG4gIHJlLmV4ZWMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBvcmlnaW5hbEV4ZWMuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfTtcbiAgdmFyIHJlc3VsdCA9ICdhYicuc3BsaXQocmUpO1xuICByZXR1cm4gcmVzdWx0Lmxlbmd0aCAhPT0gMiB8fCByZXN1bHRbMF0gIT09ICdhJyB8fCByZXN1bHRbMV0gIT09ICdiJztcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChLRVksIGxlbmd0aCwgZXhlYywgc2hhbSkge1xuICB2YXIgU1lNQk9MID0gd2VsbEtub3duU3ltYm9sKEtFWSk7XG5cbiAgdmFyIERFTEVHQVRFU19UT19TWU1CT0wgPSAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICAgIC8vIFN0cmluZyBtZXRob2RzIGNhbGwgc3ltYm9sLW5hbWVkIFJlZ0VwIG1ldGhvZHNcbiAgICB2YXIgTyA9IHt9O1xuICAgIE9bU1lNQk9MXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDc7IH07XG4gICAgcmV0dXJuICcnW0tFWV0oTykgIT0gNztcbiAgfSk7XG5cbiAgdmFyIERFTEVHQVRFU19UT19FWEVDID0gREVMRUdBVEVTX1RPX1NZTUJPTCAmJiAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICAgIC8vIFN5bWJvbC1uYW1lZCBSZWdFeHAgbWV0aG9kcyBjYWxsIC5leGVjXG4gICAgdmFyIGV4ZWNDYWxsZWQgPSBmYWxzZTtcbiAgICB2YXIgcmUgPSAvYS87XG4gICAgcmUuZXhlYyA9IGZ1bmN0aW9uICgpIHsgZXhlY0NhbGxlZCA9IHRydWU7IHJldHVybiBudWxsOyB9O1xuXG4gICAgaWYgKEtFWSA9PT0gJ3NwbGl0Jykge1xuICAgICAgLy8gUmVnRXhwW0BAc3BsaXRdIGRvZXNuJ3QgY2FsbCB0aGUgcmVnZXgncyBleGVjIG1ldGhvZCwgYnV0IGZpcnN0IGNyZWF0ZXNcbiAgICAgIC8vIGEgbmV3IG9uZS4gV2UgbmVlZCB0byByZXR1cm4gdGhlIHBhdGNoZWQgcmVnZXggd2hlbiBjcmVhdGluZyB0aGUgbmV3IG9uZS5cbiAgICAgIHJlLmNvbnN0cnVjdG9yID0ge307XG4gICAgICByZS5jb25zdHJ1Y3RvcltTUEVDSUVTXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHJlOyB9O1xuICAgIH1cblxuICAgIHJlW1NZTUJPTF0oJycpO1xuICAgIHJldHVybiAhZXhlY0NhbGxlZDtcbiAgfSk7XG5cbiAgaWYgKFxuICAgICFERUxFR0FURVNfVE9fU1lNQk9MIHx8XG4gICAgIURFTEVHQVRFU19UT19FWEVDIHx8XG4gICAgKEtFWSA9PT0gJ3JlcGxhY2UnICYmICFSRVBMQUNFX1NVUFBPUlRTX05BTUVEX0dST1VQUykgfHxcbiAgICAoS0VZID09PSAnc3BsaXQnICYmICFTUExJVF9XT1JLU19XSVRIX09WRVJXUklUVEVOX0VYRUMpXG4gICkge1xuICAgIHZhciBuYXRpdmVSZWdFeHBNZXRob2QgPSAvLi9bU1lNQk9MXTtcbiAgICB2YXIgbWV0aG9kcyA9IGV4ZWMoU1lNQk9MLCAnJ1tLRVldLCBmdW5jdGlvbiAobmF0aXZlTWV0aG9kLCByZWdleHAsIHN0ciwgYXJnMiwgZm9yY2VTdHJpbmdNZXRob2QpIHtcbiAgICAgIGlmIChyZWdleHAuZXhlYyA9PT0gcmVnZXhwRXhlYykge1xuICAgICAgICBpZiAoREVMRUdBVEVTX1RPX1NZTUJPTCAmJiAhZm9yY2VTdHJpbmdNZXRob2QpIHtcbiAgICAgICAgICAvLyBUaGUgbmF0aXZlIFN0cmluZyBtZXRob2QgYWxyZWFkeSBkZWxlZ2F0ZXMgdG8gQEBtZXRob2QgKHRoaXNcbiAgICAgICAgICAvLyBwb2x5ZmlsbGVkIGZ1bmN0aW9uKSwgbGVhc2luZyB0byBpbmZpbml0ZSByZWN1cnNpb24uXG4gICAgICAgICAgLy8gV2UgYXZvaWQgaXQgYnkgZGlyZWN0bHkgY2FsbGluZyB0aGUgbmF0aXZlIEBAbWV0aG9kIG1ldGhvZC5cbiAgICAgICAgICByZXR1cm4geyBkb25lOiB0cnVlLCB2YWx1ZTogbmF0aXZlUmVnRXhwTWV0aG9kLmNhbGwocmVnZXhwLCBzdHIsIGFyZzIpIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgZG9uZTogdHJ1ZSwgdmFsdWU6IG5hdGl2ZU1ldGhvZC5jYWxsKHN0ciwgcmVnZXhwLCBhcmcyKSB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHsgZG9uZTogZmFsc2UgfTtcbiAgICB9KTtcbiAgICB2YXIgc3RyaW5nTWV0aG9kID0gbWV0aG9kc1swXTtcbiAgICB2YXIgcmVnZXhNZXRob2QgPSBtZXRob2RzWzFdO1xuXG4gICAgcmVkZWZpbmUoU3RyaW5nLnByb3RvdHlwZSwgS0VZLCBzdHJpbmdNZXRob2QpO1xuICAgIHJlZGVmaW5lKFJlZ0V4cC5wcm90b3R5cGUsIFNZTUJPTCwgbGVuZ3RoID09IDJcbiAgICAgIC8vIDIxLjIuNS44IFJlZ0V4cC5wcm90b3R5cGVbQEByZXBsYWNlXShzdHJpbmcsIHJlcGxhY2VWYWx1ZSlcbiAgICAgIC8vIDIxLjIuNS4xMSBSZWdFeHAucHJvdG90eXBlW0BAc3BsaXRdKHN0cmluZywgbGltaXQpXG4gICAgICA/IGZ1bmN0aW9uIChzdHJpbmcsIGFyZykgeyByZXR1cm4gcmVnZXhNZXRob2QuY2FsbChzdHJpbmcsIHRoaXMsIGFyZyk7IH1cbiAgICAgIC8vIDIxLjIuNS42IFJlZ0V4cC5wcm90b3R5cGVbQEBtYXRjaF0oc3RyaW5nKVxuICAgICAgLy8gMjEuMi41LjkgUmVnRXhwLnByb3RvdHlwZVtAQHNlYXJjaF0oc3RyaW5nKVxuICAgICAgOiBmdW5jdGlvbiAoc3RyaW5nKSB7IHJldHVybiByZWdleE1ldGhvZC5jYWxsKHN0cmluZywgdGhpcyk7IH1cbiAgICApO1xuICAgIGlmIChzaGFtKSBoaWRlKFJlZ0V4cC5wcm90b3R5cGVbU1lNQk9MXSwgJ3NoYW0nLCB0cnVlKTtcbiAgfVxufTtcbiIsInZhciBjbGFzc29mID0gcmVxdWlyZSgnLi9jbGFzc29mLXJhdycpO1xudmFyIHJlZ2V4cEV4ZWMgPSByZXF1aXJlKCcuL3JlZ2V4cC1leGVjJyk7XG5cbi8vIGBSZWdFeHBFeGVjYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXJlZ2V4cGV4ZWNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKFIsIFMpIHtcbiAgdmFyIGV4ZWMgPSBSLmV4ZWM7XG4gIGlmICh0eXBlb2YgZXhlYyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHZhciByZXN1bHQgPSBleGVjLmNhbGwoUiwgUyk7XG4gICAgaWYgKHR5cGVvZiByZXN1bHQgIT09ICdvYmplY3QnKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ1JlZ0V4cCBleGVjIG1ldGhvZCByZXR1cm5lZCBzb21ldGhpbmcgb3RoZXIgdGhhbiBhbiBPYmplY3Qgb3IgbnVsbCcpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgaWYgKGNsYXNzb2YoUikgIT09ICdSZWdFeHAnKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCdSZWdFeHAjZXhlYyBjYWxsZWQgb24gaW5jb21wYXRpYmxlIHJlY2VpdmVyJyk7XG4gIH1cblxuICByZXR1cm4gcmVnZXhwRXhlYy5jYWxsKFIsIFMpO1xufTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIHJlZ2V4cEZsYWdzID0gcmVxdWlyZSgnLi9yZWdleHAtZmxhZ3MnKTtcblxudmFyIG5hdGl2ZUV4ZWMgPSBSZWdFeHAucHJvdG90eXBlLmV4ZWM7XG4vLyBUaGlzIGFsd2F5cyByZWZlcnMgdG8gdGhlIG5hdGl2ZSBpbXBsZW1lbnRhdGlvbiwgYmVjYXVzZSB0aGVcbi8vIFN0cmluZyNyZXBsYWNlIHBvbHlmaWxsIHVzZXMgLi9maXgtcmVnZXhwLXdlbGwta25vd24tc3ltYm9sLWxvZ2ljLmpzLFxuLy8gd2hpY2ggbG9hZHMgdGhpcyBmaWxlIGJlZm9yZSBwYXRjaGluZyB0aGUgbWV0aG9kLlxudmFyIG5hdGl2ZVJlcGxhY2UgPSBTdHJpbmcucHJvdG90eXBlLnJlcGxhY2U7XG5cbnZhciBwYXRjaGVkRXhlYyA9IG5hdGl2ZUV4ZWM7XG5cbnZhciBVUERBVEVTX0xBU1RfSU5ERVhfV1JPTkcgPSAoZnVuY3Rpb24gKCkge1xuICB2YXIgcmUxID0gL2EvO1xuICB2YXIgcmUyID0gL2IqL2c7XG4gIG5hdGl2ZUV4ZWMuY2FsbChyZTEsICdhJyk7XG4gIG5hdGl2ZUV4ZWMuY2FsbChyZTIsICdhJyk7XG4gIHJldHVybiByZTEubGFzdEluZGV4ICE9PSAwIHx8IHJlMi5sYXN0SW5kZXggIT09IDA7XG59KSgpO1xuXG4vLyBub25wYXJ0aWNpcGF0aW5nIGNhcHR1cmluZyBncm91cCwgY29waWVkIGZyb20gZXM1LXNoaW0ncyBTdHJpbmcjc3BsaXQgcGF0Y2guXG52YXIgTlBDR19JTkNMVURFRCA9IC8oKT8/Ly5leGVjKCcnKVsxXSAhPT0gdW5kZWZpbmVkO1xuXG52YXIgUEFUQ0ggPSBVUERBVEVTX0xBU1RfSU5ERVhfV1JPTkcgfHwgTlBDR19JTkNMVURFRDtcblxuaWYgKFBBVENIKSB7XG4gIHBhdGNoZWRFeGVjID0gZnVuY3Rpb24gZXhlYyhzdHIpIHtcbiAgICB2YXIgcmUgPSB0aGlzO1xuICAgIHZhciBsYXN0SW5kZXgsIHJlQ29weSwgbWF0Y2gsIGk7XG5cbiAgICBpZiAoTlBDR19JTkNMVURFRCkge1xuICAgICAgcmVDb3B5ID0gbmV3IFJlZ0V4cCgnXicgKyByZS5zb3VyY2UgKyAnJCg/IVxcXFxzKScsIHJlZ2V4cEZsYWdzLmNhbGwocmUpKTtcbiAgICB9XG4gICAgaWYgKFVQREFURVNfTEFTVF9JTkRFWF9XUk9ORykgbGFzdEluZGV4ID0gcmUubGFzdEluZGV4O1xuXG4gICAgbWF0Y2ggPSBuYXRpdmVFeGVjLmNhbGwocmUsIHN0cik7XG5cbiAgICBpZiAoVVBEQVRFU19MQVNUX0lOREVYX1dST05HICYmIG1hdGNoKSB7XG4gICAgICByZS5sYXN0SW5kZXggPSByZS5nbG9iYWwgPyBtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aCA6IGxhc3RJbmRleDtcbiAgICB9XG4gICAgaWYgKE5QQ0dfSU5DTFVERUQgJiYgbWF0Y2ggJiYgbWF0Y2gubGVuZ3RoID4gMSkge1xuICAgICAgLy8gRml4IGJyb3dzZXJzIHdob3NlIGBleGVjYCBtZXRob2RzIGRvbid0IGNvbnNpc3RlbnRseSByZXR1cm4gYHVuZGVmaW5lZGBcbiAgICAgIC8vIGZvciBOUENHLCBsaWtlIElFOC4gTk9URTogVGhpcyBkb2Vzbicgd29yayBmb3IgLyguPyk/L1xuICAgICAgbmF0aXZlUmVwbGFjZS5jYWxsKG1hdGNoWzBdLCByZUNvcHksIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGggLSAyOyBpKyspIHtcbiAgICAgICAgICBpZiAoYXJndW1lbnRzW2ldID09PSB1bmRlZmluZWQpIG1hdGNoW2ldID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWF0Y2g7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcGF0Y2hlZEV4ZWM7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYW4tb2JqZWN0Jyk7XG5cbi8vIGBSZWdFeHAucHJvdG90eXBlLmZsYWdzYCBnZXR0ZXIgaW1wbGVtZW50YXRpb25cbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWdldC1yZWdleHAucHJvdG90eXBlLmZsYWdzXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHRoYXQgPSBhbk9iamVjdCh0aGlzKTtcbiAgdmFyIHJlc3VsdCA9ICcnO1xuICBpZiAodGhhdC5nbG9iYWwpIHJlc3VsdCArPSAnZyc7XG4gIGlmICh0aGF0Lmlnbm9yZUNhc2UpIHJlc3VsdCArPSAnaSc7XG4gIGlmICh0aGF0Lm11bHRpbGluZSkgcmVzdWx0ICs9ICdtJztcbiAgaWYgKHRoYXQuZG90QWxsKSByZXN1bHQgKz0gJ3MnO1xuICBpZiAodGhhdC51bmljb2RlKSByZXN1bHQgKz0gJ3UnO1xuICBpZiAodGhhdC5zdGlja3kpIHJlc3VsdCArPSAneSc7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwiLy8gYFNhbWVWYWx1ZWAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1zYW1ldmFsdWVcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmlzIHx8IGZ1bmN0aW9uIGlzKHgsIHkpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICByZXR1cm4geCA9PT0geSA/IHggIT09IDAgfHwgMSAvIHggPT09IDEgLyB5IDogeCAhPSB4ICYmIHkgIT0geTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcbnZhciBleGVjID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3JlZ2V4cC1leGVjJyk7XG5cbiQoeyB0YXJnZXQ6ICdSZWdFeHAnLCBwcm90bzogdHJ1ZSwgZm9yY2VkOiAvLi8uZXhlYyAhPT0gZXhlYyB9LCB7XG4gIGV4ZWM6IGV4ZWNcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGZpeFJlZ0V4cFdlbGxLbm93blN5bWJvbExvZ2ljID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZpeC1yZWdleHAtd2VsbC1rbm93bi1zeW1ib2wtbG9naWMnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1vYmplY3QnKTtcbnZhciByZXF1aXJlT2JqZWN0Q29lcmNpYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3JlcXVpcmUtb2JqZWN0LWNvZXJjaWJsZScpO1xudmFyIHNhbWVWYWx1ZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zYW1lLXZhbHVlJyk7XG52YXIgcmVnRXhwRXhlYyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9yZWdleHAtZXhlYy1hYnN0cmFjdCcpO1xuXG4vLyBAQHNlYXJjaCBsb2dpY1xuZml4UmVnRXhwV2VsbEtub3duU3ltYm9sTG9naWMoJ3NlYXJjaCcsIDEsIGZ1bmN0aW9uIChTRUFSQ0gsIG5hdGl2ZVNlYXJjaCwgbWF5YmVDYWxsTmF0aXZlKSB7XG4gIHJldHVybiBbXG4gICAgLy8gYFN0cmluZy5wcm90b3R5cGUuc2VhcmNoYCBtZXRob2RcbiAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1zdHJpbmcucHJvdG90eXBlLnNlYXJjaFxuICAgIGZ1bmN0aW9uIHNlYXJjaChyZWdleHApIHtcbiAgICAgIHZhciBPID0gcmVxdWlyZU9iamVjdENvZXJjaWJsZSh0aGlzKTtcbiAgICAgIHZhciBzZWFyY2hlciA9IHJlZ2V4cCA9PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiByZWdleHBbU0VBUkNIXTtcbiAgICAgIHJldHVybiBzZWFyY2hlciAhPT0gdW5kZWZpbmVkID8gc2VhcmNoZXIuY2FsbChyZWdleHAsIE8pIDogbmV3IFJlZ0V4cChyZWdleHApW1NFQVJDSF0oU3RyaW5nKE8pKTtcbiAgICB9LFxuICAgIC8vIGBSZWdFeHAucHJvdG90eXBlW0BAc2VhcmNoXWAgbWV0aG9kXG4gICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtcmVnZXhwLnByb3RvdHlwZS1AQHNlYXJjaFxuICAgIGZ1bmN0aW9uIChyZWdleHApIHtcbiAgICAgIHZhciByZXMgPSBtYXliZUNhbGxOYXRpdmUobmF0aXZlU2VhcmNoLCByZWdleHAsIHRoaXMpO1xuICAgICAgaWYgKHJlcy5kb25lKSByZXR1cm4gcmVzLnZhbHVlO1xuXG4gICAgICB2YXIgcnggPSBhbk9iamVjdChyZWdleHApO1xuICAgICAgdmFyIFMgPSBTdHJpbmcodGhpcyk7XG5cbiAgICAgIHZhciBwcmV2aW91c0xhc3RJbmRleCA9IHJ4Lmxhc3RJbmRleDtcbiAgICAgIGlmICghc2FtZVZhbHVlKHByZXZpb3VzTGFzdEluZGV4LCAwKSkgcngubGFzdEluZGV4ID0gMDtcbiAgICAgIHZhciByZXN1bHQgPSByZWdFeHBFeGVjKHJ4LCBTKTtcbiAgICAgIGlmICghc2FtZVZhbHVlKHJ4Lmxhc3RJbmRleCwgcHJldmlvdXNMYXN0SW5kZXgpKSByeC5sYXN0SW5kZXggPSBwcmV2aW91c0xhc3RJbmRleDtcbiAgICAgIHJldHVybiByZXN1bHQgPT09IG51bGwgPyAtMSA6IHJlc3VsdC5pbmRleDtcbiAgICB9XG4gIF07XG59KTtcbiIsIi8qKlxuICogbG9kYXNoIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgalF1ZXJ5IEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyA8aHR0cHM6Ly9qcXVlcnkub3JnLz5cbiAqIFJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqL1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBnZW5UYWcgPSAnW29iamVjdCBHZW5lcmF0b3JGdW5jdGlvbl0nLFxuICAgIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgIHByb21pc2VUYWcgPSAnW29iamVjdCBQcm9taXNlXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXScsXG4gICAgd2Vha01hcFRhZyA9ICdbb2JqZWN0IFdlYWtNYXBdJztcblxudmFyIGRhdGFWaWV3VGFnID0gJ1tvYmplY3QgRGF0YVZpZXddJztcblxuLyoqXG4gKiBVc2VkIHRvIG1hdGNoIGBSZWdFeHBgXG4gKiBbc3ludGF4IGNoYXJhY3RlcnNdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXBhdHRlcm5zKS5cbiAqL1xudmFyIHJlUmVnRXhwQ2hhciA9IC9bXFxcXF4kLiorPygpW1xcXXt9fF0vZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGhvc3QgY29uc3RydWN0b3JzIChTYWZhcmkpLiAqL1xudmFyIHJlSXNIb3N0Q3RvciA9IC9eXFxbb2JqZWN0IC4rP0NvbnN0cnVjdG9yXFxdJC87XG5cbi8qKiBVc2VkIHRvIGRldGVjdCB1bnNpZ25lZCBpbnRlZ2VyIHZhbHVlcy4gKi9cbnZhciByZUlzVWludCA9IC9eKD86MHxbMS05XVxcZCopJC87XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgdW5pY29kZSBjaGFyYWN0ZXIgY2xhc3Nlcy4gKi9cbnZhciByc0FzdHJhbFJhbmdlID0gJ1xcXFx1ZDgwMC1cXFxcdWRmZmYnLFxuICAgIHJzQ29tYm9NYXJrc1JhbmdlID0gJ1xcXFx1MDMwMC1cXFxcdTAzNmZcXFxcdWZlMjAtXFxcXHVmZTIzJyxcbiAgICByc0NvbWJvU3ltYm9sc1JhbmdlID0gJ1xcXFx1MjBkMC1cXFxcdTIwZjAnLFxuICAgIHJzVmFyUmFuZ2UgPSAnXFxcXHVmZTBlXFxcXHVmZTBmJztcblxuLyoqIFVzZWQgdG8gY29tcG9zZSB1bmljb2RlIGNhcHR1cmUgZ3JvdXBzLiAqL1xudmFyIHJzQXN0cmFsID0gJ1snICsgcnNBc3RyYWxSYW5nZSArICddJyxcbiAgICByc0NvbWJvID0gJ1snICsgcnNDb21ib01hcmtzUmFuZ2UgKyByc0NvbWJvU3ltYm9sc1JhbmdlICsgJ10nLFxuICAgIHJzRml0eiA9ICdcXFxcdWQ4M2NbXFxcXHVkZmZiLVxcXFx1ZGZmZl0nLFxuICAgIHJzTW9kaWZpZXIgPSAnKD86JyArIHJzQ29tYm8gKyAnfCcgKyByc0ZpdHogKyAnKScsXG4gICAgcnNOb25Bc3RyYWwgPSAnW14nICsgcnNBc3RyYWxSYW5nZSArICddJyxcbiAgICByc1JlZ2lvbmFsID0gJyg/OlxcXFx1ZDgzY1tcXFxcdWRkZTYtXFxcXHVkZGZmXSl7Mn0nLFxuICAgIHJzU3VyclBhaXIgPSAnW1xcXFx1ZDgwMC1cXFxcdWRiZmZdW1xcXFx1ZGMwMC1cXFxcdWRmZmZdJyxcbiAgICByc1pXSiA9ICdcXFxcdTIwMGQnO1xuXG4vKiogVXNlZCB0byBjb21wb3NlIHVuaWNvZGUgcmVnZXhlcy4gKi9cbnZhciByZU9wdE1vZCA9IHJzTW9kaWZpZXIgKyAnPycsXG4gICAgcnNPcHRWYXIgPSAnWycgKyByc1ZhclJhbmdlICsgJ10/JyxcbiAgICByc09wdEpvaW4gPSAnKD86JyArIHJzWldKICsgJyg/OicgKyBbcnNOb25Bc3RyYWwsIHJzUmVnaW9uYWwsIHJzU3VyclBhaXJdLmpvaW4oJ3wnKSArICcpJyArIHJzT3B0VmFyICsgcmVPcHRNb2QgKyAnKSonLFxuICAgIHJzU2VxID0gcnNPcHRWYXIgKyByZU9wdE1vZCArIHJzT3B0Sm9pbixcbiAgICByc1N5bWJvbCA9ICcoPzonICsgW3JzTm9uQXN0cmFsICsgcnNDb21ibyArICc/JywgcnNDb21ibywgcnNSZWdpb25hbCwgcnNTdXJyUGFpciwgcnNBc3RyYWxdLmpvaW4oJ3wnKSArICcpJztcblxuLyoqIFVzZWQgdG8gbWF0Y2ggW3N0cmluZyBzeW1ib2xzXShodHRwczovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvamF2YXNjcmlwdC11bmljb2RlKS4gKi9cbnZhciByZVVuaWNvZGUgPSBSZWdFeHAocnNGaXR6ICsgJyg/PScgKyByc0ZpdHogKyAnKXwnICsgcnNTeW1ib2wgKyByc1NlcSwgJ2cnKTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IHN0cmluZ3Mgd2l0aCBbemVyby13aWR0aCBqb2luZXJzIG9yIGNvZGUgcG9pbnRzIGZyb20gdGhlIGFzdHJhbCBwbGFuZXNdKGh0dHA6Ly9lZXYuZWUvYmxvZy8yMDE1LzA5LzEyL2RhcmstY29ybmVycy1vZi11bmljb2RlLykuICovXG52YXIgcmVIYXNVbmljb2RlID0gUmVnRXhwKCdbJyArIHJzWldKICsgcnNBc3RyYWxSYW5nZSAgKyByc0NvbWJvTWFya3NSYW5nZSArIHJzQ29tYm9TeW1ib2xzUmFuZ2UgKyByc1ZhclJhbmdlICsgJ10nKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwgJiYgZ2xvYmFsLk9iamVjdCA9PT0gT2JqZWN0ICYmIGdsb2JhbDtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbnZhciBmcmVlU2VsZiA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYgJiYgc2VsZi5PYmplY3QgPT09IE9iamVjdCAmJiBzZWxmO1xuXG4vKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbnZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5tYXBgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZVxuICogc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5XSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IG1hcHBlZCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gYXJyYXlNYXAoYXJyYXksIGl0ZXJhdGVlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwLFxuICAgICAgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKTtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHJlc3VsdFtpbmRleF0gPSBpdGVyYXRlZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBhbiBBU0NJSSBgc3RyaW5nYCB0byBhbiBhcnJheS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBUaGUgc3RyaW5nIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gYXNjaWlUb0FycmF5KHN0cmluZykge1xuICByZXR1cm4gc3RyaW5nLnNwbGl0KCcnKTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy50aW1lc2Agd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzXG4gKiBvciBtYXggYXJyYXkgbGVuZ3RoIGNoZWNrcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IG4gVGhlIG51bWJlciBvZiB0aW1lcyB0byBpbnZva2UgYGl0ZXJhdGVlYC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGl0ZXJhdGVlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBpdGVyYXRpb24uXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHJlc3VsdHMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VUaW1lcyhuLCBpdGVyYXRlZSkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IEFycmF5KG4pO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbikge1xuICAgIHJlc3VsdFtpbmRleF0gPSBpdGVyYXRlZShpbmRleCk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy52YWx1ZXNgIGFuZCBgXy52YWx1ZXNJbmAgd2hpY2ggY3JlYXRlcyBhblxuICogYXJyYXkgb2YgYG9iamVjdGAgcHJvcGVydHkgdmFsdWVzIGNvcnJlc3BvbmRpbmcgdG8gdGhlIHByb3BlcnR5IG5hbWVzXG4gKiBvZiBgcHJvcHNgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge0FycmF5fSBwcm9wcyBUaGUgcHJvcGVydHkgbmFtZXMgdG8gZ2V0IHZhbHVlcyBmb3IuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSB2YWx1ZXMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VWYWx1ZXMob2JqZWN0LCBwcm9wcykge1xuICByZXR1cm4gYXJyYXlNYXAocHJvcHMsIGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiBvYmplY3Rba2V5XTtcbiAgfSk7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgdmFsdWUgYXQgYGtleWAgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgcHJvcGVydHkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGdldFZhbHVlKG9iamVjdCwga2V5KSB7XG4gIHJldHVybiBvYmplY3QgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IG9iamVjdFtrZXldO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgc3RyaW5nYCBjb250YWlucyBVbmljb2RlIHN5bWJvbHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byBpbnNwZWN0LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGEgc3ltYm9sIGlzIGZvdW5kLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGhhc1VuaWNvZGUoc3RyaW5nKSB7XG4gIHJldHVybiByZUhhc1VuaWNvZGUudGVzdChzdHJpbmcpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgaG9zdCBvYmplY3QgaW4gSUUgPCA5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgaG9zdCBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNIb3N0T2JqZWN0KHZhbHVlKSB7XG4gIC8vIE1hbnkgaG9zdCBvYmplY3RzIGFyZSBgT2JqZWN0YCBvYmplY3RzIHRoYXQgY2FuIGNvZXJjZSB0byBzdHJpbmdzXG4gIC8vIGRlc3BpdGUgaGF2aW5nIGltcHJvcGVybHkgZGVmaW5lZCBgdG9TdHJpbmdgIG1ldGhvZHMuXG4gIHZhciByZXN1bHQgPSBmYWxzZTtcbiAgaWYgKHZhbHVlICE9IG51bGwgJiYgdHlwZW9mIHZhbHVlLnRvU3RyaW5nICE9ICdmdW5jdGlvbicpIHtcbiAgICB0cnkge1xuICAgICAgcmVzdWx0ID0gISEodmFsdWUgKyAnJyk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGBpdGVyYXRvcmAgdG8gYW4gYXJyYXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBpdGVyYXRvciBUaGUgaXRlcmF0b3IgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgY29udmVydGVkIGFycmF5LlxuICovXG5mdW5jdGlvbiBpdGVyYXRvclRvQXJyYXkoaXRlcmF0b3IpIHtcbiAgdmFyIGRhdGEsXG4gICAgICByZXN1bHQgPSBbXTtcblxuICB3aGlsZSAoIShkYXRhID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgcmVzdWx0LnB1c2goZGF0YS52YWx1ZSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBgbWFwYCB0byBpdHMga2V5LXZhbHVlIHBhaXJzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gbWFwIFRoZSBtYXAgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUga2V5LXZhbHVlIHBhaXJzLlxuICovXG5mdW5jdGlvbiBtYXBUb0FycmF5KG1hcCkge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHJlc3VsdCA9IEFycmF5KG1hcC5zaXplKTtcblxuICBtYXAuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgcmVzdWx0WysraW5kZXhdID0gW2tleSwgdmFsdWVdO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgdW5hcnkgZnVuY3Rpb24gdGhhdCBpbnZva2VzIGBmdW5jYCB3aXRoIGl0cyBhcmd1bWVudCB0cmFuc2Zvcm1lZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gd3JhcC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHRyYW5zZm9ybSBUaGUgYXJndW1lbnQgdHJhbnNmb3JtLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIG92ZXJBcmcoZnVuYywgdHJhbnNmb3JtKSB7XG4gIHJldHVybiBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4gZnVuYyh0cmFuc2Zvcm0oYXJnKSk7XG4gIH07XG59XG5cbi8qKlxuICogQ29udmVydHMgYHNldGAgdG8gYW4gYXJyYXkgb2YgaXRzIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHNldCBUaGUgc2V0IHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIHZhbHVlcy5cbiAqL1xuZnVuY3Rpb24gc2V0VG9BcnJheShzZXQpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBBcnJheShzZXQuc2l6ZSk7XG5cbiAgc2V0LmZvckVhY2goZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXN1bHRbKytpbmRleF0gPSB2YWx1ZTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQ29udmVydHMgYHN0cmluZ2AgdG8gYW4gYXJyYXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byBjb252ZXJ0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIHN0cmluZ1RvQXJyYXkoc3RyaW5nKSB7XG4gIHJldHVybiBoYXNVbmljb2RlKHN0cmluZylcbiAgICA/IHVuaWNvZGVUb0FycmF5KHN0cmluZylcbiAgICA6IGFzY2lpVG9BcnJheShzdHJpbmcpO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGEgVW5pY29kZSBgc3RyaW5nYCB0byBhbiBhcnJheS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBUaGUgc3RyaW5nIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gdW5pY29kZVRvQXJyYXkoc3RyaW5nKSB7XG4gIHJldHVybiBzdHJpbmcubWF0Y2gocmVVbmljb2RlKSB8fCBbXTtcbn1cblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGZ1bmNQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZSxcbiAgICBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBvdmVycmVhY2hpbmcgY29yZS1qcyBzaGltcy4gKi9cbnZhciBjb3JlSnNEYXRhID0gcm9vdFsnX19jb3JlLWpzX3NoYXJlZF9fJ107XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBtZXRob2RzIG1hc3F1ZXJhZGluZyBhcyBuYXRpdmUuICovXG52YXIgbWFza1NyY0tleSA9IChmdW5jdGlvbigpIHtcbiAgdmFyIHVpZCA9IC9bXi5dKyQvLmV4ZWMoY29yZUpzRGF0YSAmJiBjb3JlSnNEYXRhLmtleXMgJiYgY29yZUpzRGF0YS5rZXlzLklFX1BST1RPIHx8ICcnKTtcbiAgcmV0dXJuIHVpZCA/ICgnU3ltYm9sKHNyYylfMS4nICsgdWlkKSA6ICcnO1xufSgpKTtcblxuLyoqIFVzZWQgdG8gcmVzb2x2ZSB0aGUgZGVjb21waWxlZCBzb3VyY2Ugb2YgZnVuY3Rpb25zLiAqL1xudmFyIGZ1bmNUb1N0cmluZyA9IGZ1bmNQcm90by50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBpZiBhIG1ldGhvZCBpcyBuYXRpdmUuICovXG52YXIgcmVJc05hdGl2ZSA9IFJlZ0V4cCgnXicgK1xuICBmdW5jVG9TdHJpbmcuY2FsbChoYXNPd25Qcm9wZXJ0eSkucmVwbGFjZShyZVJlZ0V4cENoYXIsICdcXFxcJCYnKVxuICAucmVwbGFjZSgvaGFzT3duUHJvcGVydHl8KGZ1bmN0aW9uKS4qPyg/PVxcXFxcXCgpfCBmb3IgLis/KD89XFxcXFxcXSkvZywgJyQxLio/JykgKyAnJCdcbik7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIFN5bWJvbCA9IHJvb3QuU3ltYm9sLFxuICAgIGl0ZXJhdG9yU3ltYm9sID0gU3ltYm9sID8gU3ltYm9sLml0ZXJhdG9yIDogdW5kZWZpbmVkLFxuICAgIHByb3BlcnR5SXNFbnVtZXJhYmxlID0gb2JqZWN0UHJvdG8ucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVLZXlzID0gb3ZlckFyZyhPYmplY3Qua2V5cywgT2JqZWN0KTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIERhdGFWaWV3ID0gZ2V0TmF0aXZlKHJvb3QsICdEYXRhVmlldycpLFxuICAgIE1hcCA9IGdldE5hdGl2ZShyb290LCAnTWFwJyksXG4gICAgUHJvbWlzZSA9IGdldE5hdGl2ZShyb290LCAnUHJvbWlzZScpLFxuICAgIFNldCA9IGdldE5hdGl2ZShyb290LCAnU2V0JyksXG4gICAgV2Vha01hcCA9IGdldE5hdGl2ZShyb290LCAnV2Vha01hcCcpO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgbWFwcywgc2V0cywgYW5kIHdlYWttYXBzLiAqL1xudmFyIGRhdGFWaWV3Q3RvclN0cmluZyA9IHRvU291cmNlKERhdGFWaWV3KSxcbiAgICBtYXBDdG9yU3RyaW5nID0gdG9Tb3VyY2UoTWFwKSxcbiAgICBwcm9taXNlQ3RvclN0cmluZyA9IHRvU291cmNlKFByb21pc2UpLFxuICAgIHNldEN0b3JTdHJpbmcgPSB0b1NvdXJjZShTZXQpLFxuICAgIHdlYWtNYXBDdG9yU3RyaW5nID0gdG9Tb3VyY2UoV2Vha01hcCk7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiB0aGUgYXJyYXktbGlrZSBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBxdWVyeS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaW5oZXJpdGVkIFNwZWNpZnkgcmV0dXJuaW5nIGluaGVyaXRlZCBwcm9wZXJ0eSBuYW1lcy5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGFycmF5TGlrZUtleXModmFsdWUsIGluaGVyaXRlZCkge1xuICAvLyBTYWZhcmkgOC4xIG1ha2VzIGBhcmd1bWVudHMuY2FsbGVlYCBlbnVtZXJhYmxlIGluIHN0cmljdCBtb2RlLlxuICAvLyBTYWZhcmkgOSBtYWtlcyBgYXJndW1lbnRzLmxlbmd0aGAgZW51bWVyYWJsZSBpbiBzdHJpY3QgbW9kZS5cbiAgdmFyIHJlc3VsdCA9IChpc0FycmF5KHZhbHVlKSB8fCBpc0FyZ3VtZW50cyh2YWx1ZSkpXG4gICAgPyBiYXNlVGltZXModmFsdWUubGVuZ3RoLCBTdHJpbmcpXG4gICAgOiBbXTtcblxuICB2YXIgbGVuZ3RoID0gcmVzdWx0Lmxlbmd0aCxcbiAgICAgIHNraXBJbmRleGVzID0gISFsZW5ndGg7XG5cbiAgZm9yICh2YXIga2V5IGluIHZhbHVlKSB7XG4gICAgaWYgKChpbmhlcml0ZWQgfHwgaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwga2V5KSkgJiZcbiAgICAgICAgIShza2lwSW5kZXhlcyAmJiAoa2V5ID09ICdsZW5ndGgnIHx8IGlzSW5kZXgoa2V5LCBsZW5ndGgpKSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGdldFRhZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUdldFRhZyh2YWx1ZSkge1xuICByZXR1cm4gb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNOYXRpdmVgIHdpdGhvdXQgYmFkIHNoaW0gY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgbmF0aXZlIGZ1bmN0aW9uLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzTmF0aXZlKHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3QodmFsdWUpIHx8IGlzTWFza2VkKHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgcGF0dGVybiA9IChpc0Z1bmN0aW9uKHZhbHVlKSB8fCBpc0hvc3RPYmplY3QodmFsdWUpKSA/IHJlSXNOYXRpdmUgOiByZUlzSG9zdEN0b3I7XG4gIHJldHVybiBwYXR0ZXJuLnRlc3QodG9Tb3VyY2UodmFsdWUpKTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5rZXlzYCB3aGljaCBkb2Vzbid0IHRyZWF0IHNwYXJzZSBhcnJheXMgYXMgZGVuc2UuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKi9cbmZ1bmN0aW9uIGJhc2VLZXlzKG9iamVjdCkge1xuICBpZiAoIWlzUHJvdG90eXBlKG9iamVjdCkpIHtcbiAgICByZXR1cm4gbmF0aXZlS2V5cyhvYmplY3QpO1xuICB9XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIE9iamVjdChvYmplY3QpKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBrZXkpICYmIGtleSAhPSAnY29uc3RydWN0b3InKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIENvcGllcyB0aGUgdmFsdWVzIG9mIGBzb3VyY2VgIHRvIGBhcnJheWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IHNvdXJjZSBUaGUgYXJyYXkgdG8gY29weSB2YWx1ZXMgZnJvbS5cbiAqIEBwYXJhbSB7QXJyYXl9IFthcnJheT1bXV0gVGhlIGFycmF5IHRvIGNvcHkgdmFsdWVzIHRvLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIGBhcnJheWAuXG4gKi9cbmZ1bmN0aW9uIGNvcHlBcnJheShzb3VyY2UsIGFycmF5KSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gc291cmNlLmxlbmd0aDtcblxuICBhcnJheSB8fCAoYXJyYXkgPSBBcnJheShsZW5ndGgpKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBhcnJheVtpbmRleF0gPSBzb3VyY2VbaW5kZXhdO1xuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBuYXRpdmUgZnVuY3Rpb24gYXQgYGtleWAgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgbWV0aG9kIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBmdW5jdGlvbiBpZiBpdCdzIG5hdGl2ZSwgZWxzZSBgdW5kZWZpbmVkYC5cbiAqL1xuZnVuY3Rpb24gZ2V0TmF0aXZlKG9iamVjdCwga2V5KSB7XG4gIHZhciB2YWx1ZSA9IGdldFZhbHVlKG9iamVjdCwga2V5KTtcbiAgcmV0dXJuIGJhc2VJc05hdGl2ZSh2YWx1ZSkgPyB2YWx1ZSA6IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBgdG9TdHJpbmdUYWdgIG9mIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAqL1xudmFyIGdldFRhZyA9IGJhc2VHZXRUYWc7XG5cbi8vIEZhbGxiYWNrIGZvciBkYXRhIHZpZXdzLCBtYXBzLCBzZXRzLCBhbmQgd2VhayBtYXBzIGluIElFIDExLFxuLy8gZm9yIGRhdGEgdmlld3MgaW4gRWRnZSA8IDE0LCBhbmQgcHJvbWlzZXMgaW4gTm9kZS5qcy5cbmlmICgoRGF0YVZpZXcgJiYgZ2V0VGFnKG5ldyBEYXRhVmlldyhuZXcgQXJyYXlCdWZmZXIoMSkpKSAhPSBkYXRhVmlld1RhZykgfHxcbiAgICAoTWFwICYmIGdldFRhZyhuZXcgTWFwKSAhPSBtYXBUYWcpIHx8XG4gICAgKFByb21pc2UgJiYgZ2V0VGFnKFByb21pc2UucmVzb2x2ZSgpKSAhPSBwcm9taXNlVGFnKSB8fFxuICAgIChTZXQgJiYgZ2V0VGFnKG5ldyBTZXQpICE9IHNldFRhZykgfHxcbiAgICAoV2Vha01hcCAmJiBnZXRUYWcobmV3IFdlYWtNYXApICE9IHdlYWtNYXBUYWcpKSB7XG4gIGdldFRhZyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgdmFyIHJlc3VsdCA9IG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpLFxuICAgICAgICBDdG9yID0gcmVzdWx0ID09IG9iamVjdFRhZyA/IHZhbHVlLmNvbnN0cnVjdG9yIDogdW5kZWZpbmVkLFxuICAgICAgICBjdG9yU3RyaW5nID0gQ3RvciA/IHRvU291cmNlKEN0b3IpIDogdW5kZWZpbmVkO1xuXG4gICAgaWYgKGN0b3JTdHJpbmcpIHtcbiAgICAgIHN3aXRjaCAoY3RvclN0cmluZykge1xuICAgICAgICBjYXNlIGRhdGFWaWV3Q3RvclN0cmluZzogcmV0dXJuIGRhdGFWaWV3VGFnO1xuICAgICAgICBjYXNlIG1hcEN0b3JTdHJpbmc6IHJldHVybiBtYXBUYWc7XG4gICAgICAgIGNhc2UgcHJvbWlzZUN0b3JTdHJpbmc6IHJldHVybiBwcm9taXNlVGFnO1xuICAgICAgICBjYXNlIHNldEN0b3JTdHJpbmc6IHJldHVybiBzZXRUYWc7XG4gICAgICAgIGNhc2Ugd2Vha01hcEN0b3JTdHJpbmc6IHJldHVybiB3ZWFrTWFwVGFnO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBpbmRleC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcGFyYW0ge251bWJlcn0gW2xlbmd0aD1NQVhfU0FGRV9JTlRFR0VSXSBUaGUgdXBwZXIgYm91bmRzIG9mIGEgdmFsaWQgaW5kZXguXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGluZGV4LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSW5kZXgodmFsdWUsIGxlbmd0aCkge1xuICBsZW5ndGggPSBsZW5ndGggPT0gbnVsbCA/IE1BWF9TQUZFX0lOVEVHRVIgOiBsZW5ndGg7XG4gIHJldHVybiAhIWxlbmd0aCAmJlxuICAgICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicgfHwgcmVJc1VpbnQudGVzdCh2YWx1ZSkpICYmXG4gICAgKHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPCBsZW5ndGgpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgZnVuY2AgaGFzIGl0cyBzb3VyY2UgbWFza2VkLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgZnVuY2AgaXMgbWFza2VkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzTWFza2VkKGZ1bmMpIHtcbiAgcmV0dXJuICEhbWFza1NyY0tleSAmJiAobWFza1NyY0tleSBpbiBmdW5jKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBsaWtlbHkgYSBwcm90b3R5cGUgb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgcHJvdG90eXBlLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzUHJvdG90eXBlKHZhbHVlKSB7XG4gIHZhciBDdG9yID0gdmFsdWUgJiYgdmFsdWUuY29uc3RydWN0b3IsXG4gICAgICBwcm90byA9ICh0eXBlb2YgQ3RvciA9PSAnZnVuY3Rpb24nICYmIEN0b3IucHJvdG90eXBlKSB8fCBvYmplY3RQcm90bztcblxuICByZXR1cm4gdmFsdWUgPT09IHByb3RvO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGBmdW5jYCB0byBpdHMgc291cmNlIGNvZGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBzb3VyY2UgY29kZS5cbiAqL1xuZnVuY3Rpb24gdG9Tb3VyY2UoZnVuYykge1xuICBpZiAoZnVuYyAhPSBudWxsKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBmdW5jVG9TdHJpbmcuY2FsbChmdW5jKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gKGZ1bmMgKyAnJyk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGFuIGBhcmd1bWVudHNgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBgYXJndW1lbnRzYCBvYmplY3QsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKGZ1bmN0aW9uKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcmd1bWVudHMoWzEsIDIsIDNdKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJndW1lbnRzKHZhbHVlKSB7XG4gIC8vIFNhZmFyaSA4LjEgbWFrZXMgYGFyZ3VtZW50cy5jYWxsZWVgIGVudW1lcmFibGUgaW4gc3RyaWN0IG1vZGUuXG4gIHJldHVybiBpc0FycmF5TGlrZU9iamVjdCh2YWx1ZSkgJiYgaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgJ2NhbGxlZScpICYmXG4gICAgKCFwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHZhbHVlLCAnY2FsbGVlJykgfHwgb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gYXJnc1RhZyk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhbiBgQXJyYXlgIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBhcnJheSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXkoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXkoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheSgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5O1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UuIEEgdmFsdWUgaXMgY29uc2lkZXJlZCBhcnJheS1saWtlIGlmIGl0J3NcbiAqIG5vdCBhIGZ1bmN0aW9uIGFuZCBoYXMgYSBgdmFsdWUubGVuZ3RoYCB0aGF0J3MgYW4gaW50ZWdlciBncmVhdGVyIHRoYW4gb3JcbiAqIGVxdWFsIHRvIGAwYCBhbmQgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIGBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUmAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKCdhYmMnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmICFpc0Z1bmN0aW9uKHZhbHVlKTtcbn1cblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLmlzQXJyYXlMaWtlYCBleGNlcHQgdGhhdCBpdCBhbHNvIGNoZWNrcyBpZiBgdmFsdWVgXG4gKiBpcyBhbiBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYXJyYXktbGlrZSBvYmplY3QsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZU9iamVjdChkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlT2JqZWN0KCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5TGlrZU9iamVjdChfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUxpa2VPYmplY3QodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgaXNBcnJheUxpa2UodmFsdWUpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgRnVuY3Rpb25gIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGZ1bmN0aW9uLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNGdW5jdGlvbihfKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oL2FiYy8pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICAvLyBUaGUgdXNlIG9mIGBPYmplY3QjdG9TdHJpbmdgIGF2b2lkcyBpc3N1ZXMgd2l0aCB0aGUgYHR5cGVvZmAgb3BlcmF0b3JcbiAgLy8gaW4gU2FmYXJpIDgtOSB3aGljaCByZXR1cm5zICdvYmplY3QnIGZvciB0eXBlZCBhcnJheSBhbmQgb3RoZXIgY29uc3RydWN0b3JzLlxuICB2YXIgdGFnID0gaXNPYmplY3QodmFsdWUpID8gb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSkgOiAnJztcbiAgcmV0dXJuIHRhZyA9PSBmdW5jVGFnIHx8IHRhZyA9PSBnZW5UYWc7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGxlbmd0aC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgbG9vc2VseSBiYXNlZCBvblxuICogW2BUb0xlbmd0aGBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXRvbGVuZ3RoKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGxlbmd0aCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzTGVuZ3RoKDMpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNMZW5ndGgoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNMZW5ndGgoSW5maW5pdHkpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKCczJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0xlbmd0aCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInICYmXG4gICAgdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZVxuICogW2xhbmd1YWdlIHR5cGVdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzKVxuICogb2YgYE9iamVjdGAuIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChfLm5vb3ApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICEhdmFsdWUgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTdHJpbmdgIHByaW1pdGl2ZSBvciBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQHNpbmNlIDAuMS4wXG4gKiBAbWVtYmVyT2YgX1xuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBzdHJpbmcsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1N0cmluZygnYWJjJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1N0cmluZygxKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycgfHxcbiAgICAoIWlzQXJyYXkodmFsdWUpICYmIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gc3RyaW5nVGFnKTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGFuIGFycmF5LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgYXJyYXkuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udG9BcnJheSh7ICdhJzogMSwgJ2InOiAyIH0pO1xuICogLy8gPT4gWzEsIDJdXG4gKlxuICogXy50b0FycmF5KCdhYmMnKTtcbiAqIC8vID0+IFsnYScsICdiJywgJ2MnXVxuICpcbiAqIF8udG9BcnJheSgxKTtcbiAqIC8vID0+IFtdXG4gKlxuICogXy50b0FycmF5KG51bGwpO1xuICogLy8gPT4gW11cbiAqL1xuZnVuY3Rpb24gdG9BcnJheSh2YWx1ZSkge1xuICBpZiAoIXZhbHVlKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIGlmIChpc0FycmF5TGlrZSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gaXNTdHJpbmcodmFsdWUpID8gc3RyaW5nVG9BcnJheSh2YWx1ZSkgOiBjb3B5QXJyYXkodmFsdWUpO1xuICB9XG4gIGlmIChpdGVyYXRvclN5bWJvbCAmJiB2YWx1ZVtpdGVyYXRvclN5bWJvbF0pIHtcbiAgICByZXR1cm4gaXRlcmF0b3JUb0FycmF5KHZhbHVlW2l0ZXJhdG9yU3ltYm9sXSgpKTtcbiAgfVxuICB2YXIgdGFnID0gZ2V0VGFnKHZhbHVlKSxcbiAgICAgIGZ1bmMgPSB0YWcgPT0gbWFwVGFnID8gbWFwVG9BcnJheSA6ICh0YWcgPT0gc2V0VGFnID8gc2V0VG9BcnJheSA6IHZhbHVlcyk7XG5cbiAgcmV0dXJuIGZ1bmModmFsdWUpO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBOb24tb2JqZWN0IHZhbHVlcyBhcmUgY29lcmNlZCB0byBvYmplY3RzLiBTZWUgdGhlXG4gKiBbRVMgc3BlY10oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LmtleXMpXG4gKiBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgbmFtZXMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIGZ1bmN0aW9uIEZvbygpIHtcbiAqICAgdGhpcy5hID0gMTtcbiAqICAgdGhpcy5iID0gMjtcbiAqIH1cbiAqXG4gKiBGb28ucHJvdG90eXBlLmMgPSAzO1xuICpcbiAqIF8ua2V5cyhuZXcgRm9vKTtcbiAqIC8vID0+IFsnYScsICdiJ10gKGl0ZXJhdGlvbiBvcmRlciBpcyBub3QgZ3VhcmFudGVlZClcbiAqXG4gKiBfLmtleXMoJ2hpJyk7XG4gKiAvLyA9PiBbJzAnLCAnMSddXG4gKi9cbmZ1bmN0aW9uIGtleXMob2JqZWN0KSB7XG4gIHJldHVybiBpc0FycmF5TGlrZShvYmplY3QpID8gYXJyYXlMaWtlS2V5cyhvYmplY3QpIDogYmFzZUtleXMob2JqZWN0KTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gZW51bWVyYWJsZSBzdHJpbmcga2V5ZWQgcHJvcGVydHkgdmFsdWVzIG9mIGBvYmplY3RgLlxuICpcbiAqICoqTm90ZToqKiBOb24tb2JqZWN0IHZhbHVlcyBhcmUgY29lcmNlZCB0byBvYmplY3RzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgcHJvcGVydHkgdmFsdWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLnZhbHVlcyhuZXcgRm9vKTtcbiAqIC8vID0+IFsxLCAyXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICpcbiAqIF8udmFsdWVzKCdoaScpO1xuICogLy8gPT4gWydoJywgJ2knXVxuICovXG5mdW5jdGlvbiB2YWx1ZXMob2JqZWN0KSB7XG4gIHJldHVybiBvYmplY3QgPyBiYXNlVmFsdWVzKG9iamVjdCwga2V5cyhvYmplY3QpKSA6IFtdO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHRvQXJyYXk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbGliL2Vtb2ppJyk7IiwiLypqc2xpbnQgbm9kZTogdHJ1ZSovXG52YXIgdG9BcnJheSA9IHJlcXVpcmUoJ2xvZGFzaC50b2FycmF5Jyk7XG52YXIgZW1vamlCeU5hbWUgPSByZXF1aXJlKCcuL2Vtb2ppLmpzb24nKTtcblxuXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qKlxuICogcmVnZXggdG8gcGFyc2UgZW1vamkgaW4gYSBzdHJpbmcgLSBmaW5kcyBlbW9qaSwgZS5nLiA6Y29mZmVlOlxuICovXG52YXIgZW1vamlOYW1lUmVnZXggPSAvOihbYS16QS1aMC05X1xcLVxcK10rKTovZztcblxuLyoqXG4gKiByZWdleCB0byB0cmltIHdoaXRlc3BhY2VcbiAqIHVzZSBpbnN0ZWFkIG9mIFN0cmluZy5wcm90b3R5cGUudHJpbSgpIGZvciBJRTggc3VwcG9ydFxuICovXG52YXIgdHJpbVNwYWNlUmVnZXggPSAvXltcXHNcXHVGRUZGXFx4QTBdK3xbXFxzXFx1RkVGRlxceEEwXSskL2c7XG5cbi8qKlxuICogUmVtb3ZlcyBjb2xvbnMgb24gZWl0aGVyIHNpZGVcbiAqIG9mIHRoZSBzdHJpbmcgaWYgcHJlc2VudFxuICogQHBhcmFtICB7c3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gc3RyaXBDb2xvbnMgKHN0cikge1xuICB2YXIgY29sb25JbmRleCA9IHN0ci5pbmRleE9mKCc6Jyk7XG4gIGlmIChjb2xvbkluZGV4ID4gLTEpIHtcbiAgICAvLyA6ZW1vamk6IChodHRwOi8vd3d3LmVtb2ppLWNoZWF0LXNoZWV0LmNvbS8pXG4gICAgaWYgKGNvbG9uSW5kZXggPT09IHN0ci5sZW5ndGggLSAxKSB7XG4gICAgICBzdHIgPSBzdHIuc3Vic3RyaW5nKDAsIGNvbG9uSW5kZXgpO1xuICAgICAgcmV0dXJuIHN0cmlwQ29sb25zKHN0cik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IHN0ci5zdWJzdHIoY29sb25JbmRleCArIDEpO1xuICAgICAgcmV0dXJuIHN0cmlwQ29sb25zKHN0cik7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHN0cjtcbn1cblxuLyoqXG4gKiBBZGRzIGNvbG9ucyB0byBlaXRoZXIgc2lkZVxuICogb2YgdGhlIHN0cmluZ1xuICogQHBhcmFtIHtzdHJpbmd9IHN0clxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5mdW5jdGlvbiB3cmFwQ29sb25zIChzdHIpIHtcbiAgcmV0dXJuICh0eXBlb2Ygc3RyID09PSAnc3RyaW5nJyAmJiBzdHIubGVuZ3RoID4gMCkgPyAnOicgKyBzdHIgKyAnOicgOiBzdHI7XG59XG5cbi8qKlxuICogRW5zdXJlIHRoYXQgdGhlIHdvcmQgaXMgd3JhcHBlZCBpbiBjb2xvbnNcbiAqIGJ5IG9ubHkgYWRkaW5nIHRoZW0sIGlmIHRoZXkgYXJlIG5vdCB0aGVyZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gZW5zdXJlQ29sb25zIChzdHIpIHtcbiAgcmV0dXJuICh0eXBlb2Ygc3RyID09PSAnc3RyaW5nJyAmJiBzdHJbMF0gIT09ICc6JykgPyB3cmFwQ29sb25zKHN0cikgOiBzdHI7XG59XG5cbi8vIE5vbiBzcGFjaW5nIG1hcmssIHNvbWUgZW1vdGljb25zIGhhdmUgdGhlbS4gSXQncyB0aGUgJ1ZhcmlhbnQgRm9ybScsXG4vLyB3aGljaCBwcm92aWRlcyBtb3JlIGluZm9ybWF0aW9uIHNvIHRoYXQgZW1vdGljb25zIGNhbiBiZSByZW5kZXJlZCBhc1xuLy8gbW9yZSBjb2xvcmZ1bCBncmFwaGljcy4gRkUwRSBpcyBhIHVuaWNvZGUgdGV4dCB2ZXJzaW9uLCB3aGVyZSBhcyBGRTBGXG4vLyBzaG91bGQgYmUgcmVuZGVyZWQgYXMgYSBncmFwaGljYWwgdmVyc2lvbi4gVGhlIGNvZGUgZ3JhY2VmdWxseSBkZWdyYWRlcy5cbnZhciBOT05fU1BBQ0lOR19NQVJLID0gU3RyaW5nLmZyb21DaGFyQ29kZSg2NTAzOSk7IC8vIDY1MDM5IC0gJ++4jycgLSAweEZFMEY7XG52YXIgbm9uU3BhY2luZ1JlZ2V4ID0gbmV3IFJlZ0V4cChOT05fU1BBQ0lOR19NQVJLLCAnZycpXG5cbi8vIFJlbW92ZSB0aGUgbm9uLXNwYWNpbmctbWFyayBmcm9tIHRoZSBjb2RlLCBuZXZlciBzZW5kIGEgc3RyaXBwZWQgdmVyc2lvblxuLy8gdG8gdGhlIGNsaWVudCwgYXMgaXQga2lsbHMgZ3JhcGhpY2FsIGVtb3RpY29ucy5cbmZ1bmN0aW9uIHN0cmlwTlNCIChjb2RlKSB7XG4gIHJldHVybiBjb2RlLnJlcGxhY2Uobm9uU3BhY2luZ1JlZ2V4LCAnJyk7XG59O1xuXG4vLyBSZXZlcnNlZCBoYXNoIHRhYmxlLCB3aGVyZSBhcyBlbW9qaUJ5TmFtZSBjb250YWlucyBhIHsgaGVhcnQ6ICfinaQnIH1cbi8vIGRpY3Rpb25hcnkgZW1vamlCeUNvZGUgY29udGFpbnMgeyDinaQ6ICdoZWFydCcgfS4gVGhlIGNvZGVzIGFyZSBub3JtYWxpemVkXG4vLyB0byB0aGUgdGV4dCB2ZXJzaW9uLlxudmFyIGVtb2ppQnlDb2RlID0gT2JqZWN0LmtleXMoZW1vamlCeU5hbWUpLnJlZHVjZShmdW5jdGlvbihoLGspIHtcbiAgaFtzdHJpcE5TQihlbW9qaUJ5TmFtZVtrXSldID0gaztcbiAgcmV0dXJuIGg7XG59LCB7fSk7XG5cbi8qKlxuICogRW1vamkgbmFtZXNwYWNlXG4gKi9cbnZhciBFbW9qaSA9IHtcbiAgZW1vamk6IGVtb2ppQnlOYW1lLFxufTtcblxuLyoqXG4gKiBnZXQgZW1vamkgY29kZSBmcm9tIG5hbWVcbiAqIEBwYXJhbSAge3N0cmluZ30gZW1vamlcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuRW1vamkuX2dldCA9IGZ1bmN0aW9uIF9nZXQgKGVtb2ppKSB7XG4gIGlmIChlbW9qaUJ5TmFtZS5oYXNPd25Qcm9wZXJ0eShlbW9qaSkpIHtcbiAgICByZXR1cm4gZW1vamlCeU5hbWVbZW1vamldO1xuICB9XG5cbiAgcmV0dXJuIGVuc3VyZUNvbG9ucyhlbW9qaSk7XG59O1xuXG4vKipcbiAqIGdldCBlbW9qaSBjb2RlIGZyb20gOmVtb2ppOiBzdHJpbmcgb3IgbmFtZVxuICogQHBhcmFtICB7c3RyaW5nfSBlbW9qaVxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5FbW9qaS5nZXQgPSBmdW5jdGlvbiBnZXQgKGVtb2ppKSB7XG4gIGVtb2ppID0gc3RyaXBDb2xvbnMoZW1vamkpO1xuXG4gIHJldHVybiBFbW9qaS5fZ2V0KGVtb2ppKTtcbn07XG5cbi8qKlxuICogZmluZCB0aGUgZW1vamkgYnkgZWl0aGVyIGNvZGUgb3IgbmFtZVxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWVPckNvZGUgVGhlIGVtb2ppIHRvIGZpbmQsIGVpdGhlciBgY29mZmVlYCwgYDpjb2ZmZWU6YCBvciBg4piVYDtcbiAqIEByZXR1cm4ge29iamVjdH1cbiAqL1xuRW1vamkuZmluZCA9IGZ1bmN0aW9uIGZpbmQgKG5hbWVPckNvZGUpIHtcbiAgcmV0dXJuIEVtb2ppLmZpbmRCeU5hbWUobmFtZU9yQ29kZSkgfHwgRW1vamkuZmluZEJ5Q29kZShuYW1lT3JDb2RlKTtcbn07XG5cbi8qKlxuICogZmluZCB0aGUgZW1vamkgYnkgbmFtZVxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIGVtb2ppIHRvIGZpbmQgZWl0aGVyIGBjb2ZmZWVgIG9yIGA6Y29mZmVlOmA7XG4gKiBAcmV0dXJuIHtvYmplY3R9XG4gKi9cbkVtb2ppLmZpbmRCeU5hbWUgPSBmdW5jdGlvbiBmaW5kQnlOYW1lIChuYW1lKSB7XG4gIHZhciBzdHJpcHBlZCA9IHN0cmlwQ29sb25zKG5hbWUpO1xuICB2YXIgZW1vamkgPSBlbW9qaUJ5TmFtZVtzdHJpcHBlZF07XG5cbiAgcmV0dXJuIGVtb2ppID8gKHsgZW1vamk6IGVtb2ppLCBrZXk6IHN0cmlwcGVkIH0pIDogdW5kZWZpbmVkO1xufTtcblxuLyoqXG4gKiBmaW5kIHRoZSBlbW9qaSBieSBjb2RlIChlbW9qaSlcbiAqIEBwYXJhbSB7c3RyaW5nfSBjb2RlIFRoZSBlbW9qaSB0byBmaW5kOyBmb3IgZXhhbXBsZSBg4piVYCBvciBg4piUYFxuICogQHJldHVybiB7b2JqZWN0fVxuICovXG5FbW9qaS5maW5kQnlDb2RlID0gZnVuY3Rpb24gZmluZEJ5Q29kZSAoY29kZSkge1xuICB2YXIgc3RyaXBwZWQgPSBzdHJpcE5TQihjb2RlKTtcbiAgdmFyIG5hbWUgPSBlbW9qaUJ5Q29kZVtzdHJpcHBlZF07XG5cbiAgLy8gbG9va3VwIGVtb2ppIHRvIGVuc3VyZSB0aGUgVmFyaWFudCBGb3JtIGlzIHJldHVybmVkXG4gIHJldHVybiBuYW1lID8gKHsgZW1vamk6IGVtb2ppQnlOYW1lW25hbWVdLCBrZXk6IG5hbWUgfSkgOiB1bmRlZmluZWQ7XG59O1xuXG5cbi8qKlxuICogQ2hlY2sgaWYgYW4gZW1vamkgaXMga25vd24gYnkgdGhpcyBsaWJyYXJ5XG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZU9yQ29kZSBUaGUgZW1vamkgdG8gdmFsaWRhdGUsIGVpdGhlciBgY29mZmVlYCwgYDpjb2ZmZWU6YCBvciBg4piVYDtcbiAqIEByZXR1cm4ge29iamVjdH1cbiAqL1xuRW1vamkuaGFzRW1vamkgPSBmdW5jdGlvbiBoYXNFbW9qaSAobmFtZU9yQ29kZSkge1xuICByZXR1cm4gRW1vamkuaGFzRW1vamlCeU5hbWUobmFtZU9yQ29kZSkgfHwgRW1vamkuaGFzRW1vamlCeUNvZGUobmFtZU9yQ29kZSk7XG59O1xuXG4vKipcbiAqIENoZWNrIGlmIGFuIGVtb2ppIHdpdGggZ2l2ZW4gbmFtZSBpcyBrbm93biBieSB0aGlzIGxpYnJhcnlcbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFRoZSBlbW9qaSB0byB2YWxpZGF0ZSBlaXRoZXIgYGNvZmZlZWAgb3IgYDpjb2ZmZWU6YDtcbiAqIEByZXR1cm4ge29iamVjdH1cbiAqL1xuRW1vamkuaGFzRW1vamlCeU5hbWUgPSBmdW5jdGlvbiBoYXNFbW9qaUJ5TmFtZSAobmFtZSkge1xuICB2YXIgcmVzdWx0ID0gRW1vamkuZmluZEJ5TmFtZShuYW1lKTtcbiAgcmV0dXJuICEhcmVzdWx0ICYmIHJlc3VsdC5rZXkgPT09IHN0cmlwQ29sb25zKG5hbWUpO1xufTtcblxuLyoqXG4gKiBDaGVjayBpZiBhIGdpdmVuIGVtb2ppIGlzIGtub3duIGJ5IHRoaXMgbGlicmFyeVxuICogQHBhcmFtIHtzdHJpbmd9IGNvZGUgVGhlIGVtb2ppIHRvIHZhbGlkYXRlOyBmb3IgZXhhbXBsZSBg4piVYCBvciBg4piUYFxuICogQHJldHVybiB7b2JqZWN0fVxuICovXG5FbW9qaS5oYXNFbW9qaUJ5Q29kZSA9IGZ1bmN0aW9uIGhhc0Vtb2ppQnlDb2RlIChjb2RlKSB7XG4gIHZhciByZXN1bHQgPSBFbW9qaS5maW5kQnlDb2RlKGNvZGUpO1xuICByZXR1cm4gISFyZXN1bHQgJiYgc3RyaXBOU0IocmVzdWx0LmVtb2ppKSA9PT0gc3RyaXBOU0IoY29kZSk7XG59O1xuXG4vKipcbiAqIGdldCBlbW9qaSBuYW1lIGZyb20gY29kZVxuICogQHBhcmFtICB7c3RyaW5nfSBlbW9qaVxuICogQHBhcmFtICB7Ym9vbGVhbn0gaW5jbHVkZUNvbG9ucyBzaG91bGQgdGhlIHJlc3VsdCBpbmNsdWRlIHRoZSA6OlxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5FbW9qaS53aGljaCA9IGZ1bmN0aW9uIHdoaWNoIChlbW9qaV9jb2RlLCBpbmNsdWRlQ29sb25zKSB7XG4gIHZhciBjb2RlID0gc3RyaXBOU0IoZW1vamlfY29kZSk7XG4gIHZhciB3b3JkID0gZW1vamlCeUNvZGVbY29kZV07XG5cbiAgcmV0dXJuIGluY2x1ZGVDb2xvbnMgPyB3cmFwQ29sb25zKHdvcmQpIDogd29yZDtcbn07XG5cbi8qKlxuICogZW1vamlmeSBhIHN0cmluZyAocmVwbGFjZSA6ZW1vamk6IHdpdGggYW4gZW1vamkpXG4gKiBAcGFyYW0gIHtzdHJpbmd9IHN0clxuICogQHBhcmFtICB7ZnVuY3Rpb259IG9uX21pc3NpbmcgKGdldHMgZW1vamkgbmFtZSB3aXRob3V0IDo6IGFuZCByZXR1cm5zIGEgcHJvcGVyIGVtb2ppIGlmIG5vIGVtb2ppIHdhcyBmb3VuZClcbiAqIEBwYXJhbSAge2Z1bmN0aW9ufSBmb3JtYXQgKHdyYXAgdGhlIHJldHVybmVkIGVtb2ppIGluIGEgY3VzdG9tIGVsZW1lbnQpXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbkVtb2ppLmVtb2ppZnkgPSBmdW5jdGlvbiBlbW9qaWZ5IChzdHIsIG9uX21pc3NpbmcsIGZvcm1hdCkge1xuICBpZiAoIXN0cikgcmV0dXJuICcnO1xuXG4gIHJldHVybiBzdHIuc3BsaXQoZW1vamlOYW1lUmVnZXgpIC8vIHBhcnNlIGVtb2ppIHZpYSByZWdleFxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbiBwYXJzZUVtb2ppKHMsIGkpIHtcbiAgICAgICAgICAgICAgLy8gZXZlcnkgc2Vjb25kIGVsZW1lbnQgaXMgYW4gZW1vamksIGUuZy4gXCJ0ZXN0IDpmYXN0X2ZvcndhcmQ6XCIgLT4gWyBcInRlc3QgXCIsIFwiZmFzdF9mb3J3YXJkXCIgXVxuICAgICAgICAgICAgICBpZiAoaSAlIDIgPT09IDApIHJldHVybiBzO1xuICAgICAgICAgICAgICB2YXIgZW1vamkgPSBFbW9qaS5fZ2V0KHMpO1xuICAgICAgICAgICAgICB2YXIgaXNNaXNzaW5nID0gZW1vamkuaW5kZXhPZignOicpID4gLTE7XG5cbiAgICAgICAgICAgICAgaWYgKGlzTWlzc2luZyAmJiB0eXBlb2Ygb25fbWlzc2luZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBvbl9taXNzaW5nKHMpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgaWYgKCFpc01pc3NpbmcgJiYgdHlwZW9mIGZvcm1hdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBmb3JtYXQoZW1vamksIHMpO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgcmV0dXJuIGVtb2ppO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5qb2luKCcnKSAvLyBjb252ZXJ0IGJhY2sgdG8gc3RyaW5nXG4gIDtcbn07XG5cbi8qKlxuICogcmV0dXJuIGEgcmFuZG9tIGVtb2ppXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbkVtb2ppLnJhbmRvbSA9IGZ1bmN0aW9uIHJhbmRvbSAoKSB7XG4gIHZhciBlbW9qaUtleXMgPSBPYmplY3Qua2V5cyhlbW9qaUJ5TmFtZSk7XG4gIHZhciByYW5kb21JbmRleCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGVtb2ppS2V5cy5sZW5ndGgpO1xuICB2YXIga2V5ID0gZW1vamlLZXlzW3JhbmRvbUluZGV4XTtcbiAgdmFyIGVtb2ppID0gRW1vamkuX2dldChrZXkpO1xuICByZXR1cm4geyBrZXk6IGtleSwgZW1vamk6IGVtb2ppIH07XG59XG5cbi8qKlxuICogIHJldHVybiBhbiBjb2xsZWN0aW9uIG9mIHBvdGVudGlhbCBlbW9qaSBtYXRjaGVzXG4gKiAgQHBhcmFtIHtzdHJpbmd9IHN0clxuICogIEByZXR1cm4ge0FycmF5LjxPYmplY3Q+fVxuICovXG5FbW9qaS5zZWFyY2ggPSBmdW5jdGlvbiBzZWFyY2ggKHN0cikge1xuICB2YXIgZW1vamlLZXlzID0gT2JqZWN0LmtleXMoZW1vamlCeU5hbWUpO1xuICB2YXIgbWF0Y2hlciA9IHN0cmlwQ29sb25zKHN0cilcbiAgdmFyIG1hdGNoaW5nS2V5cyA9IGVtb2ppS2V5cy5maWx0ZXIoZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIGtleS50b1N0cmluZygpLmluZGV4T2YobWF0Y2hlcikgPT09IDA7XG4gIH0pO1xuICByZXR1cm4gbWF0Y2hpbmdLZXlzLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICByZXR1cm4ge1xuICAgICAga2V5OiBrZXksXG4gICAgICBlbW9qaTogRW1vamkuX2dldChrZXkpLFxuICAgIH07XG4gIH0pO1xufVxuXG4vKipcbiAqIHVuZW1vamlmeSBhIHN0cmluZyAocmVwbGFjZSBlbW9qaSB3aXRoIDplbW9qaTopXG4gKiBAcGFyYW0gIHtzdHJpbmd9IHN0clxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5FbW9qaS51bmVtb2ppZnkgPSBmdW5jdGlvbiB1bmVtb2ppZnkgKHN0cikge1xuICBpZiAoIXN0cikgcmV0dXJuICcnO1xuICB2YXIgd29yZHMgPSB0b0FycmF5KHN0cik7XG5cbiAgcmV0dXJuIHdvcmRzLm1hcChmdW5jdGlvbih3b3JkKSB7XG4gICAgcmV0dXJuIEVtb2ppLndoaWNoKHdvcmQsIHRydWUpIHx8IHdvcmQ7XG4gIH0pLmpvaW4oJycpO1xufTtcblxuLyoqXG4gKiByZXBsYWNlIGVtb2ppcyB3aXRoIHJlcGxhY2VtZW50IHZhbHVlXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufHN0cmluZ30gdGhlIHN0cmluZyBvciBjYWxsYmFjayBmdW5jdGlvbiB0byByZXBsYWNlIHRoZSBlbW9qaSB3aXRoXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHNob3VsZCB0cmFpbGluZyB3aGl0ZXNwYWNlcyBiZSBjbGVhbmVkPyBEZWZhdWx0cyBmYWxzZVxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5FbW9qaS5yZXBsYWNlID0gZnVuY3Rpb24gcmVwbGFjZSAoc3RyLCByZXBsYWNlbWVudCwgY2xlYW5TcGFjZXMpIHtcbiAgaWYgKCFzdHIpIHJldHVybiAnJztcblxuICB2YXIgcmVwbGFjZSA9IHR5cGVvZiByZXBsYWNlbWVudCA9PT0gJ2Z1bmN0aW9uJyA/IHJlcGxhY2VtZW50IDogZnVuY3Rpb24oKSB7IHJldHVybiByZXBsYWNlbWVudDsgfTtcbiAgdmFyIHdvcmRzID0gdG9BcnJheShzdHIpO1xuXG4gIHZhciByZXBsYWNlZCA9IHdvcmRzLm1hcChmdW5jdGlvbih3b3JkLCBpZHgpIHtcbiAgICB2YXIgZW1vamkgPSBFbW9qaS5maW5kQnlDb2RlKHdvcmQpO1xuICAgIFxuICAgIGlmIChlbW9qaSAmJiBjbGVhblNwYWNlcyAmJiB3b3Jkc1tpZHggKyAxXSA9PT0gJyAnKSB7XG4gICAgICB3b3Jkc1tpZHggKyAxXSA9ICcnO1xuICAgIH1cblxuICAgIHJldHVybiBlbW9qaSA/IHJlcGxhY2UoZW1vamkpIDogd29yZDtcbiAgfSkuam9pbignJyk7XG5cbiAgcmV0dXJuIGNsZWFuU3BhY2VzID8gcmVwbGFjZWQucmVwbGFjZSh0cmltU3BhY2VSZWdleCwgJycpIDogcmVwbGFjZWQ7XG59O1xuXG5cbi8qKlxuICogcmVtb3ZlIGFsbCBlbW9qaXMgZnJvbSBhIHN0cmluZ1xuICogQHBhcmFtIHtzdHJpbmd9IHN0clxuICogQHJldHVybiB7c3RyaW5nfVxuICovXG5FbW9qaS5zdHJpcCA9IGZ1bmN0aW9uIHN0cmlwIChzdHIpIHtcbiAgcmV0dXJuIEVtb2ppLnJlcGxhY2Uoc3RyLCAnJywgdHJ1ZSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVtb2ppO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==