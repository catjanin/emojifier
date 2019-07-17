<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

class GetEmojisController extends AbstractController
{
    /**
     * @Route("/getEmojis", name="emojisListRequest")
     */
    public function index() :Response
    {
        $strJsonFileContents = file_get_contents("../assets/json/emojis.json");

        $response = new Response($strJsonFileContents);
        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }
}
