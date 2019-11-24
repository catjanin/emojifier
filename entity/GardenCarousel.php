<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * GardenCarousel
 *
 * @ORM\Table(name="garden_carousel")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\GardenCarouselRepository")
 */
class GardenCarousel
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
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\GardenType", inversedBy="gardenCarousels")
     * @ORM\JoinColumn(nullable=true)
     */
    private $gardenType;

    /**
     * @var string
     *
     * @ORM\Column(name="pathPicture", type="string", length=255)
     */
    private $pathPicture;

    /**
     * @var string
     *
     * @ORM\Column(name="hover_description", type="string", nullable=true)
     */
    private $hoverDescription;

    /**
     * @var string
     *
     * @ORM\Column(name="alt_description", type="string", nullable=true)
     */
    private $altDescription;

    /**
     * @var boolean
     *
     * @ORM\Column(name="is_carousel", type="boolean")
     */
    private $isCarousel;

    /**
     * @var boolean
     *
     * @ORM\Column(name="is_theme", type="boolean")
     */
    private $isTheme;


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
     * Set pathPicture.
     *
     * @param string $pathPicture
     *
     * @return GardenCarousel
     */
    public function setPathPicture($pathPicture)
    {
        $this->pathPicture = $pathPicture;

        return $this;
    }

    /**
     * Get pathPicture.
     *
     * @return string
     */
    public function getPathPicture()
    {
        return $this->pathPicture;
    }

    /**
     * @return bool
     */
    public function getIsCarousel()
    {
        return $this->isCarousel;
    }

    /**
     * @param bool $isCarousel
     */
    public function setIsCarousel($isCarousel)
    {
        $this->isCarousel = $isCarousel;
    }

    /**
     * @return string
     */
    public function getAltDescription()
    {
        return $this->altDescription;
    }

    /**
     * @param string $altDescription
     */
    public function setAltDescription($altDescription)
    {
        $this->altDescription = $altDescription;
    }

    /**
     * @return string
     */
    public function getHoverDescription()
    {
        return $this->hoverDescription;
    }

    /**
     * @param string $hoverDescription
     */
    public function setHoverDescription($hoverDescription)
    {
        $this->hoverDescription = $hoverDescription;
    }

    /**
     * Set gardenType.
     *
     * @param \AppBundle\Entity\GardenType|null $gardenType
     *
     * @return GardenCarousel
     */
    public function setGardenType(\AppBundle\Entity\GardenType $gardenType = null)
    {
        $this->gardenType = $gardenType;

        return $this;
    }

    /**
     * Get gardenType.
     *
     * @return \AppBundle\Entity\GardenType|null
     */
    public function getGardenType()
    {
        return $this->gardenType;
    }

    /**
     * Set isTheme.
     *
     * @param bool $isTheme
     *
     * @return GardenCarousel
     */
    public function setIsTheme($isTheme)
    {
        $this->isTheme = $isTheme;

        return $this;
    }

    /**
     * Get isTheme.
     *
     * @return bool
     */
    public function getIsTheme()
    {
        return $this->isTheme;
    }
}
