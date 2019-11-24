<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * CookiesClicCount
 *
 * @ORM\Table(name="cookies_clic_count")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\CookiesClicCountRepository")
 */
class CookiesClicCount
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
     * @var \DateTime
     *
     * @ORM\Column(name="date", type="datetime")
     */
    private $date;

    /**
     * @var int
     *
     * @ORM\Column(name="accept", type="integer", nullable=true)
     */
    private $accept;

    /**
     * @var int
     *
     * @ORM\Column(name="refuse", type="integer", nullable=true)
     */
    private $refuse;


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
     * Set date
     *
     * @param \DateTime $date
     *
     * @return CookiesClicCount
     */
    public function setDate($date)
    {
        $this->date = $date;

        return $this;
    }

    /**
     * Get date
     *
     * @return \DateTime
     */
    public function getDate()
    {
        return $this->date;
    }

    /**
     * Set accept
     *
     * @param integer $accept
     *
     * @return CookiesClicCount
     */
    public function setAccept($accept)
    {
        $this->accept = $accept;

        return $this;
    }

    /**
     * Get accept
     *
     * @return int
     */
    public function getAccept()
    {
        return $this->accept;
    }

    /**
     * Set refuse
     *
     * @param integer $refuse
     *
     * @return CookiesClicCount
     */
    public function setRefuse($refuse)
    {
        $this->refuse = $refuse;

        return $this;
    }

    /**
     * Get refuse
     *
     * @return int
     */
    public function getRefuse()
    {
        return $this->refuse;
    }
}

