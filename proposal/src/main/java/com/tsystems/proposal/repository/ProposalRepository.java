package com.tsystems.proposal.repository;

import com.tsystems.proposal.domain.Proposal;
import com.tsystems.proposal.domain.enumeration.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the Proposal entity.
 */
@Repository
public interface ProposalRepository extends JpaRepository<Proposal, Long> {

    @Query("select proposal from Proposal proposal where proposal.author.login = ?#{principal.username}")
    List<Proposal> findByAuthorIsCurrentUser();

    @Query(value = "select distinct proposal from Proposal proposal" +
        " left join fetch proposal.tags" +
        " left join fetch proposal.alikes" +
        " left join fetch proposal.histories",
        countQuery = "select count(distinct proposal) from Proposal proposal")
    Page<Proposal> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct proposal from Proposal proposal left join fetch proposal.tags")
    List<Proposal> findAllWithEagerRelationships();

    @Query("select proposal from Proposal proposal" +
        " left join fetch proposal.tags" +
        " left join fetch proposal.alikes" +
        " where proposal.id =:id")
    Optional<Proposal> findOneWithEagerRelationships(@Param("id") Long id);

    @Modifying
    @Query("update Proposal proposal set proposal.alikeSum = :likeSum where proposal.id = :id")
    int setLikeSumForProposal(@Param("id") Long id, @Param("likeSum") Long likeSum);

    @Modifying
    @Query("update Proposal proposal set proposal.commentSum = :commentSum where proposal.id = :id")
    int setCommentSumForProposal(@Param("id") Long id, @Param("commentSum") Long commentSum);

    @Modifying
    @Query("update Proposal proposal set proposal.updatedDate = :updatedDate, proposal.status = :status where proposal.id = :id")
    int setUpdateDateAndStatusForProposal(@Param("id") Long id, @Param("updatedDate") Instant updatedDate, @Param("status") Status status);

    @Modifying
    @Query("update Proposal proposal set proposal.alikeSum = proposal.alikeSum + :inc where proposal.id = :id")
    int addLikeSumForProposal(@Param("id") Long id, @Param("inc") Long inc);

    @Modifying
    @Query("update Proposal proposal set proposal.commentSum = proposal.commentSum + :inc where proposal.id = :id")
    int addCommentSumForProposal(@Param("id") Long id, @Param("inc") Long inc);
}
