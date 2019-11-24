<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * PriorityPlant
 *
 * @ORM\Table(name="priority_plant")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\PriorityPlantRepository")
 */
class PriorityPlant
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
     * @var int
     *
     * @ORM\Column(name="priority", type="integer")
     */
    private $priority;

    /**
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Plant", inversedBy="priorities", cascade={"remove"})
     */
    private $plant;

    /**
    * @ORM\ManyToMany(targetEntity="GardenType", inversedBy="priorities")
    * @ORM\JoinTable(
    *  name="priority_plant_gardentype",
    *  joinColumns={
    *      @ORM\JoinColumn(name="priority_plant_id", referencedColumnName="id")
    *  },
    *  inverseJoinColumns={
    *      @ORM\JoinColumn(name="gardentype_id", referencedColumnName="id")
    *  }
    * )
     */
    protected $gardenTypes;


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
     * Set priority.
     *
     * @param int $priority
     *
     * @return PriorityPlant
     */
    public function setPriority($priority)
    {
        $this->priority = $priority;

        return $this;
    }

    /**
     * Get priority.
     *
     * @return int
     */
    public function getPriority()
    {
        return $this->priority;
    }

    /**
     * Set plant.
     *
     * @param \AppBundle\Entity\Plant|null $plant
     *
     * @return PriorityPlant
     */
    public function setPlant(\AppBundle\Entity\Plant $plant = null)
    {
        $this->plant = $plant;

        return $this;
    }

    /**
     * Get plant.
     *
     * @return \AppBundle\Entity\Plant|null
     */
    public function getPlant()
    {
        return $this->plant;
    }
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->gardenTypes = new \Doctrine\Common\Collections\ArrayCollection();
    }

    /**
     * Add gardenType.
     *
     * @param \AppBundle\Entity\GardenType $gardenType
     *
     * @return PriorityPlant
     */
    public function addGardenType(\AppBundle\Entity\GardenType $gardenType)
    {
        $this->gardenTypes[] = $gardenType;

        return $this;
    }

    /**
     * Remove gardenType.
     *
     * @param \AppBundle\Entity\GardenType $gardenType
     *
     * @return boolean TRUE if this collection contained the specified element, FALSE otherwise.
     */
    public function removeGardenType(\AppBundle\Entity\GardenType $gardenType)
    {
        return $this->gardenTypes->removeElement($gardenType);
    }

    /**
     * Get gardenTypes.
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getGardenTypes()
    {
        return $this->gardenTypes;
    }
}
