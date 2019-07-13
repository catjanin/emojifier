Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

document.getElementById('createImage').addEventListener('click', () => {
    let emojisize = document.getElementById('form_emoji_size').value;
    let image = document.getElementById('form_image_file').files[0];

    let file = new FormData();
    file.append('image', image);
    file.append('size', emojisize);
    console.log(image);
    sendRequest(emojisize, file);
});

function sendRequest(emojisize, image){

    fetch("/sendRequest", {
        method: "POST",
        body: image
    }).then((response)=>{
        return response.text();
    }).then((text)=>{
        console.log(text);
        getTheEmojis(JSON.parse(text));
    }).catch((error)=>{
        console.log(error);
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

function createCanvas(imageInfo, corEmojis){

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

    drawStuff(corEmojis, imageInfo.info)
}

function drawStuff(corEmojis, info){
    var canvas = document.getElementById("lecanvas");
    var ctx = canvas.getContext("2d");
    ctx.font = info.sampleSize + "px Arial";
    let x = 0;
    let y = 0;
    corEmojis.forEach((v, i)=>{
        ctx.fillText(v, x-info.sampleSize, y);
        if(i % info.height === 0){
            y = 0;
            x += info.sampleSize;
        }
        y += info.sampleSize;
    })
}