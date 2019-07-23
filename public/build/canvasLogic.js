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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvanMvY2FudmFzTG9naWMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2FycmF5LWZvci1lYWNoLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9zbG9wcHktYXJyYXktbWV0aG9kLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXMuYXJyYXkuZm9yLWVhY2guanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5hcnJheS5pbmRleC1vZi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL3dlYi5kb20tY29sbGVjdGlvbnMuZm9yLWVhY2guanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy93ZWIudGltZXJzLmpzIl0sIm5hbWVzIjpbIkVsZW1lbnQiLCJwcm90b3R5cGUiLCJyZW1vdmUiLCJwYXJlbnRFbGVtZW50IiwicmVtb3ZlQ2hpbGQiLCJOb2RlTGlzdCIsIkhUTUxDb2xsZWN0aW9uIiwiaSIsImxlbmd0aCIsImRyYXduU2FtcGxlcyIsImZpbGVvYmoiLCJlbW9qaUxpc3QiLCJmZXRjaCIsIm1ldGhvZCIsInRoZW4iLCJyZXNwb25zZSIsInRleHQiLCJyZXMiLCJjb25zb2xlIiwibG9nIiwiSlNPTiIsInBhcnNlIiwibmVhcmVzdENvbG9yIiwicmVxdWlyZSIsInN0YXJ0TGlzdGVuZXJzIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwicHJldmVudERlZmF1bHQiLCJldmVudCIsInVwbG9hZF9maWxlIiwiZmlsZV9leHBsb3JlciIsImRsSW1hZ2UiLCJxdWVyeVNlbGVjdG9yIiwiY2hlY2tlZCIsInN0eWxlIiwiZGlzcGxheSIsImRhdGFUcmFuc2ZlciIsImZpbGVzIiwiY2hhbmdlRHJhZ0Ryb3BTdGF0ZSIsImNsaWNrIiwib25jaGFuZ2UiLCJhZGRMb2FkZXIiLCJpbWFnZSIsImVtb2ppc2l6ZSIsInZhbHVlIiwiYWxnbzIiLCJkcmF3blNhbXBsZXNDaGVja2JveCIsImFsZ28iLCJmaWxlIiwiRm9ybURhdGEiLCJhcHBlbmQiLCJzZW5kUmVxdWVzdCIsImJvZHkiLCJnZXRUaGVFbW9qaXMiLCJjcmVhdGVDYW52YXMiLCJpbWFnZUluZm8iLCJlbW9qaUNvbG9ycyIsIm1hcCIsIm4iLCJoZXhDb2xvciIsImdldENvbG9yIiwiZnJvbSIsImNvckVtb2ppcyIsImNvbG9ycyIsImZvckVhY2giLCJ2IiwiY29yZXNwRW1vamkiLCJpbmRleE9mIiwicHVzaCIsIm9sZENhbnZhcyIsImRyYWdEcm9wWm9uZSIsImRyYWdEcm9wUGFyZW50IiwicGFyZW50Tm9kZSIsImlkIiwiYXBwZW5kQ2hpbGQiLCJjbGFzc0xpc3QiLCJjb250YWlucyIsImFkZCIsInRvb2xDb250YWluZXIiLCJ3aW5kb3ciLCJzY3JlZW4iLCJhdmFpbEhlaWdodCIsImluZm8iLCJmdWxsSGVpZ2h0IiwiY2FudmFzIiwiY3JlYXRlRWxlbWVudCIsIndpZHRoIiwiZnVsbFdpZHRoIiwiaGVpZ2h0IiwiYm9yZGVyIiwiY2FudmFzWm9uZSIsIm9mZnNldFdpZHRoIiwiY2FudmFzQ29udGFpbmVyIiwiZHJhd1N0dWZmIiwiY3R4IiwiZ2V0Q29udGV4dCIsImRyYXdFbW9qaXMiLCJlbW9qaXMiLCJuYnJFbW9qaXMiLCJNYXRoIiwicm91bmQiLCJzYW1wbGVTaXplIiwiZGltZW5zaW9uIiwiZm9udCIsImZpbGxTdHlsZSIsImZpbGxSZWN0Iiwib2Zmc2V0VmFsdWUiLCJ1Iiwib2Zmc2V0WCIsIm9mZnNldFkiLCJ4IiwieSIsImRyYXciLCJOdW1iZXIiLCJmaWxsVGV4dCIsImRpc3BsYXlJbmZvIiwiY29ycmVjdEhlaWdodCIsInJlbW92ZUxvYWRlciIsImlubmVySFRNTCIsImh0bWwiLCJkb2N1bWVudEVsZW1lbnQiLCJoZWlnaHRNYXgiLCJtYXgiLCJzY3JvbGxIZWlnaHQiLCJvZmZzZXRIZWlnaHQiLCJjbGllbnRIZWlnaHQiLCJocmVmIiwidG9EYXRhVVJMIiwib3V0ZXJEcmFnRHJvcCIsImlubmVyRHJhZ0Ryb3AiLCJzZXRUaW1lb3V0IiwiZWxUb1JlbW92ZURyYWciLCJnZXRFbGVtZW50c0J5Q2xhc3NOYW1lIiwiZmlyc3RFbGVtZW50Q2hpbGQiLCJuYW1lIiwibG9hZGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxDQUFDQyxTQUFSLENBQWtCQyxNQUFsQixHQUEyQixZQUFZO0FBQ25DLE9BQUtDLGFBQUwsQ0FBbUJDLFdBQW5CLENBQStCLElBQS9CO0FBQ0gsQ0FGRDs7QUFHQUMsUUFBUSxDQUFDSixTQUFULENBQW1CQyxNQUFuQixHQUE0QkksY0FBYyxDQUFDTCxTQUFmLENBQXlCQyxNQUF6QixHQUFrQyxZQUFZO0FBQ3RFLE9BQUssSUFBSUssQ0FBQyxHQUFHLEtBQUtDLE1BQUwsR0FBYyxDQUEzQixFQUE4QkQsQ0FBQyxJQUFJLENBQW5DLEVBQXNDQSxDQUFDLEVBQXZDLEVBQTJDO0FBQ3ZDLFFBQUksS0FBS0EsQ0FBTCxLQUFXLEtBQUtBLENBQUwsRUFBUUosYUFBdkIsRUFBc0M7QUFDbEMsV0FBS0ksQ0FBTCxFQUFRSixhQUFSLENBQXNCQyxXQUF0QixDQUFrQyxLQUFLRyxDQUFMLENBQWxDO0FBQ0g7QUFDSjtBQUNKLENBTkQ7O0FBU0EsSUFBSUUsWUFBSjtBQUNBLElBQUlDLE9BQU8sR0FBRyxJQUFkO0FBQ0EsSUFBSUMsU0FBUyxHQUFHLElBQWhCO0FBQXFCO0FBRXJCQyxLQUFLLENBQUMsWUFBRCxFQUFlO0FBQ2hCQyxRQUFNLEVBQUU7QUFEUSxDQUFmLENBQUwsQ0FFR0MsSUFGSCxDQUVRLFVBQUNDLFFBQUQsRUFBYztBQUNsQixTQUFPQSxRQUFRLENBQUNDLElBQVQsRUFBUDtBQUNILENBSkQsRUFJR0YsSUFKSCxDQUlRLFVBQUNHLEdBQUQsRUFBUztBQUNiQyxTQUFPLENBQUNDLEdBQVIsQ0FBWUMsSUFBSSxDQUFDQyxLQUFMLENBQVdKLEdBQVgsQ0FBWjtBQUNBTixXQUFTLEdBQUlTLElBQUksQ0FBQ0MsS0FBTCxDQUFXSixHQUFYLENBQWI7QUFDSCxDQVBEOztBQVVBLElBQU1LLFlBQVksR0FBR0MsbUJBQU8sQ0FBQyxtREFBRCxDQUE1Qjs7QUFFQUMsY0FBYzs7QUFFZCxTQUFTQSxjQUFULEdBQTBCO0FBRXRCQyxVQUFRLENBQUNDLGNBQVQsQ0FBd0IsZ0JBQXhCLEVBQTBDQyxnQkFBMUMsQ0FBMkQsVUFBM0QsRUFBdUUsVUFBQ0MsQ0FBRCxFQUFPO0FBQzFFQSxLQUFDLENBQUNDLGNBQUY7QUFDSCxHQUZEO0FBSUFKLFVBQVEsQ0FBQ0MsY0FBVCxDQUF3QixnQkFBeEIsRUFBMENDLGdCQUExQyxDQUEyRCxXQUEzRCxFQUF3RSxVQUFDQyxDQUFELEVBQU87QUFDM0VBLEtBQUMsQ0FBQ0MsY0FBRjtBQUNILEdBRkQ7QUFJQUosVUFBUSxDQUFDQyxjQUFULENBQXdCLGdCQUF4QixFQUEwQ0MsZ0JBQTFDLENBQTJELE1BQTNELEVBQW1FLFVBQUNHLEtBQUQsRUFBVztBQUMxRUMsZUFBVyxDQUFDRCxLQUFELENBQVg7QUFDSCxHQUZEO0FBSUFMLFVBQVEsQ0FBQ0MsY0FBVCxDQUF3QixVQUF4QixFQUFvQ0MsZ0JBQXBDLENBQXFELE9BQXJELEVBQThELFlBQU07QUFDaEVLLGlCQUFhO0FBQ2hCLEdBRkQ7QUFJQVAsVUFBUSxDQUFDQyxjQUFULENBQXdCLFdBQXhCLEVBQXFDQyxnQkFBckMsQ0FBc0QsT0FBdEQsRUFBK0QsWUFBTTtBQUNqRU0sV0FBTztBQUNWLEdBRkQ7QUFJQVIsVUFBUSxDQUFDQyxjQUFULENBQXdCLFdBQXhCLEVBQXFDQyxnQkFBckMsQ0FBc0QsT0FBdEQsRUFBK0QsWUFBTTtBQUNqRSxRQUFHRixRQUFRLENBQUNTLGFBQVQsQ0FBdUIsa0JBQXZCLEVBQTJDQyxPQUE5QyxFQUFzRDtBQUNsRGpCLGFBQU8sQ0FBQ0MsR0FBUixDQUFZLEtBQVo7QUFDQU0sY0FBUSxDQUFDQyxjQUFULENBQXdCLGVBQXhCLEVBQXlDVSxLQUF6QyxDQUErQ0MsT0FBL0MsR0FBeUQsT0FBekQ7QUFDSCxLQUhELE1BR0s7QUFDRFosY0FBUSxDQUFDQyxjQUFULENBQXdCLGVBQXhCLEVBQXlDVSxLQUF6QyxDQUErQ0MsT0FBL0MsR0FBeUQsTUFBekQ7QUFDSDtBQUNKLEdBUEQ7QUFTSDs7QUFFRCxTQUFTTixXQUFULENBQXFCSCxDQUFyQixFQUF3QjtBQUNwQkEsR0FBQyxDQUFDQyxjQUFGO0FBQ0FuQixTQUFPLEdBQUdrQixDQUFDLENBQUNVLFlBQUYsQ0FBZUMsS0FBZixDQUFxQixDQUFyQixDQUFWO0FBQ0FDLHFCQUFtQjtBQUN0Qjs7QUFFRCxTQUFTUixhQUFULEdBQXlCO0FBQ3JCUCxVQUFRLENBQUNDLGNBQVQsQ0FBd0IsWUFBeEIsRUFBc0NlLEtBQXRDOztBQUNBaEIsVUFBUSxDQUFDQyxjQUFULENBQXdCLFlBQXhCLEVBQXNDZ0IsUUFBdEMsR0FBaUQsWUFBWTtBQUN6RGhDLFdBQU8sR0FBR2UsUUFBUSxDQUFDQyxjQUFULENBQXdCLFlBQXhCLEVBQXNDYSxLQUF0QyxDQUE0QyxDQUE1QyxDQUFWO0FBQ0FDLHVCQUFtQjtBQUN0QixHQUhEO0FBSUg7O0FBRURmLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixhQUF4QixFQUF1Q0MsZ0JBQXZDLENBQXdELE9BQXhELEVBQWlFLFlBQU07QUFFbkVnQixXQUFTO0FBRVQsTUFBSUMsS0FBSyxHQUFHbEMsT0FBWjtBQUVBUSxTQUFPLENBQUNDLEdBQVIsQ0FBWXlCLEtBQVo7QUFFQSxNQUFJQyxTQUFTLEdBQUdwQixRQUFRLENBQUNDLGNBQVQsQ0FBd0IsaUJBQXhCLEVBQTJDb0IsS0FBM0Q7QUFDQSxNQUFJQyxLQUFLLEdBQUd0QixRQUFRLENBQUNDLGNBQVQsQ0FBd0IsYUFBeEIsQ0FBWjtBQUNBLE1BQUlzQixvQkFBb0IsR0FBR3ZCLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixpQkFBeEIsQ0FBM0I7QUFDQSxNQUFJdUIsSUFBSjtBQUVBLE1BQUlDLElBQUksR0FBRyxJQUFJQyxRQUFKLEVBQVg7QUFDQUQsTUFBSSxDQUFDRSxNQUFMLENBQVksT0FBWixFQUFxQlIsS0FBckI7QUFDQU0sTUFBSSxDQUFDRSxNQUFMLENBQVksTUFBWixFQUFvQlAsU0FBcEI7O0FBRUEsTUFBSUUsS0FBSyxDQUFDWixPQUFWLEVBQW1CO0FBQ2ZlLFFBQUksQ0FBQ0UsTUFBTCxDQUFZLE1BQVosRUFBb0IsUUFBcEI7QUFDQUgsUUFBSSxHQUFHLENBQVA7QUFDSCxHQUhELE1BR087QUFDSEMsUUFBSSxDQUFDRSxNQUFMLENBQVksTUFBWixFQUFvQixRQUFwQjtBQUNBSCxRQUFJLEdBQUcsQ0FBUDtBQUNIOztBQUVELE1BQUlELG9CQUFvQixDQUFDYixPQUF6QixFQUFrQztBQUM5QjFCLGdCQUFZLEdBQUcsT0FBZjtBQUNILEdBRkQsTUFFTztBQUNIQSxnQkFBWSxHQUFHLEtBQWY7QUFDSDs7QUFFRDRDLGFBQVcsQ0FBQ0gsSUFBRCxFQUFPRCxJQUFQLENBQVg7QUFDSCxDQWhDRDs7QUFrQ0EsU0FBU0ksV0FBVCxDQUFxQkgsSUFBckIsRUFBMkJELElBQTNCLEVBQWlDO0FBRTdCckMsT0FBSyxDQUFDLGNBQUQsRUFBaUI7QUFDbEJDLFVBQU0sRUFBRSxNQURVO0FBRWxCeUMsUUFBSSxFQUFFSjtBQUZZLEdBQWpCLENBQUwsQ0FHR3BDLElBSEgsQ0FHUSxVQUFDQyxRQUFELEVBQWM7QUFDbEIsV0FBT0EsUUFBUSxDQUFDQyxJQUFULEVBQVA7QUFDSCxHQUxELEVBS0dGLElBTEgsQ0FLUSxVQUFDRyxHQUFELEVBQVM7QUFDYixRQUFJZ0MsSUFBSSxLQUFLLENBQWIsRUFBZ0I7QUFDWi9CLGFBQU8sQ0FBQ0MsR0FBUixDQUFZRixHQUFaO0FBQ0FzQyxrQkFBWSxDQUFDbkMsSUFBSSxDQUFDQyxLQUFMLENBQVdKLEdBQVgsQ0FBRCxDQUFaO0FBQ0gsS0FIRCxNQUdPO0FBQ0h1QyxrQkFBWSxDQUFDcEMsSUFBSSxDQUFDQyxLQUFMLENBQVdKLEdBQVgsQ0FBRCxDQUFaO0FBQ0g7QUFDSixHQVpEO0FBYUg7O0FBRUQsU0FBU3NDLFlBQVQsQ0FBc0JFLFNBQXRCLEVBQWlDO0FBQzdCdkMsU0FBTyxDQUFDQyxHQUFSLENBQVlSLFNBQVo7QUFDQSxNQUFJK0MsV0FBVyxHQUFHL0MsU0FBUyxDQUFDZ0QsR0FBVixDQUFjLFVBQUFDLENBQUM7QUFBQSxXQUFJQSxDQUFDLENBQUNDLFFBQU47QUFBQSxHQUFmLENBQWxCO0FBQ0EsTUFBSUMsUUFBUSxHQUFHeEMsWUFBWSxDQUFDeUMsSUFBYixDQUFrQkwsV0FBbEIsQ0FBZjtBQUNBLE1BQUlNLFNBQVMsR0FBRyxFQUFoQjtBQUVBUCxXQUFTLENBQUNRLE1BQVYsQ0FBaUJDLE9BQWpCLENBQXlCLFVBQUNDLENBQUQsRUFBTztBQUM1QixRQUFJQyxXQUFXLEdBQUd6RCxTQUFTLENBQUNBLFNBQVMsQ0FBQ2dELEdBQVYsQ0FBYyxVQUFBQyxDQUFDO0FBQUEsYUFBSUEsQ0FBQyxDQUFDQyxRQUFOO0FBQUEsS0FBZixFQUErQlEsT0FBL0IsQ0FBdUNQLFFBQVEsQ0FBQ0ssQ0FBRCxDQUEvQyxDQUFELENBQVQsUUFBbEI7QUFDQUgsYUFBUyxDQUFDTSxJQUFWLENBQWVGLFdBQWY7QUFDSCxHQUhEO0FBS0FaLGNBQVksQ0FBQ0MsU0FBRCxFQUFZTyxTQUFaLENBQVo7QUFDSDs7QUFFRCxTQUFTUixZQUFULENBQXNCQyxTQUF0QixFQUFtRDtBQUFBLE1BQWxCTyxTQUFrQix1RUFBTixJQUFNO0FBQy9DOUMsU0FBTyxDQUFDQyxHQUFSLENBQVlzQyxTQUFaO0FBRUEsTUFBSWMsU0FBUyxHQUFHOUMsUUFBUSxDQUFDQyxjQUFULENBQXdCLFVBQXhCLENBQWhCOztBQUVBLE1BQUksT0FBUTZDLFNBQVIsSUFBc0IsV0FBdEIsSUFBcUNBLFNBQVMsSUFBSSxJQUF0RCxFQUE0RDtBQUN4RDlDLFlBQVEsQ0FBQ0MsY0FBVCxDQUF3QixVQUF4QixFQUFvQ3hCLE1BQXBDO0FBQ0g7O0FBRUQsTUFBSXNFLFlBQVksR0FBRy9DLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixnQkFBeEIsQ0FBbkI7QUFDQSxNQUFJK0MsY0FBYyxHQUFHRCxZQUFZLENBQUNFLFVBQWxDOztBQUVBLE1BQUlELGNBQWMsQ0FBQ0UsRUFBZixLQUFzQixhQUExQixFQUF5QztBQUNyQ2xELFlBQVEsQ0FBQ0MsY0FBVCxDQUF3QixhQUF4QixFQUF1Q2tELFdBQXZDLENBQW1ESixZQUFuRDs7QUFDQSxRQUFJQSxZQUFZLENBQUNLLFNBQWIsQ0FBdUJDLFFBQXZCLENBQWdDLFVBQWhDLENBQUosRUFBaUQ7QUFDN0NOLGtCQUFZLENBQUNLLFNBQWIsQ0FBdUIzRSxNQUF2QixDQUE4QixVQUE5QjtBQUNBc0Usa0JBQVksQ0FBQ0ssU0FBYixDQUF1QkUsR0FBdkIsQ0FBMkIsZUFBM0I7QUFDSDtBQUNKOztBQUVELE1BQUlDLGFBQWEsR0FBR3ZELFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixlQUF4QixDQUFwQjs7QUFDQSxNQUFJc0QsYUFBYSxDQUFDSCxTQUFkLENBQXdCQyxRQUF4QixDQUFpQyxhQUFqQyxLQUFtREcsTUFBTSxDQUFDQyxNQUFQLENBQWNDLFdBQWQsR0FBNEIxQixTQUFTLENBQUMyQixJQUFWLENBQWVDLFVBQWxHLEVBQThHO0FBQzFHTCxpQkFBYSxDQUFDSCxTQUFkLENBQXdCM0UsTUFBeEIsQ0FBK0IsYUFBL0I7QUFFSCxHQUhELE1BR08sSUFBSStFLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjQyxXQUFkLEdBQTRCMUIsU0FBUyxDQUFDMkIsSUFBVixDQUFlQyxVQUEvQyxFQUEyRDtBQUM5REwsaUJBQWEsQ0FBQ0gsU0FBZCxDQUF3QkUsR0FBeEIsQ0FBNEIsYUFBNUI7QUFDSDs7QUFHRCxNQUFJTyxNQUFNLEdBQUc3RCxRQUFRLENBQUM4RCxhQUFULENBQXVCLFFBQXZCLENBQWI7QUFFQUQsUUFBTSxDQUFDWCxFQUFQLEdBQVksVUFBWjtBQUNBVyxRQUFNLENBQUNFLEtBQVAsR0FBZS9CLFNBQVMsQ0FBQzJCLElBQVYsQ0FBZUssU0FBOUI7QUFDQUgsUUFBTSxDQUFDSSxNQUFQLEdBQWdCakMsU0FBUyxDQUFDMkIsSUFBVixDQUFlQyxVQUEvQjtBQUNBQyxRQUFNLENBQUNsRCxLQUFQLENBQWF1RCxNQUFiLEdBQXNCLFdBQXRCO0FBR0EsTUFBSUMsVUFBVSxHQUFHbkUsUUFBUSxDQUFDQyxjQUFULENBQXdCLGFBQXhCLENBQWpCOztBQUVBLE1BQUkrQixTQUFTLENBQUMyQixJQUFWLENBQWVLLFNBQWYsR0FBMkJHLFVBQVUsQ0FBQ0MsV0FBMUMsRUFBdUQ7QUFDbkRQLFVBQU0sQ0FBQ1QsU0FBUCxDQUFpQkUsR0FBakIsQ0FBcUIsaUJBQXJCO0FBQ0g7O0FBRUQsTUFBSWUsZUFBZSxHQUFHckUsUUFBUSxDQUFDQyxjQUFULENBQXdCLGtCQUF4QixDQUF0QjtBQUNBb0UsaUJBQWUsQ0FBQ2xCLFdBQWhCLENBQTRCVSxNQUE1QjtBQUNBUSxpQkFBZSxDQUFDMUQsS0FBaEIsQ0FBc0JzRCxNQUF0QixHQUErQixNQUEvQjs7QUFFQSxNQUFJMUIsU0FBUyxLQUFLLElBQWxCLEVBQXdCO0FBQ3BCK0IsYUFBUyxDQUFDdEMsU0FBRCxDQUFUO0FBQ0gsR0FGRCxNQUVPO0FBQ0hzQyxhQUFTLENBQUN0QyxTQUFTLENBQUMyQixJQUFYLEVBQWlCcEIsU0FBakIsQ0FBVDtBQUNIO0FBQ0o7O0FBRUQsU0FBUytCLFNBQVQsQ0FBbUJYLElBQW5CLEVBQTJDO0FBQUEsTUFBbEJwQixTQUFrQix1RUFBTixJQUFNO0FBQ3ZDLE1BQUlzQixNQUFNLEdBQUc3RCxRQUFRLENBQUNDLGNBQVQsQ0FBd0IsVUFBeEIsQ0FBYjtBQUNBLE1BQUlzRSxHQUFHLEdBQUdWLE1BQU0sQ0FBQ1csVUFBUCxDQUFrQixJQUFsQixDQUFWO0FBRUEsTUFBSUMsVUFBSjtBQUNBLE1BQUl6QyxTQUFKOztBQUVBLE1BQUlPLFNBQVMsS0FBSyxJQUFsQixFQUF3QjtBQUNwQmtDLGNBQVUsR0FBR2QsSUFBSSxDQUFDZSxNQUFsQjtBQUNBMUMsYUFBUyxHQUFHMkIsSUFBSSxDQUFDQSxJQUFqQjtBQUNILEdBSEQsTUFHTztBQUNIM0IsYUFBUyxHQUFHMkIsSUFBWjtBQUNBYyxjQUFVLEdBQUdsQyxTQUFiO0FBQ0g7O0FBRUQ5QyxTQUFPLENBQUNDLEdBQVIsQ0FBWSxVQUFVK0UsVUFBdEI7QUFFQXpDLFdBQVMsQ0FBQzJDLFNBQVYsR0FBc0JDLElBQUksQ0FBQ0MsS0FBTCxDQUFZN0MsU0FBUyxDQUFDZ0MsU0FBVixHQUFzQmhDLFNBQVMsQ0FBQzRCLFVBQWpDLElBQWdENUIsU0FBUyxDQUFDOEMsVUFBVixHQUF1QjlDLFNBQVMsQ0FBQzhDLFVBQWpGLENBQVgsQ0FBdEI7QUFDQTlDLFdBQVMsQ0FBQytDLFNBQVYsR0FBc0IvQyxTQUFTLENBQUNnQyxTQUFWLEdBQXNCLEtBQXRCLEdBQThCaEMsU0FBUyxDQUFDNEIsVUFBOUQ7QUFFQVcsS0FBRyxDQUFDUyxJQUFKLEdBQVdoRCxTQUFTLENBQUM4QyxVQUFWLEdBQXVCLFVBQWxDLENBcEJ1QyxDQW9CTzs7QUFDOUNQLEtBQUcsQ0FBQ1UsU0FBSixHQUFnQixPQUFoQjtBQUNBVixLQUFHLENBQUNXLFFBQUosQ0FBYSxDQUFiLEVBQWdCLENBQWhCLEVBQW1CbEQsU0FBUyxDQUFDZ0MsU0FBN0IsRUFBd0NoQyxTQUFTLENBQUM0QixVQUFsRDs7QUFHQSxNQUFJNUUsWUFBWSxLQUFLLE9BQXJCLEVBQThCO0FBRTFCZ0QsYUFBUyxDQUFDMkMsU0FBVixHQUFzQjNDLFNBQVMsQ0FBQzJDLFNBQVYsR0FBb0IsQ0FBMUM7QUFFQSxRQUFJUSxXQUFXLEdBQUduRixRQUFRLENBQUNDLGNBQVQsQ0FBd0IsZUFBeEIsRUFBeUNvQixLQUEzRDs7QUFFQSxTQUFLLElBQUkrRCxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHLENBQXBCLEVBQXVCQSxDQUFDLEVBQXhCLEVBQTRCO0FBRXhCLFVBQUlDLE9BQU8sR0FBRyxDQUFkO0FBQ0EsVUFBSUMsT0FBTyxHQUFHLENBQWQ7QUFFQSxVQUFJQyxDQUFDLEdBQUcsQ0FBUjtBQUNBLFVBQUlDLENBQUMsR0FBRyxDQUFSO0FBRUEsVUFBSUosQ0FBQyxLQUFLLENBQVYsRUFBYUMsT0FBTyxHQUFHRixXQUFWO0FBQ2IsVUFBSUMsQ0FBQyxLQUFLLENBQVYsRUFBYUMsT0FBTyxHQUFHLENBQUNGLFdBQVg7QUFDYixVQUFJQyxDQUFDLEtBQUssQ0FBVixFQUFhRSxPQUFPLEdBQUdILFdBQVY7QUFDYixVQUFJQyxDQUFDLEtBQUssQ0FBVixFQUFhRSxPQUFPLEdBQUcsQ0FBQ0gsV0FBWDs7QUFDYixVQUFJQyxDQUFDLEtBQUssQ0FBVixFQUFhO0FBQ1RFLGVBQU8sR0FBRyxDQUFWO0FBQ0FELGVBQU8sR0FBRyxDQUFWO0FBQ0g7O0FBRURJLFVBQUksQ0FBQ0YsQ0FBRCxFQUFJQyxDQUFKLEVBQU9ILE9BQVAsRUFBZ0JDLE9BQWhCLENBQUo7QUFDSDtBQUNKLEdBekJELE1BeUJPLElBQUl0RyxZQUFZLEtBQUssS0FBckIsRUFBNEI7QUFFL0IsUUFBSXFHLFFBQU8sR0FBRyxDQUFkO0FBQ0EsUUFBSUMsUUFBTyxHQUFHLENBQWQ7QUFDQSxRQUFJQyxFQUFDLEdBQUcsQ0FBUjtBQUNBLFFBQUlDLEVBQUMsR0FBRyxDQUFSO0FBQ0FDLFFBQUksQ0FBQ0YsRUFBRCxFQUFJQyxFQUFKLEVBQU9ILFFBQVAsRUFBZ0JDLFFBQWhCLENBQUo7QUFDSDs7QUFFRCxXQUFTRyxJQUFULENBQWNGLENBQWQsRUFBaUJDLENBQWpCLEVBQW9CSCxPQUFwQixFQUE2QkMsT0FBN0IsRUFBc0M7QUFFbENiLGNBQVUsQ0FBQ2hDLE9BQVgsQ0FBbUIsVUFBQ0MsQ0FBRCxFQUFJNUQsQ0FBSixFQUFVO0FBQ3pCLFVBQUlBLENBQUMsR0FBRzRHLE1BQU0sQ0FBQzFELFNBQVMsQ0FBQ2lDLE1BQVgsQ0FBVixLQUFpQyxDQUFyQyxFQUF3QztBQUNwQ3VCLFNBQUMsR0FBRyxDQUFKO0FBQ0FELFNBQUMsSUFBSUcsTUFBTSxDQUFDMUQsU0FBUyxDQUFDOEMsVUFBWCxDQUFYO0FBQ0g7O0FBQ0RVLE9BQUMsSUFBSUUsTUFBTSxDQUFDMUQsU0FBUyxDQUFDOEMsVUFBWCxDQUFYO0FBQ0FQLFNBQUcsQ0FBQ29CLFFBQUosQ0FBYWpELENBQWIsRUFBZ0I2QyxDQUFDLEdBQUdHLE1BQU0sQ0FBQzFELFNBQVMsQ0FBQzhDLFVBQVgsQ0FBVixHQUFtQ08sT0FBbkQsRUFBNERHLENBQUMsR0FBR0YsT0FBaEU7QUFDSCxLQVBEO0FBU0FNLGVBQVcsQ0FBQzVELFNBQUQsQ0FBWDtBQUNBNkQsaUJBQWE7QUFDYkMsZ0JBQVk7QUFFZjtBQUNKOztBQUlELFNBQVNGLFdBQVQsQ0FBcUI1RCxTQUFyQixFQUFnQztBQUM1QmhDLFVBQVEsQ0FBQ0MsY0FBVCxDQUF3QixpQkFBeEIsRUFBMkM4RixTQUEzQyxHQUF1RCxpQkFBaUIvRCxTQUFTLENBQUMrQyxTQUFsRjtBQUNBL0UsVUFBUSxDQUFDQyxjQUFULENBQXdCLGlCQUF4QixFQUEyQzhGLFNBQTNDLEdBQXVELG9CQUFvQi9ELFNBQVMsQ0FBQzJDLFNBQXJGO0FBQ0g7O0FBRUQsU0FBU2tCLGFBQVQsR0FBeUI7QUFDckIsTUFBSXRDLGFBQWEsR0FBR3ZELFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixlQUF4QixDQUFwQjtBQUNBLE1BQUk0QixJQUFJLEdBQUc3QixRQUFRLENBQUM2QixJQUFwQjtBQUNBLE1BQUltRSxJQUFJLEdBQUdoRyxRQUFRLENBQUNpRyxlQUFwQjtBQUVBLE1BQUlDLFNBQVMsR0FBR3RCLElBQUksQ0FBQ3VCLEdBQUwsQ0FBU3RFLElBQUksQ0FBQ3VFLFlBQWQsRUFBNEJ2RSxJQUFJLENBQUN3RSxZQUFqQyxFQUNaTCxJQUFJLENBQUNNLFlBRE8sRUFDT04sSUFBSSxDQUFDSSxZQURaLEVBQzBCSixJQUFJLENBQUNLLFlBRC9CLENBQWhCO0FBR0E5QyxlQUFhLENBQUM1QyxLQUFkLENBQW9Cc0QsTUFBcEIsR0FBOEJpQyxTQUFTLEdBQUcsRUFBYixHQUFtQixJQUFoRDtBQUNIOztBQUVELFNBQVMxRixPQUFULEdBQW1CO0FBQ2ZSLFVBQVEsQ0FBQ0MsY0FBVCxDQUF3QixXQUF4QixFQUFxQ3NHLElBQXJDLEdBQTRDdkcsUUFBUSxDQUFDQyxjQUFULENBQXdCLFVBQXhCLEVBQW9DdUcsU0FBcEMsQ0FBOEMsV0FBOUMsQ0FBNUM7QUFDSDs7QUFFRCxTQUFTekYsbUJBQVQsR0FBK0I7QUFFM0IsTUFBSTBGLGFBQWEsR0FBR3pHLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixnQkFBeEIsQ0FBcEI7QUFDQSxNQUFJeUcsYUFBYSxHQUFHMUcsUUFBUSxDQUFDQyxjQUFULENBQXdCLGtCQUF4QixDQUFwQjtBQUVBd0csZUFBYSxDQUFDckQsU0FBZCxDQUF3QkUsR0FBeEIsQ0FBNEIsb0JBQTVCO0FBRUFxRCxZQUFVLENBQUMsWUFBTTtBQUNiRixpQkFBYSxDQUFDckQsU0FBZCxDQUF3QjNFLE1BQXhCLENBQStCLG9CQUEvQjtBQUNILEdBRlMsRUFFUCxJQUZPLENBQVY7O0FBSUEsTUFBSVEsT0FBTyxLQUFLLElBQWhCLEVBQXNCO0FBQ2xCLFFBQUkySCxjQUFjLEdBQUc1RyxRQUFRLENBQUM2RyxzQkFBVCxDQUFnQyxXQUFoQyxDQUFyQjs7QUFFQSxXQUFPRCxjQUFjLENBQUMsQ0FBRCxDQUFyQixFQUEwQjtBQUN0QkEsb0JBQWMsQ0FBQyxDQUFELENBQWQsQ0FBa0JuSSxNQUFsQjtBQUNIOztBQUVEaUksaUJBQWEsQ0FBQ0ksaUJBQWQsQ0FBZ0NmLFNBQWhDLElBQTZDLCtCQUErQjlHLE9BQU8sQ0FBQzhILElBQXZDLEdBQThDLE1BQTNGO0FBQ0g7O0FBQ0RoSCxnQkFBYztBQUNqQjs7QUFFRCxTQUFTbUIsU0FBVCxHQUFxQjtBQUNqQixNQUFJOEYsTUFBTSxHQUFHaEgsUUFBUSxDQUFDQyxjQUFULENBQXdCLE9BQXhCLENBQWI7QUFDQStHLFFBQU0sQ0FBQ3JHLEtBQVAsQ0FBYUMsT0FBYixHQUF1QixPQUF2QjtBQUNIOztBQUVELFNBQVNrRixZQUFULEdBQXdCO0FBQ3BCLE1BQUlrQixNQUFNLEdBQUdoSCxRQUFRLENBQUNDLGNBQVQsQ0FBd0IsT0FBeEIsQ0FBYjtBQUNBK0csUUFBTSxDQUFDckcsS0FBUCxDQUFhQyxPQUFiLEdBQXVCLE1BQXZCO0FBQ0gsQzs7Ozs7Ozs7Ozs7O0FDdFVZO0FBQ2IsZUFBZSxtQkFBTyxDQUFDLHlGQUE4QjtBQUNyRCx3QkFBd0IsbUJBQU8sQ0FBQyxpR0FBa0M7O0FBRWxFO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7Ozs7Ozs7Ozs7OztBQ1JZO0FBQ2IsWUFBWSxtQkFBTyxDQUFDLHFFQUFvQjs7QUFFeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0MsU0FBUyxFQUFFO0FBQzFELEdBQUc7QUFDSDs7Ozs7Ozs7Ozs7OztBQ1RhO0FBQ2IsUUFBUSxtQkFBTyxDQUFDLHVFQUFxQjtBQUNyQyxjQUFjLG1CQUFPLENBQUMsdUZBQTZCOztBQUVuRDtBQUNBO0FBQ0EsR0FBRyw4REFBOEQ7QUFDakU7QUFDQSxDQUFDOzs7Ozs7Ozs7Ozs7O0FDUlk7QUFDYixRQUFRLG1CQUFPLENBQUMsdUVBQXFCO0FBQ3JDLGVBQWUsbUJBQU8sQ0FBQyx1RkFBNkI7QUFDcEQsd0JBQXdCLG1CQUFPLENBQUMsaUdBQWtDOztBQUVsRTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHLHVFQUF1RTtBQUMxRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7Ozs7Ozs7QUNuQkQsYUFBYSxtQkFBTyxDQUFDLHVFQUFxQjtBQUMxQyxtQkFBbUIsbUJBQU8sQ0FBQyxxRkFBNEI7QUFDdkQsY0FBYyxtQkFBTyxDQUFDLHVGQUE2QjtBQUNuRCxXQUFXLG1CQUFPLENBQUMsbUVBQW1COztBQUV0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNkQSxRQUFRLG1CQUFPLENBQUMsdUVBQXFCO0FBQ3JDLGFBQWEsbUJBQU8sQ0FBQyx1RUFBcUI7QUFDMUMsZ0JBQWdCLG1CQUFPLENBQUMsK0VBQXlCOztBQUVqRDtBQUNBLHNDQUFzQzs7QUFFdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRyx5Q0FBeUM7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyIsImZpbGUiOiJjYW52YXNMb2dpYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIkVsZW1lbnQucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcyk7XG59O1xuTm9kZUxpc3QucHJvdG90eXBlLnJlbW92ZSA9IEhUTUxDb2xsZWN0aW9uLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgZm9yIChsZXQgaSA9IHRoaXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgaWYgKHRoaXNbaV0gJiYgdGhpc1tpXS5wYXJlbnRFbGVtZW50KSB7XG4gICAgICAgICAgICB0aGlzW2ldLnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpc1tpXSk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5cbmxldCBkcmF3blNhbXBsZXM7XG5sZXQgZmlsZW9iaiA9IG51bGw7XG5sZXQgZW1vamlMaXN0ID0gbnVsbDs7XG5cbmZldGNoKFwiL2dldEVtb2ppc1wiLCB7XG4gICAgbWV0aG9kOiBcIkdFVFwiLFxufSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpO1xufSkudGhlbigocmVzKSA9PiB7XG4gICAgY29uc29sZS5sb2coSlNPTi5wYXJzZShyZXMpKTtcbiAgICBlbW9qaUxpc3QgPSAgSlNPTi5wYXJzZShyZXMpO1xufSk7XG5cblxuY29uc3QgbmVhcmVzdENvbG9yID0gcmVxdWlyZSgnLi9uZWFyZXN0Q29sb3InKTtcblxuc3RhcnRMaXN0ZW5lcnMoKTtcblxuZnVuY3Rpb24gc3RhcnRMaXN0ZW5lcnMoKSB7XG5cbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZHJvcF9maWxlX3pvbmUnKS5hZGRFdmVudExpc3RlbmVyKCdkcmFnb3ZlcicsIChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9KTtcblxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkcm9wX2ZpbGVfem9uZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdzdGFydCcsIChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB9KTtcblxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkcm9wX2ZpbGVfem9uZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2Ryb3AnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgdXBsb2FkX2ZpbGUoZXZlbnQpO1xuICAgIH0pO1xuXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZpbGVfZXhwJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIGZpbGVfZXhwbG9yZXIoKTtcbiAgICB9KTtcblxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkbF9jYW52YXMnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgZGxJbWFnZSgpO1xuICAgIH0pO1xuXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3g1X3RvZ2dsZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBpZihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjeDVfdG9nZ2xlIGlucHV0JykuY2hlY2tlZCl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygneWF5JylcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzbGlkZXJfdG9nZ2xlJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NsaWRlcl90b2dnbGUnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICB9XG4gICAgfSk7XG5cbn1cblxuZnVuY3Rpb24gdXBsb2FkX2ZpbGUoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBmaWxlb2JqID0gZS5kYXRhVHJhbnNmZXIuZmlsZXNbMF07XG4gICAgY2hhbmdlRHJhZ0Ryb3BTdGF0ZSgpO1xufVxuXG5mdW5jdGlvbiBmaWxlX2V4cGxvcmVyKCkge1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWxlY3RmaWxlJykuY2xpY2soKTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VsZWN0ZmlsZScpLm9uY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBmaWxlb2JqID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbGVjdGZpbGUnKS5maWxlc1swXTtcbiAgICAgICAgY2hhbmdlRHJhZ0Ryb3BTdGF0ZSgpO1xuICAgIH07XG59XG5cbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjcmVhdGVJbWFnZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXG4gICAgYWRkTG9hZGVyKCk7XG5cbiAgICBsZXQgaW1hZ2UgPSBmaWxlb2JqO1xuXG4gICAgY29uc29sZS5sb2coaW1hZ2UpO1xuXG4gICAgbGV0IGVtb2ppc2l6ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmb3JtX2Vtb2ppX3NpemUnKS52YWx1ZTtcbiAgICBsZXQgYWxnbzIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZm9ybV9hbGdvXzInKTtcbiAgICBsZXQgZHJhd25TYW1wbGVzQ2hlY2tib3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZm9ybV94NF9zYW1wbGVzJyk7XG4gICAgbGV0IGFsZ287XG5cbiAgICBsZXQgZmlsZSA9IG5ldyBGb3JtRGF0YSgpO1xuICAgIGZpbGUuYXBwZW5kKCdpbWFnZScsIGltYWdlKTtcbiAgICBmaWxlLmFwcGVuZCgnc2l6ZScsIGVtb2ppc2l6ZSk7XG5cbiAgICBpZiAoYWxnbzIuY2hlY2tlZCkge1xuICAgICAgICBmaWxlLmFwcGVuZCgnYWxnbycsICdhbGdvXzInKTtcbiAgICAgICAgYWxnbyA9IDI7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZmlsZS5hcHBlbmQoJ2FsZ28nLCAnYWxnb18xJyk7XG4gICAgICAgIGFsZ28gPSAxO1xuICAgIH1cblxuICAgIGlmIChkcmF3blNhbXBsZXNDaGVja2JveC5jaGVja2VkKSB7XG4gICAgICAgIGRyYXduU2FtcGxlcyA9ICdtdWx0aSc7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZHJhd25TYW1wbGVzID0gJ29uZSc7XG4gICAgfVxuXG4gICAgc2VuZFJlcXVlc3QoZmlsZSwgYWxnbyk7XG59KTtcblxuZnVuY3Rpb24gc2VuZFJlcXVlc3QoZmlsZSwgYWxnbykge1xuXG4gICAgZmV0Y2goXCIvc2VuZFJlcXVlc3RcIiwge1xuICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICBib2R5OiBmaWxlXG4gICAgfSkudGhlbigocmVzcG9uc2UpID0+IHtcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKTtcbiAgICB9KS50aGVuKChyZXMpID0+IHtcbiAgICAgICAgaWYgKGFsZ28gPT09IDEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgICAgICBnZXRUaGVFbW9qaXMoSlNPTi5wYXJzZShyZXMpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNyZWF0ZUNhbnZhcyhKU09OLnBhcnNlKHJlcykpXG4gICAgICAgIH1cbiAgICB9KVxufVxuXG5mdW5jdGlvbiBnZXRUaGVFbW9qaXMoaW1hZ2VJbmZvKSB7XG4gICAgY29uc29sZS5sb2coZW1vamlMaXN0KTtcbiAgICBsZXQgZW1vamlDb2xvcnMgPSBlbW9qaUxpc3QubWFwKG4gPT4gbi5oZXhDb2xvcik7XG4gICAgbGV0IGdldENvbG9yID0gbmVhcmVzdENvbG9yLmZyb20oZW1vamlDb2xvcnMpO1xuICAgIGxldCBjb3JFbW9qaXMgPSBbXTtcblxuICAgIGltYWdlSW5mby5jb2xvcnMuZm9yRWFjaCgodikgPT4ge1xuICAgICAgICBsZXQgY29yZXNwRW1vamkgPSBlbW9qaUxpc3RbZW1vamlMaXN0Lm1hcChuID0+IG4uaGV4Q29sb3IpLmluZGV4T2YoZ2V0Q29sb3IodikpXS5jaGFyO1xuICAgICAgICBjb3JFbW9qaXMucHVzaChjb3Jlc3BFbW9qaSk7XG4gICAgfSk7XG5cbiAgICBjcmVhdGVDYW52YXMoaW1hZ2VJbmZvLCBjb3JFbW9qaXMpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVDYW52YXMoaW1hZ2VJbmZvLCBjb3JFbW9qaXMgPSBudWxsKSB7XG4gICAgY29uc29sZS5sb2coaW1hZ2VJbmZvKTtcblxuICAgIGxldCBvbGRDYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbGVjYW52YXMnKTtcblxuICAgIGlmICh0eXBlb2YgKG9sZENhbnZhcykgIT0gJ3VuZGVmaW5lZCcgJiYgb2xkQ2FudmFzICE9IG51bGwpIHtcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsZWNhbnZhc1wiKS5yZW1vdmUoKTtcbiAgICB9XG5cbiAgICBsZXQgZHJhZ0Ryb3Bab25lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Ryb3BfZmlsZV96b25lJyk7XG4gICAgbGV0IGRyYWdEcm9wUGFyZW50ID0gZHJhZ0Ryb3Bab25lLnBhcmVudE5vZGU7XG5cbiAgICBpZiAoZHJhZ0Ryb3BQYXJlbnQuaWQgIT09IFwiZHJhZ2Ryb3BfbGlcIikge1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZHJhZ2Ryb3BfbGknKS5hcHBlbmRDaGlsZChkcmFnRHJvcFpvbmUpO1xuICAgICAgICBpZiAoZHJhZ0Ryb3Bab25lLmNsYXNzTGlzdC5jb250YWlucygnZHJvcFpvbmUnKSkge1xuICAgICAgICAgICAgZHJhZ0Ryb3Bab25lLmNsYXNzTGlzdC5yZW1vdmUoJ2Ryb3Bab25lJyk7XG4gICAgICAgICAgICBkcmFnRHJvcFpvbmUuY2xhc3NMaXN0LmFkZCgnZHJvcFpvbmVfc2lkZScpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbGV0IHRvb2xDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG9vbENvbnRhaW5lcicpO1xuICAgIGlmICh0b29sQ29udGFpbmVyLmNsYXNzTGlzdC5jb250YWlucygnaGVpZ2h0LTk0dmgnKSAmJiB3aW5kb3cuc2NyZWVuLmF2YWlsSGVpZ2h0IDwgaW1hZ2VJbmZvLmluZm8uZnVsbEhlaWdodCkge1xuICAgICAgICB0b29sQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJ2hlaWdodC05NHZoJyk7XG5cbiAgICB9IGVsc2UgaWYgKHdpbmRvdy5zY3JlZW4uYXZhaWxIZWlnaHQgPiBpbWFnZUluZm8uaW5mby5mdWxsSGVpZ2h0KSB7XG4gICAgICAgIHRvb2xDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnaGVpZ2h0LTk0dmgnKTtcbiAgICB9XG5cblxuICAgIGxldCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcblxuICAgIGNhbnZhcy5pZCA9IFwibGVjYW52YXNcIjtcbiAgICBjYW52YXMud2lkdGggPSBpbWFnZUluZm8uaW5mby5mdWxsV2lkdGg7XG4gICAgY2FudmFzLmhlaWdodCA9IGltYWdlSW5mby5pbmZvLmZ1bGxIZWlnaHQ7XG4gICAgY2FudmFzLnN0eWxlLmJvcmRlciA9IFwiMXB4IHNvbGlkXCI7XG5cblxuICAgIGxldCBjYW52YXNab25lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhc196b25lJyk7XG5cbiAgICBpZiAoaW1hZ2VJbmZvLmluZm8uZnVsbFdpZHRoIDwgY2FudmFzWm9uZS5vZmZzZXRXaWR0aCkge1xuICAgICAgICBjYW52YXMuY2xhc3NMaXN0LmFkZCgnY2VudGVyZWRfY2FudmFzJyk7XG4gICAgfVxuXG4gICAgbGV0IGNhbnZhc0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FudmFzX2NvbnRhaW5lclwiKTtcbiAgICBjYW52YXNDb250YWluZXIuYXBwZW5kQ2hpbGQoY2FudmFzKTtcbiAgICBjYW52YXNDb250YWluZXIuc3R5bGUuaGVpZ2h0ID0gJzk0dmgnO1xuXG4gICAgaWYgKGNvckVtb2ppcyA9PT0gbnVsbCkge1xuICAgICAgICBkcmF3U3R1ZmYoaW1hZ2VJbmZvKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBkcmF3U3R1ZmYoaW1hZ2VJbmZvLmluZm8sIGNvckVtb2ppcyk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmF3U3R1ZmYoaW5mbywgY29yRW1vamlzID0gbnVsbCkge1xuICAgIGxldCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxlY2FudmFzXCIpO1xuICAgIGxldCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuXG4gICAgbGV0IGRyYXdFbW9qaXM7XG4gICAgbGV0IGltYWdlSW5mbztcblxuICAgIGlmIChjb3JFbW9qaXMgPT09IG51bGwpIHtcbiAgICAgICAgZHJhd0Vtb2ppcyA9IGluZm8uZW1vamlzO1xuICAgICAgICBpbWFnZUluZm8gPSBpbmZvLmluZm87XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaW1hZ2VJbmZvID0gaW5mbztcbiAgICAgICAgZHJhd0Vtb2ppcyA9IGNvckVtb2ppcztcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZygnREUgOiAnICsgZHJhd0Vtb2ppcylcblxuICAgIGltYWdlSW5mby5uYnJFbW9qaXMgPSBNYXRoLnJvdW5kKChpbWFnZUluZm8uZnVsbFdpZHRoICogaW1hZ2VJbmZvLmZ1bGxIZWlnaHQpIC8gKGltYWdlSW5mby5zYW1wbGVTaXplICogaW1hZ2VJbmZvLnNhbXBsZVNpemUpKTtcbiAgICBpbWFnZUluZm8uZGltZW5zaW9uID0gaW1hZ2VJbmZvLmZ1bGxXaWR0aCArICcgeCAnICsgaW1hZ2VJbmZvLmZ1bGxIZWlnaHQ7XG5cbiAgICBjdHguZm9udCA9IGltYWdlSW5mby5zYW1wbGVTaXplICsgXCJweCBBcmlhbFwiOyAvL2Nvb2wgdGhpbmcgaWYgLnNhbXBsZVNpemUgaXMgdW5kZWZpbmVkIChzY2FsZSBvcHRpb24gPykgIVxuICAgIGN0eC5maWxsU3R5bGUgPSBcIndoaXRlXCI7XG4gICAgY3R4LmZpbGxSZWN0KDAsIDAsIGltYWdlSW5mby5mdWxsV2lkdGgsIGltYWdlSW5mby5mdWxsSGVpZ2h0KTtcblxuXG4gICAgaWYgKGRyYXduU2FtcGxlcyA9PT0gJ211bHRpJykge1xuXG4gICAgICAgIGltYWdlSW5mby5uYnJFbW9qaXMgPSBpbWFnZUluZm8ubmJyRW1vamlzKjU7XG5cbiAgICAgICAgbGV0IG9mZnNldFZhbHVlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NhbXBsZV9zbGlkZXInKS52YWx1ZTtcblxuICAgICAgICBmb3IgKGxldCB1ID0gMDsgdSA8IDU7IHUrKykge1xuXG4gICAgICAgICAgICBsZXQgb2Zmc2V0WCA9IDA7XG4gICAgICAgICAgICBsZXQgb2Zmc2V0WSA9IDA7XG5cbiAgICAgICAgICAgIGxldCB4ID0gMDtcbiAgICAgICAgICAgIGxldCB5ID0gMDtcblxuICAgICAgICAgICAgaWYgKHUgPT09IDApIG9mZnNldFggPSBvZmZzZXRWYWx1ZTtcbiAgICAgICAgICAgIGlmICh1ID09PSAxKSBvZmZzZXRYID0gLW9mZnNldFZhbHVlO1xuICAgICAgICAgICAgaWYgKHUgPT09IDIpIG9mZnNldFkgPSBvZmZzZXRWYWx1ZTtcbiAgICAgICAgICAgIGlmICh1ID09PSAzKSBvZmZzZXRZID0gLW9mZnNldFZhbHVlO1xuICAgICAgICAgICAgaWYgKHUgPT09IDQpIHtcbiAgICAgICAgICAgICAgICBvZmZzZXRZID0gMDtcbiAgICAgICAgICAgICAgICBvZmZzZXRYID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZHJhdyh4LCB5LCBvZmZzZXRYLCBvZmZzZXRZKVxuICAgICAgICB9XG4gICAgfSBlbHNlIGlmIChkcmF3blNhbXBsZXMgPT09ICdvbmUnKSB7XG5cbiAgICAgICAgbGV0IG9mZnNldFggPSAwO1xuICAgICAgICBsZXQgb2Zmc2V0WSA9IDA7XG4gICAgICAgIGxldCB4ID0gMDtcbiAgICAgICAgbGV0IHkgPSAwO1xuICAgICAgICBkcmF3KHgsIHksIG9mZnNldFgsIG9mZnNldFkpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZHJhdyh4LCB5LCBvZmZzZXRYLCBvZmZzZXRZKSB7XG5cbiAgICAgICAgZHJhd0Vtb2ppcy5mb3JFYWNoKCh2LCBpKSA9PiB7XG4gICAgICAgICAgICBpZiAoaSAlIE51bWJlcihpbWFnZUluZm8uaGVpZ2h0KSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHkgPSAwO1xuICAgICAgICAgICAgICAgIHggKz0gTnVtYmVyKGltYWdlSW5mby5zYW1wbGVTaXplKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHkgKz0gTnVtYmVyKGltYWdlSW5mby5zYW1wbGVTaXplKTtcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dCh2LCB4IC0gTnVtYmVyKGltYWdlSW5mby5zYW1wbGVTaXplKSArIG9mZnNldFgsIHkgKyBvZmZzZXRZKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZGlzcGxheUluZm8oaW1hZ2VJbmZvKTtcbiAgICAgICAgY29ycmVjdEhlaWdodCgpO1xuICAgICAgICByZW1vdmVMb2FkZXIoKTtcblxuICAgIH1cbn1cblxuXG5cbmZ1bmN0aW9uIGRpc3BsYXlJbmZvKGltYWdlSW5mbykge1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbWFnZV9kaW1lbnNpb24nKS5pbm5lckhUTUwgPSAnZGltZW5zaW9uIDogJyArIGltYWdlSW5mby5kaW1lbnNpb247XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ltYWdlX25ickVtb2ppcycpLmlubmVySFRNTCA9ICdlbW9qaXMgY291bnQgOiAnICsgaW1hZ2VJbmZvLm5ickVtb2ppcztcbn1cblxuZnVuY3Rpb24gY29ycmVjdEhlaWdodCgpIHtcbiAgICBsZXQgdG9vbENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0b29sQ29udGFpbmVyJyk7XG4gICAgbGV0IGJvZHkgPSBkb2N1bWVudC5ib2R5O1xuICAgIGxldCBodG1sID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuXG4gICAgbGV0IGhlaWdodE1heCA9IE1hdGgubWF4KGJvZHkuc2Nyb2xsSGVpZ2h0LCBib2R5Lm9mZnNldEhlaWdodCxcbiAgICAgICAgaHRtbC5jbGllbnRIZWlnaHQsIGh0bWwuc2Nyb2xsSGVpZ2h0LCBodG1sLm9mZnNldEhlaWdodCk7XG5cbiAgICB0b29sQ29udGFpbmVyLnN0eWxlLmhlaWdodCA9IChoZWlnaHRNYXggLSA1NykgKyAncHgnO1xufVxuXG5mdW5jdGlvbiBkbEltYWdlKCkge1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkbF9jYW52YXMnKS5ocmVmID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xlY2FudmFzJykudG9EYXRhVVJMKCdpbWFnZS9wbmcnKTtcbn1cblxuZnVuY3Rpb24gY2hhbmdlRHJhZ0Ryb3BTdGF0ZSgpIHtcblxuICAgIGxldCBvdXRlckRyYWdEcm9wID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Ryb3BfZmlsZV96b25lJyk7XG4gICAgbGV0IGlubmVyRHJhZ0Ryb3AgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZHJhZ191cGxvYWRfZmlsZScpO1xuXG4gICAgb3V0ZXJEcmFnRHJvcC5jbGFzc0xpc3QuYWRkKCdkcm9wWm9uZV9hbmlfY2xhc3MnKTtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBvdXRlckRyYWdEcm9wLmNsYXNzTGlzdC5yZW1vdmUoJ2Ryb3Bab25lX2FuaV9jbGFzcycpO1xuICAgIH0sIDEwMDApO1xuXG4gICAgaWYgKGZpbGVvYmogIT09IG51bGwpIHtcbiAgICAgICAgbGV0IGVsVG9SZW1vdmVEcmFnID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZGVsZXRlX21lJyk7XG5cbiAgICAgICAgd2hpbGUgKGVsVG9SZW1vdmVEcmFnWzBdKSB7XG4gICAgICAgICAgICBlbFRvUmVtb3ZlRHJhZ1swXS5yZW1vdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlubmVyRHJhZ0Ryb3AuZmlyc3RFbGVtZW50Q2hpbGQuaW5uZXJIVE1MICs9ICc8cCBjbGFzcz1cImRlbGV0ZV9tZSBtdC0zXCI+JyArIGZpbGVvYmoubmFtZSArICc8L3A+JztcbiAgICB9XG4gICAgc3RhcnRMaXN0ZW5lcnMoKTtcbn1cblxuZnVuY3Rpb24gYWRkTG9hZGVyKCkge1xuICAgIGxldCBsb2FkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9hZF8nKTtcbiAgICBsb2FkZXIuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlTG9hZGVyKCkge1xuICAgIGxldCBsb2FkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9hZF8nKTtcbiAgICBsb2FkZXIuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRmb3JFYWNoID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FycmF5LWl0ZXJhdGlvbicpLmZvckVhY2g7XG52YXIgc2xvcHB5QXJyYXlNZXRob2QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc2xvcHB5LWFycmF5LW1ldGhvZCcpO1xuXG4vLyBgQXJyYXkucHJvdG90eXBlLmZvckVhY2hgIG1ldGhvZCBpbXBsZW1lbnRhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmZvcmVhY2hcbm1vZHVsZS5leHBvcnRzID0gc2xvcHB5QXJyYXlNZXRob2QoJ2ZvckVhY2gnKSA/IGZ1bmN0aW9uIGZvckVhY2goY2FsbGJhY2tmbiAvKiAsIHRoaXNBcmcgKi8pIHtcbiAgcmV0dXJuICRmb3JFYWNoKHRoaXMsIGNhbGxiYWNrZm4sIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKTtcbn0gOiBbXS5mb3JFYWNoO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKE1FVEhPRF9OQU1FLCBhcmd1bWVudCkge1xuICB2YXIgbWV0aG9kID0gW11bTUVUSE9EX05BTUVdO1xuICByZXR1cm4gIW1ldGhvZCB8fCAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11c2VsZXNzLWNhbGwsbm8tdGhyb3ctbGl0ZXJhbFxuICAgIG1ldGhvZC5jYWxsKG51bGwsIGFyZ3VtZW50IHx8IGZ1bmN0aW9uICgpIHsgdGhyb3cgMTsgfSwgMSk7XG4gIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciAkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2V4cG9ydCcpO1xudmFyIGZvckVhY2ggPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYXJyYXktZm9yLWVhY2gnKTtcblxuLy8gYEFycmF5LnByb3RvdHlwZS5mb3JFYWNoYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5mb3JlYWNoXG4kKHsgdGFyZ2V0OiAnQXJyYXknLCBwcm90bzogdHJ1ZSwgZm9yY2VkOiBbXS5mb3JFYWNoICE9IGZvckVhY2ggfSwge1xuICBmb3JFYWNoOiBmb3JFYWNoXG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciAkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2V4cG9ydCcpO1xudmFyICRpbmRleE9mID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FycmF5LWluY2x1ZGVzJykuaW5kZXhPZjtcbnZhciBzbG9wcHlBcnJheU1ldGhvZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zbG9wcHktYXJyYXktbWV0aG9kJyk7XG5cbnZhciBuYXRpdmVJbmRleE9mID0gW10uaW5kZXhPZjtcblxudmFyIE5FR0FUSVZFX1pFUk8gPSAhIW5hdGl2ZUluZGV4T2YgJiYgMSAvIFsxXS5pbmRleE9mKDEsIC0wKSA8IDA7XG52YXIgU0xPUFBZX01FVEhPRCA9IHNsb3BweUFycmF5TWV0aG9kKCdpbmRleE9mJyk7XG5cbi8vIGBBcnJheS5wcm90b3R5cGUuaW5kZXhPZmAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuaW5kZXhvZlxuJCh7IHRhcmdldDogJ0FycmF5JywgcHJvdG86IHRydWUsIGZvcmNlZDogTkVHQVRJVkVfWkVSTyB8fCBTTE9QUFlfTUVUSE9EIH0sIHtcbiAgaW5kZXhPZjogZnVuY3Rpb24gaW5kZXhPZihzZWFyY2hFbGVtZW50IC8qICwgZnJvbUluZGV4ID0gMCAqLykge1xuICAgIHJldHVybiBORUdBVElWRV9aRVJPXG4gICAgICAvLyBjb252ZXJ0IC0wIHRvICswXG4gICAgICA/IG5hdGl2ZUluZGV4T2YuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCAwXG4gICAgICA6ICRpbmRleE9mKHRoaXMsIHNlYXJjaEVsZW1lbnQsIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKTtcbiAgfVxufSk7XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIERPTUl0ZXJhYmxlcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kb20taXRlcmFibGVzJyk7XG52YXIgZm9yRWFjaCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hcnJheS1mb3ItZWFjaCcpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGlkZScpO1xuXG5mb3IgKHZhciBDT0xMRUNUSU9OX05BTUUgaW4gRE9NSXRlcmFibGVzKSB7XG4gIHZhciBDb2xsZWN0aW9uID0gZ2xvYmFsW0NPTExFQ1RJT05fTkFNRV07XG4gIHZhciBDb2xsZWN0aW9uUHJvdG90eXBlID0gQ29sbGVjdGlvbiAmJiBDb2xsZWN0aW9uLnByb3RvdHlwZTtcbiAgLy8gc29tZSBDaHJvbWUgdmVyc2lvbnMgaGF2ZSBub24tY29uZmlndXJhYmxlIG1ldGhvZHMgb24gRE9NVG9rZW5MaXN0XG4gIGlmIChDb2xsZWN0aW9uUHJvdG90eXBlICYmIENvbGxlY3Rpb25Qcm90b3R5cGUuZm9yRWFjaCAhPT0gZm9yRWFjaCkgdHJ5IHtcbiAgICBoaWRlKENvbGxlY3Rpb25Qcm90b3R5cGUsICdmb3JFYWNoJywgZm9yRWFjaCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgQ29sbGVjdGlvblByb3RvdHlwZS5mb3JFYWNoID0gZm9yRWFjaDtcbiAgfVxufVxuIiwidmFyICQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZXhwb3J0Jyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIHVzZXJBZ2VudCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy91c2VyLWFnZW50Jyk7XG5cbnZhciBzbGljZSA9IFtdLnNsaWNlO1xudmFyIE1TSUUgPSAvTVNJRSAuXFwuLy50ZXN0KHVzZXJBZ2VudCk7IC8vIDwtIGRpcnR5IGllOS0gY2hlY2tcblxudmFyIHdyYXAgPSBmdW5jdGlvbiAoc2NoZWR1bGVyKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoaGFuZGxlciwgdGltZW91dCAvKiAsIC4uLmFyZ3VtZW50cyAqLykge1xuICAgIHZhciBib3VuZEFyZ3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMjtcbiAgICB2YXIgYXJncyA9IGJvdW5kQXJncyA/IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKSA6IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gc2NoZWR1bGVyKGJvdW5kQXJncyA/IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXctZnVuY1xuICAgICAgKHR5cGVvZiBoYW5kbGVyID09ICdmdW5jdGlvbicgPyBoYW5kbGVyIDogRnVuY3Rpb24oaGFuZGxlcikpLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH0gOiBoYW5kbGVyLCB0aW1lb3V0KTtcbiAgfTtcbn07XG5cbi8vIGllOS0gc2V0VGltZW91dCAmIHNldEludGVydmFsIGFkZGl0aW9uYWwgcGFyYW1ldGVycyBmaXhcbi8vIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL3RpbWVycy1hbmQtdXNlci1wcm9tcHRzLmh0bWwjdGltZXJzXG4kKHsgZ2xvYmFsOiB0cnVlLCBiaW5kOiB0cnVlLCBmb3JjZWQ6IE1TSUUgfSwge1xuICAvLyBgc2V0VGltZW91dGAgbWV0aG9kXG4gIC8vIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL3RpbWVycy1hbmQtdXNlci1wcm9tcHRzLmh0bWwjZG9tLXNldHRpbWVvdXRcbiAgc2V0VGltZW91dDogd3JhcChnbG9iYWwuc2V0VGltZW91dCksXG4gIC8vIGBzZXRJbnRlcnZhbGAgbWV0aG9kXG4gIC8vIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL3RpbWVycy1hbmQtdXNlci1wcm9tcHRzLmh0bWwjZG9tLXNldGludGVydmFsXG4gIHNldEludGVydmFsOiB3cmFwKGdsb2JhbC5zZXRJbnRlcnZhbClcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==