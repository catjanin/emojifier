<?php

namespace App\Service;

use App\Entity\LastUpload;

Class GetLastUpload
{

    public function setLastUploadName($name) {
        $lastUpload = new LastUpload();
        $lastUpload->setName($name);
        $lastUpload->setUserId($this->getUser()->getId());
    }

    public function getLastUploadName() {
        return $this->lastUploadName;
    }
}