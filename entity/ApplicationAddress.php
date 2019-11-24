<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use AppBundle\Entity\ApplicationScreenshot;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * ApplicationAddress
 *
 * @ORM\Table(name="application_address")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ApplicationAddressRepository")
 */
class ApplicationAddress
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
     * @var string
     *
     * @ORM\Column(name="full_address", type="string", length=255, nullable=true)
     */
    private $fullAddress;

    /**
     * @var string
     *
     * @ORM\Column(name="address", type="string", length=255, nullable=true)
     */
    private $address;

    /**
     * @var string
     *
     * @ORM\Column(name="zip", type="string", nullable=true)
     */
    private $zip;

    /**
     * @var string
     *
     * @ORM\Column(name="city", type="string", length=255, nullable=true)
     */
    private $city;

    /**
     * @var string
     *
     * @ORM\Column(name="country", type="string", length=255, nullable=true)
     */
    private $country;

    /**
     * @var string
     *
     * @ORM\Column(name="uniqId", type="string", length=255, unique=true)
     */
    private $uniqId;

    /**
     * @ORM\OneToMany(targetEntity="ApplicationScreenshot", mappedBy="applicationAddress", cascade={"persist","remove"})
     */
    private $screenshots;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date", type="datetime")
     */
    private $date;

    /**
     * Set date
     *
     * @param \DateTime $date
     *
     * @return ApplicationAddress
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
     * Get id
     *
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set uniqId
     *
     * @param string $uniqId
     *
     * @return ApplicationAddress
     */
    public function setUniqId($uniqId)
    {
        $this->uniqId = $uniqId;

        return $this;
    }

    /**
     * Get uniqId
     *
     * @return string
     */
    public function getUniqId()
    {
        return $this->uniqId;
    }
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->screenshots = new \Doctrine\Common\Collections\ArrayCollection();
        $this->date = new \DateTime();
    }

    /**
     * Add screenshot
     *
     * @param \AppBundle\Entity\ApplicationScreenshot $screenshot
     *
     * @return ApplicationAddress
     */
    public function addScreenshot(\AppBundle\Entity\ApplicationScreenshot $screenshot)
    {
        $this->screenshots[] = $screenshot;

        return $this;
    }

    /**
     * Remove screenshot
     *
     * @param \AppBundle\Entity\ApplicationScreenshot $screenshot
     */
    public function removeScreenshot(\AppBundle\Entity\ApplicationScreenshot $screenshot)
    {
        $this->screenshots->removeElement($screenshot);
    }

    /**
     * Get screenshots
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getScreenshots()
    {
        return $this->screenshots;
    }

    /**
     * Set fullAddress.
     *
     * @param string|null $fullAddress
     *
     * @return ApplicationAddress
     */
    public function setFullAddress($fullAddress = null)
    {
        $this->fullAddress = $fullAddress;

        return $this;
    }

    /**
     * Get fullAddress.
     *
     * @return string|null
     */
    public function getFullAddress()
    {
        return $this->fullAddress;
    }

    /**
     * Set address.
     *
     * @param string|null $address
     *
     * @return ApplicationAddress
     */
    public function setAddress($address = null)
    {
        $this->address = $address;

        return $this;
    }

    /**
     * Get address.
     *
     * @return string|null
     */
    public function getAddress()
    {
        return $this->address;
    }

    /**
     * Set city.
     *
     * @param string|null $city
     *
     * @return ApplicationAddress
     */
    public function setCity($city = null)
    {
        $this->city = $city;

        return $this;
    }

    /**
     * Get city.
     *
     * @return string|null
     */
    public function getCity()
    {
        return $this->city;
    }

    /**
     * Set country.
     *
     * @param string|null $country
     *
     * @return ApplicationAddress
     */
    public function setCountry($country = null)
    {
        $this->country = $country;

        return $this;
    }

    /**
     * Get country.
     *
     * @return string|null
     */
    public function getCountry()
    {
        return $this->country;
    }

    /**
     * Set zip.
     *
     * @param string|null $zip
     *
     * @return ApplicationAddress
     */
    public function setZip($zip = null)
    {
        $this->zip = $zip;

        return $this;
    }

    /**
     * Get zip.
     *
     * @return string|null
     */
    public function getZip()
    {
        return $this->zip;
    }
}
