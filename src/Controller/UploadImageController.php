<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Image;
use App\Entity\LastUpload;

class UploadImageController extends AbstractController
{
    /**
     * @Route("/uploadImage", name="upload-image")
     */
    public function index(Request $request)
    {
        $imagePost = json_decode($request->getContent('data'), true);
        $commonName = $imagePost['name'];

        $repository = $this->getDoctrine()->getRepository(LastUpload::class);
        // look for a single Product by its primary key (usually "id")

        $imageData = $repository->findOneBy([
            'userId' => $this->getUser()->getId(),
        ]);

        $img = str_replace('data:image/png;base64,', '', $imagePost['image']);
        $img = str_replace(' ', '+', $img);
        $fileData = base64_decode($img);

        $fileName = $imageData->name . '.png';
        file_put_contents('convert-uploads/'.$fileName, $fileData);

        return $this->insertInDatabase($fileName, $commonName);

    }

    public function insertInDatabase($fileName, $commonName) {

        $entityManager = $this->getDoctrine()->getManager();

        $image = new Image();
        $image->setName($fileName);
        $image->setCommonName($commonName);
        $image->setUserId($this->getUser()->getId());
        $image->setAuthor($this->getUser()->getUsername());

        $entityManager->persist($image);

        $entityManager->flush();


        $repository = $this->getDoctrine()->getRepository(LastUpload::class);

        $deleteLastImage = $repository->findOneBy([
            'userId' => $this->getUser()->getId(),
        ]);
        $entityManager->remove($deleteLastImage);
        $entityManager->flush();

        return new Response('Saved new product with id '.$image->getId());

    }
}
