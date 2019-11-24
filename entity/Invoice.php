<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Invoice
 *
 * @ORM\Table(name="invoice")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\InvoiceRepository")
 */
class Invoice
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
     * @ORM\Column(name="date_invoice", type="datetime")
     */
    private $dateInvoice;

    /**
     * @var string
     *
     * @ORM\Column(name="number", type="string", length=255)
     */
    private $number;

    /**
     * @var float
     *
     * @ORM\Column(name="ht_price_tva_10", type="float")
     */
    private $htPriceTVA10;

    /**
     * @var float
     *
     * @ORM\Column(name="ht_price_tva_10_without_amounts", type="float")
     */
    private $htPriceTVA10WithoutAmounts;

    /**
     * @var float
     *
     * @ORM\Column(name="ht_price_tva_20_without_amounts", type="float")
     */
    private $htPriceTVA20WithoutAmounts;

    /**
     * @var float
     *
     * @ORM\Column(name="ht_price_tva_20", type="float")
     */
    private $htPriceTVA20;

    /**
     * @var float
     *
     * @ORM\Column(name="price_TTC", type="float")
     */
    private $priceTTC;

    /**
     * @var int|null
     *
     * @ORM\Column(name="promo_amount", type="integer", nullable=true)
     */
    private $promoAmount;

    /**
     * @var string
     *
     * @ORM\Column(name="reduction_amount", type="decimal", precision=10, scale=2, nullable=true)
     */
     private $reductionAmount;

    /**
     * @var string|null
     *
     * @ORM\Column(name="promo_code", type="string", nullable=true)
     */
    private $promoCode;

    /**
     * @var string|null
     *
     * @ORM\Column(name="mark", type="string", nullable=true, length=1)
     */
    private $mark;

    /**
     * @ORM\OneToOne(targetEntity="AppBundle\Entity\Purchase")
     */
    private $purchase;

    /**
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\Subscription", inversedBy="invoices")
     * @ORM\JoinColumn(nullable=true)
     */
    private $subscription;

    /**
     * @var string
     *
     * @ORM\Column(name="fileName", type="string", nullable=true)
     */
    private $fileName;

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
     * Set fileName.
     *
     * @param string $fileName
     *
     * @return Invoice
     */
    public function setFileName($fileName)
    {
        $this->fileName = $fileName;

        return $this;
    }

    /**
     * Get fileName.
     *
     * @return string
     */
    public function getFileName()
    {
        return $this->fileName;
    }

    /**
     * Set subscription
     *
     * @param \AppBundle\Entity\Subscription $subscription
     *
     * @return Invoice
     */
    public function setSubscription(\AppBundle\Entity\Subscription $subscription = null)
    {
        $this->subscription = $subscription;

        return $this;
    }

    /**
     * Get subscription
     *
     * @return \AppBundle\Entity\Subscription
     */
    public function getSubscription()
    {
        return $this->subscription;
    }

    /**
     * Set dateInvoice.
     *
     * @param \DateTime $dateInvoice
     *
     * @return Invoice
     */
    public function setDateInvoice($dateInvoice)
    {
        $this->dateInvoice = $dateInvoice;

        return $this;
    }

    /**
     * Get dateInvoice.
     *
     * @return \DateTime
     */
    public function getDateInvoice()
    {
        return $this->dateInvoice;
    }

    /**
     * Set number.
     *
     * @param string $number
     *
     * @return Invoice
     */
    public function setNumber($number)
    {
        $this->number = $number;

        return $this;
    }

    /**
     * Get number.
     *
     * @return string
     */
    public function getNumber()
    {
        return $this->number;
    }

    /**
     * Set priceTTC.
     *
     * @param float $priceTTC
     *
     * @return Invoice
     */
    public function setPriceTTC($priceTTC)
    {
        $this->priceTTC = $priceTTC;

        return $this;
    }

    /**
     * Get priceTTC.
     *
     * @return float
     */
    public function getPriceTTC()
    {
        return $this->priceTTC;
    }

    /**
     * Set promoAmount.
     *
     * @param int|null $promoAmount
     *
     * @return Invoice
     */
    public function setPromoAmount($promoAmount = null)
    {
        $this->promoAmount = $promoAmount;

        return $this;
    }

    /**
     * Get promoAmount.
     *
     * @return int|null
     */
    public function getPromoAmount()
    {
        return $this->promoAmount;
    }

    /**
     * Set reductionAmount.
     *
     * @param string|null $reductionAmount
     *
     * @return Invoice
     */
    public function setReductionAmount($reductionAmount = null)
    {
        $this->reductionAmount = $reductionAmount;

        return $this;
    }

    /**
     * Get reductionAmount.
     *
     * @return string|null
     */
    public function getReductionAmount()
    {
        return $this->reductionAmount;
    }

    /**
     * Set promoCode.
     *
     * @param string|null $promoCode
     *
     * @return Invoice
     */
    public function setPromoCode($promoCode = null)
    {
        $this->promoCode = $promoCode;

        return $this;
    }

    /**
     * Get promoCode.
     *
     * @return string|null
     */
    public function getPromoCode()
    {
        return $this->promoCode;
    }

    /**
     * Set mark.
     *
     * @param string|null $mark
     *
     * @return Invoice
     */
    public function setMark($mark = null)
    {
        $this->mark = $mark;

        return $this;
    }

    /**
     * Get mark.
     *
     * @return string|null
     */
    public function getMark()
    {
        return $this->mark;
    }

    /**
     * Set purchase.
     *
     * @param \AppBundle\Entity\Purchase|null $purchase
     *
     * @return Invoice
     */
    public function setPurchase(\AppBundle\Entity\Purchase $purchase = null)
    {
        $this->purchase = $purchase;

        return $this;
    }

    /**
     * Get purchase.
     *
     * @return \AppBundle\Entity\Purchase|null
     */
    public function getPurchase()
    {
        return $this->purchase;
    }

    /**
     * Set htPriceTVA10.
     *
     * @param float $htPriceTVA10
     *
     * @return Invoice
     */
    public function setHtPriceTVA10($htPriceTVA10)
    {
        $this->htPriceTVA10 = $htPriceTVA10;

        return $this;
    }

    /**
     * Get htPriceTVA10.
     *
     * @return float
     */
    public function getHtPriceTVA10()
    {
        return $this->htPriceTVA10;
    }

    /**
     * Set htPriceTVA20.
     *
     * @param float $htPriceTVA20
     *
     * @return Invoice
     */
    public function setHtPriceTVA20($htPriceTVA20)
    {
        $this->htPriceTVA20 = $htPriceTVA20;

        return $this;
    }

    /**
     * Get htPriceTVA20.
     *
     * @return float
     */
    public function getHtPriceTVA20()
    {
        return $this->htPriceTVA20;
    }

    /**
     * Set htPriceTVA10WithoutAmounts.
     *
     * @param float $htPriceTVA10WithoutAmounts
     *
     * @return Invoice
     */
    public function setHtPriceTVA10WithoutAmounts($htPriceTVA10WithoutAmounts)
    {
        $this->htPriceTVA10WithoutAmounts = $htPriceTVA10WithoutAmounts;

        return $this;
    }

    /**
     * Get htPriceTVA10WithoutAmounts.
     *
     * @return float
     */
    public function getHtPriceTVA10WithoutAmounts()
    {
        return $this->htPriceTVA10WithoutAmounts;
    }

    /**
     * Set htPriceTVA20WithoutAmounts.
     *
     * @param float $htPriceTVA20WithoutAmounts
     *
     * @return Invoice
     */
    public function setHtPriceTVA20WithoutAmounts($htPriceTVA20WithoutAmounts)
    {
        $this->htPriceTVA20WithoutAmounts = $htPriceTVA20WithoutAmounts;

        return $this;
    }

    /**
     * Get htPriceTVA20WithoutAmounts.
     *
     * @return float
     */
    public function getHtPriceTVA20WithoutAmounts()
    {
        return $this->htPriceTVA20WithoutAmounts;
    }
}
