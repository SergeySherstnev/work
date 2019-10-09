package com.tsystems.proposal.service;

import com.tsystems.proposal.domain.Quotes;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Service Interface for managing {@link Quotes}.
 */
public interface QuotesService {

    /**
     * Save a quotes.
     *
     * @param quotes the entity to save.
     * @return the persisted entity.
     */
    Quotes save(Quotes quotes);

    /**
     * Get all the quotes.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Quotes> findAll(Pageable pageable);


    /**
     * Get the "id" quotes.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Quotes> findOne(Long id);

    /**
     * Get the random quotes.
     *
     * @return the entity.
     */
    Optional<Quotes> findRandom();

    /**
     * Delete the "id" quotes.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Search for the quotes corresponding to the query.
     *
     * @param query the query of the search.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Quotes> search(String query, Pageable pageable);
}
