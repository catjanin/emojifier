<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use App\Service\testGD;
use App\Service\EmojiList;
use App\Service\ClosestColor;

class MosaicRequestController extends AbstractController
{
    /**
     * @Route("/sendRequest", name="sendRequest")
     */
    public function index(Request $request)
    {

        //$post = json_decode($request->getContent('size'));
        $requiredSample = $_POST['size'];

        $file = $_FILES['image'];

        $arr_file_types = ['image/jpg', 'image/jpeg'];

        if (!(in_array($file['type'], $arr_file_types))) {
            echo "false";
            return 'lol';
        }

        if (!file_exists('uploads')) {
            mkdir('uploads', 0777);
        }

        move_uploaded_file($file['tmp_name'], 'uploads/' . $file['name']);


        return $this->requireEmojification($requiredSample, $file['name']);

    }

    public function requireEmojification($requiredSample, $fileName) :Response
    {
        $queryImg = new testGD();
        $emojis = new EmojiList();
        $closestColor = new ClosestColor();

        $image = [];
        $queryImg->test(intval($requiredSample), $fileName);
        $image['colors'] = $queryImg->getFullColors();
        $info = $queryImg->getFullInfo();
        $image['info'] = $info;


        $emojiToUse = [];
        $emojiList = $emojis->getEmojis();

        $emojiColors = array_filter($emojiList, function($e){
            if (strlen($e) === 7 && $e[0] === "#") {
                return $e;
            }
        });

        foreach ($emojiColors as $key => $val) {
            $emojiColors[$key] = substr($val, 1);
        }

        foreach ($image['colors'] as $key => $val) {
            $imageColors[$key] = substr($val, 1);
        }

        foreach ($image['colors'] as $key => $val) {
            $closest = $closestColor->NearestColor($val, $emojiColors);
            $emojiToUse[] = $emojiList[array_search('#'.$closest, $emojiList)-1];
        }

        var_dump($emojiToUse); die;

        $response = new Response(json_encode($image));
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }
}
