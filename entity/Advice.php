<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Advice
 *
 * @ORM\Table(name="advice")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\AdviceRepository")
 */
class Advice
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
     * @ORM\OneToMany(targetEntity="AdviceHasPeriod", mappedBy="advice_id")
     */
    private $advice_period;

    /**
     *  @ORM\ManyToMany(targetEntity="Tool", mappedBy="id")
     */
    private $advice_tool;

    /**
     * @var \Doctrine\Common\Collections\Collection|Plant[]
     *
     * @ORM\ManyToMany(targetEntity="Plant", mappedBy="advices", cascade={"remove"})
     */
    protected $plants;

    /**
     * @var string
     *
     * @ORM\Column(name="content", type="text")
     */
    private $content;

    /**
     * @var string
     *
     * @ORM\Column(name="title", type="string", length=255)
     */
    private $title;

    /**
     * @ORM\Column(name="plant_minage", type="integer")
     */
    private $plant_minage;

    /**
     * @ORM\Column(name="plant_maxage", type="integer")
     */
    private $plant_maxage;

    /**
     * @ORM\Column(name="id_child_friendly", type="boolean")
     */
    private $is_child_friendly;

    /**
     * @ORM\Column(name="plant_id", type="integer")
     */
    private $plant_id;

    /**
     * @ORM\Column(name="garden_type", type="integer")
     */
    private $garden_type;


    /**
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set content
     *
     * @param string $content
     *
     * @return Advice
     */
    public function setContent($content)
    {
        $this->content = $content;

        return $this;
    }

    /**
     * Get title
     *
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set title
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * Get plant_minage
     *
     * @return int
     */
    public function getPlantMinage()
    {
        return $this->plant_minage;
    }

    /**
     * Set plant_minage
     */
    public function setPlantMinage($plant_minage)
    {
        $this->plant_minage = $plant_minage;

        return $this;
    }

    /**
     * Get plant_maxage
     *
     * @return int
     */
    public function getPlantMaxage()
    {
        return $this->plant_maxage;
    }

    /**
     * Set plant_maxage
     */
    public function setPlantMaxage($plant_maxage)
    {
        $this->plant_maxage = $plant_maxage;

        return $this;
    }

    /**
     * Get is_child_friendly
     *
     * @return bool
     */
    public function getIsChildFriendly()
    {
        return $this->is_child_friendly;
    }

    /**
     * Set is_child_friendly
     */
    public function setIsChildFriendly($is_child_friendly)
    {
        $this->is_child_friendly = $is_child_friendly;

        return $this;
    }

    /**
     * Get plant_id
     *
     * @return int
     */
    public function getPlantId()
    {
        return $this->plant_id;
    }

    /**
     * Set plant_id
     */
    public function setPlantId($plant_id)
    {
        $this->plant_id = $plant_id;

        return $this;
    }

    /**
     * Get garden_type
     *
     * @return int
     */
    public function getGardenType()
    {
        return $this->garden_type;
    }

    /**
     * Set garden_type
     */
    public function setGardenType($garden_type)
    {
        $this->garden_type = $garden_type;

        return $this;
    }

    /**
     * Get content
     *
     * @return string
     */
    public function getContent()
    {
        return $this->content;
    }
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->plants = new \Doctrine\Common\Collections\ArrayCollection();
    }

    /**
     * Add plant
     *
     * @param \AppBundle\Entity\Plant $plant
     *
     * @return Advice
     */
    public function addPlant(\AppBundle\Entity\Plant $plant)
    {
        $this->plants[] = $plant;

        return $this;
    }

    /**
     * Remove plant
     *
     * @param \AppBundle\Entity\Plant $plant
     */
    public function removePlant(\AppBundle\Entity\Plant $plant)
    {
        $this->plants->removeElement($plant);
    }

    /**
     * Get plants
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getPlants()
    {
        return $this->plants;
    }
}
