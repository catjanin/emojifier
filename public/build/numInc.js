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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9hc3NldHMvanMvbnVtSW5jLmpzIl0sIm5hbWVzIjpbIiQiLCJyZXF1aXJlIiwialF1ZXJ5IiwiaW5zZXJ0QWZ0ZXIiLCJlYWNoIiwic3Bpbm5lciIsImlucHV0IiwiZmluZCIsImJ0blVwIiwiYnRuRG93biIsIm1pbiIsImF0dHIiLCJtYXgiLCJjbGljayIsIm9sZFZhbHVlIiwicGFyc2VGbG9hdCIsInZhbCIsIm5ld1ZhbCIsInRyaWdnZXIiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJ2YWx1ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUNBLElBQUlBLENBQUMsR0FBR0MsbUJBQU8sQ0FBQyxvREFBRCxDQUFmOztBQUNBLElBQUlDLE1BQU0sR0FBR0YsQ0FBYjtBQUVBRSxNQUFNLENBQUMsb0lBQUQsQ0FBTixDQUE2SUMsV0FBN0ksQ0FBeUosaUJBQXpKO0FBQ0FELE1BQU0sQ0FBQyxXQUFELENBQU4sQ0FBb0JFLElBQXBCLENBQXlCLFlBQVc7QUFDaEMsTUFBSUMsT0FBTyxHQUFHSCxNQUFNLENBQUMsSUFBRCxDQUFwQjtBQUFBLE1BQ0lJLEtBQUssR0FBR0QsT0FBTyxDQUFDRSxJQUFSLENBQWEsc0JBQWIsQ0FEWjtBQUFBLE1BRUlDLEtBQUssR0FBR0gsT0FBTyxDQUFDRSxJQUFSLENBQWEsY0FBYixDQUZaO0FBQUEsTUFHSUUsT0FBTyxHQUFHSixPQUFPLENBQUNFLElBQVIsQ0FBYSxnQkFBYixDQUhkO0FBQUEsTUFJSUcsR0FBRyxHQUFHSixLQUFLLENBQUNLLElBQU4sQ0FBVyxLQUFYLENBSlY7QUFBQSxNQUtJQyxHQUFHLEdBQUdOLEtBQUssQ0FBQ0ssSUFBTixDQUFXLEtBQVgsQ0FMVjtBQU9BSCxPQUFLLENBQUNLLEtBQU4sQ0FBWSxZQUFXO0FBQ25CLFFBQUlDLFFBQVEsR0FBR0MsVUFBVSxDQUFDVCxLQUFLLENBQUNVLEdBQU4sRUFBRCxDQUF6Qjs7QUFDQSxRQUFJRixRQUFRLElBQUlGLEdBQWhCLEVBQXFCO0FBQ2pCLFVBQUlLLE1BQU0sR0FBR0gsUUFBYjtBQUNILEtBRkQsTUFFTztBQUNILFVBQUlHLE1BQU0sR0FBR0gsUUFBUSxHQUFHLENBQXhCO0FBQ0g7O0FBQ0RULFdBQU8sQ0FBQ0UsSUFBUixDQUFhLE9BQWIsRUFBc0JTLEdBQXRCLENBQTBCQyxNQUExQjtBQUNBWixXQUFPLENBQUNFLElBQVIsQ0FBYSxPQUFiLEVBQXNCVyxPQUF0QixDQUE4QixRQUE5QjtBQUNILEdBVEQ7QUFXQVQsU0FBTyxDQUFDSSxLQUFSLENBQWMsWUFBVztBQUNyQixRQUFJQyxRQUFRLEdBQUdDLFVBQVUsQ0FBQ1QsS0FBSyxDQUFDVSxHQUFOLEVBQUQsQ0FBekI7O0FBQ0EsUUFBSUYsUUFBUSxJQUFJSixHQUFoQixFQUFxQjtBQUNqQixVQUFJTyxNQUFNLEdBQUdILFFBQWI7QUFDSCxLQUZELE1BRU87QUFDSCxVQUFJRyxNQUFNLEdBQUdILFFBQVEsR0FBRyxDQUF4QjtBQUNIOztBQUNEVCxXQUFPLENBQUNFLElBQVIsQ0FBYSxPQUFiLEVBQXNCUyxHQUF0QixDQUEwQkMsTUFBMUI7QUFDQVosV0FBTyxDQUFDRSxJQUFSLENBQWEsT0FBYixFQUFzQlcsT0FBdEIsQ0FBOEIsUUFBOUI7QUFDSCxHQVREO0FBV0gsQ0E5QkQ7QUFnQ0FDLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixlQUF4QixFQUF5Q0MsZ0JBQXpDLENBQTBELE9BQTFELEVBQW1FLFVBQUNDLENBQUQsRUFBTztBQUN0RSxNQUFJQyxLQUFLLEdBQUdKLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixlQUF4QixFQUF5Q0csS0FBckQ7QUFDQUosVUFBUSxDQUFDQyxjQUFULENBQXdCLGVBQXhCLEVBQXlDRyxLQUF6QyxHQUFpREEsS0FBakQ7QUFDSCxDQUhEO0FBS0FKLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixlQUF4QixFQUF5Q0MsZ0JBQXpDLENBQTBELE9BQTFELEVBQW1FLFVBQUNDLENBQUQsRUFBTztBQUN0RSxNQUFJQyxLQUFLLEdBQUdKLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixlQUF4QixFQUF5Q0csS0FBckQ7O0FBQ0EsTUFBSUEsS0FBSyxHQUFHLEVBQVosRUFBZTtBQUNYQSxTQUFLLEdBQUcsRUFBUjtBQUNILEdBRkQsTUFFTyxJQUFJQSxLQUFLLEdBQUcsQ0FBWixFQUFjO0FBQ2pCQSxTQUFLLEdBQUcsQ0FBUjtBQUNIOztBQUNESixVQUFRLENBQUNDLGNBQVQsQ0FBd0IsZUFBeEIsRUFBeUNHLEtBQXpDLEdBQWlEQSxLQUFqRDtBQUNBSixVQUFRLENBQUNDLGNBQVQsQ0FBd0IsZUFBeEIsRUFBeUNHLEtBQXpDLEdBQWlEQSxLQUFqRDtBQUNILENBVEQsRSIsImZpbGUiOiJudW1JbmMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XG52YXIgalF1ZXJ5ID0gJDtcblxualF1ZXJ5KCc8ZGl2IGNsYXNzPVwicXVhbnRpdHktbmF2XCI+PGRpdiBjbGFzcz1cInF1YW50aXR5LWJ1dHRvbiBxdWFudGl0eS11cFwiPis8L2Rpdj48ZGl2IGNsYXNzPVwicXVhbnRpdHktYnV0dG9uIHF1YW50aXR5LWRvd25cIj4tPC9kaXY+PC9kaXY+JykuaW5zZXJ0QWZ0ZXIoJy5xdWFudGl0eSBpbnB1dCcpO1xualF1ZXJ5KCcucXVhbnRpdHknKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgIHZhciBzcGlubmVyID0galF1ZXJ5KHRoaXMpLFxuICAgICAgICBpbnB1dCA9IHNwaW5uZXIuZmluZCgnaW5wdXRbdHlwZT1cIm51bWJlclwiXScpLFxuICAgICAgICBidG5VcCA9IHNwaW5uZXIuZmluZCgnLnF1YW50aXR5LXVwJyksXG4gICAgICAgIGJ0bkRvd24gPSBzcGlubmVyLmZpbmQoJy5xdWFudGl0eS1kb3duJyksXG4gICAgICAgIG1pbiA9IGlucHV0LmF0dHIoJ21pbicpLFxuICAgICAgICBtYXggPSBpbnB1dC5hdHRyKCdtYXgnKTtcblxuICAgIGJ0blVwLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgb2xkVmFsdWUgPSBwYXJzZUZsb2F0KGlucHV0LnZhbCgpKTtcbiAgICAgICAgaWYgKG9sZFZhbHVlID49IG1heCkge1xuICAgICAgICAgICAgdmFyIG5ld1ZhbCA9IG9sZFZhbHVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIG5ld1ZhbCA9IG9sZFZhbHVlICsgMTtcbiAgICAgICAgfVxuICAgICAgICBzcGlubmVyLmZpbmQoXCJpbnB1dFwiKS52YWwobmV3VmFsKTtcbiAgICAgICAgc3Bpbm5lci5maW5kKFwiaW5wdXRcIikudHJpZ2dlcihcImNoYW5nZVwiKTtcbiAgICB9KTtcblxuICAgIGJ0bkRvd24uY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBvbGRWYWx1ZSA9IHBhcnNlRmxvYXQoaW5wdXQudmFsKCkpO1xuICAgICAgICBpZiAob2xkVmFsdWUgPD0gbWluKSB7XG4gICAgICAgICAgICB2YXIgbmV3VmFsID0gb2xkVmFsdWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgbmV3VmFsID0gb2xkVmFsdWUgLSAxO1xuICAgICAgICB9XG4gICAgICAgIHNwaW5uZXIuZmluZChcImlucHV0XCIpLnZhbChuZXdWYWwpO1xuICAgICAgICBzcGlubmVyLmZpbmQoXCJpbnB1dFwiKS50cmlnZ2VyKFwiY2hhbmdlXCIpO1xuICAgIH0pO1xuXG59KTtcblxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NhbXBsZV9zbGlkZXInKS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChlKSA9PiB7XG4gICAgbGV0IHZhbHVlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NhbXBsZV9zbGlkZXInKS52YWx1ZTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2FtcGxlX251bWJlcicpLnZhbHVlID0gdmFsdWU7XG59KTtcblxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NhbXBsZV9udW1iZXInKS5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChlKSA9PiB7XG4gICAgbGV0IHZhbHVlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NhbXBsZV9udW1iZXInKS52YWx1ZTtcbiAgICBpZiAodmFsdWUgPiA1MCl7XG4gICAgICAgIHZhbHVlID0gNTA7XG4gICAgfSBlbHNlIGlmICh2YWx1ZSA8IDApe1xuICAgICAgICB2YWx1ZSA9IDA7XG4gICAgfVxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzYW1wbGVfbnVtYmVyJykudmFsdWUgPSB2YWx1ZTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2FtcGxlX3NsaWRlcicpLnZhbHVlID0gdmFsdWU7XG59KTsiXSwic291cmNlUm9vdCI6IiJ9