(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["canvasLogic"],{

/***/ "./assets/js/canvasLogic.js":
/*!**********************************!*\
  !*** ./assets/js/canvasLogic.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! core-js/modules/es.array.for-each */ "./node_modules/core-js/modules/es.array.for-each.js");

__webpack_require__(/*! core-js/modules/es.array.index-of */ "./node_modules/core-js/modules/es.array.index-of.js");

__webpack_require__(/*! core-js/modules/es.array.map */ "./node_modules/core-js/modules/es.array.map.js");

__webpack_require__(/*! core-js/modules/es.function.name */ "./node_modules/core-js/modules/es.function.name.js");

__webpack_require__(/*! core-js/modules/es.number.constructor */ "./node_modules/core-js/modules/es.number.constructor.js");

__webpack_require__(/*! core-js/modules/es.object.to-string */ "./node_modules/core-js/modules/es.object.to-string.js");

__webpack_require__(/*! core-js/modules/es.promise */ "./node_modules/core-js/modules/es.promise.js");

__webpack_require__(/*! core-js/modules/web.dom-collections.for-each */ "./node_modules/core-js/modules/web.dom-collections.for-each.js");

__webpack_require__(/*! core-js/modules/web.timers */ "./node_modules/core-js/modules/web.timers.js");

Element.prototype.remove = function () {
  this.parentElement.removeChild(this);
};

NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
  for (var i = this.length - 1; i >= 0; i--) {
    if (this[i] && this[i].parentElement) {
      this[i].parentElement.removeChild(this[i]);
    }
  }
};

var drawnSamples;
var fileobj = null;
var emojiList = null;
;
fetch("/getEmojis", {
  method: "GET"
}).then(function (response) {
  return response.text();
}).then(function (res) {
  console.log(JSON.parse(res));
  emojiList = JSON.parse(res);
});

var nearestColor = __webpack_require__(/*! ./nearestColor */ "./assets/js/nearestColor.js");

startListeners();

function startListeners() {
  document.getElementById('drop_file_zone').addEventListener('dragover', function (e) {
    e.preventDefault();
  });
  document.getElementById('drop_file_zone').addEventListener('dragstart', function (e) {
    e.preventDefault();
  });
  document.getElementById('drop_file_zone').addEventListener('drop', function (event) {
    upload_file(event);
  });
  document.getElementById('file_exp').addEventListener('click', function () {
    file_explorer();
  });
  document.getElementById('dl_canvas').addEventListener('click', function () {
    dlImage();
  });
  document.getElementById('x5_toggle').addEventListener('click', function () {
    if (document.querySelector('#x5_toggle input').checked) {
      console.log('yay');
      document.getElementById('slider_toggle').style.display = 'block';
    } else {
      document.getElementById('slider_toggle').style.display = 'none';
    }
  });
}

function upload_file(e) {
  e.preventDefault();
  fileobj = e.dataTransfer.files[0];
  changeDragDropState();
}

function file_explorer() {
  document.getElementById('selectfile').click();

  document.getElementById('selectfile').onchange = function () {
    fileobj = document.getElementById('selectfile').files[0];
    changeDragDropState();
  };
}

document.getElementById('createImage').addEventListener('click', function () {
  addLoader();
  var image = fileobj;
  console.log(image);
  var emojisize = document.getElementById('form_emoji_size').value;
  var algo2 = document.getElementById('form_algo_2');
  var drawnSamplesCheckbox = document.getElementById('form_x4_samples');
  var algo;
  var file = new FormData();
  file.append('image', image);
  file.append('size', emojisize);

  if (algo2.checked) {
    file.append('algo', 'algo_2');
    algo = 2;
  } else {
    file.append('algo', 'algo_1');
    algo = 1;
  }

  if (drawnSamplesCheckbox.checked) {
    drawnSamples = 'multi';
  } else {
    drawnSamples = 'one';
  }

  sendRequest(file, algo);
});

function sendRequest(file, algo) {
  fetch("/sendRequest", {
    method: "POST",
    body: file
  }).then(function (response) {
    return response.text();
  }).then(function (res) {
    if (algo === 1) {
      console.log(res);
      getTheEmojis(JSON.parse(res));
    } else {
      createCanvas(JSON.parse(res));
    }
  });
}

function getTheEmojis(imageInfo) {
  console.log(emojiList);
  var emojiColors = emojiList.map(function (n) {
    return n.hexColor;
  });
  var getColor = nearestColor.from(emojiColors);
  var corEmojis = [];
  imageInfo.colors.forEach(function (v) {
    var corespEmoji = emojiList[emojiList.map(function (n) {
      return n.hexColor;
    }).indexOf(getColor(v))]["char"];
    corEmojis.push(corespEmoji);
  });
  createCanvas(imageInfo, corEmojis);
}

function createCanvas(imageInfo) {
  var corEmojis = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  console.log(imageInfo);
  var oldCanvas = document.getElementById('lecanvas');

  if (typeof oldCanvas != 'undefined' && oldCanvas != null) {
    document.getElementById("lecanvas").remove();
  }

  var dragDropZone = document.getElementById('drop_file_zone');
  var dragDropParent = dragDropZone.parentNode;

  if (dragDropParent.id !== "dragdrop_li") {
    document.getElementById('dragdrop_li').appendChild(dragDropZone);

    if (dragDropZone.classList.contains('dropZone')) {
      dragDropZone.classList.remove('dropZone');
      dragDropZone.classList.add('dropZone_side');
    }
  }

  var toolContainer = document.getElementById('toolContainer');

  if (toolContainer.classList.contains('height-94vh') && window.screen.availHeight < imageInfo.info.fullHeight) {
    toolContainer.classList.remove('height-94vh');
  } else if (window.screen.availHeight > imageInfo.info.fullHeight) {
    toolContainer.classList.add('height-94vh');
  }

  var canvas = document.createElement('canvas');
  canvas.id = "lecanvas";
  canvas.width = imageInfo.info.fullWidth;
  canvas.height = imageInfo.info.fullHeight;
  canvas.style.border = "1px solid";
  var canvasZone = document.getElementById('canvas_zone');

  if (imageInfo.info.fullWidth < canvasZone.offsetWidth) {
    canvas.classList.add('centered_canvas');
  }

  var canvasContainer = document.getElementById("canvas_container");
  canvasContainer.appendChild(canvas);
  canvasContainer.style.height = '94vh';

  if (corEmojis === null) {
    drawStuff(imageInfo);
  } else {
    drawStuff(imageInfo.info, corEmojis);
  }
}

