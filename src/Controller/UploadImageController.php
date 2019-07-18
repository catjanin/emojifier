<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

class UploadImageController extends AbstractController
{
    /**
     * @Route("/uploadImage", name="upload-image")
     */
    public function index(Request $request)
    {
        $post = $request->getContent('name');

        //return $this->render('home/index.html.twig');
    }
}
