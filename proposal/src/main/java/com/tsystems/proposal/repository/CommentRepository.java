package com.tsystems.proposal.repository;

import com.tsystems.proposal.domain.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data  repository for the Comment entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query("select comment from Comment comment where comment.author.login = ?#{principal.username}")
    List<Comment> findByAuthorIsCurrentUser();

    Page<Comment> findByProposalId(Long proposalId, Pageable pageable);

    Long countByProposalId(Long id);
}
