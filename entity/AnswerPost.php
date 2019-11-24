<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * AnswerPost
 *
 * @ORM\Table(name="answer_post")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\AnswerPostRepository")
 */
class AnswerPost
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
     * @ORM\Column(name="comment", type="string", length=255)
     */
    private $comment;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="uploadedAt", type="datetime")
     */
    private $uploadedAt;

    /**
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\PostCommunity", inversedBy="answers")
     */
    private $mainPost;

    /**
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\User", inversedBy="answers")
     */
    private $user;

    /**
     * @ORM\Column(name="is_reported", type="boolean")
     */
    private $isReported;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->isReported = false;
    }

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
     * @return AnswerPost
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
     * Set uploadedAt.
     *
     * @param \DateTime $uploadedAt
     *
     * @return AnswerPost
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
     * Set mainPost.
     *
     * @param \AppBundle\Entity\PostCommunity|null $mainPost
     *
     * @return AnswerPost
     */
    public function setMainPost(\AppBundle\Entity\PostCommunity $mainPost = null)
    {
        $this->mainPost = $mainPost;

        return $this;
    }

    /**
     * Get mainPost.
     *
     * @return \AppBundle\Entity\PostCommunity|null
     */
    public function getMainPost()
    {
        return $this->mainPost;
    }

    /**
     * Set user.
     *
     * @param \AppBundle\Entity\User|null $user
     *
     * @return AnswerPost
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
     * Set isReported.
     *
     * @param bool $isReported
     *
     * @return AnswerPost
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
}
