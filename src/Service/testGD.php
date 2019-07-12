<?php

namespace App\Service;

class testGD
{

    public $fullColor = [];
    public $fullInfo = [];

    public function test()
    {
        $userSample = 40;
        $fullRGBarr = [];

        $src = 'l.jpg';
        $image = imagecreatefromjpeg($src);
        $imageSize = getimagesize($src);
        $width = $imageSize[0]-1;
        $height = $imageSize[1]-1;
        $sampleSize = $this->roundSample($userSample, $width);

        $this->fullInfo['width'] = round($width/$sampleSize);
        $this->fullInfo['height'] = round($height/$sampleSize);
        $this->fullInfo['fullWidth'] = $width;
        $this->fullInfo['fullHeight'] = $height;
        $this->fullInfo['sampleSize'] = $sampleSize;

        for ($i = 0; $i < $width; $i += $sampleSize) {
            for ($j = 0; $j < $height; $j += $sampleSize) {
                $num = 0;
                $r = 0;
                $g = 0;
                $b = 0;
                for ($k = $i; $k < $i + $sampleSize; $k++) {
                    for ($l = $j; $l < $j + $sampleSize; $l++) {
                        if($k < $width && $l < $height){
                            $rgb = $this->pickColor($image, $k, $l);
                            $r += $rgb['red'] * $rgb['red'];
                            $g += $rgb['green'] * $rgb['green'];
                            $b += $rgb['blue'] * $rgb['blue'];
                            $num++;
                        }
                    }
                }
                if($num > 0){
                    $fullRGBarr[] = ['red' => round(sqrt($r/$num)), 'green' => round(sqrt($g/$num)), 'blue' => round(sqrt($b/$num))];
                }
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

        $this->fullColor = $arr;
    }

    public function getFullColors()
    {
        return $this->fullColor;
    }

    public function getFullInfo()
    {
        return $this->fullInfo;
    }

}