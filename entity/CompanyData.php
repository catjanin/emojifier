<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Annotations\Annotation;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * CompanyData
 *
 * @ORM\Table(name="company_data")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\CompanyDataRepository")
 */
class CompanyData
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
     * @Assert\NotBlank
     * @ORM\Column(name="full_name", type="string", length=255, nullable=false)
     */
    private $fullName;

    /**
     * @var string
     *
     * @Assert\NotBlank
     * @ORM\Column(name="short_name", type="string", length=255, nullable=false)
     */
    private $shortName;

    /**
     * @var string
     *
     * @Assert\NotBlank
     * @ORM\Column(name="head_office_address", type="string", length=255, nullable=false)
     */
    private $headOfficeAddress;

    /**
     * @var string
     *
     * @Assert\NotBlank
     * @ORM\Column(name="store_house_address", type="string", length=255, nullable=false)
     */
    private $storeHouseAddress;

    /**
     * @var int
     *
     * @Assert\NotBlank
     * @ORM\Column(name="share_capital", type="integer", nullable=false)
     */
    private $shareCapital;

    /**
     * @var string
     *
     * @Assert\NotBlank
     * @ORM\Column(name="vat_number", type="string", length=255, nullable=false)
     */
    private $vatNumber;

    /**
     * @var int
     *
     * @Assert\NotBlank
     * @ORM\Column(name="siren", type="integer", nullable=false)
     */
    private $siren;

    /**
     * @var string
     * @Assert\NotBlank
     *
     * @ORM\Column(name="phone_number", type="string", nullable=false)
     */
    private $phoneNumber;

    /**
     * @var string
     *
     * @Assert\NotBlank
     *
     * @Assert\Email(
     *     message = "L'adresse email '{{ value }}' n'est pas une adresse valide.",
     *     checkMX = true
     * )
     *
     * @ORM\Column(name="email_address", type="string", nullable=false)
     */
    private $emailAddress;

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
     * Set fullName.
     *
     * @param string $fullName
     *
     * @return CompanyData
     */
    public function setFullName($fullName)
    {
        $this->fullName = $fullName;

        return $this;
    }

    /**
     * Get fullName.
     *
     * @return string
     */
    public function getFullName()
    {
        return $this->fullName;
    }

    /**
     * Set shortName.
     *
     * @param string $shortName
     *
     * @return CompanyData
     */
    public function setShortName($shortName)
    {
        $this->shortName = $shortName;

        return $this;
    }

    /**
     * Get shortName.
     *
     * @return string
     */
    public function getShortName()
    {
        return $this->shortName;
    }

    /**
     * Set headOfficeAddress.
     *
     * @param string $headOfficeAddress
     *
     * @return CompanyData
     */
    public function setHeadOfficeAddress($headOfficeAddress)
    {
        $this->headOfficeAddress = $headOfficeAddress;

        return $this;
    }

    /**
     * Get headOfficeAddress.
     *
     * @return string
     */
    public function getHeadOfficeAddress()
    {
        return $this->headOfficeAddress;
    }

    /**
     * Set storeHouseAddress.
     *
     * @param string $storeHouseAddress
     *
     * @return CompanyData
     */
    public function setStoreHouseAddress($storeHouseAddress)
    {
        $this->storeHouseAddress = $storeHouseAddress;

        return $this;
    }

    /**
     * Get storeHouseAddress.
     *
     * @return string
     */
    public function getStoreHouseAddress()
    {
        return $this->storeHouseAddress;
    }

    /**
     * Set shareCapital.
     *
     * @param int $shareCapital
     *
     * @return CompanyData
     */
    public function setShareCapital($shareCapital)
    {
        $this->shareCapital = $shareCapital;

        return $this;
    }

    /**
     * Get shareCapital.
     *
     * @return int
     */
    public function getShareCapital()
    {
        return $this->shareCapital;
    }

    /**
     * Set vatNumber.
     *
     * @param string $vatNumber
     *
     * @return CompanyData
     */
    public function setVatNumber($vatNumber)
    {
        $this->vatNumber = $vatNumber;

        return $this;
    }

    /**
     * Get vatNumber.
     *
     * @return string
     */
    public function getVatNumber()
    {
        return $this->vatNumber;
    }

    /**
     * Set siren.
     *
     * @param int $siren
     *
     * @return CompanyData
     */
    public function setSiren($siren)
    {
        $this->siren = $siren;

        return $this;
    }

    /**
     * Get siren.
     *
     * @return int
     */
    public function getSiren()
    {
        return $this->siren;
    }

    /**
     * @return string
     */
    public function getPhoneNumber()
    {
        return $this->phoneNumber;
    }

    /**
     * @param string $phoneNumber
     */
    public function setPhoneNumber($phoneNumber)
    {
        $this->phoneNumber = $phoneNumber;
    }


    /**
     * @return string
     */
    public function getEmailAddress()
    {
        return $this->emailAddress;
    }

    /**
     * @param string $emailAddress
     */
    public function setEmailAddress($emailAddress)
    {
        $this->emailAddress = $emailAddress;
    }


}
