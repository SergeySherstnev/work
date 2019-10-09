package com.tsystems.proposal.service.impl;

import com.tsystems.proposal.domain.Comment;
import com.tsystems.proposal.domain.History;
import com.tsystems.proposal.domain.Proposal;
import com.tsystems.proposal.domain.User;
import com.tsystems.proposal.domain.enumeration.Status;
import com.tsystems.proposal.repository.AlikeRepository;
import com.tsystems.proposal.repository.HistoryRepository;
import com.tsystems.proposal.repository.ProposalRepository;
import com.tsystems.proposal.repository.UserRepository;
import com.tsystems.proposal.repository.search.ProposalSearchRepository;
import com.tsystems.proposal.service.CommentService;
import com.tsystems.proposal.service.HistoryService;
import com.tsystems.proposal.service.ProposalService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

/**
 * Service Implementation for managing {@link Proposal}.
 */
@Service
@Transactional
public class ProposalServiceImpl implements ProposalService {

    private final Logger log = LoggerFactory.getLogger(ProposalServiceImpl.class);

    private final ProposalRepository proposalRepository;
    private final ProposalSearchRepository proposalSearchRepository;

    private final UserRepository userRepository;
    private final HistoryRepository historyRepository;
    private final AlikeRepository alikeRepository;
    private final CommentService commentService;

    private final HistoryService historyService;

    public ProposalServiceImpl(
        ProposalRepository proposalRepository,
        ProposalSearchRepository proposalSearchRepository,
        UserRepository userRepository,
        AlikeRepository alikeRepository,
        HistoryRepository historyRepository,
        CommentService commentService,
        HistoryService historyService
    ) {
        this.proposalRepository = proposalRepository;
        this.proposalSearchRepository = proposalSearchRepository;
        this.userRepository = userRepository;
        this.alikeRepository = alikeRepository;
        this.historyRepository = historyRepository;
        this.commentService = commentService;
        this.historyService = historyService;
    }

    @Override
    @Transactional
    public Comment addComment(Long proposalId, String commentText, Long authorId) {
        // See https://stackoverflow.com/questions/45831695/alternatives-to-getreference-method-in-spring-data-jpa
        Proposal proposal = proposalRepository.getOne(proposalId);
        User user = userRepository.getOne(authorId);

        Comment comment = new Comment();
        comment.setText(commentText);
        comment.setCreatedDate(Instant.now());
        comment.setAuthor(user);

        proposal.addComment(comment);
        proposalRepository.save(proposal);
        Comment result = commentService.save(comment);
        return result;
    }

    /**
     * Delete user like for Proposal
     * @param proposalId
     * @param userId
     */
    @Override
    @Transactional
    public void deleteLikesByProposalAndUser(Long proposalId, Long userId) {
        log.debug("Request to delete like of user : {} for Proposal : {}", userId, proposalId);
        alikeRepository.deleteByProposalIdAndAuthorId(proposalId, userId);
        proposalRepository.addLikeSumForProposal(proposalId, -1l);
    }

    @Override
    @Transactional(readOnly = true)
    public int countLikesByProposalAndUser(Long proposalId, Long userId) {
        log.debug("Request to countByProposalAndUser Alikes");
        return alikeRepository.countByProposalIdAndAuthorId(proposalId, userId);
    }

    @Override
    @Transactional
    public void updateLikeSum(Proposal prop) {
        Long count = alikeRepository.countByProposalId(prop.getId());
        proposalRepository.setLikeSumForProposal(prop.getId(), count);
    }

    @Override
    @Transactional
    public void updateCommentSum(Proposal prop) {
        Long count = commentService.countByProposalId(prop.getId());
        proposalRepository.setCommentSumForProposal(prop.getId(), count);
    }

    @Override
    @Transactional
    public void updateStatus(Proposal prop) {
        History h = historyRepository.findFirstByProposalIdOrderByCreatedDateDesc(prop.getId());
        if (h != null) {
            proposalRepository.setUpdateDateAndStatusForProposal(prop.getId(), h.getCreatedDate(), h.getStatus());
        }
    }

