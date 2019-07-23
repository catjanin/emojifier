document.getElementById('form_search_emojis').addEventListener('input', () => {
    let value = document.getElementById('form_search_emojis').value.toLowerCase();
    sendRequest(value);
});

function sendRequest(value){
    fetch("/searchEmojis", {
        method: "POST",
        body: JSON.stringify([value]),
    })/*.then((response) => {
        return response.text();
    }).then((res) => {
        console.log(JSON.parse(res));
        emojiList =  JSON.parse(res);
    });*/

}