<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * GardenType
 *
 * @ORM\Table(name="garden_type")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\GardenTypeRepository")
 */
class GardenType
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
     * @ORM\OneToMany(targetEntity="AppBundle\Entity\Project", mappedBy="gardenType")
     */
    private $projects;

    /**
     * @ORM\OneToMany(targetEntity="AppBundle\Entity\Zone", mappedBy="gardenType")
     */
    private $zones;

    /**
     * @ORM\OneToMany(targetEntity="AppBundle\Entity\GardenCarousel", mappedBy="gardenType", cascade={"persist", "remove"})
     */
    private $gardenCarousels;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255)
     */
    private $name;

    /**
     * @var string
     *
     * @ORM\Column(name="title", type="string", length=255)
     */
    private $title;

    /**
     * @var string
     *
     * @ORM\Column(name="price", type="decimal", precision=10, scale=2)
     */
    private $price;

    /**
     * @var string
     *
     * @ORM\Column(name="description", type="string", length=255)
     */
    private $description;

    /**
     * @var string
     *
     * @ORM\Column(name="descriptionLong", type="text")
     */
    private $descriptionLong;

    /**
     * @var string
     *
     * @ORM\Column(name="picture", type="string", length=255)
     */
    private $picture;

    /**
     * @var int
     *
     * @ORM\Column(name="orderGarden", type="integer")
     */
    private $orderGarden;

    /**
     * @ORM\OneToMany(targetEntity="AppBundle\Entity\Document", mappedBy="gardenType")
     */
    private $picturesCommunity;

    /**
     * @var \Doctrine\Common\Collections\Collection|PriorityPlant[]
     *
     * @ORM\ManyToMany(targetEntity="PriorityPlant", mappedBy="gardenTypes", cascade={"remove"})
     */
    protected $priorities;

    /**
     * @var int
     *
     * @ORM\Column(name="ratePrice", type="integer")
     */
    private $ratePrice;

    /**
     * @var string
     *
     * @ORM\Column(name="water_color_picture", type="string")
     */
    private $waterColorPicture;

    /**
     * @var string
     *
     * @ORM\Column(name="water_color_alt", type="string")
     */
    private $waterColorAlt;

    /**
     * @var string
     *
     * @ORM\Column(name="history_picture", type="string")
     */
    private $historyPicture;

    /**
     * @var string
     *
     * @ORM\Column(name="history_picture_alt", type="string")
     */
    private $historyPictureAlt;

    /**
     * @var string
     *
     * @ORM\Column(name="history_content", type="string")
     */
    private $historyContent;

    /**
     * @var string
     *
     * @ORM\Column(name="introduction_picture", type="string")
     */
    private $introductionPicture;

    /**
     * @var string
     *
     * @ORM\Column(name="introduction_picture_alt", type="string")
     */
    private $introductionPictureAlt;

    /**
     * @var string
     *
     * @ORM\Column(name="introduction_content", type="string")
     */
    private $introductionContent;

    /**
     * @var string
     *
     * @ORM\Column(name="button_tools_title", type="string")
     */
    private $buttonToolsTitle;

    /**
     * @var string
     *
     * @ORM\Column(name="tools_picture_2D", type="string")
     */
    private $toolsPicture2D;

    /**
     * @var string
     *
     * @ORM\Column(name="tools_picture_3D", type="string")
     */
    private $toolsPicture3D;

    /**
     * @var string
     *
     * @ORM\Column(name="tools_content", type="string")
     */
    private $toolsContent;

    /**
     * @var string
     *
     * @ORM\Column(name="title_garden_page", type="string")
     */
    private $titleGardenPage;

    /**
     * @var string
     *
     * @ORM\Column(name="adjectives_garden", type="string")
     */
    private $adjectivesGarden;

    /**
     * @var string
     *
     * @ORM\Column(name="picture_banner", type="string")
     */
    private $pictureBanner;

    /**
     * @var string
     *
     * @ORM\Column(name="picture_banner_alt", type="string")
     */
    private $pictureBannerAlt;

    /**
     * @var string
     *
     * @ORM\Column(name="history_caption", type="string")
     */
    private $historyCaption;

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
     * Set name
     *
     * @param string $name
     *
     * @return GardenType
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
     * Set price
     *
     * @param string $price
     *
     * @return GardenType
     */
    public function setPrice($price)
    {
        $this->price = $price;

        return $this;
    }

    /**
     * Get price
     *
     * @return string
     */
    public function getPrice()
    {
        return $this->price;
    }

    /**
     * @return string
     */
    public function getToolsPicture2D()
    {
        return $this->toolsPicture2D;
    }

    /**
     * @param string $toolsPicture2D
     */
    public function setToolsPicture2D($toolsPicture2D)
    {
        $this->toolsPicture2D = $toolsPicture2D;
    }

    /**
     * @return string
     */
    public function getToolsPicture3D()
    {
        return $this->toolsPicture3D;
    }

    /**
     * @param string $toolsPicture3D
     */
    public function setToolsPicture3D($toolsPicture3D)
    {
        $this->toolsPicture3D = $toolsPicture3D;
    }

    /**
     * @return string
     */
    public function getToolsContent()
    {
        return $this->toolsContent;
    }

    /**
     * @param string $toolsContent
     */
    public function setToolsContent($toolsContent)
    {
        $this->toolsContent = $toolsContent;
    }

    /**
     * @return string
     */
    public function getTitleGardenPage()
    {
        return $this->titleGardenPage;
    }

    /**
     * @param string $titleGarden
     */
    public function setTitleGardenPage($titleGardenPage)
    {
        $this->titleGardenPage = $titleGardenPage;
    }

    /**
     * @return string
     */
    public function getAdjectivesGarden()
    {
        return $this->adjectivesGarden;
    }

    /**
     * @param string $adjectivesGarden
     */
    public function setAdjectivesGarden($adjectivesGarden)
    {
        $this->adjectivesGarden = $adjectivesGarden;
    }

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->projects = new \Doctrine\Common\Collections\ArrayCollection();
        $this->priorities = new \Doctrine\Common\Collections\ArrayCollection();
    }

    /**
     * Add project
     *
     * @param \AppBundle\Entity\Project $project
     *
     * @return GardenType
     */
    public function addProject(\AppBundle\Entity\Project $project)
    {
        $this->projects[] = $project;

        return $this;
    }

    /**
     * Remove project
     *
     * @param \AppBundle\Entity\Project $project
     */
    public function removeProject(\AppBundle\Entity\Project $project)
    {
        $this->projects->removeElement($project);
    }

    /**
     * Get projects
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getProjects()
    {
        return $this->projects;
    }

    /**
     * Add zone
     *
     * @param \AppBundle\Entity\Zone $zone
     *
     * @return GardenType
     */
    public function addZone(\AppBundle\Entity\Zone $zone)
    {
        $this->zones[] = $zone;

        return $this;
    }

    /**
     * Remove zone
     *
     * @param \AppBundle\Entity\Zone $zone
     */
    public function removeZone(\AppBundle\Entity\Zone $zone)
    {
        $this->zones->removeElement($zone);
    }

    /**
     * Get zones
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getZones()
    {
        return $this->zones;
    }


    /**
     * Set description
     *
     * @param string $description
     *
     * @return GardenType
     */
    public function setDescription($description)
    {
        $this->description = $description;

        return $this;
    }

    /**
     * Get description
     *
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
     * Set picture
     *
     * @param string $picture
     *
     * @return GardenType
     */
    public function setPicture($picture)
    {
        $this->picture = $picture;

        return $this;
    }

    /**
     * Get picture
     *
     * @return string
     */
    public function getPicture()
    {
        return $this->picture;
    }

    /**
     * Set title
     *
     * @param string $title
     *
     * @return GardenType
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * Get title
     *
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * @return string
     */
    public function getIntroductionPicture()
    {
        return $this->introductionPicture;
    }

    /**
     * @param string $introductionPicture
     */
    public function setIntroductionPicture($introductionPicture)
    {
        $this->introductionPicture = $introductionPicture;
    }

    /**
     * @return string
     */
    public function getIntroductionPictureAlt()
    {
        return $this->introductionPictureAlt;
    }

    /**
     * @param string $introductionPictureAlt
     */
    public function setIntroductionPictureAlt($introductionPictureAlt)
    {
        $this->introductionPictureAlt = $introductionPictureAlt;
    }

    /**
     * @return string
     */
    public function getIntroductionContent()
    {
        return $this->introductionContent;
    }

    /**
     * @param string $introductionContent
     */
    public function setIntroductionContent($introductionContent)
    {
        $this->introductionContent = $introductionContent;
    }

    /**
     * @return string
     */
    public function getButtonToolsTitle()
    {
        return $this->buttonToolsTitle;
    }

    /**
     * @param string $buttonToolsTitle
     */
    public function setButtonToolsTitle($buttonToolsTitle)
    {
        $this->buttonToolsTitle = $buttonToolsTitle;
    }

    /**
     * Add gardenCarousel
     *
     * @param \AppBundle\Entity\GardenCarousel $gardenCarousel
     *
     * @return GardenType
     */
    public function addGardenCarousel(\AppBundle\Entity\GardenCarousel $gardenCarousel)
    {
        $this->gardenCarousels[] = $gardenCarousel;
        $gardenCarousel->setGardenType($this);

        return $this;
    }

    /**
     * Remove gardenCarousel
     *
     * @param \AppBundle\Entity\GardenCarousel $gardenCarousel
     */
    public function removeGardenCarousel(\AppBundle\Entity\GardenCarousel $gardenCarousel)
    {
        $this->gardenCarousels->removeElement($gardenCarousel);
    }

    /**
     * Get gardenCarousels
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getGardenCarousels()
    {
        return $this->gardenCarousels;
    }

    /**
     * @return string
     */
    public function getWaterColorAlt()
    {
        return $this->waterColorAlt;
    }

    /**
     * @param string $waterColorAlt
     */
    public function setWaterColorAlt($waterColorAlt)
    {
        $this->waterColorAlt = $waterColorAlt;
    }

    /**
     * Set descriptionLong
     *
     * @param string $descriptionLong
     *
     * @return GardenType
     */
    public function setDescriptionLong($descriptionLong)
    {
        $this->descriptionLong = $descriptionLong;

        return $this;
    }

    /**
     * Get descriptionLong
     *
     * @return string
     */
    public function getDescriptionLong()
    {
        return $this->descriptionLong;
    }

    /**
     * @return string
     */
    public function getWaterColorPicture()
    {
        return $this->waterColorPicture;
    }

    /**
     * @param string $waterColorPicture
     */
    public function setWaterColorPicture($waterColorPicture)
    {
        $this->waterColorPicture = $waterColorPicture;
    }

    /**
     * @return string
     */
    public function getHistoryPicture()
    {
        return $this->historyPicture;
    }

    /**
     * @param string $historyPicture
     */
    public function setHistoryPicture($historyPicture)
    {
        $this->historyPicture = $historyPicture;
    }

    /**
     * @return string
     */
    public function getHistoryPictureAlt()
    {
        return $this->historyPictureAlt;
    }

    /**
     * @param string $historyPictureAlt
     */
    public function setHistoryPictureAlt($historyPictureAlt)
    {
        $this->historyPictureAlt = $historyPictureAlt;
    }

    /**
     * @return string
     */
    public function getHistoryContent()
    {
        return $this->historyContent;
    }

    /**
     * @param string $historyContent
     */
    public function setHistoryContent($historyContent)
    {
        $this->historyContent = $historyContent;
    }

    /**
     * Set orderGarden.
     *
     * @param int $orderGarden
     *
     * @return GardenType
     */
    public function setOrderGarden($orderGarden)
    {
        $this->orderGarden = $orderGarden;

        return $this;
    }

    /**
     * Get orderGarden.
     *
     * @return int
     */
    public function getOrderGarden()
    {
        return $this->orderGarden;
    }

    /**
     * Add priority.
     *
     * @param \AppBundle\Entity\PriorityPlant $priority
     *
     * @return GardenType
     */
    public function addPriority(\AppBundle\Entity\PriorityPlant $priority)
    {
        $this->priorities[] = $priority;

        return $this;
    }

    /**
     * Remove priority.
     *
     * @param \AppBundle\Entity\PriorityPlant $priority
     *
     * @return boolean TRUE if this collection contained the specified element, FALSE otherwise.
     */
    public function removePriority(\AppBundle\Entity\PriorityPlant $priority)
    {
        return $this->priorities->removeElement($priority);
    }

    /**
     * Get priorities.
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getPriorities()
    {
        return $this->priorities;
    }

    /**
     * Set ratePrice.
     *
     * @param int $ratePrice
     *
     * @return GardenType
     */
    public function setRatePrice($ratePrice)
    {
        $this->ratePrice = $ratePrice;

        return $this;
    }

    /**
     * Get ratePrice.
     *
     * @return int
     */
    public function getRatePrice()
    {
        return $this->ratePrice;
    }

    /**
     * Add picturesCommunity.
     *
     * @param \AppBundle\Entity\Document $picturesCommunity
     *
     * @return GardenType
     */
    public function addPicturesCommunity(\AppBundle\Entity\Document $picturesCommunity)
    {
        $this->picturesCommunity[] = $picturesCommunity;

        return $this;
    }

    /**
     * Remove picturesCommunity.
     *
     * @param \AppBundle\Entity\Document $picturesCommunity
     *
     * @return boolean TRUE if this collection contained the specified element, FALSE otherwise.
     */
    public function removePicturesCommunity(\AppBundle\Entity\Document $picturesCommunity)
    {
        return $this->picturesCommunity->removeElement($picturesCommunity);
    }

    /**
     * Get picturesCommunity.
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getPicturesCommunity()
    {
        return $this->picturesCommunity;
    }

    /**
     * Set pictureBanner.
     *
     * @param string $pictureBanner
     *
     * @return GardenType
     */
    public function setPictureBanner($pictureBanner)
    {
        $this->pictureBanner = $pictureBanner;

        return $this;
    }

    /**
     * Get pictureBanner.
     *
     * @return string
     */
    public function getPictureBanner()
    {
        return $this->pictureBanner;
    }

    /**
     * Set pictureBannerAlt.
     *
     * @param string $pictureBannerAlt
     *
     * @return GardenType
     */
    public function setPictureBannerAlt($pictureBannerAlt)
    {
        $this->pictureBannerAlt = $pictureBannerAlt;

        return $this;
    }

    /**
     * Get pictureBannerAlt.
     *
     * @return string
     */
    public function getPictureBannerAlt()
    {
        return $this->pictureBannerAlt;
    }

    /**
     * Set historyCaption.
     *
     * @param string $historyCaption
     *
     * @return GardenType
     */
    public function setHistoryCaption($historyCaption)
    {
        $this->historyCaption = $historyCaption;

        return $this;
    }

    /**
     * Get historyCaption.
     *
     * @return string
     */
    public function getHistoryCaption()
    {
        return $this->historyCaption;
    }
}
