<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Project
 *
 * @ORM\Table(name="project")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\ProjectRepository")
 */
class Project
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
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\User", inversedBy="projects")
     * @ORM\JoinColumn(nullable=true)
     */
    private $fosUser;

    /**
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\GardenType", inversedBy="projects", fetch="EAGER")
     */
    private $gardenType;

    /**
     * @ORM\OneToOne(targetEntity="AppBundle\Entity\Purchase")
     * @ORM\JoinColumn(nullable=true)
     */
    private $purchase;

    /**
     * @var string
     *
     * @ORM\Column(name="path_project", type="text", nullable=true)
     */
    private $pathProject;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255, nullable=true)
     */
    private $name;

    /**
     * @var int
     *
     * @ORM\Column(name="uniqid", type="string", unique=true)
     */
    private $uniqid;

    /**
     * @var string
     *
     * @ORM\Column(name="surface", type="decimal", precision=10, scale=2)
     */
    private $surface;

    /**
     * @ORM\Column(name="street", type="text")
     */
    private $street;

    /**
     * @var string
     *
     * @ORM\Column(name="city", type="text")
     */
    private $city;

    /**
     * @var string
     *
     * @ORM\Column(name="zip", type="text", nullable=true)
     */
    private $zip;

    /**
     * @var string
     *
     * @ORM\Column(name="country", type="text", nullable=true)
     */
    private $country;

    /**
     * @var string
     *
     * @ORM\Column(name="path_screenshot2D", type="text", nullable=true)
     */
    private $pathScreenshot2D;

    /**
     * @var string
     *
     * @ORM\Column(name="path_screenshot3D", type="text", nullable=true)
     */
    private $pathScreenshot3D;

    /**
     * @var string
     *
     * @ORM\Column(name="path_planting_plan", type="text", nullable=true)
     */
    private $pathPlantingPlan;

    /**
     * @var string
     *
     * @ORM\Column(name="planting_plan_caption", type="text", nullable=true)
     */
    private $plantingPlanCaption;

    /**
     * @var string
     *
     * @ORM\Column(name="total_price_ttc", type="decimal", precision=10, scale=2, nullable=true)
     */
    private $totalPriceTTC;

    /**
     * @var string
     *
     * @ORM\Column(name="total_price_ht", type="decimal", precision=10, scale=2, nullable=true)
     */
    private $totalPriceHT;

    /**
     * @var string
     *
     * @ORM\Column(name="price_group_plants_ht", type="decimal", precision=10, scale=2, nullable=true)
     */
    private $priceGroupPlantsHT;

    /**
     * @var string
     *
     * @ORM\Column(name="price_group_plants_ttc", type="decimal", precision=10, scale=2, nullable=true)
     */
    private $priceGroupPlantsTTC;

    /**
     * @var string
     *
     * @ORM\Column(name="price_group_tools_ht", type="decimal", precision=10, scale=2, nullable=true)
     */
    private $priceGroupToolsHT;

    /**
     * @var string
     *
     * @ORM\Column(name="price_group_tools_ttc", type="decimal", precision=10, scale=2, nullable=true)
     */
    private $priceGroupToolsTTC;

    /**
     * @var integer
     *
     * @ORM\Column(name="fixed_price_ht", type="integer", nullable=true)
     */
    private $fixedPriceHT;

    /**
     * @var integer
     *
     * @ORM\Column(name="fixed_price_ttc", type="integer", nullable=true)
     */
    private $fixedPriceTTC;

    /**
     * @var integer
     *
     * @ORM\Column(name="delivery_price_TTC", type="decimal", precision=10, scale=2, nullable=true)
     */
    private $deliveryPriceTTC;

    /**
     * @var integer
     *
     * @ORM\Column(name="delivery_price_HT", type="decimal", precision=10, scale=2, nullable=true)
     */
    private $deliveryPriceHT;

    /**
     * @var integer
     *
     * @ORM\Column(name="subscription_unit_price_HT", type="decimal", precision=10, scale=2, nullable=true)
     */
    private $subscriptionUnitPriceHT;

    /**
     * @var integer
     *
     * @ORM\Column(name="subscription_unit_price_TTC", type="decimal", precision=10, scale=2, nullable=true)
     */
    private $subscriptionUnitPriceTTC;

    /**
     * @var integer
     *
     * @ORM\Column(name="subscription_price_HT", type="decimal", precision=10, scale=2, nullable=true)
     */
    private $subscriptionPriceHT;

    /**
     * @var integer
     *
     * @ORM\Column(name="subscription_price_TTC", type="decimal", precision=10, scale=2, nullable=true)
     */
    private $subscriptionPriceTTC;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date", type="datetime")
     */
    private $date;

    /**
     * @ORM\OneToMany(targetEntity="AppBundle\Entity\ProjectZonePlant", mappedBy="project")
     */
    private $projectZonePlants;

    /**
     * @var string
     *
     * @ORM\Column(name="paypal_payment_id", type="string", length=255, nullable=true)
     */
    private $paypalPaymentId;

    /**
     * @var string
     *
     * @ORM\Column(name="paypal_state", type="string", length=10, nullable=true)
     */
    private $paypalState;

    /**
     * @ORM\OneToOne(targetEntity="AppBundle\Entity\Quotation")
     * @ORM\JoinColumn(onDelete="CASCADE")
     */
    private $quotation;

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
     * Set fosUserId
     *
     * @param integer $fosUserId
     *
     * @return Project
     */
    public function setFosUserId($fosUserId)
    {
        $this->fosUserId = $fosUserId;

        return $this;
    }

    /**
     * Get fosUserId
     *
     * @return int
     */
    public function getFosUserId()
    {
        return $this->fosUserId;
    }

    /**
     * Set pathProject
     *
     * @param string $pathProject
     *
     * @return Project
     */
    public function setPathProject($pathProject)
    {
        $this->pathProject = $pathProject;

        return $this;
    }

    /**
     * Get pathProject
     *
     * @return string
     */
    public function getPathProject()
    {
        return $this->pathProject;
    }

    /**
     * Set name
     *
     * @param string $name
     *
     * @return Project
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set uniqid
     *
     * @param string $uniqid
     *
     * @return Project
     */
    public function setUniqid($uniqid)
    {
        $this->uniqid = $uniqid;

        return $this;
    }

    /**
     * Get uniqid
     *
     * @return string
     */
    public function getUniqid()
    {
        return $this->uniqid;
    }

    /**
     * Set surface
     *
     * @param string $surface
     *
     * @return Project
     */
    public function setSurface($surface)
    {
        $this->surface = $surface;

        return $this;
    }

    /**
     * Get surface
     *
     * @return string
     */
    public function getSurface()
    {
        return $this->surface;
    }

    /**
     * Set gardenTypeId
     *
     * @param integer $gardenTypeId
     *
     * @return Project
     */
    public function setGardenTypeId($gardenTypeId)
    {
        $this->gardenTypeId = $gardenTypeId;

        return $this;
    }

    /**
     * Get gardenTypeId
     *
     * @return int
     */
    public function getGardenTypeId()
    {
        return $this->gardenTypeId;
    }

    /**
     * Set date
     *
     * @param \DateTime $date
     *
     * @return Project
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
     * Constructor
     */
    public function __construct()
    {
        $this->date = new \DateTime();
        $this->projectZonePlants = new \Doctrine\Common\Collections\ArrayCollection();
    }

    /**
     * Add projectZonePlant
     *
     * @param \AppBundle\Entity\ProjectZonePlant $projectZonePlant
     *
     * @return Project
     */
    public function addProjectZonePlant(\AppBundle\Entity\ProjectZonePlant $projectZonePlant)
    {
        $this->projectZonePlants[] = $projectZonePlant;

        return $this;
    }

    /**
     * Remove projectZonePlant
     *
     * @param \AppBundle\Entity\ProjectZonePlant $projectZonePlant
     */
    public function removeProjectZonePlant(\AppBundle\Entity\ProjectZonePlant $projectZonePlant)
    {
        $this->projectZonePlants->removeElement($projectZonePlant);
    }

    /**
     * Get projectZonePlants
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getProjectZonePlants()
    {
        return $this->projectZonePlants;
    }

    /**
     * Set fosUser
     *
     * @param \AppBundle\Entity\User $fosUser
     *
     * @return Project
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
     * Set zoneType
     *
     * @param \AppBundle\Entity\GardenType $zoneType
     *
     * @return Project
     */
    public function setZoneType(\AppBundle\Entity\GardenType $zoneType = null)
    {
        $this->zoneType = $zoneType;

        return $this;
    }

    /**
     * Get zoneType
     *
     * @return \AppBundle\Entity\GardenType
     */
    public function getZoneType()
    {
        return $this->zoneType;
    }

    /**
     * Set gardenType
     *
     * @param \AppBundle\Entity\GardenType $gardenType
     *
     * @return Project
     */
    public function setGardenType(\AppBundle\Entity\GardenType $gardenType = null)
    {
        $this->gardenType = $gardenType;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getGardenType()
    {
        return $this->gardenType;
    }


    /**
     * Set pathScreenshot2D
     *
     * @param string $pathScreenshot2D
     *
     * @return Project
     */
    public function setPathScreenshot2D($pathScreenshot2D)
    {
        $this->pathScreenshot2D = $pathScreenshot2D;

        return $this;
    }

    /**
     * Get pathScreenshot2D
     *
     * @return string
     */
    public function getPathScreenshot2D()
    {
        return $this->pathScreenshot2D;
    }

    /**
     * Set street
     *
     * @param string $street
     *
     * @return Project
     */
    public function setStreet($street)
    {
        $this->street = $street;

        return $this;
    }

    /**
     * Get street
     *
     * @return string
     */
    public function getStreet()
    {
        return $this->street;
    }

    /**
     * Set city
     *
     * @param string $city
     *
     * @return Project
     */
    public function setCity($city)
    {
        $this->city = $city;

        return $this;
    }

    /**
     * Get city
     *
     * @return string
     */
    public function getCity()
    {
        return $this->city;
    }

    /**
     * Set zip
     *
     * @param string $zip
     *
     * @return Project
     */
    public function setZip($zip)
    {
        $this->zip = $zip;

        return $this;
    }

    /**
     * Get zip
     *
     * @return string
     */
    public function getZip()
    {
        return $this->zip;
    }

    /**
     * Set country
     *
     * @param string $country
     *
     * @return Project
     */
    public function setCountry($country)
    {
        $this->country = $country;

        return $this;
    }

    /**
     * Get country
     *
     * @return string
     */
    public function getCountry()
    {
        return $this->country;
    }


    /**
     * Set pathScreenshot3D
     *
     * @param string $pathScreenshot3D
     *
     * @return Project
     */
    public function setPathScreenshot3D($pathScreenshot3D)
    {
        $this->pathScreenshot3D = $pathScreenshot3D;

        return $this;
    }

    /**
     * Get pathScreenshot3D
     *
     * @return string
     */
    public function getPathScreenshot3D()
    {
        return $this->pathScreenshot3D;
    }

    /**
     * Set purchase
     *
     * @param \AppBundle\Entity\Purchase $purchase
     *
     * @return Project
     */
    public function setPurchase(\AppBundle\Entity\Purchase $purchase = null)
    {
        $this->purchase = $purchase;

        return $this;
    }

    /**
     * Get purchase
     *
     * @return \AppBundle\Entity\Purchase
     */
    public function getPurchase()
    {
        return $this->purchase;
    }

    /**
     * Set pathPlantingPlan
     *
     * @param string $pathPlantingPlan
     *
     * @return Project
     */
    public function setPathPlantingPlan($pathPlantingPlan)
    {
        $this->pathPlantingPlan = $pathPlantingPlan;

        return $this;
    }

    /**
     * Get pathPlantingPlan
     *
     * @return string
     */
    public function getPathPlantingPlan()
    {
        return $this->pathPlantingPlan;
    }

    /**
     * Set plantingPlanCaption
     *
     * @param string $plantingPlanCaption
     *
     * @return Project
     */
    public function setPlantingPlanCaption($plantingPlanCaption)
    {
        $this->plantingPlanCaption = $plantingPlanCaption;

        return $this;
    }

    /**
     * Get plantingPlanCaption
     *
     * @return string
     */
    public function getPlantingPlanCaption()
    {
        return $this->plantingPlanCaption;
    }

    /**
     * Set fixedPriceHT.
     *
     * @param int|null $fixedPriceHT
     *
     * @return Project
     */
    public function setFixedPriceHT($fixedPriceHT = null)
    {
        $this->fixedPriceHT = $fixedPriceHT;

        return $this;
    }

    /**
     * Get fixedPriceHT.
     *
     * @return int|null
     */
    public function getFixedPriceHT()
    {
        return $this->fixedPriceHT;
    }

    /**
     * Set paypalPaymentId
     *
     * @param string $paypalPaymentId
     *
     * @return Project
     */
    public function setPaypalPaymentId($paypalPaymentId)
    {
        $this->paypalPaymentId = $paypalPaymentId;

        return $this;
    }

    /**
     * Get paypalPaymentId
     *
     * @return string
     */
    public function getPaypalPaymentId()
    {
        return $this->paypalPaymentId;
    }

    /**
     * Set paypalState
     *
     * @param string $paypalState
     *
     * @return Project
     */
    public function setPaypalState($paypalState)
    {
        $this->paypalState = $paypalState;

        return $this;
    }

    /**
     * Get paypalState
     *
     * @return string
     */
    public function getPaypalState()
    {
        return $this->paypalState;
    }


    /**
     * Set totalPriceTTC.
     *
     * @param string|null $totalPriceTTC
     *
     * @return Project
     */
    public function setTotalPriceTTC($totalPriceTTC = null)
    {
        $this->totalPriceTTC = $totalPriceTTC;

        return $this;
    }

    /**
     * Get totalPriceTTC.
     *
     * @return string|null
     */
    public function getTotalPriceTTC()
    {
        return $this->totalPriceTTC;
    }

    /**
     * Set totalPriceHT.
     *
     * @param string|null $totalPriceHT
     *
     * @return Project
     */
    public function setTotalPriceHT($totalPriceHT = null)
    {
        $this->totalPriceHT = $totalPriceHT;

        return $this;
    }

    /**
     * Get totalPriceHT.
     *
     * @return string|null
     */
    public function getTotalPriceHT()
    {
        return $this->totalPriceHT;
    }

    /**
     * Set priceGroupPlantsHT.
     *
     * @param string|null $priceGroupPlantsHT
     *
     * @return Project
     */
    public function setPriceGroupPlantsHT($priceGroupPlantsHT = null)
    {
        $this->priceGroupPlantsHT = $priceGroupPlantsHT;

        return $this;
    }

    /**
     * Get priceGroupPlantsHT.
     *
     * @return string|null
     */
    public function getPriceGroupPlantsHT()
    {
        return $this->priceGroupPlantsHT;
    }

    /**
     * Set priceGroupPlantsTTC.
     *
     * @param string|null $priceGroupPlantsTTC
     *
     * @return Project
     */
    public function setPriceGroupPlantsTTC($priceGroupPlantsTTC = null)
    {
        $this->priceGroupPlantsTTC = $priceGroupPlantsTTC;

        return $this;
    }

    /**
     * Get priceGroupPlantsTTC.
     *
     * @return string|null
     */
    public function getPriceGroupPlantsTTC()
    {
        return $this->priceGroupPlantsTTC;
    }

    /**
     * Set priceGroupToolsHT.
     *
     * @param string|null $priceGroupToolsHT
     *
     * @return Project
     */
    public function setPriceGroupToolsHT($priceGroupToolsHT = null)
    {
        $this->priceGroupToolsHT = $priceGroupToolsHT;

        return $this;
    }

    /**
     * Get priceGroupToolsHT.
     *
     * @return string|null
     */
    public function getPriceGroupToolsHT()
    {
        return $this->priceGroupToolsHT;
    }

    /**
     * Set priceGroupToolsTTC.
     *
     * @param string|null $priceGroupToolsTTC
     *
     * @return Project
     */
    public function setPriceGroupToolsTTC($priceGroupToolsTTC = null)
    {
        $this->priceGroupToolsTTC = $priceGroupToolsTTC;

        return $this;
    }

    /**
     * Get priceGroupToolsTTC.
     *
     * @return string|null
     */
    public function getPriceGroupToolsTTC()
    {
        return $this->priceGroupToolsTTC;
    }

    /**
     * Set fixedPriceTTC.
     *
     * @param int|null $fixedPriceTTC
     *
     * @return Project
     */
    public function setFixedPriceTTC($fixedPriceTTC = null)
    {
        $this->fixedPriceTTC = $fixedPriceTTC;

        return $this;
    }

    /**
     * Get fixedPriceTTC.
     *
     * @return int|null
     */
    public function getFixedPriceTTC()
    {
        return $this->fixedPriceTTC;
    }

    /**
     * Set quotation.
     *
     * @param \AppBundle\Entity\Quotation|null $quotation
     *
     * @return Project
     */
    public function setQuotation(\AppBundle\Entity\Quotation $quotation = null)
    {
        $this->quotation = $quotation;

        return $this;
    }

    /**
     * Get quotation.
     *
     * @return \AppBundle\Entity\Quotation|null
     */
    public function getQuotation()
    {
        return $this->quotation;
    }

    /**
     * Set deliveryPriceTTC.
     *
     * @param string|null $deliveryPriceTTC
     *
     * @return Project
     */
    public function setDeliveryPriceTTC($deliveryPriceTTC = null)
    {
        $this->deliveryPriceTTC = $deliveryPriceTTC;

        return $this;
    }

    /**
     * Get deliveryPriceTTC.
     *
     * @return string|null
     */
    public function getDeliveryPriceTTC()
    {
        return $this->deliveryPriceTTC;
    }

    /**
     * Set deliveryPriceHT.
     *
     * @param string|null $deliveryPriceHT
     *
     * @return Project
     */
    public function setDeliveryPriceHT($deliveryPriceHT = null)
    {
        $this->deliveryPriceHT = $deliveryPriceHT;

        return $this;
    }

    /**
     * Get deliveryPriceHT.
     *
     * @return string|null
     */
    public function getDeliveryPriceHT()
    {
        return $this->deliveryPriceHT;
    }

    /**
     * Set subscriptionUnitPriceHT.
     *
     * @param string|null $subscriptionUnitPriceHT
     *
     * @return Project
     */
    public function setSubscriptionUnitPriceHT($subscriptionUnitPriceHT = null)
    {
        $this->subscriptionUnitPriceHT = $subscriptionUnitPriceHT;

        return $this;
    }

    /**
     * Get subscriptionUnitPriceHT.
     *
     * @return string|null
     */
    public function getSubscriptionUnitPriceHT()
    {
        return $this->subscriptionUnitPriceHT;
    }

    /**
     * Set subscriptionUnitPriceTTC.
     *
     * @param string|null $subscriptionUnitPriceTTC
     *
     * @return Project
     */
    public function setSubscriptionUnitPriceTTC($subscriptionUnitPriceTTC = null)
    {
        $this->subscriptionUnitPriceTTC = $subscriptionUnitPriceTTC;

        return $this;
    }

    /**
     * Get subscriptionUnitPriceTTC.
     *
     * @return string|null
     */
    public function getSubscriptionUnitPriceTTC()
    {
        return $this->subscriptionUnitPriceTTC;
    }

    /**
     * Set subscriptionPriceHT.
     *
     * @param string|null $subscriptionPriceHT
     *
     * @return Project
     */
    public function setSubscriptionPriceHT($subscriptionPriceHT = null)
    {
        $this->subscriptionPriceHT = $subscriptionPriceHT;

        return $this;
    }

    /**
     * Get subscriptionPriceHT.
     *
     * @return string|null
     */
    public function getSubscriptionPriceHT()
    {
        return $this->subscriptionPriceHT;
    }

    /**
     * Set subscriptionPriceTTC.
     *
     * @param string|null $subscriptionPriceTTC
     *
     * @return Project
     */
    public function setSubscriptionPriceTTC($subscriptionPriceTTC = null)
    {
        $this->subscriptionPriceTTC = $subscriptionPriceTTC;

        return $this;
    }

    /**
     * Get subscriptionPriceTTC.
     *
     * @return string|null
     */
    public function getSubscriptionPriceTTC()
    {
        return $this->subscriptionPriceTTC;
    }
}
