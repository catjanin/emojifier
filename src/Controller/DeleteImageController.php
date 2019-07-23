<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Image;

class DeleteImageController extends AbstractController
{
    /**
     * @Route("/delete/{imageId}", name="deleteimage")
     */
    public function index($imageId) :Response
    {

        $entityManager = $this->getDoctrine()->getManager();

        $rep = $this->getDoctrine()->getRepository(Image::class);
        $image = $rep->findOneBy([
            'id' => $imageId
        ]);

        $entityManager->remove($image);
        $entityManager->flush();

        return $this->redirectToRoute('myuploads');
    }
}
