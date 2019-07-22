<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Image;

class MyUploadsController extends AbstractController
{
    /**
     * @Route("/my-uploads", name="myuploads")
     */
    public function index() :Response
    {

        $repository = $this->getDoctrine()->getRepository(Image::class);

        $persList = $repository->findBy([
            'author' => $this->getUser()->getUsername(),
        ]);

        return $this->render('myuploads/index.html.twig', [
            'images' => $persList
        ]);
    }
}
