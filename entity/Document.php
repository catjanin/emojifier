<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\HttpFoundation\File\UploadedFile;

/**
 * @ORM\Entity
 * @ORM\Table(name="document")
 * @ORM\HasLifecycleCallbacks
 * @ORM\Entity(repositoryClass="AppBundle\Repository\DocumentRepository")
 */
class Document
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank
     */
    private $name;

    /**
     * @Assert\Image(
     *  maxSize="2M",
     *  mimeTypes = {"image/jpeg", "image/png"}
     * )
     */
    private $file;

    /**
     * @ORM\Column(type="string", length=255, nullable=true, unique=true)
     */
    private $path;

    /**
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\User", inversedBy="pictures")
     */
    private $user;

    /**
     * @ORM\Column(name="is_avatar", type="boolean")
     */
    private $isAvatar;

    /**
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\PostCommunity", inversedBy="pictures")
     */
    private $comment;

    /**
     * @ORM\Column(name="post_uniq_id", type="string", nullable=true)
     */
    private $postUniqId;

    /**
     * @ORM\ManyToOne(targetEntity="AppBundle\Entity\GardenType", inversedBy="picturesCommunity")
     * @ORM\JoinColumn(nullable=true)
     */
    private $gardenType;

    /**
     * @ORM\Column(name="is_inspiration", type="boolean")
     */
    private $isInspiration;

    /**
     * @ORM\Column(name="is_inspiration_checked", type="boolean")
     */
    private $isInspirationChecked;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="uploaded_at", type="datetime")
     */
    private $uploadedAt;


    public function __construct()
    {
        $this->isAvatar = false;
        $this->isInspiration = false;
        $this->isInspirationChecked = false;
    }

    public function getUploadDir()
    {
        // get rid of the __DIR__ so it doesn't screw up
        // when displaying uploaded doc/image in the view.
        return 'community/';
    }

    /**
    * @ORM\PrePersist()
    * @ORM\PreUpdate()
    */
   public function preUpload()
   {
       // "file" property can be empty if field is required=false
       if (null === $this->file) {
           return;
       }

       if ($this->path != $this->file->getClientOriginalName()) {
           $this->path = $this->file->getClientOriginalName();
       }
   }

   /**
    * @ORM\PostPersist()
    * @ORM\PostUpdate()
    */
   public function upload($pictureName)
   {
       // "file" property can be empty if field is required=false
       if (null === $this->file) {
           return;
       }

       if (!file_exists($this->getUploadDir())) {
           mkdir($this->getUploadDir(), 0775, true);
       }

       // move() takes as arguments target directory and target file name where file is moved
       $this->file->move(
           $this->getUploadDir(), $pictureName
       );
       $this->file = null;
   }

   /**
    * @ORM\PostRemove()
    */
   public function unlinkPicture()
   {
       unlink($this->getPath());
   }

   /**
    * Get id
    *
    * @return integer
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
    * @return Document
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
    * Set path
    *
    * @param string $path
    *
    * @return Document
    */
   public function setPath($path)
   {
       $this->path = $path;

       return $this;
   }

   /**
    * Get path
    *
    * @return string
    */
   public function getPath()
   {
       return $this->path;
   }

   /**
    * @return mixed
    */
   public function getUser()
   {
       return $this->user;
   }

   /**
    * @param mixed $user
    * @return Document
    */
   public function setUser($user)
   {
       $this->user = $user;
       return $this;
   }

   /**
    * @return mixed
    */
   public function getIsAvatar()
   {
       return $this->isAvatar;
   }

   /**
    * @param mixed $isCover
    * @return ProjectPicture
    */
   public function setIsAvatar($isAvatar)
   {
       $this->isAvatar = $isAvatar;
       return $this;
   }

       /**
     * Sets file.
     *
     * @param UploadedFile $file
     */
    public function setFile(UploadedFile $file = null)
    {
        $this->file = $file;
    }

    /**
     * Get file.
     *
     * @return UploadedFile
     */
    public function getFile()
    {
        return $this->file;
    }

    /**
     * Set postUniqId.
     *
     * @param string $postUniqId
     *
     * @return Document
     */
    public function setPostUniqId($postUniqId)
    {
        $this->postUniqId = $postUniqId;

        return $this;
    }

    /**
     * Get postUniqId.
     *
     * @return string
     */
    public function getPostUniqId()
    {
        return $this->postUniqId;
    }

    /**
     * Set comment.
     *
     * @param \AppBundle\Entity\PostCommunity|null $comment
     *
     * @return Document
     */
    public function setComment(\AppBundle\Entity\PostCommunity $comment = null)
    {
        $this->comment = $comment;

        return $this;
    }

    /**
     * Get comment.
     *
     * @return \AppBundle\Entity\PostCommunity|null
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
     * @return Document
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
     * Set isInspiration.
     *
     * @param bool $isInspiration
     *
     * @return Document
     */
    public function setIsInspiration($isInspiration)
    {
        $this->isInspiration = $isInspiration;

        return $this;
    }

    /**
     * Get isInspiration.
     *
     * @return bool
     */
    public function getIsInspiration()
    {
        return $this->isInspiration;
    }

    /**
     * Set gardenType.
     *
     * @param \AppBundle\Entity\GardenType|null $gardenType
     *
     * @return Document
     */
    public function setGardenType(\AppBundle\Entity\GardenType $gardenType = null)
    {
        $this->gardenType = $gardenType;

        return $this;
    }

    /**
     * Get gardenType.
     *
     * @return \AppBundle\Entity\GardenType|null
     */
    public function getGardenType()
    {
        return $this->gardenType;
    }


    /**
     * Set isInspirationChecked.
     *
     * @param bool $isInspirationChecked
     *
     * @return Document
     */
    public function setIsInspirationChecked($isInspirationChecked)
    {
        $this->isInspirationChecked = $isInspirationChecked;

        return $this;
    }

    /**
     * Get isInspirationChecked.
     *
     * @return bool
     */
    public function getIsInspirationChecked()
    {
        return $this->isInspirationChecked;
    }
}
