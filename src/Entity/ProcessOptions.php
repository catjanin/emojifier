<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ProcessOptionsRepository")
 */
class ProcessOptions
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     */
    private $emojiSize;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmojiSize(): ?int
    {
        return $this->emojiSize;
    }

    public function setEmojiSize(int $emojiSize): self
    {
        $this->emojiSize = $emojiSize;

        return $this;
    }
}
