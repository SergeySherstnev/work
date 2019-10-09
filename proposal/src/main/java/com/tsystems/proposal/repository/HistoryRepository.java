package com.tsystems.proposal.repository;

import com.tsystems.proposal.domain.History;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the History entity.
 */
@SuppressWarnings("unused")
@Repository
public interface HistoryRepository extends JpaRepository<History, Long> {

    List<History> findByProposalIdOrderByCreatedDateDesc(Long id);

    @Query("select history from History history where history.executive.login = ?#{principal.username}")
    List<History> findByExecutiveIsCurrentUser();

    @Query("select history from History history where history.assignee.login = ?#{principal.username}")
    List<History> findByAssigneeIsCurrentUser();

    History findFirstByProposalIdOrderByCreatedDateDesc(Long proposalId);
}
