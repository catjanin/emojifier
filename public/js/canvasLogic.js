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

    drawStuff(corEmojis, imageInfo.info)
}

function drawStuff(corEmojis, info){
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    ctx.font = info.sampleSize + "px Arial";
    let x = 0;
    let y = 0;
    corEmojis.forEach((v, i)=>{
        if(i % info.height === 0){
            y = 0;
            x += info.sampleSize;
        }
        y += info.sampleSize;
        ctx.fillText(v, x, y);
    })

}