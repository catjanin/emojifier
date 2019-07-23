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
    console.log('heyeyeye');
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

  console.log('de length : ' + drawEmojis.length);
  imageInfo.nbrEmojis = Math.round(imageInfo.fullWidth * imageInfo.fullHeight / (imageInfo.sampleSize * imageInfo.sampleSize));
  imageInfo.dimension = imageInfo.fullWidth + ' x ' + imageInfo.fullHeight;
  ctx.font = imageInfo.sampleSize + "px Arial"; //cool thing if .sampleSize is undefined (scale option ?) !

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, imageInfo.fullWidth, imageInfo.fullHeight);

  if (drawnSamples === 'multi') {
    imageInfo.nbrEmojis = imageInfo.nbrEmojis * 5;
    var offsetValue = document.getElementById('sample_slider').value;
    console.log(offsetValue);

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
    console.log(info.sampleSize);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvanMvY2FudmFzTG9naWMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2FycmF5LWZvci1lYWNoLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9zbG9wcHktYXJyYXktbWV0aG9kLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXMuYXJyYXkuZm9yLWVhY2guanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5hcnJheS5pbmRleC1vZi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL3dlYi5kb20tY29sbGVjdGlvbnMuZm9yLWVhY2guanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy93ZWIudGltZXJzLmpzIl0sIm5hbWVzIjpbIkVsZW1lbnQiLCJwcm90b3R5cGUiLCJyZW1vdmUiLCJwYXJlbnRFbGVtZW50IiwicmVtb3ZlQ2hpbGQiLCJOb2RlTGlzdCIsIkhUTUxDb2xsZWN0aW9uIiwiaSIsImxlbmd0aCIsImRyYXduU2FtcGxlcyIsImZpbGVvYmoiLCJlbW9qaUxpc3QiLCJmZXRjaCIsIm1ldGhvZCIsInRoZW4iLCJyZXNwb25zZSIsInRleHQiLCJyZXMiLCJjb25zb2xlIiwibG9nIiwiSlNPTiIsInBhcnNlIiwibmVhcmVzdENvbG9yIiwicmVxdWlyZSIsInN0YXJ0TGlzdGVuZXJzIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJlIiwicHJldmVudERlZmF1bHQiLCJldmVudCIsInVwbG9hZF9maWxlIiwiZmlsZV9leHBsb3JlciIsImRsSW1hZ2UiLCJxdWVyeVNlbGVjdG9yIiwiY2hlY2tlZCIsInN0eWxlIiwiZGlzcGxheSIsImRhdGFUcmFuc2ZlciIsImZpbGVzIiwiY2hhbmdlRHJhZ0Ryb3BTdGF0ZSIsImNsaWNrIiwib25jaGFuZ2UiLCJhZGRMb2FkZXIiLCJpbWFnZSIsImVtb2ppc2l6ZSIsInZhbHVlIiwiYWxnbzIiLCJkcmF3blNhbXBsZXNDaGVja2JveCIsImFsZ28iLCJmaWxlIiwiRm9ybURhdGEiLCJhcHBlbmQiLCJzZW5kUmVxdWVzdCIsImJvZHkiLCJnZXRUaGVFbW9qaXMiLCJjcmVhdGVDYW52YXMiLCJpbWFnZUluZm8iLCJlbW9qaUNvbG9ycyIsIm1hcCIsIm4iLCJoZXhDb2xvciIsImdldENvbG9yIiwiZnJvbSIsImNvckVtb2ppcyIsImNvbG9ycyIsImZvckVhY2giLCJ2IiwiY29yZXNwRW1vamkiLCJpbmRleE9mIiwicHVzaCIsIm9sZENhbnZhcyIsImRyYWdEcm9wWm9uZSIsImRyYWdEcm9wUGFyZW50IiwicGFyZW50Tm9kZSIsImlkIiwiYXBwZW5kQ2hpbGQiLCJjbGFzc0xpc3QiLCJjb250YWlucyIsImFkZCIsInRvb2xDb250YWluZXIiLCJ3aW5kb3ciLCJzY3JlZW4iLCJhdmFpbEhlaWdodCIsImluZm8iLCJmdWxsSGVpZ2h0IiwiY2FudmFzIiwiY3JlYXRlRWxlbWVudCIsIndpZHRoIiwiZnVsbFdpZHRoIiwiaGVpZ2h0IiwiYm9yZGVyIiwiY2FudmFzWm9uZSIsIm9mZnNldFdpZHRoIiwiY2FudmFzQ29udGFpbmVyIiwiZHJhd1N0dWZmIiwiY3R4IiwiZ2V0Q29udGV4dCIsImRyYXdFbW9qaXMiLCJlbW9qaXMiLCJuYnJFbW9qaXMiLCJNYXRoIiwicm91bmQiLCJzYW1wbGVTaXplIiwiZGltZW5zaW9uIiwiZm9udCIsImZpbGxTdHlsZSIsImZpbGxSZWN0Iiwib2Zmc2V0VmFsdWUiLCJ1Iiwib2Zmc2V0WCIsIm9mZnNldFkiLCJ4IiwieSIsImRyYXciLCJOdW1iZXIiLCJmaWxsVGV4dCIsImRpc3BsYXlJbmZvIiwiY29ycmVjdEhlaWdodCIsInJlbW92ZUxvYWRlciIsImlubmVySFRNTCIsImh0bWwiLCJkb2N1bWVudEVsZW1lbnQiLCJoZWlnaHRNYXgiLCJtYXgiLCJzY3JvbGxIZWlnaHQiLCJvZmZzZXRIZWlnaHQiLCJjbGllbnRIZWlnaHQiLCJocmVmIiwidG9EYXRhVVJMIiwib3V0ZXJEcmFnRHJvcCIsImlubmVyRHJhZ0Ryb3AiLCJzZXRUaW1lb3V0IiwiZWxUb1JlbW92ZURyYWciLCJnZXRFbGVtZW50c0J5Q2xhc3NOYW1lIiwiZmlyc3RFbGVtZW50Q2hpbGQiLCJuYW1lIiwibG9hZGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxDQUFDQyxTQUFSLENBQWtCQyxNQUFsQixHQUEyQixZQUFZO0FBQ25DLE9BQUtDLGFBQUwsQ0FBbUJDLFdBQW5CLENBQStCLElBQS9CO0FBQ0gsQ0FGRDs7QUFHQUMsUUFBUSxDQUFDSixTQUFULENBQW1CQyxNQUFuQixHQUE0QkksY0FBYyxDQUFDTCxTQUFmLENBQXlCQyxNQUF6QixHQUFrQyxZQUFZO0FBQ3RFLE9BQUssSUFBSUssQ0FBQyxHQUFHLEtBQUtDLE1BQUwsR0FBYyxDQUEzQixFQUE4QkQsQ0FBQyxJQUFJLENBQW5DLEVBQXNDQSxDQUFDLEVBQXZDLEVBQTJDO0FBQ3ZDLFFBQUksS0FBS0EsQ0FBTCxLQUFXLEtBQUtBLENBQUwsRUFBUUosYUFBdkIsRUFBc0M7QUFDbEMsV0FBS0ksQ0FBTCxFQUFRSixhQUFSLENBQXNCQyxXQUF0QixDQUFrQyxLQUFLRyxDQUFMLENBQWxDO0FBQ0g7QUFDSjtBQUNKLENBTkQ7O0FBU0EsSUFBSUUsWUFBSjtBQUNBLElBQUlDLE9BQU8sR0FBRyxJQUFkO0FBQ0EsSUFBSUMsU0FBUyxHQUFHLElBQWhCO0FBQXFCO0FBRXJCQyxLQUFLLENBQUMsWUFBRCxFQUFlO0FBQ2hCQyxRQUFNLEVBQUU7QUFEUSxDQUFmLENBQUwsQ0FFR0MsSUFGSCxDQUVRLFVBQUNDLFFBQUQsRUFBYztBQUNsQixTQUFPQSxRQUFRLENBQUNDLElBQVQsRUFBUDtBQUNILENBSkQsRUFJR0YsSUFKSCxDQUlR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Qyx1RUFBcUI7QUFDckMsYUFBYSxtQkFBTyxDQUFDLHVFQUFxQjtBQUMxQyxnQkFBZ0IsbUJBQU8sQ0FBQywrRUFBeUI7O0FBRWpEO0FBQ0Esc0NBQXNDOztBQUV0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHLHlDQUF5QztBQUM1QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDIiwiZmlsZSI6ImNhbnZhc0xvZ2ljLmpzIiwic291cmNlc0NvbnRlbnQiOlsiRWxlbWVudC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzKTtcbn07XG5Ob2RlTGlzdC5wcm90b3R5cGUucmVtb3ZlID0gSFRNTENvbGxlY3Rpb24ucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKGxldCBpID0gdGhpcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBpZiAodGhpc1tpXSAmJiB0aGlzW2ldLnBhcmVudEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXNbaV0ucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZCh0aGlzW2ldKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cblxubGV0IGRyYXduU2FtcGxlcztcbmxldCBmaWxlb2JqID0gbnVsbDtcbmxldCBlbW9qaUxpc3QgPSBudWxsOztcblxuZmV0Y2goXCIvZ2V0RW1vamlzXCIsIHtcbiAgICBtZXRob2Q6IFwiR0VUXCIsXG59KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgIHJldHVybiByZXNwb25zZS50ZXh0KCk7XG59KS50aGVuKChyZXMpID0+IHtcbiAgICBjb25zb2xlLmxvZyhKU09OLnBhcnNlKHJlcykpO1xuICAgIGVtb2ppTGlzdCA9ICBKU09OLnBhcnNlKHJlcyk7XG59KTtcblxuXG5jb25zdCBuZWFyZXN0Q29sb3IgPSByZXF1aXJlKCcuL25lYXJlc3RDb2xvcicpO1xuXG5zdGFydExpc3RlbmVycygpO1xuXG5mdW5jdGlvbiBzdGFydExpc3RlbmVycygpIHtcblxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkcm9wX2ZpbGVfem9uZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH0pO1xuXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Ryb3BfZmlsZV96b25lJykuYWRkRXZlbnRMaXN0ZW5lcignZHJhZ3N0YXJ0JywgKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH0pO1xuXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Ryb3BfZmlsZV96b25lJykuYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsIChldmVudCkgPT4ge1xuICAgICAgICB1cGxvYWRfZmlsZShldmVudCk7XG4gICAgfSk7XG5cbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmlsZV9leHAnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgZmlsZV9leHBsb3JlcigpO1xuICAgICAgICBjb25zb2xlLmxvZygnaGV5ZXlleWUnKVxuICAgIH0pO1xuXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RsX2NhbnZhcycpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBkbEltYWdlKCk7XG4gICAgfSk7XG5cbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgneDVfdG9nZ2xlJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIGlmKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN4NV90b2dnbGUgaW5wdXQnKS5jaGVja2VkKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd5YXknKVxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NsaWRlcl90b2dnbGUnKS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2xpZGVyX3RvZ2dsZScpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIH1cbiAgICB9KTtcblxufVxuXG5mdW5jdGlvbiB1cGxvYWRfZmlsZShlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGZpbGVvYmogPSBlLmRhdGFUcmFuc2Zlci5maWxlc1swXTtcbiAgICBjaGFuZ2VEcmFnRHJvcFN0YXRlKCk7XG59XG5cbmZ1bmN0aW9uIGZpbGVfZXhwbG9yZXIoKSB7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NlbGVjdGZpbGUnKS5jbGljaygpO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzZWxlY3RmaWxlJykub25jaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZpbGVvYmogPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VsZWN0ZmlsZScpLmZpbGVzWzBdO1xuICAgICAgICBjaGFuZ2VEcmFnRHJvcFN0YXRlKCk7XG4gICAgfTtcbn1cblxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NyZWF0ZUltYWdlJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB7XG5cbiAgICBhZGRMb2FkZXIoKTtcblxuICAgIGxldCBpbWFnZSA9IGZpbGVvYmo7XG5cbiAgICBjb25zb2xlLmxvZyhpbWFnZSk7XG5cbiAgICBsZXQgZW1vamlzaXplID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Zvcm1fZW1vamlfc2l6ZScpLnZhbHVlO1xuICAgIGxldCBhbGdvMiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmb3JtX2FsZ29fMicpO1xuICAgIGxldCBkcmF3blNhbXBsZXNDaGVja2JveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmb3JtX3g0X3NhbXBsZXMnKTtcbiAgICBsZXQgYWxnbztcblxuICAgIGxldCBmaWxlID0gbmV3IEZvcm1EYXRhKCk7XG4gICAgZmlsZS5hcHBlbmQoJ2ltYWdlJywgaW1hZ2UpO1xuICAgIGZpbGUuYXBwZW5kKCdzaXplJywgZW1vamlzaXplKTtcblxuICAgIGlmIChhbGdvMi5jaGVja2VkKSB7XG4gICAgICAgIGZpbGUuYXBwZW5kKCdhbGdvJywgJ2FsZ29fMicpO1xuICAgICAgICBhbGdvID0gMjtcbiAgICB9IGVsc2Uge1xuICAgICAgICBmaWxlLmFwcGVuZCgnYWxnbycsICdhbGdvXzEnKTtcbiAgICAgICAgYWxnbyA9IDE7XG4gICAgfVxuXG4gICAgaWYgKGRyYXduU2FtcGxlc0NoZWNrYm94LmNoZWNrZWQpIHtcbiAgICAgICAgZHJhd25TYW1wbGVzID0gJ211bHRpJztcbiAgICB9IGVsc2Uge1xuICAgICAgICBkcmF3blNhbXBsZXMgPSAnb25lJztcbiAgICB9XG5cbiAgICBzZW5kUmVxdWVzdChmaWxlLCBhbGdvKTtcbn0pO1xuXG5mdW5jdGlvbiBzZW5kUmVxdWVzdChmaWxlLCBhbGdvKSB7XG5cbiAgICBmZXRjaChcIi9zZW5kUmVxdWVzdFwiLCB7XG4gICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgIGJvZHk6IGZpbGVcbiAgICB9KS50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpO1xuICAgIH0pLnRoZW4oKHJlcykgPT4ge1xuICAgICAgICBpZiAoYWxnbyA9PT0gMSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzKTtcbiAgICAgICAgICAgIGdldFRoZUVtb2ppcyhKU09OLnBhcnNlKHJlcykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY3JlYXRlQ2FudmFzKEpTT04ucGFyc2UocmVzKSlcbiAgICAgICAgfVxuICAgIH0pXG59XG5cbmZ1bmN0aW9uIGdldFRoZUVtb2ppcyhpbWFnZUluZm8pIHtcbiAgICBjb25zb2xlLmxvZyhlbW9qaUxpc3QpO1xuICAgIGxldCBlbW9qaUNvbG9ycyA9IGVtb2ppTGlzdC5tYXAobiA9PiBuLmhleENvbG9yKTtcbiAgICBsZXQgZ2V0Q29sb3IgPSBuZWFyZXN0Q29sb3IuZnJvbShlbW9qaUNvbG9ycyk7XG4gICAgbGV0IGNvckVtb2ppcyA9IFtdO1xuXG4gICAgaW1hZ2VJbmZvLmNvbG9ycy5mb3JFYWNoKCh2KSA9PiB7XG4gICAgICAgIGxldCBjb3Jlc3BFbW9qaSA9IGVtb2ppTGlzdFtlbW9qaUxpc3QubWFwKG4gPT4gbi5oZXhDb2xvcikuaW5kZXhPZihnZXRDb2xvcih2KSldLmNoYXI7XG4gICAgICAgIGNvckVtb2ppcy5wdXNoKGNvcmVzcEVtb2ppKTtcbiAgICB9KTtcblxuICAgIGNyZWF0ZUNhbnZhcyhpbWFnZUluZm8sIGNvckVtb2ppcyk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUNhbnZhcyhpbWFnZUluZm8sIGNvckVtb2ppcyA9IG51bGwpIHtcbiAgICBjb25zb2xlLmxvZyhpbWFnZUluZm8pO1xuXG4gICAgbGV0IG9sZENhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsZWNhbnZhcycpO1xuXG4gICAgaWYgKHR5cGVvZiAob2xkQ2FudmFzKSAhPSAndW5kZWZpbmVkJyAmJiBvbGRDYW52YXMgIT0gbnVsbCkge1xuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImxlY2FudmFzXCIpLnJlbW92ZSgpO1xuICAgIH1cblxuICAgIGxldCBkcmFnRHJvcFpvbmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZHJvcF9maWxlX3pvbmUnKTtcbiAgICBsZXQgZHJhZ0Ryb3BQYXJlbnQgPSBkcmFnRHJvcFpvbmUucGFyZW50Tm9kZTtcblxuICAgIGlmIChkcmFnRHJvcFBhcmVudC5pZCAhPT0gXCJkcmFnZHJvcF9saVwiKSB7XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkcmFnZHJvcF9saScpLmFwcGVuZENoaWxkKGRyYWdEcm9wWm9uZSk7XG4gICAgICAgIGlmIChkcmFnRHJvcFpvbmUuY2xhc3NMaXN0LmNvbnRhaW5zKCdkcm9wWm9uZScpKSB7XG4gICAgICAgICAgICBkcmFnRHJvcFpvbmUuY2xhc3NMaXN0LnJlbW92ZSgnZHJvcFpvbmUnKTtcbiAgICAgICAgICAgIGRyYWdEcm9wWm9uZS5jbGFzc0xpc3QuYWRkKCdkcm9wWm9uZV9zaWRlJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgdG9vbENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0b29sQ29udGFpbmVyJyk7XG4gICAgaWYgKHRvb2xDb250YWluZXIuY2xhc3NMaXN0LmNvbnRhaW5zKCdoZWlnaHQtOTR2aCcpICYmIHdpbmRvdy5zY3JlZW4uYXZhaWxIZWlnaHQgPCBpbWFnZUluZm8uaW5mby5mdWxsSGVpZ2h0KSB7XG4gICAgICAgIHRvb2xDb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnaGVpZ2h0LTk0dmgnKTtcblxuICAgIH0gZWxzZSBpZiAod2luZG93LnNjcmVlbi5hdmFpbEhlaWdodCA+IGltYWdlSW5mby5pbmZvLmZ1bGxIZWlnaHQpIHtcbiAgICAgICAgdG9vbENvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdoZWlnaHQtOTR2aCcpO1xuICAgIH1cblxuXG4gICAgbGV0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuXG4gICAgY2FudmFzLmlkID0gXCJsZWNhbnZhc1wiO1xuICAgIGNhbnZhcy53aWR0aCA9IGltYWdlSW5mby5pbmZvLmZ1bGxXaWR0aDtcbiAgICBjYW52YXMuaGVpZ2h0ID0gaW1hZ2VJbmZvLmluZm8uZnVsbEhlaWdodDtcbiAgICBjYW52YXMuc3R5bGUuYm9yZGVyID0gXCIxcHggc29saWRcIjtcblxuXG4gICAgbGV0IGNhbnZhc1pvbmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzX3pvbmUnKTtcblxuICAgIGlmIChpbWFnZUluZm8uaW5mby5mdWxsV2lkdGggPCBjYW52YXNab25lLm9mZnNldFdpZHRoKSB7XG4gICAgICAgIGNhbnZhcy5jbGFzc0xpc3QuYWRkKCdjZW50ZXJlZF9jYW52YXMnKTtcbiAgICB9XG5cbiAgICBsZXQgY2FudmFzQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjYW52YXNfY29udGFpbmVyXCIpO1xuICAgIGNhbnZhc0NvbnRhaW5lci5hcHBlbmRDaGlsZChjYW52YXMpO1xuICAgIGNhbnZhc0NvbnRhaW5lci5zdHlsZS5oZWlnaHQgPSAnOTR2aCc7XG5cbiAgICBpZiAoY29yRW1vamlzID09PSBudWxsKSB7XG4gICAgICAgIGRyYXdTdHVmZihpbWFnZUluZm8pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGRyYXdTdHVmZihpbWFnZUluZm8uaW5mbywgY29yRW1vamlzKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYXdTdHVmZihpbmZvLCBjb3JFbW9qaXMgPSBudWxsKSB7XG4gICAgbGV0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibGVjYW52YXNcIik7XG4gICAgbGV0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG5cbiAgICBsZXQgZHJhd0Vtb2ppcztcbiAgICBsZXQgaW1hZ2VJbmZvO1xuXG4gICAgaWYgKGNvckVtb2ppcyA9PT0gbnVsbCkge1xuICAgICAgICBkcmF3RW1vamlzID0gaW5mby5lbW9qaXM7XG4gICAgICAgIGltYWdlSW5mbyA9IGluZm8uaW5mbztcbiAgICB9IGVsc2Uge1xuICAgICAgICBpbWFnZUluZm8gPSBpbmZvO1xuICAgICAgICBkcmF3RW1vamlzID0gY29yRW1vamlzO1xuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKCdkZSBsZW5ndGggOiAnICsgZHJhd0Vtb2ppcy5sZW5ndGgpXG5cbiAgICBpbWFnZUluZm8ubmJyRW1vamlzID0gTWF0aC5yb3VuZCgoaW1hZ2VJbmZvLmZ1bGxXaWR0aCAqIGltYWdlSW5mby5mdWxsSGVpZ2h0KSAvIChpbWFnZUluZm8uc2FtcGxlU2l6ZSAqIGltYWdlSW5mby5zYW1wbGVTaXplKSk7XG4gICAgaW1hZ2VJbmZvLmRpbWVuc2lvbiA9IGltYWdlSW5mby5mdWxsV2lkdGggKyAnIHggJyArIGltYWdlSW5mby5mdWxsSGVpZ2h0O1xuXG4gICAgY3R4LmZvbnQgPSBpbWFnZUluZm8uc2FtcGxlU2l6ZSArIFwicHggQXJpYWxcIjsgLy9jb29sIHRoaW5nIGlmIC5zYW1wbGVTaXplIGlzIHVuZGVmaW5lZCAoc2NhbGUgb3B0aW9uID8pICFcbiAgICBjdHguZmlsbFN0eWxlID0gXCJ3aGl0ZVwiO1xuICAgIGN0eC5maWxsUmVjdCgwLCAwLCBpbWFnZUluZm8uZnVsbFdpZHRoLCBpbWFnZUluZm8uZnVsbEhlaWdodCk7XG5cblxuICAgIGlmIChkcmF3blNhbXBsZXMgPT09ICdtdWx0aScpIHtcblxuICAgICAgICBpbWFnZUluZm8ubmJyRW1vamlzID0gaW1hZ2VJbmZvLm5ickVtb2ppcyo1O1xuXG4gICAgICAgIGxldCBvZmZzZXRWYWx1ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzYW1wbGVfc2xpZGVyJykudmFsdWU7XG4gICAgICAgIGNvbnNvbGUubG9nKG9mZnNldFZhbHVlKTtcblxuICAgICAgICBmb3IgKGxldCB1ID0gMDsgdSA8IDU7IHUrKykge1xuXG4gICAgICAgICAgICBsZXQgb2Zmc2V0WCA9IDA7XG4gICAgICAgICAgICBsZXQgb2Zmc2V0WSA9IDA7XG5cbiAgICAgICAgICAgIGxldCB4ID0gMDtcbiAgICAgICAgICAgIGxldCB5ID0gMDtcblxuICAgICAgICAgICAgaWYgKHUgPT09IDApIG9mZnNldFggPSBvZmZzZXRWYWx1ZTtcbiAgICAgICAgICAgIGlmICh1ID09PSAxKSBvZmZzZXRYID0gLW9mZnNldFZhbHVlO1xuICAgICAgICAgICAgaWYgKHUgPT09IDIpIG9mZnNldFkgPSBvZmZzZXRWYWx1ZTtcbiAgICAgICAgICAgIGlmICh1ID09PSAzKSBvZmZzZXRZID0gLW9mZnNldFZhbHVlO1xuICAgICAgICAgICAgaWYgKHUgPT09IDQpIHtcbiAgICAgICAgICAgICAgICBvZmZzZXRZID0gMDtcbiAgICAgICAgICAgICAgICBvZmZzZXRYID0gMDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZHJhdyh4LCB5LCBvZmZzZXRYLCBvZmZzZXRZKVxuICAgICAgICB9XG4gICAgfSBlbHNlIGlmIChkcmF3blNhbXBsZXMgPT09ICdvbmUnKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGluZm8uc2FtcGxlU2l6ZSk7XG5cbiAgICAgICAgbGV0IG9mZnNldFggPSAwO1xuICAgICAgICBsZXQgb2Zmc2V0WSA9IDA7XG4gICAgICAgIGxldCB4ID0gMDtcbiAgICAgICAgbGV0IHkgPSAwO1xuICAgICAgICBkcmF3KHgsIHksIG9mZnNldFgsIG9mZnNldFkpXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZHJhdyh4LCB5LCBvZmZzZXRYLCBvZmZzZXRZKSB7XG5cbiAgICAgICAgZHJhd0Vtb2ppcy5mb3JFYWNoKCh2LCBpKSA9PiB7XG4gICAgICAgICAgICBpZiAoaSAlIE51bWJlcihpbWFnZUluZm8uaGVpZ2h0KSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHkgPSAwO1xuICAgICAgICAgICAgICAgIHggKz0gTnVtYmVyKGltYWdlSW5mby5zYW1wbGVTaXplKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHkgKz0gTnVtYmVyKGltYWdlSW5mby5zYW1wbGVTaXplKTtcbiAgICAgICAgICAgIGN0eC5maWxsVGV4dCh2LCB4IC0gTnVtYmVyKGltYWdlSW5mby5zYW1wbGVTaXplKSArIG9mZnNldFgsIHkgKyBvZmZzZXRZKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZGlzcGxheUluZm8oaW1hZ2VJbmZvKTtcbiAgICAgICAgY29ycmVjdEhlaWdodCgpO1xuICAgICAgICByZW1vdmVMb2FkZXIoKTtcblxuICAgIH1cbn1cblxuXG5cbmZ1bmN0aW9uIGRpc3BsYXlJbmZvKGltYWdlSW5mbykge1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbWFnZV9kaW1lbnNpb24nKS5pbm5lckhUTUwgPSAnZGltZW5zaW9uIDogJyArIGltYWdlSW5mby5kaW1lbnNpb247XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ltYWdlX25ickVtb2ppcycpLmlubmVySFRNTCA9ICdlbW9qaXMgY291bnQgOiAnICsgaW1hZ2VJbmZvLm5ickVtb2ppcztcbn1cblxuZnVuY3Rpb24gY29ycmVjdEhlaWdodCgpIHtcbiAgICBsZXQgdG9vbENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0b29sQ29udGFpbmVyJyk7XG4gICAgbGV0IGJvZHkgPSBkb2N1bWVudC5ib2R5O1xuICAgIGxldCBodG1sID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuXG4gICAgbGV0IGhlaWdodE1heCA9IE1hdGgubWF4KGJvZHkuc2Nyb2xsSGVpZ2h0LCBib2R5Lm9mZnNldEhlaWdodCxcbiAgICAgICAgaHRtbC5jbGllbnRIZWlnaHQsIGh0bWwuc2Nyb2xsSGVpZ2h0LCBodG1sLm9mZnNldEhlaWdodCk7XG5cbiAgICB0b29sQ29udGFpbmVyLnN0eWxlLmhlaWdodCA9IChoZWlnaHRNYXggLSA1NykgKyAncHgnO1xufVxuXG5mdW5jdGlvbiBkbEltYWdlKCkge1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkbF9jYW52YXMnKS5ocmVmID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xlY2FudmFzJykudG9EYXRhVVJMKCdpbWFnZS9wbmcnKTtcbn1cblxuZnVuY3Rpb24gY2hhbmdlRHJhZ0Ryb3BTdGF0ZSgpIHtcblxuICAgIGxldCBvdXRlckRyYWdEcm9wID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Ryb3BfZmlsZV96b25lJyk7XG4gICAgbGV0IGlubmVyRHJhZ0Ryb3AgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZHJhZ191cGxvYWRfZmlsZScpO1xuXG4gICAgb3V0ZXJEcmFnRHJvcC5jbGFzc0xpc3QuYWRkKCdkcm9wWm9uZV9hbmlfY2xhc3MnKTtcblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBvdXRlckRyYWdEcm9wLmNsYXNzTGlzdC5yZW1vdmUoJ2Ryb3Bab25lX2FuaV9jbGFzcycpO1xuICAgIH0sIDEwMDApO1xuXG4gICAgaWYgKGZpbGVvYmogIT09IG51bGwpIHtcbiAgICAgICAgbGV0IGVsVG9SZW1vdmVEcmFnID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZGVsZXRlX21lJyk7XG5cbiAgICAgICAgd2hpbGUgKGVsVG9SZW1vdmVEcmFnWzBdKSB7XG4gICAgICAgICAgICBlbFRvUmVtb3ZlRHJhZ1swXS5yZW1vdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlubmVyRHJhZ0Ryb3AuZmlyc3RFbGVtZW50Q2hpbGQuaW5uZXJIVE1MICs9ICc8cCBjbGFzcz1cImRlbGV0ZV9tZSBtdC0zXCI+JyArIGZpbGVvYmoubmFtZSArICc8L3A+JztcbiAgICB9XG4gICAgc3RhcnRMaXN0ZW5lcnMoKTtcbn1cblxuZnVuY3Rpb24gYWRkTG9hZGVyKCkge1xuICAgIGxldCBsb2FkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9hZF8nKTtcbiAgICBsb2FkZXIuc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlTG9hZGVyKCkge1xuICAgIGxldCBsb2FkZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9hZF8nKTtcbiAgICBsb2FkZXIuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRmb3JFYWNoID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FycmF5LWl0ZXJhdGlvbicpLmZvckVhY2g7XG52YXIgc2xvcHB5QXJyYXlNZXRob2QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc2xvcHB5LWFycmF5LW1ldGhvZCcpO1xuXG4vLyBgQXJyYXkucHJvdG90eXBlLmZvckVhY2hgIG1ldGhvZCBpbXBsZW1lbnRhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmZvcmVhY2hcbm1vZHVsZS5leHBvcnRzID0gc2xvcHB5QXJyYXlNZXRob2QoJ2ZvckVhY2gnKSA/IGZ1bmN0aW9uIGZvckVhY2goY2FsbGJhY2tmbiAvKiAsIHRoaXNBcmcgKi8pIHtcbiAgcmV0dXJuICRmb3JFYWNoKHRoaXMsIGNhbGxiYWNrZm4sIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKTtcbn0gOiBbXS5mb3JFYWNoO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKE1FVEhPRF9OQU1FLCBhcmd1bWVudCkge1xuICB2YXIgbWV0aG9kID0gW11bTUVUSE9EX05BTUVdO1xuICByZXR1cm4gIW1ldGhvZCB8fCAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11c2VsZXNzLWNhbGwsbm8tdGhyb3ctbGl0ZXJhbFxuICAgIG1ldGhvZC5jYWxsKG51bGwsIGFyZ3VtZW50IHx8IGZ1bmN0aW9uICgpIHsgdGhyb3cgMTsgfSwgMSk7XG4gIH0pO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciAkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2V4cG9ydCcpO1xudmFyIGZvckVhY2ggPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYXJyYXktZm9yLWVhY2gnKTtcblxuLy8gYEFycmF5LnByb3RvdHlwZS5mb3JFYWNoYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5mb3JlYWNoXG4kKHsgdGFyZ2V0OiAnQXJyYXknLCBwcm90bzogdHJ1ZSwgZm9yY2VkOiBbXS5mb3JFYWNoICE9IGZvckVhY2ggfSwge1xuICBmb3JFYWNoOiBmb3JFYWNoXG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciAkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2V4cG9ydCcpO1xudmFyICRpbmRleE9mID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FycmF5LWluY2x1ZGVzJykuaW5kZXhPZjtcbnZhciBzbG9wcHlBcnJheU1ldGhvZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zbG9wcHktYXJyYXktbWV0aG9kJyk7XG5cbnZhciBuYXRpdmVJbmRleE9mID0gW10uaW5kZXhPZjtcblxudmFyIE5FR0FUSVZFX1pFUk8gPSAhIW5hdGl2ZUluZGV4T2YgJiYgMSAvIFsxXS5pbmRleE9mKDEsIC0wKSA8IDA7XG52YXIgU0xPUFBZX01FVEhPRCA9IHNsb3BweUFycmF5TWV0aG9kKCdpbmRleE9mJyk7XG5cbi8vIGBBcnJheS5wcm90b3R5cGUuaW5kZXhPZmAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuaW5kZXhvZlxuJCh7IHRhcmdldDogJ0FycmF5JywgcHJvdG86IHRydWUsIGZvcmNlZDogTkVHQVRJVkVfWkVSTyB8fCBTTE9QUFlfTUVUSE9EIH0sIHtcbiAgaW5kZXhPZjogZnVuY3Rpb24gaW5kZXhPZihzZWFyY2hFbGVtZW50IC8qICwgZnJvbUluZGV4ID0gMCAqLykge1xuICAgIHJldHVybiBORUdBVElWRV9aRVJPXG4gICAgICAvLyBjb252ZXJ0IC0wIHRvICswXG4gICAgICA/IG5hdGl2ZUluZGV4T2YuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCAwXG4gICAgICA6ICRpbmRleE9mKHRoaXMsIHNlYXJjaEVsZW1lbnQsIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKTtcbiAgfVxufSk7XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIERPTUl0ZXJhYmxlcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kb20taXRlcmFibGVzJyk7XG52YXIgZm9yRWFjaCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hcnJheS1mb3ItZWFjaCcpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGlkZScpO1xuXG5mb3IgKHZhciBDT0xMRUNUSU9OX05BTUUgaW4gRE9NSXRlcmFibGVzKSB7XG4gIHZhciBDb2xsZWN0aW9uID0gZ2xvYmFsW0NPTExFQ1RJT05fTkFNRV07XG4gIHZhciBDb2xsZWN0aW9uUHJvdG90eXBlID0gQ29sbGVjdGlvbiAmJiBDb2xsZWN0aW9uLnByb3RvdHlwZTtcbiAgLy8gc29tZSBDaHJvbWUgdmVyc2lvbnMgaGF2ZSBub24tY29uZmlndXJhYmxlIG1ldGhvZHMgb24gRE9NVG9rZW5MaXN0XG4gIGlmIChDb2xsZWN0aW9uUHJvdG90eXBlICYmIENvbGxlY3Rpb25Qcm90b3R5cGUuZm9yRWFjaCAhPT0gZm9yRWFjaCkgdHJ5IHtcbiAgICBoaWRlKENvbGxlY3Rpb25Qcm90b3R5cGUsICdmb3JFYWNoJywgZm9yRWFjaCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgQ29sbGVjdGlvblByb3RvdHlwZS5mb3JFYWNoID0gZm9yRWFjaDtcbiAgfVxufVxuIiwidmFyICQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZXhwb3J0Jyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIHVzZXJBZ2VudCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy91c2VyLWFnZW50Jyk7XG5cbnZhciBzbGljZSA9IFtdLnNsaWNlO1xudmFyIE1TSUUgPSAvTVNJRSAuXFwuLy50ZXN0KHVzZXJBZ2VudCk7IC8vIDwtIGRpcnR5IGllOS0gY2hlY2tcblxudmFyIHdyYXAgPSBmdW5jdGlvbiAoc2NoZWR1bGVyKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoaGFuZGxlciwgdGltZW91dCAvKiAsIC4uLmFyZ3VtZW50cyAqLykge1xuICAgIHZhciBib3VuZEFyZ3MgPSBhcmd1bWVudHMubGVuZ3RoID4gMjtcbiAgICB2YXIgYXJncyA9IGJvdW5kQXJncyA/IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKSA6IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gc2NoZWR1bGVyKGJvdW5kQXJncyA/IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXctZnVuY1xuICAgICAgKHR5cGVvZiBoYW5kbGVyID09ICdmdW5jdGlvbicgPyBoYW5kbGVyIDogRnVuY3Rpb24oaGFuZGxlcikpLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH0gOiBoYW5kbGVyLCB0aW1lb3V0KTtcbiAgfTtcbn07XG5cbi8vIGllOS0gc2V0VGltZW91dCAmIHNldEludGVydmFsIGFkZGl0aW9uYWwgcGFyYW1ldGVycyBmaXhcbi8vIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL3RpbWVycy1hbmQtdXNlci1wcm9tcHRzLmh0bWwjdGltZXJzXG4kKHsgZ2xvYmFsOiB0cnVlLCBiaW5kOiB0cnVlLCBmb3JjZWQ6IE1TSUUgfSwge1xuICAvLyBgc2V0VGltZW91dGAgbWV0aG9kXG4gIC8vIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL3RpbWVycy1hbmQtdXNlci1wcm9tcHRzLmh0bWwjZG9tLXNldHRpbWVvdXRcbiAgc2V0VGltZW91dDogd3JhcChnbG9iYWwuc2V0VGltZW91dCksXG4gIC8vIGBzZXRJbnRlcnZhbGAgbWV0aG9kXG4gIC8vIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL3RpbWVycy1hbmQtdXNlci1wcm9tcHRzLmh0bWwjZG9tLXNldGludGVydmFsXG4gIHNldEludGVydmFsOiB3cmFwKGdsb2JhbC5zZXRJbnRlcnZhbClcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==