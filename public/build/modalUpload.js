(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["modalUpload"],{

/***/ "./assets/js/modalUpload.js":
/*!**********************************!*\
  !*** ./assets/js/modalUpload.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! core-js/modules/es.array.for-each */ "./node_modules/core-js/modules/es.array.for-each.js");

__webpack_require__(/*! core-js/modules/es.array.from */ "./node_modules/core-js/modules/es.array.from.js");

__webpack_require__(/*! core-js/modules/es.object.to-string */ "./node_modules/core-js/modules/es.object.to-string.js");

__webpack_require__(/*! core-js/modules/es.promise */ "./node_modules/core-js/modules/es.promise.js");

__webpack_require__(/*! core-js/modules/es.string.iterator */ "./node_modules/core-js/modules/es.string.iterator.js");

__webpack_require__(/*! core-js/modules/web.dom-collections.for-each */ "./node_modules/core-js/modules/web.dom-collections.for-each.js");

document.getElementById('modal_show').addEventListener('click', function () {
  var image = new Image();
  var canvas = document.getElementById('lecanvas');
  image.id = "modal_image";
  image.classList.add('modal_upload_image');
  image.src = canvas.toDataURL();
  var imageWrapper = document.getElementById('modal_image_wrap');

  if (imageWrapper.childElementCount === 0) {
    imageWrapper.appendChild(image);
  } else {
    while (imageWrapper.childNodes[0]) {
      imageWrapper.childNodes[0].remove();
    }

    imageWrapper.appendChild(image);
  }
});
document.getElementById('modal_upload_button').addEventListener('click', function () {
  var name = document.getElementById('image_upload_name').value;
  var dimension = document.getElementById('image_dimension').innerText;
  var emojiCount = document.getElementById('image_nbrEmojis').innerText;
  var canvas = document.getElementById('lecanvas');
  var canvasData = canvas.toDataURL("image/png");
  var categories = Array.from(document.getElementsByName('someRadio'));
  var category = '';
  categories.forEach(function (v) {
    if (v.checked) {
      category = v.value;
    }
  });
  imageUpload(name, canvasData, dimension, emojiCount, category);
});

function imageUpload(name, canvasData, dimension, emojiCount, category) {
  console.log(name, canvasData);
  fetch("/uploadImage", {
    method: "POST",
    body: JSON.stringify({
      name: name,
      image: canvasData,
      dimension: dimension,
      emojiCount: emojiCount,
      category: category
    })
  });
  /*.then((response) => {
    return response.text();
  }).then((res) => {
    console.log(JSON.parse(res));
  });*/
}

/***/ }),

/***/ "./node_modules/core-js/internals/array-for-each.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/internals/array-for-each.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $forEach = __webpack_require__(/*! ../internals/array-iteration */ "./node_modules/core-js/internals/array-iteration.js").forEach;
var sloppyArrayMethod = __webpack_require__(/*! ../internals/sloppy-array-method */ "./node_modules/core-js/internals/sloppy-array-method.js");

// `Array.prototype.forEach` method implementation
// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
module.exports = sloppyArrayMethod('forEach') ? function forEach(callbackfn /* , thisArg */) {
  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
} : [].forEach;


/***/ }),

/***/ "./node_modules/core-js/internals/array-from.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/internals/array-from.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var bind = __webpack_require__(/*! ../internals/bind-context */ "./node_modules/core-js/internals/bind-context.js");
var toObject = __webpack_require__(/*! ../internals/to-object */ "./node_modules/core-js/internals/to-object.js");
var callWithSafeIterationClosing = __webpack_require__(/*! ../internals/call-with-safe-iteration-closing */ "./node_modules/core-js/internals/call-with-safe-iteration-closing.js");
var isArrayIteratorMethod = __webpack_require__(/*! ../internals/is-array-iterator-method */ "./node_modules/core-js/internals/is-array-iterator-method.js");
var toLength = __webpack_require__(/*! ../internals/to-length */ "./node_modules/core-js/internals/to-length.js");
var createProperty = __webpack_require__(/*! ../internals/create-property */ "./node_modules/core-js/internals/create-property.js");
var getIteratorMethod = __webpack_require__(/*! ../internals/get-iterator-method */ "./node_modules/core-js/internals/get-iterator-method.js");

