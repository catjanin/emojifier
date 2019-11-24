<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * AdviceHasProject
 *
 * @ORM\Table(name="advice_has_project")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\AdviceRepository")
 */
class AdviceHasProject
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
     */
    private $advice_id;

    /**
     * @var int
     *
     * @ORM\Column(name="project_id", type="integer")
     */
    private $project_id;

    /**
     * @var bool
     *
     * @ORM\Column(name="is_done", type="boolean")
     */
    private $is_done;


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

    public function getProjectId()
    {
        return $this->project_id;
    }

    public function setProjectId($project_id)
    {
        $this->project_id = $project_id;

        return $this;
    }


    /*
     * is_done
     */

    public function getIsDone()
    {
        return $this->is_done;
    }

    public function setIsDone($is_done)
    {
        $this->is_done = $is_done;

        return $this;
    }

}