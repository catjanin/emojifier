<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

class MosaicRequestController extends AbstractController
{
    /**
     * @Route("/sendRequest", name="sendRequest")
     */
    public function index() :Response
    {
        $response = new Response(json_encode(array(
            'titre' => 'rrr',
            'producteur' => 'eeee'
        )));
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }
}
