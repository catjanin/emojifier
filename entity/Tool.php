<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Advice
 *
 * @ORM\Table(name="advice")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\AdviceRepository")
 */
class Tool
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(name="name", type="string", length=45)
     */
    private $name;

    /**
     *  @ORM\ManyToMany(targetEntity="Advice", mappedBy="id")
     */
    private $advice_tool;


    /*
     * id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /*
     * name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }
}