function drawStuff(info) {
  var corEmojis = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var canvas = document.getElementById("lecanvas");
  var ctx = canvas.getContext("2d");
  var drawEmojis;
  var imageInfo;

  if (corEmojis === null) {
    drawEmojis = info.emojis;
    imageInfo = info.info;
  } else {
    imageInfo = info;
    drawEmojis = corEmojis;
  }

  console.log('DE : ' + drawEmojis);
  imageInfo.nbrEmojis = Math.round(imageInfo.fullWidth * imageInfo.fullHeight / (imageInfo.sampleSize * imageInfo.sampleSize));
  imageInfo.dimension = imageInfo.fullWidth + ' x ' + imageInfo.fullHeight;
  ctx.font = imageInfo.sampleSize + "px Arial"; //cool thing if .sampleSize is undefined (scale option ?) !

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, imageInfo.fullWidth, imageInfo.fullHeight);

  if (drawnSamples === 'multi') {
    imageInfo.nbrEmojis = imageInfo.nbrEmojis * 5;
    var offsetValue = document.getElementById('sample_slider').value;

    for (var u = 0; u < 5; u++) {
      var offsetX = 0;
      var offsetY = 0;
      var x = 0;
      var y = 0;
      if (u === 0) offsetX = offsetValue;
      if (u === 1) offsetX = -offsetValue;
      if (u === 2) offsetY = offsetValue;
      if (u === 3) offsetY = -offsetValue;

      if (u === 4) {
        offsetY = 0;
        offsetX = 0;
      }

      draw(x, y, offsetX, offsetY);
    }
  } else if (drawnSamples === 'one') {
    var _offsetX = 0;
    var _offsetY = 0;
    var _x = 0;
    var _y = 0;
    draw(_x, _y, _offsetX, _offsetY);
  }

  function draw(x, y, offsetX, offsetY) {
    drawEmojis.forEach(function (v, i) {
      if (i % Number(imageInfo.height) === 0) {
        y = 0;
        x += Number(imageInfo.sampleSize);
      }

      y += Number(imageInfo.sampleSize);
      ctx.fillText(v, x - Number(imageInfo.sampleSize) + offsetX, y + offsetY);
    });
    displayInfo(imageInfo);
    correctHeight();
    removeLoader();
  }
}

function displayInfo(imageInfo) {
  document.getElementById('image_dimension').innerHTML = 'dimension : ' + imageInfo.dimension;
  document.getElementById('image_nbrEmojis').innerHTML = 'emojis count : ' + imageInfo.nbrEmojis;
}

function correctHeight() {
  var toolContainer = document.getElementById('toolContainer');
  var body = document.body;
  var html = document.documentElement;
  var heightMax = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
  toolContainer.style.height = heightMax - 57 + 'px';
}

function dlImage() {
  document.getElementById('dl_canvas').href = document.getElementById('lecanvas').toDataURL('image/png');
}

function changeDragDropState() {
  var outerDragDrop = document.getElementById('drop_file_zone');
  var innerDragDrop = document.getElementById('drag_upload_file');
  outerDragDrop.classList.add('dropZone_ani_class');
  setTimeout(function () {
    outerDragDrop.classList.remove('dropZone_ani_class');
  }, 1000);

  if (fileobj !== null) {
    var elToRemoveDrag = document.getElementsByClassName('delete_me');

    while (elToRemoveDrag[0]) {
      elToRemoveDrag[0].remove();
    }

    innerDragDrop.firstElementChild.innerHTML += '<p class="delete_me mt-3">' + fileobj.name + '</p>';
  }

  startListeners();
}

function addLoader() {
  var loader = document.getElementById('load_');
  loader.style.display = "block";
}

function removeLoader() {
  var loader = document.getElementById('load_');
  loader.style.display = "none";
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

/***/ "./node_modules/core-js/modules/es.array.index-of.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/es.array.index-of.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var $indexOf = __webpack_require__(/*! ../internals/array-includes */ "./node_modules/core-js/internals/array-includes.js").indexOf;
var sloppyArrayMethod = __webpack_require__(/*! ../internals/sloppy-array-method */ "./node_modules/core-js/internals/sloppy-array-method.js");

var nativeIndexOf = [].indexOf;

var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
var SLOPPY_METHOD = sloppyArrayMethod('indexOf');

// `Array.prototype.indexOf` method
// https://tc39.github.io/ecma262/#sec-array.prototype.indexof
$({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || SLOPPY_METHOD }, {
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? nativeIndexOf.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
  }
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


/***/ }),

/***/ "./node_modules/core-js/modules/web.timers.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/web.timers.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var global = __webpack_require__(/*! ../internals/global */ "./node_modules/core-js/internals/global.js");
var userAgent = __webpack_require__(/*! ../internals/user-agent */ "./node_modules/core-js/internals/user-agent.js");

var slice = [].slice;
var MSIE = /MSIE .\./.test(userAgent); // <- dirty ie9- check

var wrap = function (scheduler) {
  return function (handler, timeout /* , ...arguments */) {
    var boundArgs = arguments.length > 2;
    var args = boundArgs ? slice.call(arguments, 2) : undefined;
    return scheduler(boundArgs ? function () {
      // eslint-disable-next-line no-new-func
      (typeof handler == 'function' ? handler : Function(handler)).apply(this, args);
    } : handler, timeout);
  };
};

// ie9- setTimeout & setInterval additional parameters fix
// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers
$({ global: true, bind: true, forced: MSIE }, {
  // `setTimeout` method
  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-settimeout
  setTimeout: wrap(global.setTimeout),
  // `setInterval` method
  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-setinterval
  setInterval: wrap(global.setInterval)
});


