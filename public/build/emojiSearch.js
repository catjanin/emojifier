(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["emojiSearch"],{

/***/ "./assets/js/emojiSearch.js":
/*!**********************************!*\
  !*** ./assets/js/emojiSearch.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! core-js/modules/es.object.to-string */ "./node_modules/core-js/modules/es.object.to-string.js");

__webpack_require__(/*! core-js/modules/es.promise */ "./node_modules/core-js/modules/es.promise.js");

document.getElementById('form_search_emojis').addEventListener('input', function () {
  var value = document.getElementById('form_search_emojis').value.toLowerCase();
  sendRequest(value);
});

function sendRequest(value) {
  fetch("/searchEmojis", {
    method: "POST",
    body: JSON.stringify([value])
  });
  /*.then((response) => {
    return response.text();
  }).then((res) => {
    console.log(JSON.parse(res));
    emojiList =  JSON.parse(res);
  });*/
}

/***/ })

},[["./assets/js/emojiSearch.js","runtime","vendors~canvasLogic~emojiGet~emojiList~emojiSearch~gallerySearch~modalUpload~nearestColor~numInc","vendors~canvasLogic~emojiList~emojiSearch~modalUpload"]]]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvanMvZW1vamlTZWFyY2guanMiXSwibmFtZXMiOlsiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJ2YWx1ZSIsInRvTG93ZXJDYXNlIiwic2VuZFJlcXVlc3QiLCJmZXRjaCIsIm1ldGhvZCIsImJvZHkiLCJKU09OIiwic3RyaW5naWZ5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUFBLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixvQkFBeEIsRUFBOENDLGdCQUE5QyxDQUErRCxPQUEvRCxFQUF3RSxZQUFNO0FBQzFFLE1BQUlDLEtBQUssR0FBR0gsUUFBUSxDQUFDQyxjQUFULENBQXdCLG9CQUF4QixFQUE4Q0UsS0FBOUMsQ0FBb0RDLFdBQXBELEVBQVo7QUFDQUMsYUFBVyxDQUFDRixLQUFELENBQVg7QUFDSCxDQUhEOztBQUtBLFNBQVNFLFdBQVQsQ0FBcUJGLEtBQXJCLEVBQTJCO0FBQ3ZCRyxPQUFLLENBQUMsZUFBRCxFQUFrQjtBQUNuQkMsVUFBTSxFQUFFLE1BRFc7QUFFbkJDLFFBQUksRUFBRUMsSUFBSSxDQUFDQyxTQUFMLENBQWUsQ0FBQ1AsS0FBRCxDQUFmO0FBRmEsR0FBbEIsQ0FBTDtBQUdFOzs7Ozs7QUFPTCxDIiwiZmlsZSI6ImVtb2ppU2VhcmNoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Zvcm1fc2VhcmNoX2Vtb2ppcycpLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKCkgPT4ge1xuICAgIGxldCB2YWx1ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmb3JtX3NlYXJjaF9lbW9qaXMnKS52YWx1ZS50b0xvd2VyQ2FzZSgpO1xuICAgIHNlbmRSZXF1ZXN0KHZhbHVlKTtcbn0pO1xuXG5mdW5jdGlvbiBzZW5kUmVxdWVzdCh2YWx1ZSl7XG4gICAgZmV0Y2goXCIvc2VhcmNoRW1vamlzXCIsIHtcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoW3ZhbHVlXSksXG4gICAgfSkvKi50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpO1xuICAgIH0pLnRoZW4oKHJlcykgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhKU09OLnBhcnNlKHJlcykpO1xuICAgICAgICBlbW9qaUxpc3QgPSAgSlNPTi5wYXJzZShyZXMpO1xuICAgIH0pOyovXG5cbn0iXSwic291cmNlUm9vdCI6IiJ9