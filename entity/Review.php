<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Review
 *
 * @ORM\Table(name="review")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ReviewRepository")
 */
class Review
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
     * @ORM\Column(name="coment", type="text")
     */
    private $comment;

    /**
     * @ORM\Column(name="notation", type="string", length=45)
     */
    private $notation;

    /**
     * @ORM\Column(name="advice_id", type="integer")
     */
    private $advice_id;

    /**
     * @ORM\Column(name="project_id", type="integer")
     */
    private $project_id;



    /*
     * id
     */
    public function getId()
    {
        return $this->id;
    }

    /*
     * comment
     */
    public function getComment()
    {
        return $this->comment;
    }

    public function setComment($comment)
    {
        $this->comment = $comment;

        return $this;
    }

    /*
    * notation
    */
    public function getNotation()
    {
        return $this->notation;
    }

    public function setNotation($notation)
    {
        $this->notation = $notation;

        return $this;
    }

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
   * project_id
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

}