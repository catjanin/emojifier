<?php

namespace App\Service;

Class EmojiList
{
    public function getEmojis()
    {
        return json_decode(file_get_contents("../assets/json/emojis.json"), true);
    }

    public function searchEmojis($value)
    {
        $full = $this->getEmojis();

        $filterBy = $value;

        $result = array_filter($full, function ($e) use ($filterBy) {
            if(strpos($e['name'], $filterBy)) {
                return $e['char'];
            }
        });

        var_dump($result); die;
    }
}