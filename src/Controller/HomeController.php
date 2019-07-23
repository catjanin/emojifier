<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\NumberType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

class HomeController extends AbstractController
{
    /**
     * @Route("/", name="home")
     */
    public function index() :Response
    {

        $form = $this->createFormBuilder()
            ->add('emoji_size', TextType::class, [
                'label'    => 'Emoji size',
                'required' => true,
                'attr'     => array(
                    'min'  => 2,
                    'max'  => 200,
                    'step' => 1,
                    'value' => 8
                ),
            ])
            ->add('algo_2', CheckboxType::class, [
                'label' => 'algo 2',
                'required' => false
            ])
            ->add('x4_samples', CheckboxType::class, [
                'label' => '5x samples',
                'required' => false
            ])
            ->getForm();

        return $this->render('home/index.html.twig', [
            'form' => $form->createView(),
        ]);
    }
}
