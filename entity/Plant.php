<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Plant
 *
 * @ORM\Table(name="plant")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\PlantRepository")
 */
class Plant
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
     * @var \Doctrine\Common\Collections\Collection|ZoneType[]
     *
     * @ORM\ManyToMany(targetEntity="ZoneType", inversedBy="plants", cascade={"remove"})
     * @ORM\JoinTable(
     *  name="plant_zonetype",
     *  joinColumns={
     *      @ORM\JoinColumn(name="plant_id", referencedColumnName="id")
     *  },
     *  inverseJoinColumns={
     *      @ORM\JoinColumn(name="zonetype_id", referencedColumnName="id")
     *  }
     * )
     */
    protected $zoneTypes;

    /**
     * @var \Doctrine\Common\Collections\Collection|Advice[]
     *
     * @ORM\ManyToMany(targetEntity="Advice", inversedBy="plants", cascade={"remove"})
     * @ORM\JoinTable(
     *  name="plant_advice",
     *  joinColumns={
     *      @ORM\JoinColumn(name="plant_id", referencedColumnName="id")
     *  },
     *  inverseJoinColumns={
     *      @ORM\JoinColumn(name="advice_id", referencedColumnName="id")
     *  }
     * )
     */
    protected $advices;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255)
     */
    private $name;

    /**
     * @var int
     *
     * @ORM\Column(name="diameter", type="integer")
     */
    private $diameter;

    /**
     * @var int
     *
     * @ORM\Column(name="height", type="integer")
     */
    private $height;

    /**
     * @var int
     *
     * @ORM\Column(name="exposure", type="integer", nullable=true)
     */
    private $exposure; // 0 = ombre / 1 = soleil / 2 = les deux

    /**
     * @var string
     *
     * @ORM\Column(name="path_picture", type="text")
     */
    private $pathPicture;

    /**
     * @var string
     *
     * @ORM\Column(name="path_watercolor_face", type="text")
     */
    private $pathWatercolorFace;

    /**
     * @var string
     *
     * @ORM\Column(name="path_watercolor_top", type="text")
     */
    private $pathWatercolorTop;

    /**
     * @var string
     *
     * @ORM\Column(name="path_watercolor_face_3_years", type="text", nullable=true)
     */
    private $pathWatercolorFace3Years;

    /**
     * @var string
     *
     * @ORM\Column(name="path_watercolor_face_5_years", type="text", nullable=true)
     */
    private $pathWatercolorFace5Years;

    /**
     * @var string
     *
     * @ORM\Column(name="price", type="decimal", precision=10, scale=2)
     */
    private $price;

    /**
     * @ORM\OneToMany(targetEntity="AppBundle\Entity\PriorityPlant", mappedBy="plant", cascade={"remove"})
     */
    private $priorities;

    /**
     * @var string
     *
     * @ORM\Column(name="explanations_hover", type="string")
     */
    private $explanationsHover;

    /**
     * @ORM\Column(type="string", nullable=true)
     * @ORM\OneToMany(targetEntity="PlantKind", mappedBy="name", cascade={"remove"})
     */
    private $type;

    /**
     * @ORM\Column(type="string", nullable=true)
     * @ORM\OneToMany(targetEntity="PlantSpecies", mappedBy="name", cascade={"remove"})
     */
    private $species;

    /**
     * @ORM\Column(type="string", nullable=true)
     * @ORM\OneToMany(targetEntity="PlantFamily", mappedBy="name", cascade={"all"})
     */
    private $family;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    private $nativeCountry;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $height3;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $height5;

    /**
     * @ORM\Column(name="frequency_of_watering", nullable=true)
     * @ORM\OneToMany(targetEntity="Frequency", mappedBy="name", cascade={"all"}, fetch="EAGER")
     */
    private $frequencyOfWatering;

    /**
     * @ORM\ManyToMany(targetEntity="Month", inversedBy="name", cascade={"all"}, fetch="EAGER")
     */
    private $bloomTime;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $minimalTemperature;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $idealTemperature;

    /**
     * @ORM\Column(type="integer", nullable=true)
     */
    private $maximalTemperature;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    private $careLevel;

    /**
     * @ORM\ManyToMany(targetEntity="Color", inversedBy="name", cascade={"all"}, fetch="EAGER")
     */
    private $colors;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    private $picture2D5YSpring;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    private $picture2D5YSummer;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    private $picture2D5YAutumn;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    private $picture2D5YWinter;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    private $picture2D3Y;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    private $picture2D1Y;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    private $picture3D5YSpring;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    private $picture3D5YSummer;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    private $picture3D5YAutumn;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    private $picture3D5YWinter;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    private $picture3D3Y;

    /**
     * @ORM\Column(type="string", nullable=true)
     */
    private $picture3D1Y;

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
     * Set name
     *
     * @param string $name
     *
     * @return Plant
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set diameter
     *
     * @param integer $diameter
     *
     * @return Plant
     */
    public function setDiameter($diameter)
    {
        $this->diameter = $diameter;

        return $this;
    }

    /**
     * Get diameter
     *
     * @return int
     */
    public function getDiameter()
    {
        return $this->diameter;
    }

    /**
     * Set height
     *
     * @param string $height
     *
     * @return Plant
     */
    public function setHeight($height)
    {
        $this->height = $height;

        return $this;
    }

    /**
     * Get height
     *
     * @return string
     */
    public function getHeight()
    {
        return $this->height;
    }

    /**
     * @return string
     */
    public function getExplanationsHover()
    {
        return $this->explanationsHover;
    }

    /**
     * @param string $explanationsHover
     */
    public function setExplanationsHover($explanationsHover)
    {
        $this->explanationsHover = $explanationsHover;
    }

    /**
     * Set exposure
     *
     * @param string $exposure
     *
     * @return Plant
     */
    public function setExposure($exposure)
    {
        $this->exposure = $exposure;

        return $this;
    }

    /**
     * Get exposure
     *
     * @return string
     */
    public function getExposure()
    {
        return $this->exposure;
    }

    /**
     * Set pathPicture
     *
     * @param string $pathPicture
     *
     * @return Plant
     */
    public function setPathPicture($pathPicture)
    {
        $this->pathPicture = $pathPicture;

        return $this;
    }

    /**
     * Get pathPicture
     *
     * @return string
     */
    public function getPathPicture()
    {
        return $this->pathPicture;
    }

    /**
     * Set pathWatercolorFace
     *
     * @param string $pathWatercolorFace
     *
     * @return Plant
     */
    public function setPathWatercolorFace($pathWatercolorFace)
    {
        $this->pathWatercolorFace = $pathWatercolorFace;

        return $this;
    }

    /**
     * Get pathWatercolorFace
     *
     * @return string
     */
    public function getPathWatercolorFace()
    {
        return $this->pathWatercolorFace;
    }

    /**
     * Set pathWatercolorTop
     *
     * @param string $pathWatercolorTop
     *
     * @return Plant
     */
    public function setPathWatercolorTop($pathWatercolorTop)
    {
        $this->pathWatercolorTop = $pathWatercolorTop;

        return $this;
    }

    /**
     * Get pathWatercolorTop
     *
     * @return string
     */
    public function getPathWatercolorTop()
    {
        return $this->pathWatercolorTop;
    }
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->zoneTypes = new \Doctrine\Common\Collections\ArrayCollection();
        $this->bloomTime = new \Doctrine\Common\Collections\ArrayCollection();
        $this->colors = new \Doctrine\Common\Collections\ArrayCollection();
    }

    /**
     * Add zoneType
     *
     * @param \AppBundle\Entity\ZoneType $zoneType
     *
     * @return Plant
     */
    public function addZoneType(\AppBundle\Entity\ZoneType $zoneType)
    {
        $this->zoneTypes[] = $zoneType;

        return $this;
    }

    /**
     * Remove zoneType
     *
     * @param \AppBundle\Entity\ZoneType $zoneType
     */
    public function removeZoneType(\AppBundle\Entity\ZoneType $zoneType)
    {
        $this->zoneTypes->removeElement($zoneType);
    }

    /**
     * Get zoneTypes
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getZoneTypes()
    {
        return $this->zoneTypes;
    }

    /**
     * Add advice
     *
     * @param \AppBundle\Entity\Advice $advice
     *
     * @return Plant
     */
    public function addAdvice(\AppBundle\Entity\Advice $advice)
    {
        $this->advices[] = $advice;

        return $this;
    }

    /**
     * Remove advice
     *
     * @param \AppBundle\Entity\Advice $advice
     */
    public function removeAdvice(\AppBundle\Entity\Advice $advice)
    {
        $this->advices->removeElement($advice);
    }

    /**
     * Get advices
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getAdvices()
    {
        return $this->advices;
    }

    /**
     * Set price.
     *
     * @param string $price
     *
     * @return Plant
     */
    public function setPrice($price)
    {
        $this->price = $price;

        return $this;
    }

    /**
     * Get price.
     *
     * @return string
     */
    public function getPrice()
    {
        return $this->price;
    }

    /**
     * Add priority.
     *
     * @param \AppBundle\Entity\PriorityPlant $priority
     *
     * @return Plant
     */
    public function addPriority(\AppBundle\Entity\PriorityPlant $priority)
    {
        $this->priorities[] = $priority;

        return $this;
    }

    /**
     * Remove priority.
     *
     * @param \AppBundle\Entity\PriorityPlant $priority
     *
     * @return boolean TRUE if this collection contained the specified element, FALSE otherwise.
     */
    public function removePriority(\AppBundle\Entity\PriorityPlant $priority)
    {
        return $this->priorities->removeElement($priority);
    }

    /**
     * Get priorities.
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getPriorities()
    {
        return $this->priorities;
    }

    /**
     * @return mixed
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * @param mixed $type
     */
    public function setType($type)
    {
        $this->type = $type;
    }

    /**
     * @return mixed
     */
    public function getSpecies()
    {
        return $this->species;
    }

    /**
     * @param mixed $species
     */
    public function setSpecies($species)
    {
        $this->species = $species;
    }

    /**
     * @return mixed
     */
    public function getFamily()
    {
        return $this->family;
    }

    /**
     * @param mixed $family
     */
    public function setFamily($family)
    {
        $this->family = $family;
    }

    /**
     * @return mixed
     */
    public function getNativeCountry()
    {
        return $this->nativeCountry;
    }

    /**
     * @param mixed $nativeCountry
     */
    public function setNativeCountry($nativeCountry)
    {
        $this->nativeCountry = $nativeCountry;
    }

    /**
     * @return mixed
     */
    public function getHeight3()
    {
        return $this->height3;
    }

    /**
     * @param mixed $height3
     */
    public function setHeight3($height3)
    {
        $this->height3 = $height3;
    }

    /**
     * @return mixed
     */
    public function getHeight5()
    {
        return $this->height5;
    }

    /**
     * @param mixed $height5
     */
    public function setHeight5($height5)
    {
        $this->height5 = $height5;
    }


    /**
     * @return mixed
     */
    public function getFrequencyOfWatering()
    {
        return $this->frequencyOfWatering;
    }

    /**
     * @param mixed $frequencyOfWatering
     */
    public function setFrequencyOfWatering($frequencyOfWatering)
    {
        $this->frequencyOfWatering = $frequencyOfWatering;
    }

    /**
     * @return mixed
     */
    public function getBloomTime()
    {
        return $this->bloomTime;
    }

    /**
     * @param mixed $bloomTime
     */
    public function setBloomTime($bloomTime)
    {
        $this->bloomTime = $bloomTime;
    }

    /**
     * @return mixed
     */
    public function getMinimalTemperature()
    {
        return $this->minimalTemperature;
    }

    /**
     * @param mixed $minimalTemperature
     */
    public function setMinimalTemperature($minimalTemperature)
    {
        $this->minimalTemperature = $minimalTemperature;
    }

    /**
     * @return mixed
     */
    public function getIdealTemperature()
    {
        return $this->idealTemperature;
    }

    /**
     * @param mixed $idealTemperature
     */
    public function setIdealTemperature($idealTemperature)
    {
        $this->idealTemperature = $idealTemperature;
    }

    /**
     * @return mixed
     */
    public function getMaximalTemperature()
    {
        return $this->maximalTemperature;
    }

    /**
     * @param mixed $maximalTemperature
     */
    public function setMaximalTemperature($maximalTemperature)
    {
        $this->maximalTemperature = $maximalTemperature;
    }

    /**
     * @return mixed
     */
    public function getCareLevel()
    {
        return $this->careLevel;
    }

    /**
     * @param mixed $careLevel
     */
    public function setCareLevel($careLevel)
    {
        $this->careLevel = $careLevel;
    }

    /**
     * @return mixed
     */
    public function getColors()
    {
        return $this->colors;
    }

    /**
     * @param mixed $colors
     */
    public function setColors($colors)
    {
        $this->colors = $colors;
    }

    /**
     * @return string
     */
    public function getPathWatercolorFace3Years()
    {
        return $this->pathWatercolorFace3Years;
    }

    /**
     * @param string $pathWatercolorFace3Years
     */
    public function setPathWatercolorFace3Years($pathWatercolorFace3Years)
    {
        $this->pathWatercolorFace3Years = $pathWatercolorFace3Years;
    }

    /**
     * @return string
     */
    public function getPathWatercolorFace5Years()
    {
        return $this->pathWatercolorFace5Years;
    }

    /**
     * @param string $pathWatercolorFace5Years
     */
    public function setPathWatercolorFace5Years($pathWatercolorFace5Years)
    {
        $this->pathWatercolorFace5Years = $pathWatercolorFace5Years;
    }

    /**
     * @return mixed
     */
    public function getPicture2D5YSpring()
    {
        return $this->picture2D5YSpring;
    }

    /**
     * @param mixed $picture2D5YSpring
     */
    public function setPicture2D5YSpring($picture2D5YSpring)
    {
        $this->picture2D5YSpring = $picture2D5YSpring;
    }

    /**
     * @return mixed
     */
    public function getPicture2D5YSummer()
    {
        return $this->picture2D5YSummer;
    }

    /**
     * @param mixed $picture2D5YSummer
     */
    public function setPicture2D5YSummer($picture2D5YSummer)
    {
        $this->picture2D5YSummer = $picture2D5YSummer;
    }

    /**
     * @return mixed
     */
    public function getPicture2D5YAutumn()
    {
        return $this->picture2D5YAutumn;
    }

    /**
     * @param mixed $picture2D5YAutumn
     */
    public function setPicture2D5YAutumn($picture2D5YAutumn)
    {
        $this->picture2D5YAutumn = $picture2D5YAutumn;
    }

    /**
     * @return mixed
     */
    public function getPicture2D5YWinter()
    {
        return $this->picture2D5YWinter;
    }

    /**
     * @param mixed $picture2D5YWinter
     */
    public function setPicture2D5YWinter($picture2D5YWinter)
    {
        $this->picture2D5YWinter = $picture2D5YWinter;
    }

    /**
     * @return mixed
     */
    public function getPicture2D3Y()
    {
        return $this->picture2D3Y;
    }

    /**
     * @param mixed $picture2D3Y
     */
    public function setPicture2D3Y($picture2D3Y)
    {
        $this->picture2D3Y = $picture2D3Y;
    }

    /**
     * @return mixed
     */
    public function getPicture2D1Y()
    {
        return $this->picture2D1Y;
    }

    /**
     * @param mixed $picture2D1Y
     */
    public function setPicture2D1Y($picture2D1Y)
    {
        $this->picture2D1Y = $picture2D1Y;
    }

    /**
     * @return mixed
     */
    public function getPicture3D5YSpring()
    {
        return $this->picture3D5YSpring;
    }

    /**
     * @param mixed $picture3D5YSpring
     */
    public function setPicture3D5YSpring($picture3D5YSpring)
    {
        $this->picture3D5YSpring = $picture3D5YSpring;
    }

    /**
     * @return mixed
     */
    public function getPicture3D5YSummer()
    {
        return $this->picture3D5YSummer;
    }

    /**
     * @param mixed $picture3D5YSummer
     */
    public function setPicture3D5YSummer($picture3D5YSummer)
    {
        $this->picture3D5YSummer = $picture3D5YSummer;
    }

    /**
     * @return mixed
     */
    public function getPicture3D5YAutumn()
    {
        return $this->picture3D5YAutumn;
    }

    /**
     * @param mixed $picture3D5YAutumn
     */
    public function setPicture3D5YAutumn($picture3D5YAutumn)
    {
        $this->picture3D5YAutumn = $picture3D5YAutumn;
    }

    /**
     * @return mixed
     */
    public function getPicture3D5YWinter()
    {
        return $this->picture3D5YWinter;
    }

    /**
     * @param mixed $picture3D5YWinter
     */
    public function setPicture3D5YWinter($picture3D5YWinter)
    {
        $this->picture3D5YWinter = $picture3D5YWinter;
    }

    /**
     * @return mixed
     */
    public function getPicture3D3Y()
    {
        return $this->picture3D3Y;
    }

    /**
     * @param mixed $picture3D3Y
     */
    public function setPicture3D3Y($picture3D3Y)
    {
        $this->picture3D3Y = $picture3D3Y;
    }

    /**
     * @return mixed
     */
    public function getPicture3D1Y()
    {
        return $this->picture3D1Y;
    }

    /**
     * @param mixed $picture3D1Y
     */
    public function setPicture3D1Y($picture3D1Y)
    {
        $this->picture3D1Y = $picture3D1Y;
    }
}
