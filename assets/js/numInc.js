
var $ = require('jquery');
var jQuery = $;

jQuery('<div class="quantity-nav"><div class="quantity-button quantity-up">+</div><div class="quantity-button quantity-down">-</div></div>').insertAfter('.quantity input');
jQuery('.quantity').each(function() {
    var spinner = jQuery(this),
        input = spinner.find('input[type="number"]'),
        btnUp = spinner.find('.quantity-up'),
        btnDown = spinner.find('.quantity-down'),
        min = input.attr('min'),
        max = input.attr('max');

    btnUp.click(function() {
        var oldValue = parseFloat(input.val());
        if (oldValue >= max) {
            var newVal = oldValue;
        } else {
            var newVal = oldValue + 1;
        }
        spinner.find("input").val(newVal);
        spinner.find("input").trigger("change");
    });

    btnDown.click(function() {
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

document.getElementById('sample_slider').addEventListener('input', (e) => {
    let value = document.getElementById('sample_slider').value;
    document.getElementById('sample_number').value = value;
});

document.getElementById('sample_number').addEventListener('input', (e) => {
    let value = document.getElementById('sample_number').value;
    if (value > 50){
        value = 50;
    } else if (value < 0){
        value = 0;
    }
    document.getElementById('sample_number').value = value;
    document.getElementById('sample_slider').value = value;
});