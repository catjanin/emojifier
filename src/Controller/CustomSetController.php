<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use App\Service\EmojiList;

class CustomSetController extends AbstractController
{
    /**
     * @Route("/custom-set", name="customset")
     */
    public function index(EmojiList $emojis) :Response
    {

        return $this->render('customset/index.html.twig', [
            'emojis' => $emojis->getEmojis()
        ]);
    }

    /**
     * @Route("/searchEmojis", name="searchemojis")
     */
    public function search(Request $request, EmojiList $emojis) :Response
    {
        $post = json_decode($request->getContent('name'));

        return $emojis->searchEmojis($post[0]);
    }
}
