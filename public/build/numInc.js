(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["numInc"],{

/***/ "./assets/js/numInc.js":
/*!*****************************!*\
  !*** ./assets/js/numInc.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! core-js/modules/es.array.find */ "./node_modules/core-js/modules/es.array.find.js");

__webpack_require__(/*! core-js/modules/es.parse-float */ "./node_modules/core-js/modules/es.parse-float.js");

var $ = __webpack_require__(/*! jquery */ "./node_modules/jquery/dist/jquery.js");

var jQuery = $;
jQuery('<div class="quantity-nav"><div class="quantity-button quantity-up">+</div><div class="quantity-button quantity-down">-</div></div>').insertAfter('.quantity input');
jQuery('.quantity').each(function () {
  var spinner = jQuery(this),
      input = spinner.find('input[type="number"]'),
      btnUp = spinner.find('.quantity-up'),
      btnDown = spinner.find('.quantity-down'),
      min = input.attr('min'),
      max = input.attr('max');
  btnUp.click(function () {
    var oldValue = parseFloat(input.val());

    if (oldValue >= max) {
      var newVal = oldValue;
    } else {
      var newVal = oldValue + 1;
    }

    spinner.find("input").val(newVal);
    spinner.find("input").trigger("change");
  });
  btnDown.click(function () {
    var oldValue = parseFloat(input.val());

    if (oldValue <= min) {
      var newVal = oldValue;
    } else {
      var newVal = oldValue - 1;
    }

    spinner.find("input").val(newVal);
    spinner.find("input").trigger("change");
  });
});
document.getElementById('sample_slider').addEventListener('input', function (e) {
  var value = document.getElementById('sample_slider').value;
  document.getElementById('sample_number').value = value;
});
document.getElementById('sample_number').addEventListener('input', function (e) {
  var value = document.getElementById('sample_number').value;

  if (value > 50) {
    value = 50;
  } else if (value < 0) {
    value = 0;
  }

  document.getElementById('sample_number').value = value;
  document.getElementById('sample_slider').value = value;
});

/***/ })

},[["./assets/js/numInc.js","runtime","vendors~canvasLogic~emojiGet~emojiList~emojiSearch~gallerySearch~modalUpload~nearestColor~numInc","vendors~app~numInc","vendors~numInc"]]]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvanMvbnVtSW5jLmpzIl0sIm5hbWVzIjpbIiQiLCJyZXF1aXJlIiwialF1ZXJ5IiwiaW5zZXJ0QWZ0ZXIiLCJlYWNoIiwic3Bpbm5lciIsImlucHV0IiwiZmluZCIsImJ0blVwIiwiYnRuRG93biIsIm1pbiIsImF0dHIiLCJtYXgiLCJjbGljayIsIm9sZFZhbHVlIiwicGFyc2VGbG9hdCIsInZhbCIsIm5ld1ZhbCIsInRyaWdnZXIiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJ2YWx1ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUNBLElBQUlBLENBQUMsR0FBR0MsbUJBQU8sQ0FBQyxvREFBRCxDQUFmOztBQUNBLElBQUlDLE1BQU0sR0FBR0YsQ0FBYjtBQUVBRSxNQUFNLENBQUMsb0lBQUQsQ0FBTixDQUE2SUMsV0FBN0ksQ0FBeUosaUJBQXpKO0FBQ0FELE1BQU0sQ0FBQyxXQUFELENBQU4sQ0FBb0JFLElBQXBCLENBQXlCLFlBQVc7QUFDaEMsTUFBSUMsT0FBTyxHQUFHSCxNQUFNLENBQUMsSUFBRCxDQUFwQjtBQUFBLE1BQ0lJLEtBQUssR0FBR0QsT0FBTyxDQUFDRSxJQUFSLENBQWEsc0JBQWIsQ0FEWjtBQUFBLE1BRUlDLEtBQUssR0FBR0gsT0FBTyxDQUFDRSxJQUFSLENBQWEsY0FBYixDQUZaO0FBQUEsTUFHSUUsT0FBTyxHQUFHSixPQUFPLENBQUNFLElBQVIsQ0FBYSxnQkFBYixDQUhkO0FBQUEsTUFJSUcsR0FBRyxHQUFHSixLQUFLLENBQUNLLElBQU4sQ0FBVyxLQUFYLENBSlY7QUFBQSxNQUtJQyxHQUFHLEdBQUdOLEtBQUssQ0FBQ0ssSUFBTixDQUFXLEtBQVgsQ0FMVjtBQU9BSCxPQUFLLENBQUNLLEtBQU4sQ0FBWSxZQUFXO0FBQ25CLFFBQUlDLFFBQVEsR0FBR0MsVUFBVSxDQUFDVCxLQUFLLENBQUNVLEdBQU4sRUFBRCxDQUF6Qjs7QUFDQSxRQUFJRixRQUFRLElBQUlGLEdBQWhCLEVBQXFCO0FBQ2pCLFVBQUlLLE1BQU0sR0FBR0gsUUFBYjtBQUNILEtBRkQsTUFFTztBQUNILFVBQUlHLE1BQU0sR0FBR0gsUUFBUSxHQUFHLENBQXhCO0FBQ0g7O0FBQ0RULFdBQU8sQ0FBQ0UsSUFBUixDQUFhLE9BQWIsRUFBc0JTLEdBQXRCLENBQTBCQyxNQUExQjtBQUNBWixXQUFPLENBQUNFLElBQVIsQ0FBYSxPQUFiLEVBQXNCVyxPQUF0QixDQUE4QixRQUE5QjtBQUNILEdBVEQ7QUFXQVQsU0FBTyxDQUFDSSxLQUFSLENBQWMsWUFBVztBQUNyQixRQUFJQyxRQUFRLEdBQUdDLFVBQVUsQ0FBQ1QsS0FBSyxDQUFDVSxHQUFOLEVBQUQsQ0FBekI7O0FBQ0EsUUFBSUYsUUFBUSxJQUFJSixHQUFoQixFQUFxQjtBQUNqQixVQUFJTyxNQUFNLEdBQUdILFFBQWI7QUFDSCxLQUZELE1BRU87QUFDSCxVQUFJRyxNQUFNLEdBQUdILFFBQVEsR0FBRyxDQUF4QjtBQUNIOztBQUNEVCxXQUFPLENBQUNFLElBQVIsQ0FBYSxPQUFiLEVBQXNCUyxHQUF0QixDQUEwQkMsTUFBMUI7QUFDQVosV0FBTyxDQUFDRSxJQUFSLENBQWEsT0FBYixFQUFzQlcsT0FBdEIsQ0FBOEIsUUFBOUI7QUFDSCxHQVREO0FBV0gsQ0E5QkQ7QUFnQ0FDLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixlQUF4QixFQUF5Q0MsZ0JBQXpDLENBQTBELE9BQTFELEVBQW1FLFVBQUNDLENBQUQsRUFBTztBQUN0RSxNQUFJQyxLQUFLLEdBQUdKLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixlQUF4QixFQUF5Q0csS0FBckQ7QUFDQUosVUFBUSxDQUFDQyxjQUFULENBQXdCLGVBQXhCLEVBQXlDRyxLQUF6QyxHQUFpREEsS0FBakQ7QUFDSCxDQUhEO0FBS0FKLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixlQUF4QixFQUF5Q0MsZ0JBQXpDLENBQTBELE9BQTFELEVBQW1FLFVBQUNDLENBQUQsRUFBTztBQUN0RSxNQUFJQyxLQUFLLEdBQUdKLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixlQUF4QixFQUF5Q0csS0FBckQ7O0FBQ0EsTUFBSUEsS0FBSyxHQUFHLEVBQVosRUFBZTtBQUNYQSxTQUFLLEdBQUcsRUFBUjtBQUNILEdBRkQsTUFFTyxJQUFJQSxLQUFLLEdBQUcsQ0FBWixFQUFjO0FBQ2pCQSxTQUFLLEdBQUcsQ0FBUjtBQUNIOztBQUNESixVQUFRLENBQUNDLGNBQVQsQ0FBd0IsZUFBeEIsRUFBeUNHLEtBQXpDLEdBQWlEQSxLQUFqRDtBQUNBSixVQUFRLENBQUNDLGNBQVQsQ0FBd0IsZUFBeEIsRUFBeUNHLEtBQXpDLEdBQWlEQSxLQUFqRDtBQUNILENBVEQsRSIsImZpbGUiOiJudW1JbmMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxudmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcclxudmFyIGpRdWVyeSA9ICQ7XHJcblxyXG5qUXVlcnkoJzxkaXYgY2xhc3M9XCJxdWFudGl0eS1uYXZcIj48ZGl2IGNsYXNzPVwicXVhbnRpdHktYnV0dG9uIHF1YW50aXR5LXVwXCI+KzwvZGl2PjxkaXYgY2xhc3M9XCJxdWFudGl0eS1idXR0b24gcXVhbnRpdHktZG93blwiPi08L2Rpdj48L2Rpdj4nKS5pbnNlcnRBZnRlcignLnF1YW50aXR5IGlucHV0Jyk7XHJcbmpRdWVyeSgnLnF1YW50aXR5JykuZWFjaChmdW5jdGlvbigpIHtcclxuICAgIHZhciBzcGlubmVyID0galF1ZXJ5KHRoaXMpLFxyXG4gICAgICAgIGlucHV0ID0gc3Bpbm5lci5maW5kKCdpbnB1dFt0eXBlPVwibnVtYmVyXCJdJyksXHJcbiAgICAgICAgYnRuVXAgPSBzcGlubmVyLmZpbmQoJy5xdWFudGl0eS11cCcpLFxyXG4gICAgICAgIGJ0bkRvd24gPSBzcGlubmVyLmZpbmQoJy5xdWFudGl0eS1kb3duJyksXHJcbiAgICAgICAgbWluID0gaW5wdXQuYXR0cignbWluJyksXHJcbiAgICAgICAgbWF4ID0gaW5wdXQuYXR0cignbWF4Jyk7XHJcblxyXG4gICAgYnRuVXAuY2xpY2soZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIG9sZFZhbHVlID0gcGFyc2VGbG9hdChpbnB1dC52YWwoKSk7XHJcbiAgICAgICAgaWYgKG9sZFZhbHVlID49IG1heCkge1xyXG4gICAgICAgICAgICB2YXIgbmV3VmFsID0gb2xkVmFsdWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIG5ld1ZhbCA9IG9sZFZhbHVlICsgMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc3Bpbm5lci5maW5kKFwiaW5wdXRcIikudmFsKG5ld1ZhbCk7XHJcbiAgICAgICAgc3Bpbm5lci5maW5kKFwiaW5wdXRcIikudHJpZ2dlcihcImNoYW5nZVwiKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGJ0bkRvd24uY2xpY2soZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIG9sZFZhbHVlID0gcGFyc2VGbG9hdChpbnB1dC52YWwoKSk7XHJcbiAgICAgICAgaWYgKG9sZFZhbHVlIDw9IG1pbikge1xyXG4gICAgICAgICAgICB2YXIgbmV3VmFsID0gb2xkVmFsdWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyIG5ld1ZhbCA9IG9sZFZhbHVlIC0gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc3Bpbm5lci5maW5kKFwiaW5wdXRcIikudmFsKG5ld1ZhbCk7XHJcbiAgICAgICAgc3Bpbm5lci5maW5kKFwiaW5wdXRcIikudHJpZ2dlcihcImNoYW5nZVwiKTtcclxuICAgIH0pO1xyXG5cclxufSk7XHJcblxyXG5kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2FtcGxlX3NsaWRlcicpLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKGUpID0+IHtcclxuICAgIGxldCB2YWx1ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzYW1wbGVfc2xpZGVyJykudmFsdWU7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2FtcGxlX251bWJlcicpLnZhbHVlID0gdmFsdWU7XHJcbn0pO1xyXG5cclxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NhbXBsZV9udW1iZXInKS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChlKSA9PiB7XHJcbiAgICBsZXQgdmFsdWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2FtcGxlX251bWJlcicpLnZhbHVlO1xyXG4gICAgaWYgKHZhbHVlID4gNTApe1xyXG4gICAgICAgIHZhbHVlID0gNTA7XHJcbiAgICB9IGVsc2UgaWYgKHZhbHVlIDwgMCl7XHJcbiAgICAgICAgdmFsdWUgPSAwO1xyXG4gICAgfVxyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NhbXBsZV9udW1iZXInKS52YWx1ZSA9IHZhbHVlO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NhbXBsZV9zbGlkZXInKS52YWx1ZSA9IHZhbHVlO1xyXG59KTsiXSwic291cmNlUm9vdCI6IiJ9