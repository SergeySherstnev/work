package com.tsystems.proposal.service;

import com.tsystems.proposal.domain.Comment;
import com.tsystems.proposal.domain.History;
import com.tsystems.proposal.domain.Proposal;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Proposal}.
 */
public interface ProposalService {

    /**
     * Delete users like for Proposal
     * @param proposalId
     * @param userId
     */
    void deleteLikesByProposalAndUser(Long proposalId, Long userId);

    /**
     * Count user's likes for given Proposal
     * @param proposalId proposal id
     * @param userId user id
     * @return
     */
    int countLikesByProposalAndUser(Long proposalId, Long userId);

    /**
     * Add user's comment to proposal
     *
     * @param proposalId proposal id
     * @param commentText comment text
     * @param authorId user id who add a comment
     * @return
     */
    Comment addComment(Long proposalId, String commentText, Long authorId);

    /**
     * Count likes for given proposal and update Proposal.alikeSum property.
     * @param prop proposal
     */
    void updateLikeSum(Proposal prop);

    /**
     * Count comments for given proposal and update Proposal.commentSum property.
     * @param prop proposal
     */
    void updateCommentSum(Proposal prop);

    /**
     * Find last history entity of a given proposal and from found entity update Proposal.updatedDate and Proposal.status properties.
     * @param prop
     */
    void updateStatus(Proposal prop);

    /**
     * Save a proposal.
     *
     * @param proposal the entity to save.
     * @return the persisted entity.
     */
    Proposal save(Proposal proposal);

    /**
     * Save a proposal.
     *
     * @param proposal the entity to save.
     * @return the persisted entity.
     */
    Proposal save(Proposal proposal, Long userId);

    /**
     * Get all the proposals.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Proposal> findAll(Pageable pageable);

    /**
     * Get all the proposals with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    Page<Proposal> findAllWithEagerRelationships(Pageable pageable);

    /**
     * Get the "id" proposal.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Proposal> findOne(Long id);

    /**
     * Delete the "id" proposal.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Search for the proposal corresponding to the query.
     *
     * @param query the query of the search.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Proposal> search(String query, Pageable pageable);

    /**
     * Get all Histories of the proposal.
     *
     * @param id the Proposal id.
     * @return the list of entities.
     */
    List<History> getHistories(Long id);

    /**
     * Save a history for proposal.
     *
     * @param history the entity to save.
     * @param userId the history executive.
     * @return the persisted entity.
     */
    History addHistory(History history, Long proposalId, Long userId);


    void saveOrUpdateSearchIndex(Proposal proposal);

}
