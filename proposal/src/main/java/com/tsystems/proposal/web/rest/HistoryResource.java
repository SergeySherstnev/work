package com.tsystems.proposal.web.rest;

import com.tsystems.proposal.domain.History;
import com.tsystems.proposal.service.HistoryService;
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
 * REST controller for managing {@link com.tsystems.proposal.domain.History}.
 */
@RestController
@RequestMapping("/api")
public class HistoryResource {

    private final Logger log = LoggerFactory.getLogger(HistoryResource.class);

    private static final String ENTITY_NAME = "history";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final HistoryService historyService;

    public HistoryResource(HistoryService historyService) {
        this.historyService = historyService;
    }

    /**
     * {@code POST  /histories} : Create a new history.
     *
     * @param history the history to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new history, or with status {@code 400 (Bad Request)} if the history has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/histories")
    public ResponseEntity<History> createHistory(@Valid @RequestBody History history) throws URISyntaxException {
        log.debug("REST request to save History : {}", history);
        if (history.getId() != null) {
            throw new BadRequestAlertException("A new history cannot already have an ID", ENTITY_NAME, "idexists");
        }
        History result = historyService.save(history);
        return ResponseEntity.created(new URI("/api/histories/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /histories} : Updates an existing history.
     *
     * @param history the history to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated history,
     * or with status {@code 400 (Bad Request)} if the history is not valid,
     * or with status {@code 500 (Internal Server Error)} if the history couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/histories")
    public ResponseEntity<History> updateHistory(@Valid @RequestBody History history) throws URISyntaxException {
        log.debug("REST request to update History : {}", history);
        if (history.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        History result = historyService.save(history);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, history.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /histories} : get all the histories.
     *
     * @param pageable the pagination information.
     * @param queryParams a {@link MultiValueMap} query parameters.
     * @param uriBuilder a {@link UriComponentsBuilder} URI builder.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of histories in body.
     */
    @GetMapping("/histories")
    public ResponseEntity<List<History>> getAllHistories(Pageable pageable, @RequestParam MultiValueMap<String, String> queryParams, UriComponentsBuilder uriBuilder) {
        log.debug("REST request to get a page of Histories");
        Page<History> page = historyService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(uriBuilder.queryParams(queryParams), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /histories/:id} : get the "id" history.
     *
     * @param id the id of the history to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the history, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/histories/{id}")
    public ResponseEntity<History> getHistory(@PathVariable Long id) {
        log.debug("REST request to get History : {}", id);
        Optional<History> history = historyService.findOne(id);
        return ResponseUtil.wrapOrNotFound(history);
    }

    /**
     * {@code DELETE  /histories/:id} : delete the "id" history.
     *
     * @param id the id of the history to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/histories/{id}")
    public ResponseEntity<Void> deleteHistory(@PathVariable Long id) {
        log.debug("REST request to delete History : {}", id);
        historyService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/histories?query=:query} : search for the history corresponding
     * to the query.
     *
     * @param query the query of the history search.
     * @param pageable the pagination information.
     * @param queryParams a {@link MultiValueMap} query parameters.
     * @param uriBuilder a {@link UriComponentsBuilder} URI builder.
     * @return the result of the search.
     */
    @GetMapping("/_search/histories")
    public ResponseEntity<List<History>> searchHistories(@RequestParam String query, Pageable pageable, @RequestParam MultiValueMap<String, String> queryParams, UriComponentsBuilder uriBuilder) {
        log.debug("REST request to search for a page of Histories for query {}", query);
        Page<History> page = historyService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(uriBuilder.queryParams(queryParams), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

}