// `Array.from` method implementation
// https://tc39.github.io/ecma262/#sec-array.from
module.exports = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
  var O = toObject(arrayLike);
  var C = typeof this == 'function' ? this : Array;
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  var index = 0;
  var iteratorMethod = getIteratorMethod(O);
  var length, result, step, iterator;
  if (mapping) mapfn = bind(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
  // if the target is not iterable or it's an array with the default iterator - use a simple case
  if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
    iterator = iteratorMethod.call(O);
    result = new C();
    for (;!(step = iterator.next()).done; index++) {
      createProperty(result, index, mapping
        ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true)
        : step.value
      );
    }
  } else {
    length = toLength(O.length);
    result = new C(length);
    for (;length > index; index++) {
      createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
    }
  }
  result.length = index;
  return result;
};


/***/ }),

/***/ "./node_modules/core-js/internals/sloppy-array-method.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/internals/sloppy-array-method.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(/*! ../internals/fails */ "./node_modules/core-js/internals/fails.js");

module.exports = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !method || !fails(function () {
    // eslint-disable-next-line no-useless-call,no-throw-literal
    method.call(null, argument || function () { throw 1; }, 1);
  });
};


/***/ }),

/***/ "./node_modules/core-js/modules/es.array.for-each.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/es.array.for-each.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var forEach = __webpack_require__(/*! ../internals/array-for-each */ "./node_modules/core-js/internals/array-for-each.js");

// `Array.prototype.forEach` method
// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
$({ target: 'Array', proto: true, forced: [].forEach != forEach }, {
  forEach: forEach
});


/***/ }),

/***/ "./node_modules/core-js/modules/es.array.from.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/modules/es.array.from.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var from = __webpack_require__(/*! ../internals/array-from */ "./node_modules/core-js/internals/array-from.js");
var checkCorrectnessOfIteration = __webpack_require__(/*! ../internals/check-correctness-of-iteration */ "./node_modules/core-js/internals/check-correctness-of-iteration.js");

var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
  Array.from(iterable);
});

// `Array.from` method
// https://tc39.github.io/ecma262/#sec-array.from
$({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
  from: from
});


/***/ }),

/***/ "./node_modules/core-js/modules/web.dom-collections.for-each.js":
/*!**********************************************************************!*\
  !*** ./node_modules/core-js/modules/web.dom-collections.for-each.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var DOMIterables = __webpack_require__(/*! ../internals/dom-iterables */ "./node_modules/core-js/internals/dom-iterables.js");
var forEach = __webpack_require__(/*! ../internals/array-for-each */ "./node_modules/core-js/internals/array-for-each.js");
var hide = __webpack_require__(/*! ../internals/hide */ "./node_modules/core-js/internals/hide.js");

