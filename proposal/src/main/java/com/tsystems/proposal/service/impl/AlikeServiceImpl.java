package com.tsystems.proposal.service.impl;

import com.tsystems.proposal.repository.ProposalRepository;
import com.tsystems.proposal.service.AlikeService;
import com.tsystems.proposal.domain.Alike;
import com.tsystems.proposal.repository.AlikeRepository;
import com.tsystems.proposal.repository.search.AlikeSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing {@link Alike}.
 */
@Service
@Transactional
public class AlikeServiceImpl implements AlikeService {

    private final Logger log = LoggerFactory.getLogger(AlikeServiceImpl.class);

    private final AlikeRepository alikeRepository;

    private final AlikeSearchRepository alikeSearchRepository;

    private final ProposalRepository proposalRepository;

    public AlikeServiceImpl(AlikeRepository alikeRepository, AlikeSearchRepository alikeSearchRepository, ProposalRepository proposalRepository) {
        this.alikeRepository = alikeRepository;
        this.alikeSearchRepository = alikeSearchRepository;
        this.proposalRepository = proposalRepository;
    }

    /**
     * Save a alike.
     *
     * @param alike the entity to save.
     * @return the persisted entity.
     */
    @Override
    @Transactional
    public Alike save(Alike alike) {
        log.debug("Request to save Alike : {}", alike);
        boolean isNew = (alike.getId() == null || alike.getId().equals(0l));
        Alike result = alikeRepository.save(alike);
        if (isNew) { // for new like
            proposalRepository.addLikeSumForProposal(alike.getProposal().getId(), 1l);
        }
        alikeSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the alikes.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Alike> findAll(Pageable pageable) {
        log.debug("Request to get all Alikes");
        return alikeRepository.findAll(pageable);
    }


    /**
     * Get one alike by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Alike> findOne(Long id) {
        log.debug("Request to get Alike : {}", id);
        return alikeRepository.findById(id);
    }

    /**
     * Delete the alike by id.
     *
     * @param id the id of the entity.
     */
    @Override
    @Transactional
    public void delete(Long id) {
        log.debug("Request to delete Alike : {}", id);
        Alike alike = alikeRepository.getOne(id);

        proposalRepository.addLikeSumForProposal(alike.getProposal().getId(), -1l);
        alikeRepository.deleteById(alike.getId());
        alikeSearchRepository.deleteById(id);
    }

    /**
     * Search for the alike corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Alike> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Alikes for query {}", query);
        return alikeSearchRepository.search(queryStringQuery(query), pageable);    }
}
