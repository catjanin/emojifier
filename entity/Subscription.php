<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Subscription
 *
 * @ORM\Table(name="subscription")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\SubscriptionRepository")
 */
class Subscription
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
     * @ORM\Column(name="start_date", type="datetime", nullable=true)
     */
    private $startDate;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="end_date", type="datetime", nullable=true)
     */
    private $endDate;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="last_invoice", type="datetime", nullable=true)
     */
    private $lastInvoice;

    /**
     * @var string
     *
     * @ORM\Column(name="garden_line1", type="string", length=255, nullable=true)
     */
    private $gardenLine1;

    /**
     * @var string
     *
     * @ORM\Column(name="garden_line2", type="string", length=255, nullable=true)
     */
    private $gardenLine2;

    /**
     * @var string
     *
     * @ORM\Column(name="garden_zip", type="string", length=255, nullable=true)
     */
    private $gardenZip;

    /**
     * @var string
     *
     * @ORM\Column(name="garden_city", type="string", length=255, nullable=true)
     */
    private $gardenCity;

    /**
     * @var string
     *
     * @ORM\Column(name="garden_country", type="string", length=255, nullable=true)
     */
    private $gardenCountry;

    /**
     * @var string
     *
     * @ORM\Column(name="billing_line1", type="string", length=255, nullable=true)
     */
    private $billingLine1;

    /**
     * @var string
     *
     * @ORM\Column(name="billing_line2", type="string", length=255, nullable=true)
     */
    private $billingLine2;

    /**
     * @var string
     *
     * @ORM\Column(name="billing_zip", type="string", length=255, nullable=true)
     */
    private $billingZip;

    /**
     * @var string
     *
     * @ORM\Column(name="billing_city", type="string", length=255, nullable=true)
     */
    private $billingCity;

    /**
     * @var string
     *
     * @ORM\Column(name="billing_country", type="string", length=255, nullable=true)
     */
    private $billingCountry;

    /**
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\User", inversedBy="subscriptions")
     * @ORM\JoinColumn(nullable=true)
     */
    private $fosUser;

    /**
    * @var string
    *
    * @ORM\Column(name="transaction", type="string", length=255, nullable=false, unique=true)
    */
    private $transaction;

    /**
     * @var string
     *
     * @ORM\Column(name="last_name", type="string", length=255, nullable=false)
     */
    private $lastName;

    /**
     * @var string
     *
     * @ORM\Column(name="first_name", type="string", length=255, nullable=false)
     */
    private $firstName;

    /**
     * @ORM\OneToMany(targetEntity="AppBundle\Entity\Invoice", mappedBy="subscription")
     */
    private $invoices;

    /**
    * @var string
    *
    * @ORM\Column(name="currency", type="string", length=255)
    */
    private $currency;

    /**
    * @var string
    *
    * @ORM\Column(name="amount_paid", type="decimal", precision=10, scale=2)
    */
    private $amountPaid;

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
     * Constructor
     */
    public function __construct()
    {
        $this->startDate = new \DateTime();
    }

    /**
     * Set startDate
     *
     * @param \DateTime $startDate
     *
     * @return Subscription
     */
    public function setStartDate($startDate)
    {
        $this->startDate = $startDate;

        return $this;
    }

    /**
     * Get startDate
     *
     * @return \DateTime
     */
    public function getStartDate()
    {
        return $this->startDate;
    }

    /**
     * Set endDate
     *
     * @param \DateTime $endDate
     *
     * @return Subscription
     */
    public function setEndDate($endDate)
    {
        $this->endDate = $endDate;

        return $this;
    }

    /**
     * Get endDate
     *
     * @return \DateTime
     */
    public function getEndDate()
    {
        return $this->endDate;
    }
    
    /**
     * Set fosUser
     *
     * @param \AppBundle\Entity\User $fosUser
     *
     * @return Subscription
     */
    public function setFosUser(\AppBundle\Entity\User $fosUser = null)
    {
        $this->fosUser = $fosUser;

        return $this;
    }

    /**
     * Get fosUser
     *
     * @return \AppBundle\Entity\User
     */
    public function getFosUser()
    {
        return $this->fosUser;
    }

    /**
     * Set transaction
     *
     * @param string $transaction
     *
     * @return Subscription
     */
    public function setTransaction($transaction)
    {
        $this->transaction = $transaction;

        return $this;
    }

    /**
     * Get transaction
     *
     * @return string
     */
    public function getTransaction()
    {
        return $this->transaction;
    }

    /**
     * Set lastName
     *
     * @param string $lastName
     *
     * @return Subscription
     */
    public function setLastName($lastName)
    {
        $this->lastName = $lastName;

        return $this;
    }

    /**
     * Get lastName
     *
     * @return string
     */
    public function getLastName()
    {
        return $this->lastName;
    }

    /**
     * Set firstName
     *
     * @param string $firstName
     *
     * @return Subscription
     */
    public function setFirstName($firstName)
    {
        $this->firstName = $firstName;

        return $this;
    }

    /**
     * Get firstName
     *
     * @return string
     */
    public function getFirstName()
    {
        return $this->firstName;
    }

    /**
     * Add invoice
     *
     * @param \AppBundle\Entity\Invoice $invoice
     *
     * @return Subscription
     */
    public function addInvoice(\AppBundle\Entity\Invoice $invoice)
    {
        $this->invoices[] = $invoice;

        return $this;
    }

    /**
     * Remove invoice
     *
     * @param \AppBundle\Entity\Invoice $invoice
     */
    public function removeInvoice(\AppBundle\Entity\Invoice $invoice)
    {
        $this->invoices->removeElement($invoice);
    }

    /**
     * Get invoices
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getInvoices()
    {
        return $this->invoices;
    }

    /**
     * Set currency
     *
     * @param string $currency
     *
     * @return Subscription
     */
    public function setCurrency($currency)
    {
        $this->currency = $currency;

        return $this;
    }

    /**
     * Get currency
     *
     * @return string
     */
    public function getCurrency()
    {
        return $this->currency;
    }

    /**
     * Set amountPaid
     *
     * @param string $amountPaid
     *
     * @return Subscription
     */
    public function setAmountPaid($amountPaid)
    {
        $this->amountPaid = $amountPaid;

        return $this;
    }

    /**
     * Get amountPaid
     *
     * @return string
     */
    public function getAmountPaid()
    {
        return $this->amountPaid;
    }

    /**
     * Set lastInvoice.
     *
     * @param \DateTime|null $lastInvoice
     *
     * @return Subscription
     */
    public function setLastInvoice($lastInvoice = null)
    {
        $this->lastInvoice = $lastInvoice;

        return $this;
    }

    /**
     * Get lastInvoice.
     *
     * @return \DateTime|null
     */
    public function getLastInvoice()
    {
        return $this->lastInvoice;
    }

    /**
     * Set gardenLine1.
     *
     * @param string|null $gardenLine1
     *
     * @return Subscription
     */
    public function setGardenLine1($gardenLine1 = null)
    {
        $this->gardenLine1 = $gardenLine1;

        return $this;
    }

    /**
     * Get gardenLine1.
     *
     * @return string|null
     */
    public function getGardenLine1()
    {
        return $this->gardenLine1;
    }

    /**
     * Set gardenLine2.
     *
     * @param string|null $gardenLine2
     *
     * @return Subscription
     */
    public function setGardenLine2($gardenLine2 = null)
    {
        $this->gardenLine2 = $gardenLine2;

        return $this;
    }

    /**
     * Get gardenLine2.
     *
     * @return string|null
     */
    public function getGardenLine2()
    {
        return $this->gardenLine2;
    }

    /**
     * Set gardenZip.
     *
     * @param string|null $gardenZip
     *
     * @return Subscription
     */
    public function setGardenZip($gardenZip = null)
    {
        $this->gardenZip = $gardenZip;

        return $this;
    }

    /**
     * Get gardenZip.
     *
     * @return string|null
     */
    public function getGardenZip()
    {
        return $this->gardenZip;
    }

    /**
     * Set gardenCity.
     *
     * @param string|null $gardenCity
     *
     * @return Subscription
     */
    public function setGardenCity($gardenCity = null)
    {
        $this->gardenCity = $gardenCity;

        return $this;
    }

    /**
     * Get gardenCity.
     *
     * @return string|null
     */
    public function getGardenCity()
    {
        return $this->gardenCity;
    }

    /**
     * Set gardenCountry.
     *
     * @param string|null $gardenCountry
     *
     * @return Subscription
     */
    public function setGardenCountry($gardenCountry = null)
    {
        $this->gardenCountry = $gardenCountry;

        return $this;
    }

    /**
     * Get gardenCountry.
     *
     * @return string|null
     */
    public function getGardenCountry()
    {
        return $this->gardenCountry;
    }

    /**
     * Set billingLine1.
     *
     * @param string|null $billingLine1
     *
     * @return Subscription
     */
    public function setBillingLine1($billingLine1 = null)
    {
        $this->billingLine1 = $billingLine1;

        return $this;
    }

    /**
     * Get billingLine1.
     *
     * @return string|null
     */
    public function getBillingLine1()
    {
        return $this->billingLine1;
    }

    /**
     * Set billingLine2.
     *
     * @param string|null $billingLine2
     *
     * @return Subscription
     */
    public function setBillingLine2($billingLine2 = null)
    {
        $this->billingLine2 = $billingLine2;

        return $this;
    }

    /**
     * Get billingLine2.
     *
     * @return string|null
     */
    public function getBillingLine2()
    {
        return $this->billingLine2;
    }

    /**
     * Set billingZip.
     *
     * @param string|null $billingZip
     *
     * @return Subscription
     */
    public function setBillingZip($billingZip = null)
    {
        $this->billingZip = $billingZip;

        return $this;
    }

    /**
     * Get billingZip.
     *
     * @return string|null
     */
    public function getBillingZip()
    {
        return $this->billingZip;
    }

    /**
     * Set billingCity.
     *
     * @param string|null $billingCity
     *
     * @return Subscription
     */
    public function setBillingCity($billingCity = null)
    {
        $this->billingCity = $billingCity;

        return $this;
    }

    /**
     * Get billingCity.
     *
     * @return string|null
     */
    public function getBillingCity()
    {
        return $this->billingCity;
    }

    /**
     * Set billingCountry.
     *
     * @param string|null $billingCountry
     *
     * @return Subscription
     */
    public function setBillingCountry($billingCountry = null)
    {
        $this->billingCountry = $billingCountry;

        return $this;
    }

    /**
     * Get billingCountry.
     *
     * @return string|null
     */
    public function getBillingCountry()
    {
        return $this->billingCountry;
    }
}