for (var COLLECTION_NAME in DOMIterables) {
  var Collection = global[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  // some Chrome versions have non-configurable methods on DOMTokenList
  if (CollectionPrototype && CollectionPrototype.forEach !== forEach) try {
    hide(CollectionPrototype, 'forEach', forEach);
  } catch (error) {
    CollectionPrototype.forEach = forEach;
  }
}


/***/ })

},[["./assets/js/modalUpload.js","runtime","vendors~canvasLogic~emojiGet~emojiList~emojiSearch~gallerySearch~modalUpload~nearestColor~numInc","vendors~canvasLogic~emojiList~emojiSearch~modalUpload","vendors~canvasLogic~gallerySearch~modalUpload~nearestColor"]]]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvanMvbW9kYWxVcGxvYWQuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2FycmF5LWZvci1lYWNoLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9hcnJheS1mcm9tLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9zbG9wcHktYXJyYXktbWV0aG9kLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXMuYXJyYXkuZm9yLWVhY2guanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5hcnJheS5mcm9tLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvd2ViLmRvbS1jb2xsZWN0aW9ucy5mb3ItZWFjaC5qcyJdLCJuYW1lcyI6WyJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiYWRkRXZlbnRMaXN0ZW5lciIsImltYWdlIiwiSW1hZ2UiLCJjYW52YXMiLCJpZCIsImNsYXNzTGlzdCIsImFkZCIsInNyYyIsInRvRGF0YVVSTCIsImltYWdlV3JhcHBlciIsImNoaWxkRWxlbWVudENvdW50IiwiYXBwZW5kQ2hpbGQiLCJjaGlsZE5vZGVzIiwicmVtb3ZlIiwibmFtZSIsInZhbHVlIiwiZGltZW5zaW9uIiwiaW5uZXJUZXh0IiwiZW1vamlDb3VudCIsImNhbnZhc0RhdGEiLCJjYXRlZ29yaWVzIiwiQXJyYXkiLCJmcm9tIiwiZ2V0RWxlbWVudHNCeU5hbWUiLCJjYXRlZ29yeSIsImZvckVhY2giLCJ2IiwiY2hlY2tlZCIsImltYWdlVXBsb2FkIiwiY29uc29sZSIsImxvZyIsImZldGNoIiwibWV0aG9kIiwiYm9keSIsIkpTT04iLCJzdHJpbmdpZnkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7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QWMsbUJBQU8sQ0FBQyx1RkFBNkI7QUFDbkQsV0FBVyxtQkFBTyxDQUFDLG1FQUFtQjs7QUFFdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSIsImZpbGUiOiJtb2RhbFVwbG9hZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbF9zaG93JykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICBsZXQgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICAgIGxldCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGVjYW52YXMnKTtcclxuICAgIGltYWdlLmlkID0gXCJtb2RhbF9pbWFnZVwiO1xyXG4gICAgaW1hZ2UuY2xhc3NMaXN0LmFkZCgnbW9kYWxfdXBsb2FkX2ltYWdlJyk7XHJcbiAgICBpbWFnZS5zcmMgPSBjYW52YXMudG9EYXRhVVJMKCk7XHJcblxyXG4gICAgbGV0IGltYWdlV3JhcHBlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbF9pbWFnZV93cmFwJyk7XHJcblxyXG4gICAgaWYoaW1hZ2VXcmFwcGVyLmNoaWxkRWxlbWVudENvdW50ID09PSAwKXtcclxuICAgICAgICBpbWFnZVdyYXBwZXIuYXBwZW5kQ2hpbGQoaW1hZ2UpO1xyXG4gICAgfWVsc2V7XHJcbiAgICAgICAgd2hpbGUgKGltYWdlV3JhcHBlci5jaGlsZE5vZGVzWzBdKSB7XHJcbiAgICAgICAgICAgIGltYWdlV3JhcHBlci5jaGlsZE5vZGVzWzBdLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpbWFnZVdyYXBwZXIuYXBwZW5kQ2hpbGQoaW1hZ2UpO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtb2RhbF91cGxvYWRfYnV0dG9uJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICBsZXQgbmFtZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbWFnZV91cGxvYWRfbmFtZScpLnZhbHVlO1xyXG4gICAgbGV0IGRpbWVuc2lvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbWFnZV9kaW1lbnNpb24nKS5pbm5lclRleHQ7XHJcbiAgICBsZXQgZW1vamlDb3VudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbWFnZV9uYnJFbW9qaXMnKS5pbm5lclRleHQ7XHJcbiAgICBsZXQgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xlY2FudmFzJyk7XHJcbiAgICBsZXQgY2FudmFzRGF0YSA9IGNhbnZhcy50b0RhdGFVUkwoXCJpbWFnZS9wbmdcIik7XHJcblxyXG4gICAgbGV0IGNhdGVnb3JpZXMgPSBBcnJheS5mcm9tKGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCdzb21lUmFkaW8nKSk7XHJcblxyXG4gICAgbGV0IGNhdGVnb3J5ID0gJyc7XHJcblxyXG4gICAgY2F0ZWdvcmllcy5mb3JFYWNoKCh2KSA9PiB7XHJcbiAgICAgICAgaWYgKHYuY2hlY2tlZCkge1xyXG4gICAgICAgICAgICBjYXRlZ29yeSA9IHYudmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgaW1hZ2VVcGxvYWQobmFtZSwgY2FudmFzRGF0YSwgZGltZW5zaW9uLCBlbW9qaUNvdW50LCBjYXRlZ29yeSk7XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gaW1hZ2VVcGxvYWQobmFtZSwgY2FudmFzRGF0YSwgZGltZW5zaW9uLCBlbW9qaUNvdW50LCBjYXRlZ29yeSkge1xyXG4gICAgY29uc29sZS5sb2cobmFtZSwgY2FudmFzRGF0YSk7XHJcbiAgICBmZXRjaChcIi91cGxvYWRJbWFnZVwiLCB7XHJcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7bmFtZTogbmFtZSwgaW1hZ2U6IGNhbnZhc0RhdGEsIGRpbWVuc2lvbjogZGltZW5zaW9uLCBlbW9qaUNvdW50OiBlbW9qaUNvdW50LCBjYXRlZ29yeTogY2F0ZWdvcnl9KVxyXG4gICAgfSkvKi50aGVuKChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIHJldHVybiByZXNwb25zZS50ZXh0KCk7XHJcbiAgICB9KS50aGVuKChyZXMpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZyhKU09OLnBhcnNlKHJlcykpO1xyXG4gICAgfSk7Ki9cclxufVxyXG5cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgJGZvckVhY2ggPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYXJyYXktaXRlcmF0aW9uJykuZm9yRWFjaDtcclxudmFyIHNsb3BweUFycmF5TWV0aG9kID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3Nsb3BweS1hcnJheS1tZXRob2QnKTtcclxuXHJcbi8vIGBBcnJheS5wcm90b3R5cGUuZm9yRWFjaGAgbWV0aG9kIGltcGxlbWVudGF0aW9uXHJcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5mb3JlYWNoXHJcbm1vZHVsZS5leHBvcnRzID0gc2xvcHB5QXJyYXlNZXRob2QoJ2ZvckVhY2gnKSA/IGZ1bmN0aW9uIGZvckVhY2goY2FsbGJhY2tmbiAvKiAsIHRoaXNBcmcgKi8pIHtcclxuICByZXR1cm4gJGZvckVhY2godGhpcywgY2FsbGJhY2tmbiwgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQpO1xyXG59IDogW10uZm9yRWFjaDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgYmluZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9iaW5kLWNvbnRleHQnKTtcclxudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLW9iamVjdCcpO1xyXG52YXIgY2FsbFdpdGhTYWZlSXRlcmF0aW9uQ2xvc2luZyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jYWxsLXdpdGgtc2FmZS1pdGVyYXRpb24tY2xvc2luZycpO1xyXG52YXIgaXNBcnJheUl0ZXJhdG9yTWV0aG9kID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWFycmF5LWl0ZXJhdG9yLW1ldGhvZCcpO1xyXG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tbGVuZ3RoJyk7XHJcbnZhciBjcmVhdGVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jcmVhdGUtcHJvcGVydHknKTtcclxudmFyIGdldEl0ZXJhdG9yTWV0aG9kID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dldC1pdGVyYXRvci1tZXRob2QnKTtcclxuXHJcbi8vIGBBcnJheS5mcm9tYCBtZXRob2QgaW1wbGVtZW50YXRpb25cclxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkuZnJvbVxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZyb20oYXJyYXlMaWtlIC8qICwgbWFwZm4gPSB1bmRlZmluZWQsIHRoaXNBcmcgPSB1bmRlZmluZWQgKi8pIHtcclxuICB2YXIgTyA9IHRvT2JqZWN0KGFycmF5TGlrZSk7XHJcbiAgdmFyIEMgPSB0eXBlb2YgdGhpcyA9PSAnZnVuY3Rpb24nID8gdGhpcyA6IEFycmF5O1xyXG4gIHZhciBhcmd1bWVudHNMZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xyXG4gIHZhciBtYXBmbiA9IGFyZ3VtZW50c0xlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQ7XHJcbiAgdmFyIG1hcHBpbmcgPSBtYXBmbiAhPT0gdW5kZWZpbmVkO1xyXG4gIHZhciBpbmRleCA9IDA7XHJcbiAgdmFyIGl0ZXJhdG9yTWV0aG9kID0gZ2V0SXRlcmF0b3JNZXRob2QoTyk7XHJcbiAgdmFyIGxlbmd0aCwgcmVzdWx0LCBzdGVwLCBpdGVyYXRvcjtcclxuICBpZiAobWFwcGluZykgbWFwZm4gPSBiaW5kKG1hcGZuLCBhcmd1bWVudHNMZW5ndGggPiAyID8gYXJndW1lbnRzWzJdIDogdW5kZWZpbmVkLCAyKTtcclxuICAvLyBpZiB0aGUgdGFyZ2V0IGlzIG5vdCBpdGVyYWJsZSBvciBpdCdzIGFuIGFycmF5IHdpdGggdGhlIGRlZmF1bHQgaXRlcmF0b3IgLSB1c2UgYSBzaW1wbGUgY2FzZVxyXG4gIGlmIChpdGVyYXRvck1ldGhvZCAhPSB1bmRlZmluZWQgJiYgIShDID09IEFycmF5ICYmIGlzQXJyYXlJdGVyYXRvck1ldGhvZChpdGVyYXRvck1ldGhvZCkpKSB7XHJcbiAgICBpdGVyYXRvciA9IGl0ZXJhdG9yTWV0aG9kLmNhbGwoTyk7XHJcbiAgICByZXN1bHQgPSBuZXcgQygpO1xyXG4gICAgZm9yICg7IShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lOyBpbmRleCsrKSB7XHJcbiAgICAgIGNyZWF0ZVByb3BlcnR5KHJlc3VsdCwgaW5kZXgsIG1hcHBpbmdcclxuICAgICAgICA/IGNhbGxXaXRoU2FmZUl0ZXJhdGlvbkNsb3NpbmcoaXRlcmF0b3IsIG1hcGZuLCBbc3RlcC52YWx1ZSwgaW5kZXhdLCB0cnVlKVxyXG4gICAgICAgIDogc3RlcC52YWx1ZVxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aCk7XHJcbiAgICByZXN1bHQgPSBuZXcgQyhsZW5ndGgpO1xyXG4gICAgZm9yICg7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIHtcclxuICAgICAgY3JlYXRlUHJvcGVydHkocmVzdWx0LCBpbmRleCwgbWFwcGluZyA/IG1hcGZuKE9baW5kZXhdLCBpbmRleCkgOiBPW2luZGV4XSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJlc3VsdC5sZW5ndGggPSBpbmRleDtcclxuICByZXR1cm4gcmVzdWx0O1xyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTUVUSE9EX05BTUUsIGFyZ3VtZW50KSB7XHJcbiAgdmFyIG1ldGhvZCA9IFtdW01FVEhPRF9OQU1FXTtcclxuICByZXR1cm4gIW1ldGhvZCB8fCAhZmFpbHMoZnVuY3Rpb24gKCkge1xyXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVzZWxlc3MtY2FsbCxuby10aHJvdy1saXRlcmFsXHJcbiAgICBtZXRob2QuY2FsbChudWxsLCBhcmd1bWVudCB8fCBmdW5jdGlvbiAoKSB7IHRocm93IDE7IH0sIDEpO1xyXG4gIH0pO1xyXG59O1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbnZhciAkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2V4cG9ydCcpO1xyXG52YXIgZm9yRWFjaCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hcnJheS1mb3ItZWFjaCcpO1xyXG5cclxuLy8gYEFycmF5LnByb3RvdHlwZS5mb3JFYWNoYCBtZXRob2RcclxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmZvcmVhY2hcclxuJCh7IHRhcmdldDogJ0FycmF5JywgcHJvdG86IHRydWUsIGZvcmNlZDogW10uZm9yRWFjaCAhPSBmb3JFYWNoIH0sIHtcclxuICBmb3JFYWNoOiBmb3JFYWNoXHJcbn0pO1xyXG4iLCJ2YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcclxudmFyIGZyb20gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYXJyYXktZnJvbScpO1xyXG52YXIgY2hlY2tDb3JyZWN0bmVzc09mSXRlcmF0aW9uID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NoZWNrLWNvcnJlY3RuZXNzLW9mLWl0ZXJhdGlvbicpO1xyXG5cclxudmFyIElOQ09SUkVDVF9JVEVSQVRJT04gPSAhY2hlY2tDb3JyZWN0bmVzc09mSXRlcmF0aW9uKGZ1bmN0aW9uIChpdGVyYWJsZSkge1xyXG4gIEFycmF5LmZyb20oaXRlcmFibGUpO1xyXG59KTtcclxuXHJcbi8vIGBBcnJheS5mcm9tYCBtZXRob2RcclxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkuZnJvbVxyXG4kKHsgdGFyZ2V0OiAnQXJyYXknLCBzdGF0OiB0cnVlLCBmb3JjZWQ6IElOQ09SUkVDVF9JVEVSQVRJT04gfSwge1xyXG4gIGZyb206IGZyb21cclxufSk7XHJcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XHJcbnZhciBET01JdGVyYWJsZXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZG9tLWl0ZXJhYmxlcycpO1xyXG52YXIgZm9yRWFjaCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hcnJheS1mb3ItZWFjaCcpO1xyXG52YXIgaGlkZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9oaWRlJyk7XHJcblxyXG5mb3IgKHZhciBDT0xMRUNUSU9OX05BTUUgaW4gRE9NSXRlcmFibGVzKSB7XHJcbiAgdmFyIENvbGxlY3Rpb24gPSBnbG9iYWxbQ09MTEVDVElPTl9OQU1FXTtcclxuICB2YXIgQ29sbGVjdGlvblByb3RvdHlwZSA9IENvbGxlY3Rpb24gJiYgQ29sbGVjdGlvbi5wcm90b3R5cGU7XHJcbiAgLy8gc29tZSBDaHJvbWUgdmVyc2lvbnMgaGF2ZSBub24tY29uZmlndXJhYmxlIG1ldGhvZHMgb24gRE9NVG9rZW5MaXN0XHJcbiAgaWYgKENvbGxlY3Rpb25Qcm90b3R5cGUgJiYgQ29sbGVjdGlvblByb3RvdHlwZS5mb3JFYWNoICE9PSBmb3JFYWNoKSB0cnkge1xyXG4gICAgaGlkZShDb2xsZWN0aW9uUHJvdG90eXBlLCAnZm9yRWFjaCcsIGZvckVhY2gpO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBDb2xsZWN0aW9uUHJvdG90eXBlLmZvckVhY2ggPSBmb3JFYWNoO1xyXG4gIH1cclxufVxyXG4iXSwic291cmNlUm9vdCI6IiJ9