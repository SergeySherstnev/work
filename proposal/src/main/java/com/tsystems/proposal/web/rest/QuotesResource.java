package com.tsystems.proposal.web.rest;

import com.tsystems.proposal.domain.Quotes;
import com.tsystems.proposal.service.QuotesService;
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
 * REST controller for managing {@link com.tsystems.proposal.domain.Quotes}.
 */
@RestController
@RequestMapping("/api")
public class QuotesResource {

    private final Logger log = LoggerFactory.getLogger(QuotesResource.class);

    private static final String ENTITY_NAME = "quotes";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final QuotesService quotesService;

    public QuotesResource(QuotesService quotesService) {
        this.quotesService = quotesService;
    }

    /**
     * {@code POST  /quotes} : Create a new quotes.
     *
     * @param quotes the quotes to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new quotes, or with status {@code 400 (Bad Request)} if the quotes has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/quotes")
    public ResponseEntity<Quotes> createQuotes(@Valid @RequestBody Quotes quotes) throws URISyntaxException {
        log.debug("REST request to save Quotes : {}", quotes);
        if (quotes.getId() != null) {
            throw new BadRequestAlertException("A new quotes cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Quotes result = quotesService.save(quotes);
        return ResponseEntity.created(new URI("/api/quotes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /quotes} : Updates an existing quotes.
     *
     * @param quotes the quotes to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated quotes,
     * or with status {@code 400 (Bad Request)} if the quotes is not valid,
     * or with status {@code 500 (Internal Server Error)} if the quotes couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/quotes")
    public ResponseEntity<Quotes> updateQuotes(@Valid @RequestBody Quotes quotes) throws URISyntaxException {
        log.debug("REST request to update Quotes : {}", quotes);
        if (quotes.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Quotes result = quotesService.save(quotes);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, quotes.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /quotes} : get all the quotes.
     *
     * @param pageable the pagination information.
     * @param queryParams a {@link MultiValueMap} query parameters.
     * @param uriBuilder a {@link UriComponentsBuilder} URI builder.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of quotes in body.
     */
    @GetMapping("/quotes")
    public ResponseEntity<List<Quotes>> getAllQuotes(Pageable pageable, @RequestParam MultiValueMap<String, String> queryParams, UriComponentsBuilder uriBuilder) {
        log.debug("REST request to get a page of Quotes");
        Page<Quotes> page = quotesService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(uriBuilder.queryParams(queryParams), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /quotes/:id} : get the "id" quotes.
     *
     * @param id the id of the quotes to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the quotes, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/quotes/{id}")
    public ResponseEntity<Quotes> getQuotes(@PathVariable Long id) {
        log.debug("REST request to get Quotes : {}", id);
        Optional<Quotes> quotes = quotesService.findOne(id);
        return ResponseUtil.wrapOrNotFound(quotes);
    }

    /**
     * {@code GET  /quotes/random} : get the random quotes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the quotes, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/quotes/random")
    public ResponseEntity<Quotes> getRandomQuotes() {
        log.debug("REST request to get Quotes random.");
        Optional<Quotes> quotes = quotesService.findRandom();
        return ResponseUtil.wrapOrNotFound(quotes);
    }

    /**
     * {@code DELETE  /quotes/:id} : delete the "id" quotes.
     *
     * @param id the id of the quotes to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/quotes/{id}")
    public ResponseEntity<Void> deleteQuotes(@PathVariable Long id) {
        log.debug("REST request to delete Quotes : {}", id);
        quotesService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/quotes?query=:query} : search for the quotes corresponding
     * to the query.
     *
     * @param query the query of the quotes search.
     * @param pageable the pagination information.
     * @param queryParams a {@link MultiValueMap} query parameters.
     * @param uriBuilder a {@link UriComponentsBuilder} URI builder.
     * @return the result of the search.
     */
    @GetMapping("/_search/quotes")
    public ResponseEntity<List<Quotes>> searchQuotes(@RequestParam String query, Pageable pageable, @RequestParam MultiValueMap<String, String> queryParams, UriComponentsBuilder uriBuilder) {
        log.debug("REST request to search for a page of Quotes for query {}", query);
        Page<Quotes> page = quotesService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(uriBuilder.queryParams(queryParams), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

}
