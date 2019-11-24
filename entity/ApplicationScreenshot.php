<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * ApplicationScreenshot
 *
 * @ORM\Table(name="application_screenshot")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ApplicationScreenshotRepository")
 */
class ApplicationScreenshot
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
    * @ORM\ManyToOne(targetEntity="ApplicationAddress", inversedBy="screenshots")
    * @ORM\JoinColumn(name="application_address", referencedColumnName="id")
    */
    private $applicationAddress;


    /**
     * @var string
     *
     * @ORM\Column(name="path_screenshot", type="text", nullable=true)
     */
    private $pathScreenshot;

    /**
     * @var string
     *
     * @ORM\Column(name="comment", type="string", nullable=true)
     */
    private $comment;

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
     * Set pathScreenshot
     *
     * @param string $pathScreenshot
     *
     * @return ApplicationScreenshot
     */
    public function setPathScreenshot($pathScreenshot)
    {
        $this->pathScreenshot = $pathScreenshot;

        return $this;
    }

    /**
     * Get pathScreenshot
     *
     * @return string
     */
    public function getPathScreenshot()
    {
        return $this->pathScreenshot;
    }

    /**
     * Set applicationAddress
     *
     * @param \AppBundle\Entity\ApplicationAddress $applicationAddress
     *
     * @return ApplicationScreenshot
     */
    public function setApplicationAddress(\AppBundle\Entity\ApplicationAddress $applicationAddress = null)
    {
        $this->applicationAddress = $applicationAddress;

        return $this;
    }

    /**
     * Get applicationAddress
     *
     * @return \AppBundle\Entity\ApplicationAddress
     */
    public function getApplicationAddress()
    {
        return $this->applicationAddress;
    }

    /**
     * Set comment.
     *
     * @param string|null $comment
     *
     * @return ApplicationScreenshot
     */
    public function setComment($comment = null)
    {
        $this->comment = $comment;

        return $this;
    }

    /**
     * Get comment.
     *
     * @return string|null
     */
    public function getComment()
    {
        return $this->comment;
    }
}
