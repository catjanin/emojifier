<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * PostCommunity
 *
 * @ORM\Table(name="post_community")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\PostCommunityRepository")
 */
class PostCommunity
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
     * @Assert\NotBlank()
     * @ORM\Column(name="title", type="string")
     */
    private $title;

    /**
     * @var string
     *
     * @Assert\NotBlank()
     * @ORM\Column(name="comment", type="text")
     */
    private $comment;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="uploaded_at", type="datetime")
     */
    private $uploadedAt;

    /**
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\User", inversedBy="comments")
     */
    private $user;

    /**
     * @ORM\OneToMany(targetEntity="AppBundle\Entity\Document", mappedBy="comment")
     */
    private $pictures;

    /**
     * @ORM\Column(name="uniq_id", type="string", nullable=true)
     */
    private $uniqId;

    /**
     * @ORM\Column(name="is_reported", type="boolean")
     */
    private $isReported;

    /**
     * @ORM\Column(name="is_validated", type="boolean")
     */
    private $isValidated = false;

    /**
     * @ORM\OneToMany(targetEntity="AppBundle\Entity\AnswerPost", mappedBy="mainPost", cascade="remove")
     */
    private $answers;

    /**
     * @ORM\ManyToMany(targetEntity="AppBundle\Entity\Tag", inversedBy="posts", cascade={"remove"})
     *
     * @Assert\Count(max = 3, maxMessage = "Vous ne pouvez pas mettre plus de {{ limit }} tags")
     *
     */
    private $tags;


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
     * Set comment.
     *
     * @param string $comment
     *
     * @return PostCommunity
     */
    public function setComment($comment)
    {
        $this->comment = $comment;

        return $this;
    }

    /**
     * Get comment.
     *
     * @return string
     */
    public function getComment()
    {
        return $this->comment;
    }

    /**
     * Set user.
     *
     * @param \AppBundle\Entity\User|null $user
     *
     * @return PostCommunity
     */
    public function setUser(\AppBundle\Entity\User $user = null)
    {
        $this->user = $user;

        return $this;
    }

    /**
     * Get user.
     *
     * @return \AppBundle\Entity\User|null
     */
    public function getUser()
    {
        return $this->user;
    }


    /**
     * Set uploadedAt.
     *
     * @param \DateTime $uploadedAt
     *
     * @return PostCommunity
     */
    public function setUploadedAt($uploadedAt)
    {
        $this->uploadedAt = $uploadedAt;

        return $this;
    }

    /**
     * Get uploadedAt.
     *
     * @return \DateTime
     */
    public function getUploadedAt()
    {
        return $this->uploadedAt;
    }

    /**
     * Set uniqId.
     *
     * @param string $uniqId
     *
     * @return PostCommunity
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
     * Constructor
     */
    public function __construct()
    {
        $this->pictures = new ArrayCollection();
        $this->isReported = false;
        $this->tags = new ArrayCollection();
    }

    /**
     * Add picture.
     *
     * @param \AppBundle\Entity\Document $picture
     *
     * @return PostCommunity
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
     * Set title.
     *
     * @param string $title
     *
     * @return PostCommunity
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

    /**
     * Get title.
     *
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set isReported.
     *
     * @param bool $isReported
     *
     * @return PostCommunity
     */
    public function setIsReported($isReported)
    {
        $this->isReported = $isReported;

        return $this;
    }

    /**
     * Get isReported.
     *
     * @return bool
     */
    public function getIsReported()
    {
        return $this->isReported;
    }

    /**
     * @return mixed
     */
    public function getIsValidated()
    {
        return $this->isValidated;
    }

    /**
     * @param mixed $isValidated
     */
    public function setIsValidated($isValidated)
    {
        $this->isValidated = $isValidated;
    }


    /**
     * Add answer.
     *
     * @param \AppBundle\Entity\AnswerPost $answer
     *
     * @return PostCommunity
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
     * Add tag.
     *
     * @param mixed $tag
     *
     * @return PostCommunity
     */
    public function addTag($tags)
    {
        foreach ($tags as $tag) {
            $this->tags[] = $tag;
        }

        return $this;
    }

    /**
     * Remove tag.
     *
     * @param \AppBundle\Entity\Tag $tag
     *
     * @return boolean TRUE if this collection contained the specified element, FALSE otherwise.
     */
    public function removeTag(\AppBundle\Entity\Tag $tag)
    {
        return $this->tags->removeElement($tag);
    }

    /**
     * Get tags.
     *
     * @return \Doctrine\Common\Collections\Collection
     */
    public function getTags()
    {
        return $this->tags;
    }

}
