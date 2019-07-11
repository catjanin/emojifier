<?php

namespace App\Service;

class testGD
{

    public $fullColor = [];

    public function test()
    {
        $userSample = 7;
        $fullRGBarr = [];

        $image = imagecreatefromjpeg('slim-small-red.jpg');
        $imageSize = getimagesize('slim-small-red.jpg');
        $width = $imageSize[0]-1;

        $sampleSize = $this->roundSample($userSample, $width);

        for ($i = 0; $i < $width-1; $i += $sampleSize) {
            for ($j = 0; $j < $width-1; $j += $sampleSize) {
                $square = [];
                for ($k = $i; $k < $i + $sampleSize; $k++) {
                    for ($l = $j; $l < $j + $sampleSize; $l++) {
                        $square[] = $this->pickColor($image, $k, $l);
                    }
                }
                $fullRGBarr[] = $square;
            }
        }
        $this->convertToHex($fullRGBarr);
    }


    public function pickColor($image, $x, $y)
    {
        $rgb = imagecolorat($image, $x, $y);
        $colors = imagecolorsforindex($image, $rgb);

        return $colors;
    }

    public function roundSample($userSample, $width)
    {
        $trueSample = 0;
        for ($i = $userSample; $i < $width; $i++) {
            if (($width+1) % $i === 0) {
                $trueSample = $i;
                break;
            }
        }

        return $trueSample;
    }

    public function convertToHex($arr)
    {
        var_dump($arr);
        foreach($arr as $key => $rgb){

            $rgb['red'] = dechex($rgb['red']);
            if (strlen($rgb['red'])<2)
                $rgb['red'] = '0'.$rgb['red'];

            $rgb['green'] = dechex($rgb['green']);
            if (strlen($rgb['green'])<2)
                $rgb['green'] = '0'.$rgb['green'];

            $rgb['blue'] = dechex($rgb['blue']);
            if (strlen($rgb['blue'])<2)
                $rgb['blue'] = '0'.$rgb['blue'];

            $arr[$key] = '#' . $rgb['red'] . $rgb['green'] . $rgb['blue'];
        }

        var_dump($arr);
    }

    public function getFullColors()
    {
        return $this->fullColor;
    }

}