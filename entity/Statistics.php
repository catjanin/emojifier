<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Statistics
 *
 * @ORM\Table(name="statistics")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\StatisticsRepository")
 */
class Statistics
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
     * @var \DateTime|null
     *
     * @ORM\Column(name="date", type="datetime", nullable=true)
     */
    private $date;

    /**
     * @var int|null
     *
     * @ORM\Column(name="matomo_visits", type="integer", nullable=true)
     */
    private $matomoVisits;

    /**
     * @var int|null
     *
     * @ORM\Column(name="google_visits", type="integer", nullable=true)
     */
    private $googleVisits;

    /**
     * @var int|null
     *
     * @ORM\Column(name="home_clics", type="integer", nullable=true)
     */
    private $homeClics;

    /**
     * @var int|null
     *
     * @ORM\Column(name="google_unique_visits", type="integer", nullable=true)
     */
    private $googleUniqueVisits;

    /**
     * @var int|null
     *
     * @ORM\Column(name="matomo_unique_visits", type="integer", nullable=true)
     */
    private $matomoUniqueVisits;

    /**
     * @var int|null
     *
     * @ORM\Column(name="google_bounce", type="integer", nullable=true)
     */
    private $googleBounce;

    /**
     * @var int|null
     *
     * @ORM\Column(name="matomo_bounce", type="integer", nullable=true)
     */
    private $matomoBounce;

    /**
     * @var \DateTime|null
     *
     * @ORM\Column(name="google_duration", type="integer", nullable=true)
     */
    private $googleDuration;

    /**
     * @var \DateTime|null
     *
     * @ORM\Column(name="matomo_duration", type="integer", nullable=true)
     */
    private $matomoDuration;

    /**
     * @var int|null
     *
     * @ORM\Column(name="google_direct", type="integer", nullable=true)
     */
    private $googleDirect;

    /**
     * @var int|null
     *
     * @ORM\Column(name="matomo_direct", type="integer", nullable=true)
     */
    private $matomoDirect;

    /**
     * @var int|null
     *
     * @ORM\Column(name="google_organic", type="integer", nullable=true)
     */
    private $googleOrganic;

    /**
     * @var int|null
     *
     * @ORM\Column(name="matomo_organic", type="integer", nullable=true)
     */
    private $matomoOrganic;

    /**
     * @var int|null
     *
     * @ORM\Column(name="google_campaign", type="integer", nullable=true)
     */
    private $googleCampaign;

    /**
     * @var int|null
     *
     * @ORM\Column(name="matomo_campaign", type="integer", nullable=true)
     */
    private $matomoCampaign;

    /**
     * @var int|null
     *
     * @ORM\Column(name="google_social", type="integer", nullable=true)
     */
    private $googleSocial;

    /**
     * @var int|null
     *
     * @ORM\Column(name="matomo_social", type="integer", nullable=true)
     */
    private $matomoSocial;

    /**
     * @var int|null
     *
     * @ORM\Column(name="drawing_visits", type="integer", nullable=true)
     */
    private $drawingVisits;

    /**
     * @var int|null
     *
     * @ORM\Column(name="generated_gardens", type="integer", nullable=true)
     */
    private $generatedGardens;

    /**
     * @var int|null
     *
     * @ORM\Column(name="projects", type="integer", nullable=true)
     */
    private $projects;

    /**
     * @var int|null
     *
     * @ORM\Column(name="commands", type="integer", nullable=true)
     */
    private $commands;



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
     * @param \DateTime|null $date
     *
     * @return Statistics
     */
    public function setDate($date = null)
    {
        $this->date = $date;

        return $this;
    }

    /**
     * Get date.
     *
     * @return \DateTime|null
     */
    public function getDate()
    {
        return $this->date;
    }

    /**
     * Set matomoVisits.
     *
     * @param int|null $matomoVisits
     *
     * @return Statistics
     */
    public function setMatomoVisits($matomoVisits = null)
    {
        $this->matomoVisits = $matomoVisits;

        return $this;
    }

    /**
     * Get matomoVisits.
     *
     * @return int|null
     */
    public function getMatomoVisits()
    {
        return $this->matomoVisits;
    }

    /**
     * Set googleVisits.
     *
     * @param int|null $googleVisits
     *
     * @return Statistics
     */
    public function setGoogleVisits($googleVisits = null)
    {
        $this->googleVisits = $googleVisits;

        return $this;
    }

    /**
     * Get googleVisits.
     *
     * @return int|null
     */
    public function getGoogleVisits()
    {
        return $this->googleVisits;
    }

    /**
     * Set homeClics.
     *
     * @param int|null $homeClics
     *
     * @return Statistics
     */
    public function setHomeClics($homeClics = null)
    {
        $this->homeClics = $homeClics;

        return $this;
    }

    /**
     * Get homeClics.
     *
     * @return int|null
     */
    public function getHomeClics()
    {
        return $this->homeClics;
    }

    /**
     * Set googleUniqueVisits.
     *
     * @param int|null $googleUniqueVisits
     *
     * @return Statistics
     */
    public function setGoogleUniqueVisits($googleUniqueVisits = null)
    {
        $this->googleUniqueVisits = $googleUniqueVisits;

        return $this;
    }

    /**
     * Get googleUniqueVisits.
     *
     * @return int|null
     */
    public function getGoogleUniqueVisits()
    {
        return $this->googleUniqueVisits;
    }

    /**
     * Set matomoUniqueVisits.
     *
     * @param int|null $matomoUniqueVisits
     *
     * @return Statistics
     */
    public function setMatomoUniqueVisits($matomoUniqueVisits = null)
    {
        $this->matomoUniqueVisits = $matomoUniqueVisits;

        return $this;
    }

    /**
     * Get matomoUniqueVisits.
     *
     * @return int|null
     */
    public function getMatomoUniqueVisits()
    {
        return $this->matomoUniqueVisits;
    }

    /**
     * Set googleBounce.
     *
     * @param int|null $googleBounce
     *
     * @return Statistics
     */
    public function setGoogleBounce($googleBounce = null)
    {
        $this->googleBounce = $googleBounce;

        return $this;
    }

    /**
     * Get googleBounce.
     *
     * @return int|null
     */
    public function getGoogleBounce()
    {
        return $this->googleBounce;
    }

    /**
     * Set matomoBounce.
     *
     * @param int|null $matomoBounce
     *
     * @return Statistics
     */
    public function setMatomoBounce($matomoBounce = null)
    {
        $this->matomoBounce = $matomoBounce;

        return $this;
    }

    /**
     * Get matomoBounce.
     *
     * @return int|null
     */
    public function getMatomoBounce()
    {
        return $this->matomoBounce;
    }

    /**
     * Set googleDuration.
     *
     * @param \DateTime|null $googleDuration
     *
     * @return Statistics
     */
    public function setGoogleDuration($googleDuration = null)
    {
        $this->googleDuration = $googleDuration;

        return $this;
    }

    /**
     * Get googleDuration.
     *
     * @return \DateTime|null
     */
    public function getGoogleDuration()
    {
        return $this->googleDuration;
    }

    /**
     * Set matomoDuration.
     *
     * @param \DateTime|null $matomoDuration
     *
     * @return Statistics
     */
    public function setMatomoDuration($matomoDuration = null)
    {
        $this->matomoDuration = $matomoDuration;

        return $this;
    }

    /**
     * Get matomoDuration.
     *
     * @return \DateTime|null
     */
    public function getMatomoDuration()
    {
        return $this->matomoDuration;
    }

    /**
     * Set googleDirect.
     *
     * @param int|null $googleDirect
     *
     * @return Statistics
     */
    public function setGoogleDirect($googleDirect = null)
    {
        $this->googleDirect = $googleDirect;

        return $this;
    }

    /**
     * Get googleDirect.
     *
     * @return int|null
     */
    public function getGoogleDirect()
    {
        return $this->googleDirect;
    }

    /**
     * Set matomoDirect.
     *
     * @param int|null $matomoDirect
     *
     * @return Statistics
     */
    public function setMatomoDirect($matomoDirect = null)
    {
        $this->matomoDirect = $matomoDirect;

        return $this;
    }

    /**
     * Get matomoDirect.
     *
     * @return int|null
     */
    public function getMatomoDirect()
    {
        return $this->matomoDirect;
    }

    /**
     * Set googleOrganic.
     *
     * @param int|null $googleOrganic
     *
     * @return Statistics
     */
    public function setGoogleOrganic($googleOrganic = null)
    {
        $this->googleOrganic = $googleOrganic;

        return $this;
    }

    /**
     * Get googleOrganic.
     *
     * @return int|null
     */
    public function getGoogleOrganic()
    {
        return $this->googleOrganic;
    }

    /**
     * Set matomoOrganic.
     *
     * @param int|null $matomoOrganic
     *
     * @return Statistics
     */
    public function setMatomoOrganic($matomoOrganic = null)
    {
        $this->matomoOrganic = $matomoOrganic;

        return $this;
    }

    /**
     * Get matomoOrganic.
     *
     * @return int|null
     */
    public function getMatomoOrganic()
    {
        return $this->matomoOrganic;
    }

    /**
     * Set googleCampaign.
     *
     * @param int|null $googleCampaign
     *
     * @return Statistics
     */
    public function setGoogleCampaign($googleCampaign = null)
    {
        $this->googleCampaign = $googleCampaign;

        return $this;
    }

    /**
     * Get googleCampaign.
     *
     * @return int|null
     */
    public function getGoogleCampaign()
    {
        return $this->googleCampaign;
    }

    /**
     * Set matomoCampaign.
     *
     * @param int|null $matomoCampaign
     *
     * @return Statistics
     */
    public function setMatomoCampaign($matomoCampaign = null)
    {
        $this->matomoCampaign = $matomoCampaign;

        return $this;
    }

    /**
     * Get matomoCampaign.
     *
     * @return int|null
     */
    public function getMatomoCampaign()
    {
        return $this->matomoCampaign;
    }

    /**
     * Set googleSocial.
     *
     * @param int|null $googleSocial
     *
     * @return Statistics
     */
    public function setGoogleSocial($googleSocial = null)
    {
        $this->googleSocial = $googleSocial;

        return $this;
    }

    /**
     * Get googleSocial.
     *
     * @return int|null
     */
    public function getGoogleSocial()
    {
        return $this->googleSocial;
    }

    /**
     * Set matomoSocial.
     *
     * @param int|null $matomoSocial
     *
     * @return Statistics
     */
    public function setMatomoSocial($matomoSocial = null)
    {
        $this->matomoSocial = $matomoSocial;

        return $this;
    }

    /**
     * Get matomoSocial.
     *
     * @return int|null
     */
    public function getMatomoSocial()
    {
        return $this->matomoSocial;
    }

    /**
     * Set drawingVisits.
     *
     * @param int|null $drawingVisits
     *
     * @return Statistics
     */
    public function setDrawingVisits($drawingVisits = null)
    {
        $this->drawingVisits = $drawingVisits;

        return $this;
    }

    /**
     * Get drawingVisits.
     *
     * @return int|null
     */
    public function getDrawingVisits()
    {
        return $this->drawingVisits;
    }

    /**
     * Set generatedGardens.
     *
     * @param int|null $generatedGardens
     *
     * @return Statistics
     */
    public function setGeneratedGardens($generatedGardens = null)
    {
        $this->generatedGardens = $generatedGardens;

        return $this;
    }

    /**
     * Get generatedGardens.
     *
     * @return int|null
     */
    public function getGeneratedGardens()
    {
        return $this->generatedGardens;
    }

    /**
     * Set projects.
     *
     * @param int|null $projects
     *
     * @return Statistics
     */
    public function setProjects($projects = null)
    {
        $this->projects = $projects;

        return $this;
    }

    /**
     * Get projects.
     *
     * @return int|null
     */
    public function getProjects()
    {
        return $this->projects;
    }

    /**
     * Set commands.
     *
     * @param int|null $commands
     *
     * @return Statistics
     */
    public function setCommands($commands = null)
    {
        $this->commands = $commands;

        return $this;
    }

    /**
     * Get commands.
     *
     * @return int|null
     */
    public function getCommands()
    {
        return $this->commands;
    }
}
