<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use App\Service\testGD;
use App\Service\VideoHandler;
use App\Service\EmojiList;

class VideoConversionController extends AbstractController
{
    /**
     * @Route("/video", name="video")
     */
    public function index(testGD $frameProcessing, VideoHandler $videoHandler, EmojiList $emojis) :Response
    {
        $frameProcessing->test(intval(8), 'out-001.jpg');
        $imagePalette = $frameProcessing->getFullColors();
        $image['colors'] = $imagePalette;
        $info = $frameProcessing->getFullInfo();
        $image['info'] = $info;
        $videoHandler->getFrames($frameProcessing, $emojis);
        return $this->render('home/index.html.twig');
    }
}
