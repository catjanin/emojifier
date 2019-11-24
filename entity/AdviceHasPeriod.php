<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * AdviceHasPeriod
 *
 * @ORM\Table(name="advice_has_period")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\AdviceRepository")
 */
class AdviceHasPeriod
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
     * @ORM\Column(name="advice_id", type="integer")
     * @ORM\ManyToOne(targetEntity="Advice", inversedBy="advice_period")
     */
    private $advice_id;

    /**
     * @var int
     *
     * @ORM\Column(name="period_id", type="integer")
     * @ORM\ManyToOne(targetEntity="Period", inversedBy="advice_period")
     */
    private $period_id;

    /**
     * @ORM\Column(name="is_mandatory", type="boolean")
     */
    private $is_mandatory;

    /*
     * advice_id
     */
    public function getAdviceId()
    {
        return $this->advice_id;
    }

    public function setAdviceId($advice_id)
    {
        $this->advice_id = $advice_id;

        return $this;
    }


    /*
     * period_id
     */
    public function getPeriodId()
    {
        return $this->period_id;
    }

    public function setPeriodId($period_id)
    {
        $this->period_id = $period_id;

        return $this;
    }

    /*
    * is_mandatory
    */
    public function getIsMandatory()
    {
        return $this->is_mandatory;
    }

    public function setIsMandatory($isMandatory)
    {
        $this->is_mandatory = $isMandatory;

        return $this;
    }

}