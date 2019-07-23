<?php

namespace App\Repository;

use App\Entity\LastUpload;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method LastUpload|null find($id, $lockMode = null, $lockVersion = null)
 * @method LastUpload|null findOneBy(array $criteria, array $orderBy = null)
 * @method LastUpload[]    findAll()
 * @method LastUpload[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class LastUploadRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, LastUpload::class);
    }

    // /**
    //  * @return LastUpload[] Returns an array of LastUpload objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('l')
            ->andWhere('l.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('l.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?LastUpload
    {
        return $this->createQueryBuilder('l')
            ->andWhere('l.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
