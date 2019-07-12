console.log(emojiList);

document.getElementById('createImage').addEventListener('click', () => {
    sendRequest();
});

function sendRequest(){
    var xhr = new XMLHttpRequest();

    xhr.onload = function () {

        // Process our return data
        if (xhr.status >= 200 && xhr.status < 300) {
            // What do when the request is successful
            //console.log(JSON.parse(xhr.response))
            console.log(JSON.parse(xhr.response));
            getTheEmojis(JSON.parse(xhr.response))

        } else {
            // What do when the request fails
            console.log('The request failed!');
        }

        // Code that should run regardless of the request status
        console.log('This always runs...');
    };

    xhr.open('POST', '/sendRequest');
    xhr.send(null);
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