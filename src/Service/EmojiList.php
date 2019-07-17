<?php

namespace App\Service;

Class EmojiList
{
    public function getEmojis()
    {
        return json_decode(file_get_contents("../assets/json/emojis.json"), true);
    }
}