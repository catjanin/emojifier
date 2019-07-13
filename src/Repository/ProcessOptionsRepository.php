<?php

namespace App\Repository;

use App\Entity\ProcessOptions;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method ProcessOptions|null find($id, $lockMode = null, $lockVersion = null)
 * @method ProcessOptions|null findOneBy(array $criteria, array $orderBy = null)
 * @method ProcessOptions[]    findAll()
 * @method ProcessOptions[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ProcessOptionsRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, ProcessOptions::class);
    }

    // /**
    //  * @return ProcessOptions[] Returns an array of ProcessOptions objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('p.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?ProcessOptions
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
