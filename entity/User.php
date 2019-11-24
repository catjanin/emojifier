<?php
/**
 * Created by PhpStorm.
 * User: wilder9
 * Date: 04/01/18
 * Time: 10:53
 */

namespace AppBundle\Entity;

use FOS\UserBundle\Model\User as FosUser;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;


    /**
    * @ORM\Entity
    * @ORM\Table(name="fos_user")
    *
    * @UniqueEntity(
    *     fields={"emailCanonical"},
    *     message="email déjà utilisé",
    * )
    * @UniqueEntity(
    *     fields={"usernameCanonical"},
    *     message="nom d'utilisateur déjà utilisé",
    * )
    */
class User extends FosUser
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @var string
     *
     * @ORM\Column(name="firstname", type="string", length=255, nullable=true)
     */
    private $firstname;

    /**
     * @var string
     *
     * @ORM\Column(name="lastname", type="string", length=255, nullable=true)
     */
    private $lastname;

    /**
     * @var string
     *
     * @ORM\Column(name="address", type="string", length=255, nullable=true)
     */
    private $address;

    /**
     * @var int
     *
     * @ORM\Column(name="zip", type="integer", nullable=true)
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
     * @ORM\Column(name="phone", type="string", length=25, nullable=true)
     */
    private $phone;

    /**
     * @var string
     *
     * @ORM\Column(name="phone2", type="string", length=25, nullable=true)
     */
    private $phone2;

    /**
     * @ORM\Column(name="creation", type="date")
     */
    private $creation;

    /**
     * @ORM\OneToMany(targetEntity="AppBundle\Entity\Project", mappedBy="fosUser")
     */
    private $projects;

    /**
     * @ORM\OneToMany(targetEntity="AppBundle\Entity\Subscription", mappedBy="fosUser")
     */
    private $subscriptions;

    /**
     * @ORM\OneToMany(targetEntity="AppBundle\Entity\Document", mappedBy="user", cascade={"remove"})
     */
    private $pictures;

    /**
     * @ORM\OneToMany(targetEntity="AppBundle\Entity\PostCommunity", mappedBy="user")
     */
    private $comments;

    /**
     * @ORM\OneToMany(targetEntity="AppBundle\Entity\AnswerPost", mappedBy="user")
     */
    private $answers;

    /**
     * @var string
     *
     * @ORM\Column(name="avatar_path", type="string", nullable=true)
     */
    private $avatarPath;

    /**
     * @var boolean
     *
     * @ORM\Column(name="is_friend", type="boolean")
     */
    private $isFriend;

    /**
     * @var boolean
     *
     * @ORM\Column(name="is_ok_for_mailing", type="boolean")
     */
    private $isOKForMailing = true;

    /**
     * @var string
     *
     * @ORM\Column(name="facebook_id", type="string", nullable=true, unique=true)
     */
    private $facebookId;

    /**
     * @var boolean
     *
     * @ORM\Column(name="is_complete", type="boolean")
     */
    private $isComplete;

    /**
     * @var boolean
     *
     * @ORM\Column(name="is_selected", type="boolean")
     */
    private $isSelected = true;

    public function __construct()
    {
        parent::__construct();
        if (empty($this->creation)) {
            $this->creation = new \DateTime();
        };
        $this->isFriend = false;
        $this->isComplete = false;

    }

    /**
     * Set firstname
     *
     * @param string $firstname
     *
     * @return User
     */
    public function setFirstname($firstname)
    {
        $this->firstname = $firstname;

        return $this;
    }

    /**
     * Get firstname
     *
     * @return string
     */
    public function getFirstname()
    {
        return $this->firstname;
    }

    /**
     * Set lastname
     *
     * @param string $lastname
     *
     * @return User
     */
    public function setLastname($lastname)
    {
        $this->lastname = $lastname;

        return $this;
    }

    /**
     * Get lastname
     *
     * @return string
     */
    public function getLastname()
    {
        return $this->lastname;
    }

    /**
     * Set phone
     *
     * @param string $phone
     *
     * @return User
     */
    public function setPhone($phone)
    {
        $this->phone = $phone;

        return $this;
    }

    /**
     * Get phone
     *
     * @return string
     */
    public function getPhone()
    {
        return $this->phone;
    }

    /**
     * Set phone2
     *
     * @param string $phone2
     *
     * @return User
     */
    public function setPhone2($phone2)
    {
        $this->phone2 = $phone2;

        return $this;
    }

    /**
     * Get phone2
     *
     * @return string
     */
    public function getPhone2()
    {
        return $this->phone2;
    }


    /**
     * Add project
     *
     * @param \AppBundle\Entity\Project $project
     *
     * @return User
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
     * Set creation
     *
     * @param \DateTime $creation
     *
     * @return User
     */
    public function setCreation($creation)
    {
        $this->creation = $creation;

        return $this;
    }

    /**
     * Get creation
     *
     * @return \DateTime
     */
    public function getCreation()
    {
        return $this->creation;
    }

    /**
     * Set address
     *
     * @param string $address
     *
     * @return User
     */
    public function setAddress($address)
    {
        $this->address = $address;

        return $this;
    }

    /**
     * Get address
     *
     * @return string
     */
    public function getAddress()
    {
        return $this->address;
    }

    /**
     * Set zip
     *
     * @param integer $zip
     *
     * @return User
     */
    public function setZip($zip)
    {
        $this->zip = $zip;

        return $this;
    }

    /**
     * Get zip
     *
     * @return integer
     */
    public function getZip()
    {
        return $this->zip;
    }

    /**
     * Set city
     *
     * @param string $city
     *
     * @return User
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
     * Set country
     *
     * @param string $country
     *
     * @return User
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
     * Add subscription
     *
     * @param \AppBundle\Entity\Subscription $subscription
     *
     * @return User
     */
    public function addSubscription(\AppBundle\Entity\Subscription $subscription)
    {
        $this->subscriptions[] = $subscription;

        return $this;
    }

    /**
     * Remove subscription
     *
     * @param \AppBundle\Entity\Subscription $subscription
     */
    public function removeSubscription(\AppBundle\Entity\Subscription $subscription)
    {
        $this->subscriptions->removeElement($subscription);
    }

    /**
     * Get subscriptions
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getSubscriptions()
    {
        return $this->subscriptions;
    }


    /**
     * Add picture.
     *
     * @param \AppBundle\Entity\Document $picture
     *
     * @return User
     */
    public function addPicture(\AppBundle\Entity\Document $picture)
    {
        $this->pictures[] = $picture;

        return $this;
    }

    /**
     * Remove picture.
     *
     * @param \AppBundle\Entity\Document $picture
     *
     * @return boolean TRUE if this collection contained the specified element, FALSE otherwise.
     */
    public function removePicture(\AppBundle\Entity\Document $picture)
    {
        return $this->pictures->removeElement($picture);
    }

    /**
     * Get pictures.
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getPictures()
    {
        return $this->pictures;
    }

    /**
     * Add comment.
     *
     * @param \AppBundle\Entity\PostCommunity $comment
     *
     * @return User
     */
    public function addComment(\AppBundle\Entity\PostCommunity $comment)
    {
        $this->comments[] = $comment;

        return $this;
    }

    /**
     * Remove comment.
     *
     * @param \AppBundle\Entity\PostCommunity $comment
     *
     * @return boolean TRUE if this collection contained the specified element, FALSE otherwise.
     */
    public function removeComment(\AppBundle\Entity\PostCommunity $comment)
    {
        return $this->comments->removeElement($comment);
    }

    /**
     * Get comments.
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getComments()
    {
        return $this->comments;
    }

    /**
     * Set avatarPath.
     *
     * @param string|null $avatarPath
     *
     * @return User
     */
    public function setAvatarPath($avatarPath = null)
    {
        $this->avatarPath = $avatarPath;

        return $this;
    }

    /**
     * Get avatarPath.
     *
     * @return string|null
     */
    public function getAvatarPath()
    {
        return $this->avatarPath;
    }

    /**
     * Add answer.
     *
     * @param \AppBundle\Entity\AnswerPost $answer
     *
     * @return User
     */
    public function addAnswer(\AppBundle\Entity\AnswerPost $answer)
    {
        $this->answers[] = $answer;

        return $this;
    }

    /**
     * Remove answer.
     *
     * @param \AppBundle\Entity\AnswerPost $answer
     *
     * @return boolean TRUE if this collection contained the specified element, FALSE otherwise.
     */
    public function removeAnswer(\AppBundle\Entity\AnswerPost $answer)
    {
        return $this->answers->removeElement($answer);
    }

    /**
     * Get answers.
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getAnswers()
    {
        return $this->answers;
    }

    /**
     * Set isFriend.
     *
     * @param bool $isFriend
     *
     * @return User
     */
    public function setIsFriend($isFriend)
    {
        $this->isFriend = $isFriend;

        return $this;
    }

    /**
     * Get isFriend.
     *
     * @return bool
     */
    public function getIsFriend()
    {
        return $this->isFriend;
    }

    /**
     * Set facebookId.
     *
     * @param string|null $facebookId
     *
     * @return User
     */
    public function setFacebookId($facebookId = null)
    {
        $this->facebookId = $facebookId;

        return $this;
    }

    /**
     * Get facebookId.
     *
     * @return string|null
     */
    public function getFacebookId()
    {
        return $this->facebookId;
    }

    /**
     * Set isComplete.
     *
     * @param bool $isComplete
     *
     * @return User
     */
    public function setIsComplete($isComplete)
    {
        $this->isComplete = $isComplete;

        return $this;
    }

    /**
     * Get isComplete.
     *
     * @return bool
     */
    public function getIsComplete()
    {
        return $this->isComplete;
    }

    /**
     * @return bool
     */
    public function getIsSelected()
    {
        return $this->isSelected;
    }

    /**
     * @param bool $isSelected
     */
    public function setIsSelected($isSelected)
    {
        $this->isSelected = $isSelected;
    }

    /**
     * @return bool
     */
    public function isOKForMailing()
    {
        return $this->isOKForMailing;
    }

    /**
     * @param bool $isOKForMailing
     */
    public function setIsOKForMailing($isOKForMailing)
    {
        $this->isOKForMailing = $isOKForMailing;
    }
}
