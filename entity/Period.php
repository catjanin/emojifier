<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Period
 *
 * @ORM\Table(name="period")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\PeriodRepository")
 */
class Period
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
     * @ORM\Column(name="start_at", type="string", length=45)
     */
    private $start_at;

    /**
     * @ORM\Column(name="end_at", type="string", length=45)
     */
    private $end_at;

    /**
     * @ORM\OneToMany(targetEntity="adviceHasPeriod", mappedBy="period_id")
     */
    private $advice_period;

    /*
     * id
     */
    public function getId()
    {
        return $this->id;
    }

    /*
     * start_at
     */
    public function getStartAt()
    {
        return $this->start_at;
    }

    public function setStartAt($start_at)
    {
        $this->start_at = $start_at;

        return $this;
    }


    /*
     * end_at
     */
    public function getEndAt()
    {
        return $this->end_at;
    }

    public function setEndAt($end_at)
    {
        $this->end_at = $end_at;

        return $this;
    }

}