<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use App\Service\testGD;

class HomeController extends AbstractController
{
    /**
     * @Route("/", name="home")
     */
    public function index(testGD $queryImg) :Response
    {
        $image = $queryImg->test();
        return $this->render('home/index.html.twig', ['image' => $image]);
    }
}
