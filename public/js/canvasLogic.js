Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(let i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

let drawnSamples;

document.getElementById('createImage').addEventListener('click', () => {
    let emojisize = document.getElementById('form_emoji_size').value;
    let image = document.getElementById('form_image_file').files[0];
    let algo2 = document.getElementById('form_algo_2');
    let drawnSamplesCheckbox = document.getElementById('form_x4_samples');
    let algo;

    let file = new FormData();
    file.append('image', image);
    file.append('size', emojisize);

    if(algo2.checked){
        file.append('algo', 'algo_2');
        algo = 2;
    }else{
        file.append('algo', 'algo_1');
        algo = 1;
    }

    if(drawnSamplesCheckbox.checked){
        drawnSamples = 'multi';
    }else{
        drawnSamples = 'one';
    }

    console.log(image);
    sendRequest(file, algo);
});

function sendRequest(file, algo){
    console.log(file);

    fetch("/sendRequest", {
        method: "POST",
        body: file
    }).then((response)=>{
        return response.text();
    }).then((res)=>{
        console.log(res);
        if(algo === 1){
            getTheEmojis(JSON.parse(res));
        }else{
            createCanvas(JSON.parse(res))
        }
    })

}

function getTheEmojis(imageInfo){
    let emojiColors = emojiList.filter(el => el.charAt(0) === '#' && el.length === 7 );
    let getColor = nearestColor.from(emojiColors);
    let corEmojis = [];

    imageInfo.colors.forEach((v)=>{
        let corespEmoji = emojiList[emojiList.indexOf(getColor(v))-1];
        corEmojis.push(corespEmoji);
    });

    createCanvas(imageInfo, corEmojis);
}

function createCanvas(imageInfo, corEmojis = null){
    console.log(imageInfo);

    let oldCanvas = document.getElementById('lecanvas')

    if (typeof(oldCanvas) != 'undefined' && oldCanvas != null)
    {
        document.getElementById("lecanvas").remove();
    }

    let canvas = document.createElement('canvas');

    canvas.id = "lecanvas";
    canvas.width = imageInfo.info.fullWidth;
    canvas.height = imageInfo.info.fullHeight;
    canvas.style.border = "1px solid";

    let body = document.getElementsByTagName("body")[0];
    body.appendChild(canvas);

    if(corEmojis === null){
        drawStuff(imageInfo)
    }else{
        drawStuff(imageInfo.info, corEmojis)
    }
}

function drawStuff(info, corEmojis = null){
    let canvas = document.getElementById("lecanvas");
    let ctx = canvas.getContext("2d");
    ctx.font = info.sampleSize + "px Arial";

    let drawEmojis;
    let imageInfo;

    if (corEmojis === null) {
        drawEmojis = info.emojis;
        imageInfo = info.info;
    } else {
        imageInfo = info;
        drawEmojis = corEmojis;
    }

    if (drawnSamples === 'multi') {
        for (let u = 0; u < 5; u++) {

            let offsetX = 0;
            let offsetY = 0;

            let x = 0;
            let y = 0;

            if (u === 0) offsetX = 1;
            if (u === 1) offsetX = -1;
            if (u === 2) offsetY = 1;
            if (u === 3) offsetY = -1;
            if (u === 4) {
                offsetY = 0;
                offsetX = 0;
            }

            draw(x, y, offsetX, offsetY)
        }
    }
    else if (drawnSamples === 'one') {

        let offsetX = 0;
        let offsetY = 0;
        let x = 0;
        let y = 0;
        draw(x, y, offsetX, offsetY)
    }

    function draw(x, y, offsetX, offsetY) {
        drawEmojis.forEach((v, i)=>{
            if(i % Number(imageInfo.height) === 0){
                y = offsetY;
                x += Number(imageInfo.sampleSize) + offsetX;
            }
            y += Number(imageInfo.sampleSize) + offsetX;
            ctx.fillText(v, x - Number(imageInfo.sampleSize) + offsetX, y + offsetY);
        })
    }
}