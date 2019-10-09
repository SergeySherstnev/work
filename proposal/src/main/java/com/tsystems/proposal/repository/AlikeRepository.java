package com.tsystems.proposal.repository;

import com.tsystems.proposal.domain.Alike;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the Alike entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AlikeRepository extends JpaRepository<Alike, Long> {

    @Query("select alike from Alike alike where alike.author.login = ?#{principal.username}")
    List<Alike> findByAuthorIsCurrentUser();

    Long countByProposalId(Long id);

    void deleteByProposalIdAndAuthorId(Long proposalId, Long authorId);

    int countByProposalIdAndAuthorId(Long proposalId, Long authorId);

}
