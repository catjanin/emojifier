<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Month
 *
 * @ORM\Table(name="month")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\MonthRepository")
 *
 */
class Month
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
     * @ORM\Column(name="name", type="string", length=40)
     * @ORM\ManyToMany(targetEntity="Plant", mappedBy="bloomTime", cascade={"remove"})
     */
    private $name;

    /**
     * @Orm\Column(name="translation_key", type="string", length=255)
     */
    private $translationKey;


    /**
     * Get id.
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set name.
     *
     * @param string $name
     *
     * @return Month
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name.
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @return mixed
     */
    public function getTranslationKey()
    {
        return $this->translationKey;
    }

    /**
     * @param mixed $translationKey
     */
    public function setTranslationKey($translationKey)
    {
        $this->translationKey = $translationKey;
    }


}
