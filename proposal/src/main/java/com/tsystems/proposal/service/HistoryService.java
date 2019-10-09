package com.tsystems.proposal.service;

import com.tsystems.proposal.domain.History;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Service Interface for managing {@link History}.
 */
public interface HistoryService {

    /**
     * Save a history.
     *
     * @param history the entity to save.
     * @return the persisted entity.
     */
    History save(History history);

    /**
     * Get all the histories.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<History> findAll(Pageable pageable);


    /**
     * Get the "id" history.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<History> findOne(Long id);

    /**
     * Delete the "id" history.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Search for the history corresponding to the query.
     *
     * @param query the query of the search.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<History> search(String query, Pageable pageable);
}
