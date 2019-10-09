package com.tsystems.proposal.service.impl;

import com.tsystems.proposal.service.QuotesService;
import com.tsystems.proposal.domain.Quotes;
import com.tsystems.proposal.repository.QuotesRepository;
import com.tsystems.proposal.repository.search.QuotesSearchRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * Service Implementation for managing {@link Quotes}.
 */
@Service
@Transactional
public class QuotesServiceImpl implements QuotesService {

    private final Logger log = LoggerFactory.getLogger(QuotesServiceImpl.class);

    private final QuotesRepository quotesRepository;

    private final QuotesSearchRepository quotesSearchRepository;

    public QuotesServiceImpl(QuotesRepository quotesRepository, QuotesSearchRepository quotesSearchRepository) {
        this.quotesRepository = quotesRepository;
        this.quotesSearchRepository = quotesSearchRepository;
    }

    /**
     * Save a quotes.
     *
     * @param quotes the entity to save.
     * @return the persisted entity.
     */
    @Override
    public Quotes save(Quotes quotes) {
        log.debug("Request to save Quotes : {}", quotes);
        Quotes result = quotesRepository.save(quotes);
        quotesSearchRepository.save(result);
        return result;
    }

    /**
     * Get all the quotes.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Quotes> findAll(Pageable pageable) {
        log.debug("Request to get all Quotes");
        return quotesRepository.findAll(pageable);
    }


    /**
     * Get one quotes by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Quotes> findOne(Long id) {
        log.debug("Request to get Quotes : {}", id);
        return quotesRepository.findById(id);
    }

    /**
     * Get one random quotes.
     *
     * @return the entity.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Quotes> findRandom() {
        Long qty = quotesRepository.countAll();
        int idx = (int)(Math.random() * qty);
        Page<Quotes> quotePage = quotesRepository.findAll(new PageRequest(idx, 1));
        Quotes q = null;
        if (quotePage.hasContent()) {
            q = quotePage.getContent().get(0);
        }
        return Optional.of(q);
    }

    /**
     * Delete the quotes by id.
     *
     * @param id the id of the entity.
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Quotes : {}", id);
        quotesRepository.deleteById(id);
        quotesSearchRepository.deleteById(id);
    }

    /**
     * Search for the quotes corresponding to the query.
     *
     * @param query the query of the search.
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Quotes> search(String query, Pageable pageable) {
        log.debug("Request to search for a page of Quotes for query {}", query);
        return quotesSearchRepository.search(queryStringQuery(query), pageable);    }
}
