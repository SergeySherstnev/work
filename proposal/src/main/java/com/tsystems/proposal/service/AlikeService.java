package com.tsystems.proposal.service;

import com.tsystems.proposal.domain.Alike;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

/**
 * Service Interface for managing {@link Alike}.
 */
public interface AlikeService {

    /**
     * Save a alike.
     *
     * @param alike the entity to save.
     * @return the persisted entity.
     */
    Alike save(Alike alike);

    /**
     * Get all the alikes.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Alike> findAll(Pageable pageable);


    /**
     * Get the "id" alike.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Alike> findOne(Long id);

    /**
     * Delete the "id" alike.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    /**
     * Search for the alike corresponding to the query.
     *
     * @param query the query of the search.
     * 
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Alike> search(String query, Pageable pageable);
}
