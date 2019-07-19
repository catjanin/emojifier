<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Image;

class GalleryController extends AbstractController
{
    /**
     * @Route("/gallery", name="gallery")
     */
    public function index() :Response
    {

        $rep = $this->getDoctrine()->getRepository(Image::class);
        $images = $rep->findAll();

        return $this->render('gallery/index.html.twig', [
            'images' => $images
        ]);
    }
}
