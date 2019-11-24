<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * HomeScrollCount
 *
 * @ORM\Table(name="home_scroll_count")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\HomeScrollCountRepository")
 */
class HomeScrollCount
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
     * @var string
     *
     * @ORM\Column(name="reader_type", type="string")
     */
    private $readerType;

    /**
     * @var string
     *
     * @ORM\Column(name="uniq_id", type="string")
     */
    private $uniqId;

    /**
     * @var int
     *
     * @ORM\Column(name="time", type="integer")
     */
    private $time;


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
     * Set date.
     *
     * @param \DateTime $date
     *
     * @return HomeScrollCount
     */
    public function setDate($date)
    {
        $this->date = $date;

        return $this;
    }

    /**
     * Get date.
     *
     * @return \DateTime
     */
    public function getDate()
    {
        return $this->date;
    }


    /**
     * Set readerType.
     *
     * @param string $readerType
     *
     * @return HomeScrollCount
     */
    public function setReaderType($readerType)
    {
        $this->readerType = $readerType;

        return $this;
    }

    /**
     * Get readerType.
     *
     * @return string
     */
    public function getReaderType()
    {
        return $this->readerType;
    }

    /**
     * Set uniqId.
     *
     * @param string $uniqId
     *
     * @return HomeScrollCount
     */
    public function setUniqId($uniqId)
    {
        $this->uniqId = $uniqId;

        return $this;
    }

    /**
     * Get uniqId.
     *
     * @return string
     */
    public function getUniqId()
    {
        return $this->uniqId;
    }

    /**
     * Set time.
     *
     * @param int $time
     *
     * @return HomeScrollCount
     */
    public function setTime($time)
    {
        $this->time = $time;

        return $this;
    }

    /**
     * Get time.
     *
     * @return int
     */
    public function getTime()
    {
        return $this->time;
    }
}
