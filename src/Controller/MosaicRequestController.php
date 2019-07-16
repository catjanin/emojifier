<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use App\Service\testGD;
use App\Service\EmojiList;
use App\Service\EmojiListRGB;
use App\Service\ClosestColor;

class MosaicRequestController extends AbstractController
{
    /**
     * @Route("/sendRequest", name="sendRequest")
     */
    public function index()
    {

        //$post = json_decode($request->getContent('size'));
        $requiredSample = $_POST['size'];
        $requiredAlgo = $_POST['algo'];
        $file = $_FILES['image'];

        $arr_file_types = ['image/jpg', 'image/jpeg', 'image/png'];

        if (!(in_array($file['type'], $arr_file_types))) {
            return null;
        }

        if (!file_exists('uploads')) {
            mkdir('uploads', 0777);
        }

        move_uploaded_file($file['tmp_name'], 'uploads/' . $file['name']);

        return $this->requireEmojification($requiredSample, $file['name'], $requiredAlgo);

    }

    public function requireEmojification($requiredSample, $fileName, $requiredAlgo) :Response
    {
        $image = [];
        $emojis = new EmojiListRGB();
        $queryImg = new testGD();
        $closestColor = new ClosestColor();

        if($requiredAlgo === 'algo_1'){

            $queryImg->test(intval($requiredSample), $fileName);
            $image['colors'] = $queryImg->getFullColors();
            $info = $queryImg->getFullInfo();
            $image['info'] = $info;
        }

        if($requiredAlgo === 'algo_2') {

            $emojiToUse = [];
            $queryImg->test(intval($requiredSample), $fileName);
            $emojiList = $emojis->getEmojis();
            $imageColors = $queryImg->getFullColors();

            $emojiColors = array_filter($emojiList[0], function ($e) {
                if (!is_string($e)) {
                    return $e;
                }
            });

            foreach ($imageColors as $key => $val) {
                $closestIndex = $closestColor->NearestColor(substr($val, 1), $emojiColors);
                $emojiToUse[] = $emojiList[0][$closestIndex - 1];
            }

            $image['emojis'] = $emojiToUse;
            $info = $queryImg->getFullInfo();
            $image['info'] = $info;

        }

        $response = new Response(json_encode($image));
        $response->headers->set('Content-Type', 'application/json');

        return $response;

    }
}
