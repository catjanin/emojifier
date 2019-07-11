console.log(emojiList);

document.getElementById('createImage').addEventListener('click', ()=>{
    sendRequest();
});

function sendRequest(){
    var xhr = new XMLHttpRequest();

    xhr.onload = function () {

        // Process our return data
        if (xhr.status >= 200 && xhr.status < 300) {
            // What do when the request is successful
            console.log('success!', xhr);
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