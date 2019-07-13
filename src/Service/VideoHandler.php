<?php

namespace App\Service;

use App\Service\testGD;
use App\Service\ClosestColor;

Class VideoHandler
{
    public function getFrames(testGD $colorSampler, EmojiList $emojis)
    {
        $emojiToUse = [];
        $closestColor = new ClosestColor();
        //$src = 'video/frames/out-001.jpg';
        $emojiList = $emojis->getEmojis();
        $colorSampler->test(8, 'out-001.jpg');
        $imageColors = $colorSampler->getFullColors();

        $emojiColors = array_filter($emojiList, function($e){
            if (strlen($e) === 7 && $e[0] === "#") {
                return $e;
            }
        });

        foreach ($emojiColors as $key => $val) {
            $emojiColors[$key] = substr($val, 1);
        }

        foreach ($imageColors as $key => $val) {
            $imageColors[$key] = substr($val, 1);
        }

        foreach ($imageColors as $key => $val) {
            $closest = $closestColor->NearestColor($val, $emojiColors);
            $emojiToUse[] = $emojiList[array_search('#'.$closest, $emojiList)-1];
        }

        var_dump($emojiToUse);



        //var_dump($closest);

        //var_dump(count($emojiColors));
        //$image = imagecreatefromjpeg($src);
    }

}