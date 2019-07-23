<?php

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraints\NotBlank;

class ChangePasswordFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('username', TextType::class, [
                'label' => false,
                'attr' => [
                    'placeholder' => 'Confirm your account',
                ],
                'constraints' => [new NotBlank(['message'=>'Please fill these fields'])]
            ])

            ->add('password', RepeatedType::class, [
                'type' => PasswordType::class,
                'invalid_message' => 'The passwords aren\'t identical',
                'options' => ['attr' => ['class' => 'mot de passe']],
                'required' =>true,
                'first_options' => ['label' => false, 'attr' => [
                    'placeholder' => 'New password',
                ],],
                'second_options' => ['label' => false,'attr' => [
                    'placeholder' => 'Repeat password',
                ],]
            ]);
    }
}
