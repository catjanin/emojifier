<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Validator\Constraints as Assert;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

/**
 * Partners
 *
 * @ORM\Table(name="partners")
 * @ORM\Entity(repositoryClass="AppBundle\Repository\PartnersRepository")
 * @Vich\Uploadable
 */
class Partners
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
     * @ORM\Column(name="name", type="string", length=255)
     */
    private $name;

    /**
     * @var string
     *
     * @ORM\Column(name="link", type="text", nullable=true)
     */
    private $link;

    /**
     * @var string
     *
     * @ORM\Column(name="category", type="string", length=255)
     */
    private $category;

    /**
     * @ORM\Column(type="string", length=255)
     * @var string
     */
    private $picture;

    /**
     * @Vich\UploadableField(mapping="images_fixes", fileNameProperty="picture")
     * @var File
     */
    private $imageFile;

    /**
     * @ORM\Column(type="datetime")
     * @var \DateTime
     */
    private $updatedAt;

    /**
     * @ORM\Column(type="string", length=255)
     * @var string
     */
    private $transKey;

    /**
     * @var string
     */
    private $transEN;

    /**
     * @var string
     */
    private $transFR;


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
     * Set name.
     *
     * @param string $name
     *
     * @return Partners
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * Get name.
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    public function getPicture()
    {
        return $this->picture;
    }

    public function setPicture($picture)
    {
        $this->picture = $picture;

        return $this;
    }

    public function setImageFile(File $image = null)
    {
        $this->imageFile = $image;

        $this->updatedAt = new \DateTime('now');
    }

    public function getImageFile()
    {
        return $this->imageFile;
    }

    /**
     * @return string
     */
    public function getLink()
    {
        return $this->link;
    }

    /**
     * @param string $link
     */
    public function setLink($link)
    {
        $this->link = $link;
    }

    /**
     * @return string
     */
    public function getCategory()
    {
        return $this->category;
    }

    /**
     * @param string $category
     */
    public function setCategory($category)
    {
        $this->category = $category;
    }

    /**
     * @return string
     */
    public function getTransKey()
    {
        return $this->transKey;
    }

    /**
     * @param string $key
     */
    public function setTransKey($key)
    {
        $this->transKey = $key;
    }

    /**
     * @return string
     */
    public function getTransEN()
    {
        return $this->transEN;
    }

    /**
     * @param string $transEN
     */
    public function setTransEN($transEN)
    {
        $this->transEN = $transEN;
    }

    /**
     * @return string
     */
    public function getTransFR()
    {
        return $this->transFR;
    }

    /**
     * @param string $transFR
     */
    public function setTransFR($transFR)
    {
        $this->transFR = $transFR;
    }




}
