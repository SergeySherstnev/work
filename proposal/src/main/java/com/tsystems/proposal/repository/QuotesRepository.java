package com.tsystems.proposal.repository;

import com.tsystems.proposal.domain.Quotes;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;


/**
 * Spring Data  repository for the Quotes entity.
 */
@SuppressWarnings("unused")
@Repository
public interface QuotesRepository extends JpaRepository<Quotes, Long> {

    @Query("SELECT COUNT(q) FROM Quotes q")
    Long countAll();
}
