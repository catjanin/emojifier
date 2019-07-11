<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use App\Service\testGD;

class MosaicRequestController extends AbstractController
{
    /**
     * @Route("/sendRequest", name="sendRequest")
     */
    public function index(testGD $queryImg) :Response
    {
        $image = [];
        $queryImg->test();
        $image['colors'] = $queryImg->getFullColors();
        $info = $queryImg->getFullInfo();
        $image['info'] = $info;

        $response = new Response(json_encode($image));
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }
}
