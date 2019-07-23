document.getElementById('modal_show').addEventListener('click', () => {
    let image = new Image();
    let canvas = document.getElementById('lecanvas');
    image.id = "modal_image";
    image.classList.add('modal_upload_image');
    image.src = canvas.toDataURL();

    let imageWrapper = document.getElementById('modal_image_wrap');

    if(imageWrapper.childElementCount === 0){
        imageWrapper.appendChild(image);
    }else{
        while (imageWrapper.childNodes[0]) {
            imageWrapper.childNodes[0].remove();
        }
        imageWrapper.appendChild(image);
    }
});

document.getElementById('modal_upload_button').addEventListener('click', () => {
    let name = document.getElementById('image_upload_name').value;
    let dimension = document.getElementById('image_dimension').innerText;
    let emojiCount = document.getElementById('image_nbrEmojis').innerText;
    let canvas = document.getElementById('lecanvas');
    let canvasData = canvas.toDataURL("image/png");

    let categories = Array.from(document.getElementsByName('someRadio'));

    let category = '';

    categories.forEach((v) => {
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
        body: JSON.stringify({name: name, image: canvasData, dimension: dimension, emojiCount: emojiCount, category: category})
    })/*.then((response) => {
        return response.text();
    }).then((res) => {
        console.log(JSON.parse(res));
    });*/
}

