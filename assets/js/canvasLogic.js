Element.prototype.remove = function () {
    this.parentElement.removeChild(this);
};
NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
    for (let i = this.length - 1; i >= 0; i--) {
        if (this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
};


let drawnSamples;
let fileobj = null;
let emojiList = null;;

fetch("/getEmojis", {
    method: "GET",
}).then((response) => {
    return response.text();
}).then((res) => {
    console.log(JSON.parse(res));
    emojiList =  JSON.parse(res);
});


const nearestColor = require('./nearestColor');

startListeners();

function startListeners() {

    document.getElementById('drop_file_zone').addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    document.getElementById('drop_file_zone').addEventListener('dragstart', (e) => {
        e.preventDefault();
    });

    document.getElementById('drop_file_zone').addEventListener('drop', (event) => {
        upload_file(event);
    });

    document.getElementById('file_exp').addEventListener('click', () => {
        file_explorer();
        console.log('heyeyeye')
    });

    document.getElementById('dl_canvas').addEventListener('click', () => {
        dlImage();
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

document.getElementById('createImage').addEventListener('click', () => {

    addLoader();

    let image = fileobj;

    console.log(image);

    let emojisize = document.getElementById('form_emoji_size').value;
    let algo2 = document.getElementById('form_algo_2');
    let drawnSamplesCheckbox = document.getElementById('form_x4_samples');
    let algo;

    let file = new FormData();
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
    }).then((response) => {
        return response.text();
    }).then((res) => {
        if (algo === 1) {
            console.log(res);
            getTheEmojis(JSON.parse(res));
        } else {
            createCanvas(JSON.parse(res))
        }
    })
}

function getTheEmojis(imageInfo) {
    console.log(emojiList);
    let emojiColors = emojiList.map(n => n.hexColor);
    let getColor = nearestColor.from(emojiColors);
    let corEmojis = [];

    imageInfo.colors.forEach((v) => {
        let corespEmoji = emojiList[emojiList.map(n => n.hexColor).indexOf(getColor(v))].char;
        corEmojis.push(corespEmoji);
    });

    createCanvas(imageInfo, corEmojis);
}

function createCanvas(imageInfo, corEmojis = null) {
    console.log(imageInfo);

    let oldCanvas = document.getElementById('lecanvas');

    if (typeof (oldCanvas) != 'undefined' && oldCanvas != null) {
        document.getElementById("lecanvas").remove();
    }

    let dragDropZone = document.getElementById('drop_file_zone');
    let dragDropParent = dragDropZone.parentNode;

    if (dragDropParent.id !== "dragdrop_li") {
        document.getElementById('dragdrop_li').appendChild(dragDropZone);
        if (dragDropZone.classList.contains('dropZone')) {
            dragDropZone.classList.remove('dropZone');
            dragDropZone.classList.add('dropZone_side');
        }
    }

    let toolContainer = document.getElementById('toolContainer');
    if (toolContainer.classList.contains('height-94vh') && window.screen.availHeight < imageInfo.info.fullHeight) {
        toolContainer.classList.remove('height-94vh');

    } else if (window.screen.availHeight > imageInfo.info.fullHeight) {
        toolContainer.classList.add('height-94vh');
    }


    let canvas = document.createElement('canvas');

    canvas.id = "lecanvas";
    canvas.width = imageInfo.info.fullWidth;
    canvas.height = imageInfo.info.fullHeight;
    canvas.style.border = "1px solid";


    let canvasZone = document.getElementById('canvas_zone');

    if (imageInfo.info.fullWidth < canvasZone.offsetWidth) {
        canvas.classList.add('centered_canvas');
    }

    let canvasContainer = document.getElementById("canvas_container");
    canvasContainer.appendChild(canvas);
    canvasContainer.style.height = '94vh';

    if (corEmojis === null) {
        drawStuff(imageInfo);
    } else {
        drawStuff(imageInfo.info, corEmojis);
    }
}

function drawStuff(info, corEmojis = null) {
    let canvas = document.getElementById("lecanvas");
    let ctx = canvas.getContext("2d");

    let drawEmojis;
    let imageInfo;

    if (corEmojis === null) {
        drawEmojis = info.emojis;
        imageInfo = info.info;
    } else {
        imageInfo = info;
        drawEmojis = corEmojis;
    }

    imageInfo.nbrEmojis = Math.round((imageInfo.fullWidth * imageInfo.fullHeight) / (imageInfo.sampleSize * imageInfo.sampleSize));
    imageInfo.dimension = imageInfo.fullWidth + ' x ' + imageInfo.fullHeight;

    ctx.font = imageInfo.sampleSize + "px Arial"; //cool thing if .sampleSize is undefined (scale option ?) !
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, imageInfo.fullWidth, imageInfo.fullHeight);


    if (drawnSamples === 'multi') {

        imageInfo.nbrEmojis = imageInfo.nbrEmojis*5;

        let offsetValue = document.getElementById('sample_slider').value;
        console.log(offsetValue);

        for (let u = 0; u < 5; u++) {

            let offsetX = 0;
            let offsetY = 0;

            let x = 0;
            let y = 0;

            if (u === 0) offsetX = offsetValue;
            if (u === 1) offsetX = -offsetValue;
            if (u === 2) offsetY = offsetValue;
            if (u === 3) offsetY = -offsetValue;
            if (u === 4) {
                offsetY = 0;
                offsetX = 0;
            }

            draw(x, y, offsetX, offsetY)
        }
    } else if (drawnSamples === 'one') {
        console.log(info.sampleSize);

        let offsetX = 0;
        let offsetY = 0;
        let x = 0;
        let y = 0;
        draw(x, y, offsetX, offsetY)
    }

    function draw(x, y, offsetX, offsetY) {

        drawEmojis.forEach((v, i) => {
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
    let toolContainer = document.getElementById('toolContainer');
    let body = document.body;
    let html = document.documentElement;

    let heightMax = Math.max(body.scrollHeight, body.offsetHeight,
        html.clientHeight, html.scrollHeight, html.offsetHeight);

    toolContainer.style.height = (heightMax - 57) + 'px';
}

function dlImage() {
    document.getElementById('dl_canvas').href = document.getElementById('lecanvas').toDataURL('image/png');
}

function changeDragDropState() {

    let outerDragDrop = document.getElementById('drop_file_zone');
    let innerDragDrop = document.getElementById('drag_upload_file');

    outerDragDrop.classList.add('dropZone_ani_class');

    setTimeout(() => {
        outerDragDrop.classList.remove('dropZone_ani_class');
    }, 1000);

    if (fileobj !== null) {
        let elToRemoveDrag = document.getElementsByClassName('delete_me');

        while (elToRemoveDrag[0]) {
            elToRemoveDrag[0].remove();
        }

        innerDragDrop.firstElementChild.innerHTML += '<p class="delete_me mt-3">' + fileobj.name + '</p>';
    }
    startListeners();
}

function addLoader() {
    let loader = document.getElementById('load_');
    loader.style.display = "block";
}

function removeLoader() {
    let loader = document.getElementById('load_');
    loader.style.display = "none";
}
