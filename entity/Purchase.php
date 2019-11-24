<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Purchase
 *
 * @ORM\Table(name="purchase")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\PurchaseRepository")
 */
class Purchase
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
     * @ORM\Column(name="date_purchased", type="datetime")
     */
    private $datePurchased;

    /**
     * @ORM\OneToOne(targetEntity="AppBundle\Entity\Project", inversedBy="purchase")
     */
    private $project;

    /**
    * @var string
    *
    * @ORM\Column(name="promo", type="string", length=255, nullable=true)
    */
    private $promo;

    /**
    * @var string
    *
    * @ORM\Column(name="currency", type="string", length=255)
    */
    private $currency;

    /**
    * @var string
    *
    * @ORM\Column(name="state_message", type="string", length=255, nullable=true)
    */
    private $stateMessage;

    /**
    * @var string
    *
    * @ORM\Column(name="amount_paid", type="decimal", precision=10, scale=2)
    */
    private $amountPaid;

    /**
    * @var string
    *
    * @ORM\Column(name="transaction", type="string", length=255)
    */
    private $transaction;

    /**
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\ContactPurchase")
     */
    private $shipContact;

    /**
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\ContactPurchase")
     */
    private $billContact;

    /**
     * @var string
     *
     * @ORM\Column(name="state", type="string", length=50)
     */
    private $state;

    /**
     * @var bool
     *
     * @ORM\Column(name="appointment", type="boolean")
     */
    private $appointment;

    /**
     * @var bool
     *
     * @ORM\Column(name="is_delivered", type="boolean")
     */
    private $isDelivered;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_appointment", type="datetime", nullable=true)
     */
    private $dateAppointment;

    /**
     * @var string
     *
     * @ORM\Column(name="ship_place", type="string", length=50, nullable=true)
     */
    private $shipPlace;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date_validation", type="datetime", nullable=true)
     */
    private $dateValidation;

    /**
     * @ORM\OneToOne(targetEntity="AppBundle\Entity\Invoice")
     */
    private $invoice;

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
     * Set datePurchased
     *
     * @param \DateTime $datePurchased
     *
     * @return Purchase
     */
    public function setDatePurchased($datePurchased)
    {
        $this->datePurchased = $datePurchased;

        return $this;
    }

    /**
     * Get datePurchased
     *
     * @return \DateTime
     */
    public function getDatePurchased()
    {
        return $this->datePurchased;
    }

    /**
     * Set project
     *
     * @param \AppBundle\Entity\Project $project
     *
     * @return Purchase
     */
    public function setProject(\AppBundle\Entity\Project $project = null)
    {
        $this->project = $project;

        return $this;
    }

    /**
     * Get project
     *
     * @return \AppBundle\Entity\Project
     */
    public function getProject()
    {
        return $this->project;
    }

    /**
     * Set shipContact
     *
     * @param \AppBundle\Entity\ContactPurchase $shipContact
     *
     * @return Purchase
     */
    public function setShipContact(\AppBundle\Entity\ContactPurchase $shipContact = null)
    {
        $this->shipContact = $shipContact;

        return $this;
    }

    /**
     * Get shipContact
     *
     * @return \AppBundle\Entity\ContactPurchase
     */
    public function getShipContact()
    {
        return $this->shipContact;
    }

    /**
     * Set billContact
     *
     * @param \AppBundle\Entity\ContactPurchase $billContact
     *
     * @return Purchase
     */
    public function setBillContact(\AppBundle\Entity\ContactPurchase $billContact = null)
    {
        $this->billContact = $billContact;

        return $this;
    }

    /**
     * Get billContact
     *
     * @return \AppBundle\Entity\ContactPurchase
     */
    public function getBillContact()
    {
        return $this->billContact;
    }

    /**
     * Set promo
     *
     * @param string $promo
     *
     * @return Purchase
     */
    public function setPromo($promo)
    {
        $this->promo = $promo;

        return $this;
    }

    /**
     * Get promo
     *
     * @return string
     */
    public function getPromo()
    {
        return $this->promo;
    }

    /**
     * Set transaction
     *
     * @param string $transaction
     *
     * @return Purchase
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
     * Set currency
     *
     * @param string $currency
     *
     * @return Purchase
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
     * Set state
     *
     * @param string $state
     *
     * @return Purchase
     */
    public function setState($state)
    {
        $this->state = $state;

        return $this;
    }

    /**
     * Get state
     *
     * @return string
     */
    public function getState()
    {
        return $this->state;
    }

    /**
     * Set stateMessage
     *
     * @param string $stateMessage
     *
     * @return Purchase
     */
    public function setStateMessage($stateMessage)
    {
        $this->stateMessage = $stateMessage;

        return $this;
    }

    /**
     * Get stateMessage
     *
     * @return string
     */
    public function getStateMessage()
    {
        return $this->stateMessage;
    }

    /**
     * Set amountPaid
     *
     * @param string $amountPaid
     *
     * @return Purchase
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
     * Set appointment.
     *
     * @param bool $appointment
     *
     * @return Purchase
     */
    public function setAppointment($appointment)
    {
        $this->appointment = $appointment;

        return $this;
    }

    /**
     * Get appointment.
     *
     * @return bool
     */
    public function getAppointment()
    {
        return $this->appointment;
    }

    /**
     * Set isDelivered.
     *
     * @param bool $isDelivered
     *
     * @return Purchase
     */
    public function setIsDelivered($isDelivered)
    {
        $this->isDelivered = $isDelivered;

        return $this;
    }

    /**
     * Get isDelivered.
     *
     * @return bool
     */
    public function getIsDelivered()
    {
        return $this->isDelivered;
    }

    /**
     * Set dateAppointment.
     *
     * @param \DateTime $dateAppointment
     *
     * @return Purchase
     */
    public function setDateAppointment($dateAppointment)
    {
        $this->dateAppointment = $dateAppointment;

        return $this;
    }

    /**
     * Get dateAppointment.
     *
     * @return \DateTime
     */
    public function getDateAppointment()
    {
        return $this->dateAppointment;
    }


    /**
     * Set shipPlace.
     *
     * @param string|null $shipPlace
     *
     * @return Purchase
     */
    public function setShipPlace($shipPlace = null)
    {
        $this->shipPlace = $shipPlace;

        return $this;
    }

    /**
     * Get shipPlace.
     *
     * @return string|null
     */
    public function getShipPlace()
    {
        return $this->shipPlace;
    }

    /**
     * Set dateValidation.
     *
     * @param \DateTime $dateValidation
     *
     * @return Purchase
     */
    public function setDateValidation($dateValidation)
    {
        $this->dateValidation = $dateValidation;

        return $this;
    }

    /**
     * Get dateValidation.
     *
     * @return \DateTime
     */
    public function getDateValidation()
    {
        return $this->dateValidation;
    }


    /**
     * Set invoice.
     *
     * @param \AppBundle\Entity\Invoice|null $invoice
     *
     * @return Purchase
     */
    public function setInvoice(\AppBundle\Entity\Invoice $invoice = null)
    {
        $this->invoice = $invoice;

        return $this;
    }

    /**
     * Get invoice.
     *
     * @return \AppBundle\Entity\Invoice|null
     */
    public function getInvoice()
    {
        return $this->invoice;
    }
}
