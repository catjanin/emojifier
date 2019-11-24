<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Zone
 *
 * @ORM\Table(name="zone")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ZoneRepository")
 */
class Zone
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
     * @ORM\Column(name="name", type="string", length=30)
     */
    private $name;

    /**
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\GardenType", inversedBy="zones")
     * @ORM\JoinColumn(nullable=true)
     */
    private $gardenType;

    /**
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\ZoneType", inversedBy="zones", cascade={"remove"})
     * @ORM\JoinColumn(nullable=true)
     */
    private $zoneType;


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
     * @return Zone
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
     * Set gardenType
     *
     * @param \AppBundle\Entity\GardenType $gardenType
     *
     * @return Zone
     */
    public function setGardenType(\AppBundle\Entity\GardenType $gardenType = null)
    {
        $this->gardenType = $gardenType;

        return $this;
    }

    /**
     * Get gardenType
     *
     * @return \AppBundle\Entity\GardenType
     */
    public function getGardenType()
    {
        return $this->gardenType;
    }

    /**
     * Set zoneType
     *
     * @param \AppBundle\Entity\ZoneType $zoneType
     *
     * @return Zone
     */
    public function setZoneType(\AppBundle\Entity\ZoneType $zoneType = null)
    {
        $this->zoneType = $zoneType;

        return $this;
    }

    /**
     * Get zoneType
     *
     * @return \AppBundle\Entity\ZoneType
     */
    public function getZoneType()
    {
        return $this->zoneType;
    }
}
