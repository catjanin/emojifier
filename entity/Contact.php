<?php


namespace AppBundle\Entity;

use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Validator\Constraints as Assert;

class Contact
{

    /**
     * @var string
     * @Assert\NotBlank()
     * @Assert\Email(
     *     message = "L'email '{{ value }}' n'est pas valide.",
     *     checkMX = true
     * )
     */
    private $mail;

    /**
     * @var string
     */
    private $phoneNumber;

    /**
     * @var string
     * @Assert\Length(
     *     min= 1,
     *     max= 50,
     *     minMessage="Minimum 1 caractère",
     *     maxMessage="Maximum 50 caractères"
     * )
     */
    private $city;

    /**
     * @var string
     */
    private $street;

    /**
     * @var string
     * @Assert\NotBlank()
     */
    private $message;

    /**
     * @var string
     * @Assert\NotBlank()
     */
    private $subject;

    /**
     * @var string
     */
    private $attachment;

    /**
     * @var int
     * @Assert\Regex(
     *     pattern="/^[0-9]{5,5}$/",
     *     match=true,
     *     message="Ceci n'est pas un code postal valide"
     * )
     */
    private $postalCode;

    /**
     * @var array
     *
     */
    private $file = [];

    /**
     * @return array
     */
    public function getFile():?array
    {
        return $this->file;
    }

    /**
     * @param array $file
     * @return Contact
     */
    public function setFile(array $file): Contact
    {
        $this->file[] = $file;
        return $this;
    }

    /**
     * @return string
     */
    public function getStreet()
    {
        return $this->street;
    }

    /**
     * @param string $street
     * @return Contact
     */
    public function setStreet(string $street): Contact
    {
        $this->street = $street;
        return $this;
    }

    /**
     * @return int
     */
    public function getPostalCode()
    {
        return $this->postalCode;
    }

    /**
     * @param int $postalCode
     * @return Contact
     */
    public function setPostalCode(int $postalCode): Contact
    {
        $this->postalCode = $postalCode;
        return $this;
    }

    /**
     * @return string
     */
    public function getMail()
    {
        return $this->mail;
    }

    /**
     * @param string $mail
     * @return Contact
     */
    public function setMail(string $mail): Contact
    {
        $this->mail = $mail;
        return $this;
    }

    /**
     * @return string
     */
    public function getPhoneNumber()
    {
        return $this->phoneNumber;
    }

    /**
     * @param string $phoneNumber
     * @return Contact
     */
    public function setPhoneNumber(string $phoneNumber): Contact
    {
        $this->phoneNumber = $phoneNumber;
        return $this;
    }

    /**
     * @return string
     */
    public function getCity()
    {
        return $this->city;
    }

    /**
     * @param string $city
     * @return Contact
     */
    public function setCity(string $city): Contact
    {
        $this->city = $city;
        return $this;
    }

    /**
     * @return string
     */
    public function getLastName()
    {
        return $this->lastName;
    }

    /**
     * @param string $lastName
     * @return Contact
     */
    public function setLastName(string $lastName): Contact
    {
        $this->lastName = $lastName;
        return $this;
    }

    /**
     * @return string
     */
    public function getFirstName()
    {
        return $this->firstName;
    }

    /**
     * @param string $firstName
     * @return Contact
     */
    public function setFirstName(string $firstName): Contact
    {
        $this->firstName = $firstName;
        return $this;
    }

    /**
     * @return string
     */
    public function getMessage()
    {
        return $this->message;
    }

    /**
     * @param string $message
     * @return Contact
     */
    public function setMessage(string $message): Contact
    {
        $this->message = $message;
        return $this;
    }

    /**
     * @return string
     */
    public function getSubject()
    {
        return $this->subject;
    }

    /**
     * @param string $subject
     * @return Contact
     */
    public function setSubject(string $subject = null): Contact
    {
        $this->subject = $subject;
        return $this;
    }

    /**
     * @return string
     */
    public function getAttachment()
    {
        return $this->attachment;
    }

    /**
     * @param string $attachment
     * @return Contact
     */
    public function setAttachment(string $attachment): Contact
    {
        $this->attachment = $attachment;
        return $this;
    }

}