    /**
     * Save a proposal.
     *
     * @param proposal the entity to save.
     * @return the persisted entity.
     */
    @Override
    @Transactional
    // TODO: check when this is called and change the logic accordingly
    public Proposal save(Proposal proposal) {
        log.debug("Request to save Proposal : {}", proposal);
        if (proposal.getId() == null) { // new proposal
            proposal.setAlikeSum(0l);
            proposal.setCommentSum(0l);
            // Create initial history element
            History h = new History();
            h.setStatus(Status.NEW);
            h.setComment("Created by " + proposal.getAuthor().getFirstName() + " " + proposal.getAuthor().getLastName());
            proposal.addHistory(h);
        }

        Proposal result = proposalRepository.save(proposal);
        proposalSearchRepository.save(result);
        return result;
    }

    /**
     * Save a proposal.
     *
     * @param proposal the entity to save.
     * @param userId user who made changes
     * @return
     */
    @Override
    @Transactional
    public Proposal save(Proposal proposal, Long userId) {
        log.debug("Request to save Proposal : {} with author: {}", proposal, userId);

        User author = userRepository.getOne(userId);
        Instant now = Instant.now();

        if (proposal.getId() == null) { // new proposal
            proposal.setAuthor(author);
            proposal.setCreatedDate(now);
            proposal.setUpdatedDate(now);
            proposal.setStatus(Status.NEW);
            proposal.setAlikeSum(0l);
            proposal.setCommentSum(0l);
            // Create initial history element
            History h = new History();
            h.setCreatedDate(now);
            h.setStatus(Status.NEW);
            h.setExecutive(author);
            h.setComment("Created");
            proposal.addHistory(h);
        } else { // update proposal
            proposal.setUpdatedDate(now);
            History h = new History();
            h.setCreatedDate(now);
            // when updating proposal by author leave the status as is
            // history record is just for record fact of modification
            h.setStatus(proposal.getStatus());
            h.setExecutive(author);
            // May be add to comment what was changed in proposal (compare old and new caption , description)?
            h.setComment("Updated");
            // deserialized proposal has nulled histories collection
            Set<History> histories = proposal.getHistories();
            if (histories != null) {
                proposal.addHistory(h);
            } else {
                h.setProposal(proposal);
                historyService.save(h);
            }
        }

        Proposal result = proposalRepository.save(proposal);
        proposalSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the proposals.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Proposal> findAll(Pageable pageable) {
        log.debug("Request to get all Proposals");
        return proposalRepository.findAll(pageable);
    }

    /**
     * Get all the proposals with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<Proposal> findAllWithEagerRelationships(Pageable pageable) {
        return proposalRepository.findAllWithEagerRelationships(pageable);
    }


    /**
     * Get one proposal by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Proposal> findOne(Long id) {
        log.debug("Request to get Proposal : {}", id);
        return proposalRepository.findOneWithEagerRelationships(id);
    }

    /**
     * Delete the proposal by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Proposal : {}", id);
        proposalRepository.deleteById(id);
        proposalSearchRepository.deleteById(id);
    }

    /**
     * Search for the proposal corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Proposal> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Proposals for query {}", query);
        return proposalSearchRepository.search(queryStringQuery(query), pageable);
    }

    /**
     * Get all histories of Proposal
     * @param id the Proposal id.
     * @return list od History
     */
    @Override
    public List<History> getHistories(Long id) {
        return historyRepository.findByProposalIdOrderByCreatedDateDesc(id);
    }

    /**
     * Save a history for proposal, update proposal status.
     *
     * @param history the entity to save.
     * @param userId the history executive.
     * @return the persisted entity.
     */
    @Override
    @Transactional
    public History addHistory(History history, Long proposalId, Long userId) {
        log.debug("Request to save History : {}", history);
        User executive = userRepository.getOne(userId);
        Proposal proposal = proposalRepository.getOne(proposalId);

        Instant now = Instant.now();
        history.setExecutive(executive);
        history.setProposal(proposal);
        history.setCreatedDate(now);

        proposal.setStatus(history.getStatus());
        proposal.setUpdatedDate(now);

        // save history
        History result = historyService.save(history);
        // update proposal
        Proposal prop = proposalRepository.save(proposal);
        proposalSearchRepository.save(prop);

        return result;
    }

    public void saveOrUpdateSearchIndex(Proposal proposal) {
        proposalSearchRepository.save(proposal);
    }
}
