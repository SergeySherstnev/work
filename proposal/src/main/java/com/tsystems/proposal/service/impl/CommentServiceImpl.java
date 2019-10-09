package com.tsystems.proposal.service.impl;

import com.tsystems.proposal.domain.Comment;
import com.tsystems.proposal.repository.CommentRepository;
import com.tsystems.proposal.repository.ProposalRepository;
import com.tsystems.proposal.repository.search.CommentSearchRepository;
import com.tsystems.proposal.service.CommentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

/**
 * Service Implementation for managing {@link Comment}.
 */
@Service
@Transactional
public class CommentServiceImpl implements CommentService {

    private final Logger log = LoggerFactory.getLogger(CommentServiceImpl.class);

    private final CommentRepository commentRepository;
    private final CommentSearchRepository commentSearchRepository;
    private final ProposalRepository proposalRepository;

    public CommentServiceImpl(
        CommentRepository commentRepository,
        CommentSearchRepository commentSearchRepository,
        ProposalRepository proposalRepository
    ) {
        this.commentRepository = commentRepository;
        this.commentSearchRepository = commentSearchRepository;
        this.proposalRepository = proposalRepository;
    }

    @Override
    public Long countByProposalId(Long proposalId) {
        return commentRepository.countByProposalId(proposalId);
    }

    /**
     * Save a comment.
     *
     * @param comment the entity to save.
     * @return the persisted entity.
     */
    @Override
    @Transactional
    public Comment save(Comment comment) {
        log.debug("Request to save Comment : {}", comment);
        boolean isNew = (comment.getId() == null || comment.getId().equals(0l));
        Comment result = commentRepository.save(comment);
        commentSearchRepository.save(result);
        if (isNew) { // for new comment
            proposalRepository.addCommentSumForProposal(result.getProposal().getId(), 1l);
        }
        return result;
    }

    /**
     * Get all the comments.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Comment> findAll(Pageable pageable) {
        log.debug("Request to get all Comments");
        return commentRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Comment> findByProposal(Long proposalId, Pageable pageable) {
        log.debug("Request to get Comments by Proposal");
        return commentRepository.findByProposalId(proposalId, pageable);
    }

    /**
     * Get one comment by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Comment> findOne(Long id) {
        log.debug("Request to get Comment : {}", id);
        return commentRepository.findById(id);
    }

    /**
     * Delete the comment by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Comment : {}", id);
        Comment comment = commentRepository.getOne(id);

        proposalRepository.addCommentSumForProposal(comment.getProposal().getId(), 1l);
        commentRepository.deleteById(comment.getId());
        commentSearchRepository.deleteById(id);
    }

    /**
     * Search for the comment corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Comment> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Comments for query {}", query);
        return commentSearchRepository.search(queryStringQuery(query), pageable);    }
}
