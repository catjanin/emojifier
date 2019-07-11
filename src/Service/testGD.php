<?php

namespace App\Service;

class testGD
{

    public $fullColor = [];

    public function test()
    {
        $userSample = 7;

        $image = imagecreatefromjpeg('slim-small-red.jpg');
        $imageSize = getimagesize('slim-small-red.jpg');
        $width = $imageSize[0]-1;
        $height = $imageSize[1]-1;

        $sampleSize = $this->roundSample($userSample, $width);

        $totalPixels = $width*$height;

        $yBlock = 0;
        $xBlock = 0;

        for ($i = 0; $i < $totalPixels/($sampleSize*$sampleSize); $i++) {

            $r = 0;
            $g = 0;
            $b = 0;

            $x = $xBlock;
            $y = $yBlock;

            $num = 0;

            for ($u = 0; $u < $sampleSize*$sampleSize; $u++) {

                $rgb = $this->pickColor($image, $x, $y);
                $r += $rgb['red'] * $rgb['red'];
                $g += $rgb['green'] * $rgb['green'];
                $b += $rgb['blue'] * $rgb['blue'];

                $x++;
                $num++;

                if ($x === $width) {
                    $rgb = $this->pickColor($image, $x, $y);
                    $r += $rgb['red'] * $rgb['red'];
                    $g += $rgb['green'] * $rgb['green'];
                    $b += $rgb['blue'] * $rgb['blue'];
                }

                if ($x % $sampleSize === 0) {
                    $y++;
                    $x = $xBlock;
                    if ($y % $sampleSize === 0) {
                        $xBlock += $sampleSize;
                    }
                }

                if ($y === $yBlock + $sampleSize-1 && $x === $width) {
                    $yBlock += $sampleSize;
                    $xBlock = 0;
                    break;
                }
            }
            $this->fullColor[] = ['r' => floor(sqrt($r/$num)), 'g' => floor(sqrt($g/$num)), 'b' => floor(sqrt($b/$num))];
        }

        return $this->fullColor;
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

    public function getFullColor()
    {
        return $this->fullColor;
    }

}