package com.tsystems.proposal.web.rest;

import com.tsystems.proposal.domain.Alike;
import com.tsystems.proposal.service.AlikeService;
import com.tsystems.proposal.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.util.MultiValueMap;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing {@link com.tsystems.proposal.domain.Alike}.
 */
@RestController
@RequestMapping("/api")
public class AlikeResource {

    private final Logger log = LoggerFactory.getLogger(AlikeResource.class);

    private static final String ENTITY_NAME = "alike";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AlikeService alikeService;

    public AlikeResource(AlikeService alikeService) {
        this.alikeService = alikeService;
    }

    /**
     * {@code POST  /alikes} : Create a new alike.
     *
     * @param alike the alike to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new alike, or with status {@code 400 (Bad Request)} if the alike has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/alikes")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<Alike> createAlike(@Valid @RequestBody Alike alike) throws URISyntaxException {
        log.debug("REST request to save Alike : {}", alike);
        if (alike.getId() != null) {
            throw new BadRequestAlertException("A new alike cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Alike result = alikeService.save(alike);
        return ResponseEntity.created(new URI("/api/alikes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /alikes} : Updates an existing alike.
     *
     * @param alike the alike to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated alike,
     * or with status {@code 400 (Bad Request)} if the alike is not valid,
     * or with status {@code 500 (Internal Server Error)} if the alike couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/alikes")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<Alike> updateAlike(@Valid @RequestBody Alike alike) throws URISyntaxException {
        log.debug("REST request to update Alike : {}", alike);
        if (alike.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Alike result = alikeService.save(alike);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, alike.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /alikes} : get all the alikes.
     *
     * @param pageable the pagination information.
     * @param queryParams a {@link MultiValueMap} query parameters.
     * @param uriBuilder a {@link UriComponentsBuilder} URI builder.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of alikes in body.
     */
    @GetMapping("/alikes")
    public ResponseEntity<List<Alike>> getAllAlikes(Pageable pageable, @RequestParam MultiValueMap<String, String> queryParams, UriComponentsBuilder uriBuilder) {
        log.debug("REST request to get a page of Alikes");
        Page<Alike> page = alikeService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(uriBuilder.queryParams(queryParams), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /alikes/:id} : get the "id" alike.
     *
     * @param id the id of the alike to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the alike, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/alikes/{id}")
    public ResponseEntity<Alike> getAlike(@PathVariable Long id) {
        log.debug("REST request to get Alike : {}", id);
        Optional<Alike> alike = alikeService.findOne(id);
        return ResponseUtil.wrapOrNotFound(alike);
    }

    /**
     * {@code DELETE  /alikes/:id} : delete the "id" alike.
     *
     * @param id the id of the alike to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/alikes/{id}")
    @Secured("ROLE_ADMIN")
    public ResponseEntity<Void> deleteAlike(@PathVariable Long id) {
        log.debug("REST request to delete Alike : {}", id);
        alikeService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/alikes?query=:query} : search for the alike corresponding
     * to the query.
     *
     * @param query the query of the alike search.
     * @param pageable the pagination information.
     * @param queryParams a {@link MultiValueMap} query parameters.
     * @param uriBuilder a {@link UriComponentsBuilder} URI builder.
     * @return the result of the search.
     */
    @GetMapping("/_search/alikes")
    public ResponseEntity<List<Alike>> searchAlikes(@RequestParam String query, Pageable pageable, @RequestParam MultiValueMap<String, String> queryParams, UriComponentsBuilder uriBuilder) {
        log.debug("REST request to search for a page of Alikes for query {}", query);
        Page<Alike> page = alikeService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(uriBuilder.queryParams(queryParams), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

}
