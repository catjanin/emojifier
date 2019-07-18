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
    imageUpload(name);
});

function imageUpload(name) {
console.log(name)
    fetch("/uploadImage", {
        method: "POST",
        body: name
    })/*.then((response) => {
        return response.text();
    }).then((res) => {
        console.log(JSON.parse(res));
    });*/
}

