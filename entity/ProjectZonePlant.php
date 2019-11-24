<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * ProjectZonePlant
 *
 * @ORM\Table(name="project_zone_plant")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ProjectZonePlantRepository")
 */
class ProjectZonePlant
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
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Zone")
     */
    private $zone;

    /**
     * @var int
     *
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Plant")
     */
    private $plant;

    /**
     * @var int
     *
     * @ORM\Column(name="plant_quantity", type="integer")
     */
    private $plantQuantity;

    /**
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Project", inversedBy="projectZonePlants")
     * @ORM\JoinColumn(nullable=true)
     */
    private $project;


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
     * Set plantQuantity
     *
     * @param integer $plantQuantity
     *
     * @return ProjectZonePlant
     */
    public function setPlantQuantity($plantQuantity)
    {
        $this->plantQuantity = $plantQuantity;

        return $this;
    }

    /**
     * Get plantQuantity
     *
     * @return int
     */
    public function getPlantQuantity()
    {
        return $this->plantQuantity;
    }

    /**
     * Set project
     *
     * @param \AppBundle\Entity\Project $project
     *
     * @return ProjectZonePlant
     */
    public function setProject(\AppBundle\Entity\Project $project = null)
    {
        $this->project = $project;

        return $this;
    }

    /**
     * Get project
     *
     * @return \AppBundle\Entity\Project
     */
    public function getProject()
    {
        return $this->project;
    }

    /**
     * Set plant
     *
     * @param \AppBundle\Entity\Plant $plant
     *
     * @return ProjectZonePlant
     */
    public function setPlant(\AppBundle\Entity\Plant $plant = null)
    {
        $this->plant = $plant;

        return $this;
    }

    /**
     * Get plant
     *
     * @return \AppBundle\Entity\Plant
     */
    public function getPlant()
    {
        return $this->plant;
    }

    /**
     * Set zone
     *
     * @param \AppBundle\Entity\Zone $zone
     *
     * @return ProjectZonePlant
     */
    public function setZone(\AppBundle\Entity\Zone $zone = null)
    {
        $this->zone = $zone;

        return $this;
    }

    /**
     * Get zone
     *
     * @return \AppBundle\Entity\Zone
     */
    public function getZone()
    {
        return $this->zone;
    }
}
