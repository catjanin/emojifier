<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * PlantSpecies
 *
 * @ORM\Table(name="plant_species")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\PlantSpeciesRepository")
 */
class PlantSpecies
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
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255)
     * @ORM\ManyToMany(targetEntity="Plant", inversedBy="species", cascade={"remove"})
     */
    private $name;

    /**
     * @var string
     *
     * @ORM\Column(name="translationKey", type="string", length=255)
     */
    private $translationKey;

    public function __toString()
    {
        return $this->getTranslationKey();
    }


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
     * @return PlantSpecies
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
     * Set translationKey.
     *
     * @param string $translationKey
     *
     * @return PlantSpecies
     */
    public function setTranslationKey($translationKey)
    {
        $this->translationKey = $translationKey;

        return $this;
    }

    /**
     * Get translationKey.
     *
     * @return string
     */
    public function getTranslationKey()
    {
        return $this->translationKey;
    }
}
