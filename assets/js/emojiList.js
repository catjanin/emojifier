module.exports = function() {

    this.getEmojis = () => {

        const request = async () => {
            const response = await fetch('/getEmojis');
            const json = await response.json();
            console.log(json);
        };

        request();

    }
};

