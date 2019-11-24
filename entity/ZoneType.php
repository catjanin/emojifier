<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * ZoneType
 *
 * @ORM\Table(name="zone_type")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ZoneTypeRepository")
 */
class ZoneType
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
     * @var \Doctrine\Common\Collections\Collection|Plant[]
     *
     * @ORM\ManyToMany(targetEntity="Plant", mappedBy="zoneTypes", cascade={"remove"})
     */
    protected $plants;

    /**
     * @ORM\OneToMany(targetEntity="AppBundle\Entity\Zone", mappedBy="zoneType")
     */
    private $zones;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=45)
     */
    private $name;

    /**
     * @var string
     *
     * @ORM\Column(name="group_zone", type="string", length=50, nullable=true)
     */
    private $groupZone;


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
     * @return ZoneType
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
     * Constructor
     */
    public function __construct()
    {
        $this->zones = new \Doctrine\Common\Collections\ArrayCollection();
    }

    /**
     * Add zone
     *
     * @param \AppBundle\Entity\Zone $zone
     *
     * @return ZoneType
     */
    public function addZone(\AppBundle\Entity\Zone $zone)
    {
        $this->zones[] = $zone;

        return $this;
    }

    /**
     * Remove zone
     *
     * @param \AppBundle\Entity\Zone $zone
     */
    public function removeZone(\AppBundle\Entity\Zone $zone)
    {
        $this->zones->removeElement($zone);
    }

    /**
     * Get zones
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getZones()
    {
        return $this->zones;
    }

    /**
     * Add plant
     *
     * @param \AppBundle\Entity\Plant $plant
     *
     * @return ZoneType
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


    /**
     * Set groupZone.
     *
     * @param string|null $groupZone
     *
     * @return ZoneType
     */
    public function setGroupZone($groupZone = null)
    {
        $this->groupZone = $groupZone;

        return $this;
    }

    /**
     * Get groupZone.
     *
     * @return string|null
     */
    public function getGroupZone()
    {
        return $this->groupZone;
    }
}