/***/ })

},[["./assets/js/canvasLogic.js","runtime","vendors~canvasLogic~emojiGet~emojiList~emojiSearch~gallerySearch~modalUpload~nearestColor~numInc","vendors~canvasLogic~emojiList~emojiSearch~modalUpload","vendors~canvasLogic~gallerySearch~modalUpload~nearestColor","vendors~canvasLogic~nearestColor","canvasLogic~nearestColor"]]]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvanMvY2FudmFzTG9naWMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2FycmF5LWZvci1lYWNoLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9zbG9wcHktYXJyYXktbWV0aG9kLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXMuYXJyYXkuZm9yLWVhY2guanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5hcnJheS5pbmRleC1vZi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL3dlYi5kb20tY29sbGVjdGlvbnMuZm9yLWVhY2guanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy93ZWIudGltZXJzLmpzIl0sIm5hbWVzIjpbIkVsZW1lbnQiLCJwcm90b3R5cGUiLCJyZW1vdmUiLCJwYXJlbnRFbGVtZW50IiwicmVtb3ZlQ2hpbGQiLCJOb2RlTGlzdCIsIkhUTUxDb2xsZWN0aW9uIiwiaSIsImxlbmd0aCIsImRyYXduU2FtcGxlcyIsImZpbGVvYmoiLCJlbW9qaUxpc3QiLCJmZXRjaCIsIm1ldGhvZCIsInRoZW4iLCJyZXNwb25zZSIsInRleHQiLCJyZXMiLCJjb25zb2xlIiwibG9nIiwiSlNPTiIsInBhcnNlIiwibmVhcmVzdENvbG9yIiwicmVxdWlyZSIsInN0YXJ0TGlzdGVuZXJzIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwicHJldmVudERlZmF1bHQiLCJldmVudCIsInVwbG9hZF9maWxlIiwiZmlsZV9leHBsb3JlciIsImRsSW1hZ2UiLCJxdWVyeVNlbGVjdG9yIiwiY2hlY2tlZCIsInN0eWxlIiwiZGlzcGxheSIsImRhdGFUcmFuc2ZlciIsImZpbGVzIiwiY2hhbmdlRHJhZ0Ryb3BTdGF0ZSIsImNsaWNrIiwib25jaGFuZ2UiLCJhZGRMb2FkZXIiLCJpbWFnZSIsImVtb2ppc2l6ZSIsInZhbHVlIiwiYWxnbzIiLCJkcmF3blNhbXBsZXNDaGVja2JveCIsImFsZ28iLCJmaWxlIiwiRm9ybURhdGEiLCJhcHBlbmQiLCJzZW5kUmVxdWVzdCIsImJvZHkiLCJnZXRUaGVFbW9qaXMiLCJjcmVhdGVDYW52YXMiLCJpbWFnZUluZm8iLCJlbW9qaUNvbG9ycyIsIm1hcCIsIm4iLCJoZXhDb2xvciIsImdldENvbG9yIiwiZnJvbSIsImNvckVtb2ppcyIsImNvbG9ycyIsImZvckVhY2giLCJ2IiwiY29yZXNwRW1vamkiLCJpbmRleE9mIiwicHVzaCIsIm9sZENhbnZhcyIsImRyYWdEcm9wWm9uZSIsImRyYWdEcm9wUGFyZW50IiwicGFyZW50Tm9kZSIsImlkIiwiYXBwZW5kQ2hpbGQiLCJjbGFzc0xpc3QiLCJjb250YWlucyIsImFkZCIsInRvb2xDb250YWluZXIiLCJ3aW5kb3ciLCJzY3JlZW4iLCJhdmFpbEhlaWdodCIsImluZm8iLCJmdWxsSGVpZ2h0IiwiY2FudmFzIiwiY3JlYXRlRWxlbWVudCIsIndpZHRoIiwiZnVsbFdpZHRoIiwiaGVpZ2h0IiwiYm9yZGVyIiwiY2FudmFzWm9uZSIsIm9mZnNldFdpZHRoIiwiY2FudmFzQ29udGFpbmVyIiwiZHJhd1N0dWZmIiwiY3R4IiwiZ2V0Q29udGV4dCIsImRyYXdFbW9qaXMiLCJlbW9qaXMiLCJuYnJFbW9qaXMiLCJNYXRoIiwicm91bmQiLCJzYW1wbGVTaXplIiwiZGltZW5zaW9uIiwiZm9udCIsImZpbGxTdHlsZSIsImZpbGxSZWN0Iiwib2Zmc2V0VmFsdWUiLCJ1Iiwib2Zmc2V0WCIsIm9mZnNldFkiLCJ4IiwieSIsImRyYXciLCJOdW1iZXIiLCJmaWxsVGV4dCIsImRpc3BsYXlJbmZvIiwiY29ycmVjdEhlaWdodCIsInJlbW92ZUxvYWRlciIsImlubmVySFRNTCIsImh0bWwiLCJkb2N1bWVudEVsZW1lbnQiLCJoZWlnaHRNYXgiLCJtYXgiLCJzY3JvbGxIZWlnaHQiLCJvZmZzZXRIZWlnaHQiLCJjbGllbnRIZWlnaHQiLCJocmVmIiwidG9EYXRhVVJMIiwib3V0ZXJEcmFnRHJvcCIsImlubmVyRHJhZ0Ryb3AiLCJzZXRUaW1lb3V0IiwiZWxUb1JlbW92ZURyYWciLCJnZXRFbGVtZW50c0J5Q2xhc3NOYW1lIiwiZmlyc3RFbGVtZW50Q2hpbGQiLCJuYW1lIiwibG9hZGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxDQUFDQyxTQUFSLENBQWtCQyxNQUFsQixHQUEyQixZQUFZO0FBQ25DLE9BQUtDLGFBQUwsQ0FBbUJDLFdBQW5CLENBQStCLElBQS9CO0FBQ0gsQ0FGRDs7QUFHQUMsUUFBUSxDQUFDSixTQUFULENBQW1CQyxNQUFuQixHQUE0QkksY0FBYyxDQUFDTCxTQUFmLENBQXlCQyxNQUF6QixHQUFrQyxZQUFZO0FBQ3RFLE9BQUssSUFBSUssQ0FBQyxHQUFHLEtBQUtDLE1BQUwsR0FBYyxDQUEzQixFQUE4QkQsQ0FBQyxJQUFJLENBQW5DLEVBQXNDQSxDQUFDLEVBQXZDLEVBQTJDO0FBQ3ZDLFFBQUksS0FBS0EsQ0FBTCxLQUFXLEtBQUtBLENBQUwsRUFBUUosYUFBdkIsRUFBc0M7QUFDbEMsV0FBS0ksQ0FBTCxFQUFRSixhQUFSLENBQXNCQyxXQUF0QixDQUFrQyxLQUFLRyxDQUFMLENBQWxDO0FBQ0g7QUFDSjtBQUNKLENBTkQ7O0FBU0EsSUFBSUUsWUFBSjtBQUNBLElBQUlDLE9BQU8sR0FBRyxJQUFkO0FBQ0EsSUFBSUMsU0FBUyxHQUFHLElBQWhCO0FBQXFCO0FBRXJCQyxLQUFLLENBQUMsWUFBRCxFQUFlO0FBQ2hCQyxRQUFNLEVBQUU7QUFEUSxDQUFmLENBQUwsQ0FFR0MsSUFGSCxDQUVRLFVBQUNDLFFBQUQsRUFBYztBQUNsQixTQUFPQSxRQUFRLENBQUNDLElBQVQsRUFBUDtBQUNILENBSkQsRUFJR0YsSUFKSCxDQUlR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QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRyx5Q0FBeUM7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyIsImZpbGUiOiJjYW52YXNMb2dpYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIkVsZW1lbnQucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzKTtcclxufTtcclxuTm9kZUxpc3QucHJvdG90eXBlLnJlbW92ZSA9IEhUTUxDb2xsZWN0aW9uLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBmb3IgKGxldCBpID0gdGhpcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgIGlmICh0aGlzW2ldICYmIHRoaXNbaV0ucGFyZW50RWxlbWVudCkge1xyXG4gICAgICAgICAgICB0aGlzW2ldLnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpc1tpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxuXHJcbmxldCBkcmF3blNhbXBsZXM7XHJcbmxldCBmaWxlb2JqID0gbnVsbDtcclxubGV0IGVtb2ppTGlzdCA9IG51bGw7O1xyXG5cclxuZmV0Y2goXCIvZ2V0RW1vamlzXCIsIHtcclxuICAgIG1ldGhvZDogXCJHRVRcIixcclxufSkudGhlbigocmVzcG9uc2UpID0+IHtcclxuICAgIHJldHVybiByZXNwb25zZS50ZXh0KCk7XHJcbn0pLnRoZW4oKHJlcykgPT4ge1xyXG4gICAgY29uc29sZS5sb2coSlNPTi5wYXJzZShyZXMpKTtcclxuICAgIGVtb2ppTGlzdCA9ICBKU09OLnBhcnNlKHJlcyk7XHJcbn0pO1xyXG5cclxuXHJcbmNvbnN0IG5lYXJlc3RDb2xvciA9IHJlcXVpcmUoJy4vbmVhcmVzdENvbG9yJyk7XHJcblxyXG5zdGFydExpc3RlbmVycygpO1xyXG5cclxuZnVuY3Rpb24gc3RhcnRMaXN0ZW5lcnMoKSB7XHJcblxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Ryb3BfZmlsZV96b25lJykuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ292ZXInLCAoZSkgPT4ge1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkcm9wX2ZpbGVfem9uZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsIChlKSA9PiB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Ryb3BfZmlsZV96b25lJykuYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsIChldmVudCkgPT4ge1xyXG4gICAgICAgIHVwbG9hZF9maWxlKGV2ZW50KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmaWxlX2V4cCcpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgIGZpbGVfZXhwbG9yZXIoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkbF9jYW52YXMnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICBkbEltYWdlKCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgneDVfdG9nZ2xlJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XHJcbiAgICAgICAgaWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3g1X3RvZ2dsZSBpbnB1dCcpLmNoZWNrZWQpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygneWF5JylcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NsaWRlcl90b2dnbGUnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NsaWRlcl90b2dnbGUnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxufVxyXG5cclxuZnVuY3Rpb24gdXBsb2FkX2ZpbGUoZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgZmlsZW9iaiA9IGUuZGF0YVRyYW5zZmVyLmZpbGVzWzBdO1xyXG4gICAgY2hhbmdlRHJhZ0Ryb3BTdGF0ZSgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBmaWxlX2V4cGxvcmVyKCkge1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbGVjdGZpbGUnKS5jbGljaygpO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbGVjdGZpbGUnKS5vbmNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBmaWxlb2JqID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbGVjdGZpbGUnKS5maWxlc1swXTtcclxuICAgICAgICBjaGFuZ2VEcmFnRHJvcFN0YXRlKCk7XHJcbiAgICB9O1xyXG59XHJcblxyXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3JlYXRlSW1hZ2UnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcclxuXHJcbiAgICBhZGRMb2FkZXIoKTtcclxuXHJcbiAgICBsZXQgaW1hZ2UgPSBmaWxlb2JqO1xyXG5cclxuICAgIGNvbnNvbGUubG9nKGltYWdlKTtcclxuXHJcbiAgICBsZXQgZW1vamlzaXplID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Zvcm1fZW1vamlfc2l6ZScpLnZhbHVlO1xyXG4gICAgbGV0IGFsZ28yID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Zvcm1fYWxnb18yJyk7XHJcbiAgICBsZXQgZHJhd25TYW1wbGVzQ2hlY2tib3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZm9ybV94NF9zYW1wbGVzJyk7XHJcbiAgICBsZXQgYWxnbztcclxuXHJcbiAgICBsZXQgZmlsZSA9IG5ldyBGb3JtRGF0YSgpO1xyXG4gICAgZmlsZS5hcHBlbmQoJ2ltYWdlJywgaW1hZ2UpO1xyXG4gICAgZmlsZS5hcHBlbmQoJ3NpemUnLCBlbW9qaXNpemUpO1xyXG5cclxuICAgIGlmIChhbGdvMi5jaGVja2VkKSB7XHJcbiAgICAgICAgZmlsZS5hcHBlbmQoJ2FsZ28nLCAnYWxnb18yJyk7XHJcbiAgICAgICAgYWxnbyA9IDI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGZpbGUuYXBwZW5kKCdhbGdvJywgJ2FsZ29fMScpO1xyXG4gICAgICAgIGFsZ28gPSAxO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChkcmF3blNhbXBsZXNDaGVja2JveC5jaGVja2VkKSB7XHJcbiAgICAgICAgZHJhd25TYW1wbGVzID0gJ211bHRpJztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZHJhd25TYW1wbGVzID0gJ29uZSc7XHJcbiAgICB9XHJcblxyXG4gICAgc2VuZFJlcXVlc3QoZmlsZSwgYWxnbyk7XHJcbn0pO1xyXG5cclxuZnVuY3Rpb24gc2VuZFJlcXVlc3QoZmlsZSwgYWxnbykge1xyXG5cclxuICAgIGZldGNoKFwiL3NlbmRSZXF1ZXN0XCIsIHtcclxuICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxyXG4gICAgICAgIGJvZHk6IGZpbGVcclxuICAgIH0pLnRoZW4oKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKTtcclxuICAgIH0pLnRoZW4oKHJlcykgPT4ge1xyXG4gICAgICAgIGlmIChhbGdvID09PSAxKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XHJcbiAgICAgICAgICAgIGdldFRoZUVtb2ppcyhKU09OLnBhcnNlKHJlcykpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNyZWF0ZUNhbnZhcyhKU09OLnBhcnNlKHJlcykpXHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0VGhlRW1vamlzKGltYWdlSW5mbykge1xyXG4gICAgY29uc29sZS5sb2coZW1vamlMaXN0KTtcclxuICAgIGxldCBlbW9qaUNvbG9ycyA9IGVtb2ppTGlzdC5tYXAobiA9PiBuLmhleENvbG9yKTtcclxuICAgIGxldCBnZXRDb2xvciA9IG5lYXJlc3RDb2xvci5mcm9tKGVtb2ppQ29sb3JzKTtcclxuICAgIGxldCBjb3JFbW9qaXMgPSBbXTtcclxuXHJcbiAgICBpbWFnZUluZm8uY29sb3JzLmZvckVhY2goKHYpID0+IHtcclxuICAgICAgICBsZXQgY29yZXNwRW1vamkgPSBlbW9qaUxpc3RbZW1vamlMaXN0Lm1hcChuID0+IG4uaGV4Q29sb3IpLmluZGV4T2YoZ2V0Q29sb3IodikpXS5jaGFyO1xyXG4gICAgICAgIGNvckVtb2ppcy5wdXNoKGNvcmVzcEVtb2ppKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNyZWF0ZUNhbnZhcyhpbWFnZUluZm8sIGNvckVtb2ppcyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUNhbnZhcyhpbWFnZUluZm8sIGNvckVtb2ppcyA9IG51bGwpIHtcclxuICAgIGNvbnNvbGUubG9nKGltYWdlSW5mbyk7XHJcblxyXG4gICAgbGV0IG9sZENhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsZWNhbnZhcycpO1xyXG5cclxuICAgIGlmICh0eXBlb2YgKG9sZENhbnZhcykgIT0gJ3VuZGVmaW5lZCcgJiYgb2xkQ2FudmFzICE9IG51bGwpIHtcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxlY2FudmFzXCIpLnJlbW92ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBkcmFnRHJvcFpvbmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZHJvcF9maWxlX3pvbmUnKTtcclxuICAgIGxldCBkcmFnRHJvcFBhcmVudCA9IGRyYWdEcm9wWm9uZS5wYXJlbnROb2RlO1xyXG5cclxuICAgIGlmIChkcmFnRHJvcFBhcmVudC5pZCAhPT0gXCJkcmFnZHJvcF9saVwiKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RyYWdkcm9wX2xpJykuYXBwZW5kQ2hpbGQoZHJhZ0Ryb3Bab25lKTtcclxuICAgICAgICBpZiAoZHJhZ0Ryb3Bab25lLmNsYXNzTGlzdC5jb250YWlucygnZHJvcFpvbmUnKSkge1xyXG4gICAgICAgICAgICBkcmFnRHJvcFpvbmUuY2xhc3NMaXN0LnJlbW92ZSgnZHJvcFpvbmUnKTtcclxuICAgICAgICAgICAgZHJhZ0Ryb3Bab25lLmNsYXNzTGlzdC5hZGQoJ2Ryb3Bab25lX3NpZGUnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IHRvb2xDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG9vbENvbnRhaW5lcicpO1xyXG4gICAgaWYgKHRvb2xDb250YWluZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdoZWlnaHQtOTR2aCcpICYmIHdpbmRvdy5zY3JlZW4uYXZhaWxIZWlnaHQgPCBpbWFnZUluZm8uaW5mby5mdWxsSGVpZ2h0KSB7XHJcbiAgICAgICAgdG9vbENvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCdoZWlnaHQtOTR2aCcpO1xyXG5cclxuICAgIH0gZWxzZSBpZiAod2luZG93LnNjcmVlbi5hdmFpbEhlaWdodCA+IGltYWdlSW5mby5pbmZvLmZ1bGxIZWlnaHQpIHtcclxuICAgICAgICB0b29sQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2hlaWdodC05NHZoJyk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGxldCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuXHJcbiAgICBjYW52YXMuaWQgPSBcImxlY2FudmFzXCI7XHJcbiAgICBjYW52YXMud2lkdGggPSBpbWFnZUluZm8uaW5mby5mdWxsV2lkdGg7XHJcbiAgICBjYW52YXMuaGVpZ2h0ID0gaW1hZ2VJbmZvLmluZm8uZnVsbEhlaWdodDtcclxuICAgIGNhbnZhcy5zdHlsZS5ib3JkZXIgPSBcIjFweCBzb2xpZFwiO1xyXG5cclxuXHJcbiAgICBsZXQgY2FudmFzWm9uZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXNfem9uZScpO1xyXG5cclxuICAgIGlmIChpbWFnZUluZm8uaW5mby5mdWxsV2lkdGggPCBjYW52YXNab25lLm9mZnNldFdpZHRoKSB7XHJcbiAgICAgICAgY2FudmFzLmNsYXNzTGlzdC5hZGQoJ2NlbnRlcmVkX2NhbnZhcycpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBjYW52YXNDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNhbnZhc19jb250YWluZXJcIik7XHJcbiAgICBjYW52YXNDb250YWluZXIuYXBwZW5kQ2hpbGQoY2FudmFzKTtcclxuICAgIGNhbnZhc0NvbnRhaW5lci5zdHlsZS5oZWlnaHQgPSAnOTR2aCc7XHJcblxyXG4gICAgaWYgKGNvckVtb2ppcyA9PT0gbnVsbCkge1xyXG4gICAgICAgIGRyYXdTdHVmZihpbWFnZUluZm8pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICBkcmF3U3R1ZmYoaW1hZ2VJbmZvLmluZm8sIGNvckVtb2ppcyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXdTdHVmZihpbmZvLCBjb3JFbW9qaXMgPSBudWxsKSB7XHJcbiAgICBsZXQgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsZWNhbnZhc1wiKTtcclxuICAgIGxldCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xyXG5cclxuICAgIGxldCBkcmF3RW1vamlzO1xyXG4gICAgbGV0IGltYWdlSW5mbztcclxuXHJcbiAgICBpZiAoY29yRW1vamlzID09PSBudWxsKSB7XHJcbiAgICAgICAgZHJhd0Vtb2ppcyA9IGluZm8uZW1vamlzO1xyXG4gICAgICAgIGltYWdlSW5mbyA9IGluZm8uaW5mbztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaW1hZ2VJbmZvID0gaW5mbztcclxuICAgICAgICBkcmF3RW1vamlzID0gY29yRW1vamlzO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnNvbGUubG9nKCdERSA6ICcgKyBkcmF3RW1vamlzKVxyXG5cclxuICAgIGltYWdlSW5mby5uYnJFbW9qaXMgPSBNYXRoLnJvdW5kKChpbWFnZUluZm8uZnVsbFdpZHRoICogaW1hZ2VJbmZvLmZ1bGxIZWlnaHQpIC8gKGltYWdlSW5mby5zYW1wbGVTaXplICogaW1hZ2VJbmZvLnNhbXBsZVNpemUpKTtcclxuICAgIGltYWdlSW5mby5kaW1lbnNpb24gPSBpbWFnZUluZm8uZnVsbFdpZHRoICsgJyB4ICcgKyBpbWFnZUluZm8uZnVsbEhlaWdodDtcclxuXHJcbiAgICBjdHguZm9udCA9IGltYWdlSW5mby5zYW1wbGVTaXplICsgXCJweCBBcmlhbFwiOyAvL2Nvb2wgdGhpbmcgaWYgLnNhbXBsZVNpemUgaXMgdW5kZWZpbmVkIChzY2FsZSBvcHRpb24gPykgIVxyXG4gICAgY3R4LmZpbGxTdHlsZSA9IFwid2hpdGVcIjtcclxuICAgIGN0eC5maWxsUmVjdCgwLCAwLCBpbWFnZUluZm8uZnVsbFdpZHRoLCBpbWFnZUluZm8uZnVsbEhlaWdodCk7XHJcblxyXG5cclxuICAgIGlmIChkcmF3blNhbXBsZXMgPT09ICdtdWx0aScpIHtcclxuXHJcbiAgICAgICAgaW1hZ2VJbmZvLm5ickVtb2ppcyA9IGltYWdlSW5mby5uYnJFbW9qaXMqNTtcclxuXHJcbiAgICAgICAgbGV0IG9mZnNldFZhbHVlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NhbXBsZV9zbGlkZXInKS52YWx1ZTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgdSA9IDA7IHUgPCA1OyB1KyspIHtcclxuXHJcbiAgICAgICAgICAgIGxldCBvZmZzZXRYID0gMDtcclxuICAgICAgICAgICAgbGV0IG9mZnNldFkgPSAwO1xyXG5cclxuICAgICAgICAgICAgbGV0IHggPSAwO1xyXG4gICAgICAgICAgICBsZXQgeSA9IDA7XHJcblxyXG4gICAgICAgICAgICBpZiAodSA9PT0gMCkgb2Zmc2V0WCA9IG9mZnNldFZhbHVlO1xyXG4gICAgICAgICAgICBpZiAodSA9PT0gMSkgb2Zmc2V0WCA9IC1vZmZzZXRWYWx1ZTtcclxuICAgICAgICAgICAgaWYgKHUgPT09IDIpIG9mZnNldFkgPSBvZmZzZXRWYWx1ZTtcclxuICAgICAgICAgICAgaWYgKHUgPT09IDMpIG9mZnNldFkgPSAtb2Zmc2V0VmFsdWU7XHJcbiAgICAgICAgICAgIGlmICh1ID09PSA0KSB7XHJcbiAgICAgICAgICAgICAgICBvZmZzZXRZID0gMDtcclxuICAgICAgICAgICAgICAgIG9mZnNldFggPSAwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBkcmF3KHgsIHksIG9mZnNldFgsIG9mZnNldFkpXHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChkcmF3blNhbXBsZXMgPT09ICdvbmUnKSB7XHJcblxyXG4gICAgICAgIGxldCBvZmZzZXRYID0gMDtcclxuICAgICAgICBsZXQgb2Zmc2V0WSA9IDA7XHJcbiAgICAgICAgbGV0IHggPSAwO1xyXG4gICAgICAgIGxldCB5ID0gMDtcclxuICAgICAgICBkcmF3KHgsIHksIG9mZnNldFgsIG9mZnNldFkpXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZHJhdyh4LCB5LCBvZmZzZXRYLCBvZmZzZXRZKSB7XHJcblxyXG4gICAgICAgIGRyYXdFbW9qaXMuZm9yRWFjaCgodiwgaSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaSAlIE51bWJlcihpbWFnZUluZm8uaGVpZ2h0KSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgeSA9IDA7XHJcbiAgICAgICAgICAgICAgICB4ICs9IE51bWJlcihpbWFnZUluZm8uc2FtcGxlU2l6ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgeSArPSBOdW1iZXIoaW1hZ2VJbmZvLnNhbXBsZVNpemUpO1xyXG4gICAgICAgICAgICBjdHguZmlsbFRleHQodiwgeCAtIE51bWJlcihpbWFnZUluZm8uc2FtcGxlU2l6ZSkgKyBvZmZzZXRYLCB5ICsgb2Zmc2V0WSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGRpc3BsYXlJbmZvKGltYWdlSW5mbyk7XHJcbiAgICAgICAgY29ycmVjdEhlaWdodCgpO1xyXG4gICAgICAgIHJlbW92ZUxvYWRlcigpO1xyXG5cclxuICAgIH1cclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBkaXNwbGF5SW5mbyhpbWFnZUluZm8pIHtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbWFnZV9kaW1lbnNpb24nKS5pbm5lckhUTUwgPSAnZGltZW5zaW9uIDogJyArIGltYWdlSW5mby5kaW1lbnNpb247XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW1hZ2VfbmJyRW1vamlzJykuaW5uZXJIVE1MID0gJ2Vtb2ppcyBjb3VudCA6ICcgKyBpbWFnZUluZm8ubmJyRW1vamlzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjb3JyZWN0SGVpZ2h0KCkge1xyXG4gICAgbGV0IHRvb2xDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG9vbENvbnRhaW5lcicpO1xyXG4gICAgbGV0IGJvZHkgPSBkb2N1bWVudC5ib2R5O1xyXG4gICAgbGV0IGh0bWwgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XHJcblxyXG4gICAgbGV0IGhlaWdodE1heCA9IE1hdGgubWF4KGJvZHkuc2Nyb2xsSGVpZ2h0LCBib2R5Lm9mZnNldEhlaWdodCxcclxuICAgICAgICBodG1sLmNsaWVudEhlaWdodCwgaHRtbC5zY3JvbGxIZWlnaHQsIGh0bWwub2Zmc2V0SGVpZ2h0KTtcclxuXHJcbiAgICB0b29sQ29udGFpbmVyLnN0eWxlLmhlaWdodCA9IChoZWlnaHRNYXggLSA1NykgKyAncHgnO1xyXG59XHJcblxyXG5mdW5jdGlvbiBkbEltYWdlKCkge1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RsX2NhbnZhcycpLmhyZWYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGVjYW52YXMnKS50b0RhdGFVUkwoJ2ltYWdlL3BuZycpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjaGFuZ2VEcmFnRHJvcFN0YXRlKCkge1xyXG5cclxuICAgIGxldCBvdXRlckRyYWdEcm9wID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Ryb3BfZmlsZV96b25lJyk7XHJcbiAgICBsZXQgaW5uZXJEcmFnRHJvcCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkcmFnX3VwbG9hZF9maWxlJyk7XHJcblxyXG4gICAgb3V0ZXJEcmFnRHJvcC5jbGFzc0xpc3QuYWRkKCdkcm9wWm9uZV9hbmlfY2xhc3MnKTtcclxuXHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBvdXRlckRyYWdEcm9wLmNsYXNzTGlzdC5yZW1vdmUoJ2Ryb3Bab25lX2FuaV9jbGFzcycpO1xyXG4gICAgfSwgMTAwMCk7XHJcblxyXG4gICAgaWYgKGZpbGVvYmogIT09IG51bGwpIHtcclxuICAgICAgICBsZXQgZWxUb1JlbW92ZURyYWcgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdkZWxldGVfbWUnKTtcclxuXHJcbiAgICAgICAgd2hpbGUgKGVsVG9SZW1vdmVEcmFnWzBdKSB7XHJcbiAgICAgICAgICAgIGVsVG9SZW1vdmVEcmFnWzBdLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaW5uZXJEcmFnRHJvcC5maXJzdEVsZW1lbnRDaGlsZC5pbm5lckhUTUwgKz0gJzxwIGNsYXNzPVwiZGVsZXRlX21lIG10LTNcIj4nICsgZmlsZW9iai5uYW1lICsgJzwvcD4nO1xyXG4gICAgfVxyXG4gICAgc3RhcnRMaXN0ZW5lcnMoKTtcclxufVxyXG5cclxuZnVuY3Rpb24gYWRkTG9hZGVyKCkge1xyXG4gICAgbGV0IGxvYWRlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2FkXycpO1xyXG4gICAgbG9hZGVyLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbW92ZUxvYWRlcigpIHtcclxuICAgIGxldCBsb2FkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9hZF8nKTtcclxuICAgIGxvYWRlci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbn1cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgJGZvckVhY2ggPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYXJyYXktaXRlcmF0aW9uJykuZm9yRWFjaDtcclxudmFyIHNsb3BweUFycmF5TWV0aG9kID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3Nsb3BweS1hcnJheS1tZXRob2QnKTtcclxuXHJcbi8vIGBBcnJheS5wcm90b3R5cGUuZm9yRWFjaGAgbWV0aG9kIGltcGxlbWVudGF0aW9uXHJcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5mb3JlYWNoXHJcbm1vZHVsZS5leHBvcnRzID0gc2xvcHB5QXJyYXlNZXRob2QoJ2ZvckVhY2gnKSA/IGZ1bmN0aW9uIGZvckVhY2goY2FsbGJhY2tmbiAvKiAsIHRoaXNBcmcgKi8pIHtcclxuICByZXR1cm4gJGZvckVhY2godGhpcywgY2FsbGJhY2tmbiwgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQpO1xyXG59IDogW10uZm9yRWFjaDtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKE1FVEhPRF9OQU1FLCBhcmd1bWVudCkge1xyXG4gIHZhciBtZXRob2QgPSBbXVtNRVRIT0RfTkFNRV07XHJcbiAgcmV0dXJuICFtZXRob2QgfHwgIWZhaWxzKGZ1bmN0aW9uICgpIHtcclxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11c2VsZXNzLWNhbGwsbm8tdGhyb3ctbGl0ZXJhbFxyXG4gICAgbWV0aG9kLmNhbGwobnVsbCwgYXJndW1lbnQgfHwgZnVuY3Rpb24gKCkgeyB0aHJvdyAxOyB9LCAxKTtcclxuICB9KTtcclxufTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcclxudmFyIGZvckVhY2ggPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYXJyYXktZm9yLWVhY2gnKTtcclxuXHJcbi8vIGBBcnJheS5wcm90b3R5cGUuZm9yRWFjaGAgbWV0aG9kXHJcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5mb3JlYWNoXHJcbiQoeyB0YXJnZXQ6ICdBcnJheScsIHByb3RvOiB0cnVlLCBmb3JjZWQ6IFtdLmZvckVhY2ggIT0gZm9yRWFjaCB9LCB7XHJcbiAgZm9yRWFjaDogZm9yRWFjaFxyXG59KTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcclxudmFyICRpbmRleE9mID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FycmF5LWluY2x1ZGVzJykuaW5kZXhPZjtcclxudmFyIHNsb3BweUFycmF5TWV0aG9kID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3Nsb3BweS1hcnJheS1tZXRob2QnKTtcclxuXHJcbnZhciBuYXRpdmVJbmRleE9mID0gW10uaW5kZXhPZjtcclxuXHJcbnZhciBORUdBVElWRV9aRVJPID0gISFuYXRpdmVJbmRleE9mICYmIDEgLyBbMV0uaW5kZXhPZigxLCAtMCkgPCAwO1xyXG52YXIgU0xPUFBZX01FVEhPRCA9IHNsb3BweUFycmF5TWV0aG9kKCdpbmRleE9mJyk7XHJcblxyXG4vLyBgQXJyYXkucHJvdG90eXBlLmluZGV4T2ZgIG1ldGhvZFxyXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuaW5kZXhvZlxyXG4kKHsgdGFyZ2V0OiAnQXJyYXknLCBwcm90bzogdHJ1ZSwgZm9yY2VkOiBORUdBVElWRV9aRVJPIHx8IFNMT1BQWV9NRVRIT0QgfSwge1xyXG4gIGluZGV4T2Y6IGZ1bmN0aW9uIGluZGV4T2Yoc2VhcmNoRWxlbWVudCAvKiAsIGZyb21JbmRleCA9IDAgKi8pIHtcclxuICAgIHJldHVybiBORUdBVElWRV9aRVJPXHJcbiAgICAgIC8vIGNvbnZlcnQgLTAgdG8gKzBcclxuICAgICAgPyBuYXRpdmVJbmRleE9mLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgMFxyXG4gICAgICA6ICRpbmRleE9mKHRoaXMsIHNlYXJjaEVsZW1lbnQsIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKTtcclxuICB9XHJcbn0pO1xyXG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xyXG52YXIgRE9NSXRlcmFibGVzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2RvbS1pdGVyYWJsZXMnKTtcclxudmFyIGZvckVhY2ggPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYXJyYXktZm9yLWVhY2gnKTtcclxudmFyIGhpZGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGlkZScpO1xyXG5cclxuZm9yICh2YXIgQ09MTEVDVElPTl9OQU1FIGluIERPTUl0ZXJhYmxlcykge1xyXG4gIHZhciBDb2xsZWN0aW9uID0gZ2xvYmFsW0NPTExFQ1RJT05fTkFNRV07XHJcbiAgdmFyIENvbGxlY3Rpb25Qcm90b3R5cGUgPSBDb2xsZWN0aW9uICYmIENvbGxlY3Rpb24ucHJvdG90eXBlO1xyXG4gIC8vIHNvbWUgQ2hyb21lIHZlcnNpb25zIGhhdmUgbm9uLWNvbmZpZ3VyYWJsZSBtZXRob2RzIG9uIERPTVRva2VuTGlzdFxyXG4gIGlmIChDb2xsZWN0aW9uUHJvdG90eXBlICYmIENvbGxlY3Rpb25Qcm90b3R5cGUuZm9yRWFjaCAhPT0gZm9yRWFjaCkgdHJ5IHtcclxuICAgIGhpZGUoQ29sbGVjdGlvblByb3RvdHlwZSwgJ2ZvckVhY2gnLCBmb3JFYWNoKTtcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgQ29sbGVjdGlvblByb3RvdHlwZS5mb3JFYWNoID0gZm9yRWFjaDtcclxuICB9XHJcbn1cclxuIiwidmFyICQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZXhwb3J0Jyk7XHJcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XHJcbnZhciB1c2VyQWdlbnQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdXNlci1hZ2VudCcpO1xyXG5cclxudmFyIHNsaWNlID0gW10uc2xpY2U7XHJcbnZhciBNU0lFID0gL01TSUUgLlxcLi8udGVzdCh1c2VyQWdlbnQpOyAvLyA8LSBkaXJ0eSBpZTktIGNoZWNrXHJcblxyXG52YXIgd3JhcCA9IGZ1bmN0aW9uIChzY2hlZHVsZXIpIHtcclxuICByZXR1cm4gZnVuY3Rpb24gKGhhbmRsZXIsIHRpbWVvdXQgLyogLCAuLi5hcmd1bWVudHMgKi8pIHtcclxuICAgIHZhciBib3VuZEFyZ3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMjtcclxuICAgIHZhciBhcmdzID0gYm91bmRBcmdzID8gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpIDogdW5kZWZpbmVkO1xyXG4gICAgcmV0dXJuIHNjaGVkdWxlcihib3VuZEFyZ3MgPyBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXctZnVuY1xyXG4gICAgICAodHlwZW9mIGhhbmRsZXIgPT0gJ2Z1bmN0aW9uJyA/IGhhbmRsZXIgOiBGdW5jdGlvbihoYW5kbGVyKSkuYXBwbHkodGhpcywgYXJncyk7XHJcbiAgICB9IDogaGFuZGxlciwgdGltZW91dCk7XHJcbiAgfTtcclxufTtcclxuXHJcbi8vIGllOS0gc2V0VGltZW91dCAmIHNldEludGVydmFsIGFkZGl0aW9uYWwgcGFyYW1ldGVycyBmaXhcclxuLy8gaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvdGltZXJzLWFuZC11c2VyLXByb21wdHMuaHRtbCN0aW1lcnNcclxuJCh7IGdsb2JhbDogdHJ1ZSwgYmluZDogdHJ1ZSwgZm9yY2VkOiBNU0lFIH0sIHtcclxuICAvLyBgc2V0VGltZW91dGAgbWV0aG9kXHJcbiAgLy8gaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvdGltZXJzLWFuZC11c2VyLXByb21wdHMuaHRtbCNkb20tc2V0dGltZW91dFxyXG4gIHNldFRpbWVvdXQ6IHdyYXAoZ2xvYmFsLnNldFRpbWVvdXQpLFxyXG4gIC8vIGBzZXRJbnRlcnZhbGAgbWV0aG9kXHJcbiAgLy8gaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy9tdWx0aXBhZ2UvdGltZXJzLWFuZC11c2VyLXByb21wdHMuaHRtbCNkb20tc2V0aW50ZXJ2YWxcclxuICBzZXRJbnRlcnZhbDogd3JhcChnbG9iYWwuc2V0SW50ZXJ2YWwpXHJcbn0pO1xyXG4iXSwic291cmNlUm9vdCI6IiJ9