package com.tsystems.proposal.web.rest;

import com.tsystems.proposal.domain.*;
import com.tsystems.proposal.security.AuthoritiesConstants;
import com.tsystems.proposal.security.SecurityUtils;
import com.tsystems.proposal.service.AlikeService;
import com.tsystems.proposal.service.CommentService;
import com.tsystems.proposal.service.HistoryService;
import com.tsystems.proposal.service.ProposalService;
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.MultiValueMap;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

import static org.elasticsearch.index.query.QueryBuilders.*;

/**
 * REST controller for managing {@link com.tsystems.proposal.domain.Proposal}.
 */
@RestController
@RequestMapping("/api")
public class ProposalResource {

    private final Logger log = LoggerFactory.getLogger(ProposalResource.class);

    private static final String ENTITY_NAME = "proposal";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProposalService proposalService;
    private final AlikeService alikeService;

    public ProposalResource(ProposalService proposalService, AlikeService alikeService) {
        this.proposalService = proposalService;
        this.alikeService = alikeService;
    }

    @PutMapping("/proposals/{id}/togglelike")
    public ResponseEntity<Integer> togleLikeForProposal(@PathVariable Long id) {
        log.debug("REST request to toggle Proposal like : {}", id);
        Optional<Long> userId = SecurityUtils.getCurrentUserId();
        if (! userId.isPresent()) {
            throw new BadRequestAlertException("There is no Current user. Cant toggle like.", ENTITY_NAME, "nocurrentuser");
        }

        int likes = proposalService.countLikesByProposalAndUser(id, userId.get());
        if (likes > 0) { // delete like
            proposalService.deleteLikesByProposalAndUser(id, userId.get());
            return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, "like", id.toString()))
                .body(-1);
        } else { // create like
            Alike alike = new Alike();
            alike.setText("");
            alike.setCreatedDate(Instant.now());

            User author = new User();
            author.setId(userId.get());
            alike.setAuthor(author);

            Proposal prop = new Proposal();
            prop.setId(id);
            alike.setProposal(prop);
            alike = alikeService.save(alike);

            return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, "like", alike.getId().toString()))
                .body(1);
        }
    }

    @PostMapping("/proposals/{id}/addComment")
    public ResponseEntity<Comment> addCommentForProposal(@PathVariable Long id, @RequestBody Comment comment) throws URISyntaxException {
        log.debug("REST request to add Proposal comment : {} + {}", id, comment);
        Optional<Long> userId = SecurityUtils.getCurrentUserId();
        if (! userId.isPresent()) {
            throw new BadRequestAlertException("There is no Current user. Can't add comment.", ENTITY_NAME, "nocurrentuser");
        }

        // only text was set in UI
        Comment result = proposalService.addComment(id, comment.getText(), userId.get());

        return ResponseEntity.created(new URI("/api/comments/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, "comment", result.getId().toString()))
            .body(result);
    }

    @PreAuthorize("hasRole(\"" + AuthoritiesConstants.MANAGER + "\")")
    @PostMapping("/proposals/{id}/addHistory")
    public ResponseEntity<History> addHistoryForProposal(@PathVariable Long id, @RequestBody History history) throws URISyntaxException {
        log.debug("REST request to add Proposal History: {} + {}", id, history);
        Optional<Long> userId = SecurityUtils.getCurrentUserId();
        if (! userId.isPresent()) {
            throw new BadRequestAlertException("There is no Current user. Can't add history like.", ENTITY_NAME, "nocurrentuser");
        }

        // only text was set in UI
        History result = proposalService.addHistory(history, id, userId.get());

        return ResponseEntity.created(new URI("/api/histories/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, "history", result.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /proposals/{id}/histories} : get all the histories for Proposal.
     *
     * @param id Proposal id.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of histories in body.
     */
    @GetMapping("/proposals/{id}/histories")
    public ResponseEntity<List<History>> getHistories(@PathVariable Long id) {
        log.debug("REST request to get a histories for Proposal");
        List<History> res = proposalService.getHistories(id);
        return ResponseEntity.ok().body(res);
    }

    /**
     * {@code POST  /proposals} : Create a new proposal.
     *
     * @param proposal the proposal to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new proposal, or with status {@code 400 (Bad Request)} if the proposal has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/proposals")
    // TODO: Uncomment @Valid and make UI show correct allert in case of backend error
    public ResponseEntity<Proposal> createProposal(/* @Valid */ @RequestBody Proposal proposal) throws URISyntaxException {
        log.debug("REST request to save Proposal : {}", proposal);
        if (proposal.getId() != null) {
            throw new BadRequestAlertException("A new proposal cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Optional<Long> userId = SecurityUtils.getCurrentUserId();
        if ( ! userId.isPresent() ) {
            throw new BadRequestAlertException("There is no Current user.", ENTITY_NAME, "nocurrentuser");
        }

        if ( ! SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN )
            && ( proposal.getAuthor().getId() != userId.get() )
        ) {
            throw new BadRequestAlertException("User is not present or not authorised.", ENTITY_NAME, "usernotauth");
        }

        Proposal result = proposalService.save(proposal, userId.get());
        return ResponseEntity.created(new URI("/api/proposals/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /proposals} : Updates an existing proposal.
     *
     * @param proposal the proposal to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated proposal,
     * or with status {@code 400 (Bad Request)} if the proposal is not valid,
     * or with status {@code 500 (Internal Server Error)} if the proposal couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/proposals")
    public ResponseEntity<Proposal> updateProposal(@Valid @RequestBody Proposal proposal) {
        log.debug("REST request to update Proposal : {}", proposal);
        if (proposal.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }

        Optional<Long> userId = SecurityUtils.getCurrentUserId();
        if ( ! userId.isPresent() ) {
            throw new BadRequestAlertException("There is no Current user. Cant toggle like.", ENTITY_NAME, "nocurrentuser");
        }

        if ( ! SecurityUtils.isCurrentUserInRole(AuthoritiesConstants.ADMIN )
            && ( proposal.getAuthor().getId() != userId.get() )
        ) {
            throw new BadRequestAlertException("User is not present or not authorised.", ENTITY_NAME, "usernotauth");
        }

        Proposal result = proposalService.save(proposal, userId.get());
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, proposal.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /proposals} : get all the proposals.
     *
     * @param pageable the pagination information.
     * @param queryParams a {@link MultiValueMap} query parameters.
     * @param uriBuilder a {@link UriComponentsBuilder} URI builder.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of proposals in body.
     */
    @GetMapping("/proposals")
    public ResponseEntity<List<Proposal>> getAllProposals(Pageable pageable, @RequestParam MultiValueMap<String, String> queryParams, UriComponentsBuilder uriBuilder, @RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get a page of Proposals");
        Page<Proposal> page;
        if (eagerload) {
            page = proposalService.findAllWithEagerRelationships(pageable);
            Optional<Long> userId = SecurityUtils.getCurrentUserId();
            if (userId.isPresent()) {
                // add user-dependent calculated attributes
                page.forEach(proposal -> {
                    setLikedAttribute(proposal, userId.get());
                });
            }
        } else {
            page = proposalService.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(uriBuilder.queryParams(queryParams), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    private void setLikedAttribute(Proposal proposal, Long userId) {
        boolean liked = proposal.getAlikes().stream().anyMatch(like -> (
            like.getAuthor().getId().equals(userId)
        ));
        proposal.setLiked(liked);
    }

    /**
     * {@code GET  /proposals/:id} : get the "id" proposal.
     *
     * @param id the id of the proposal to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the proposal, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/proposals/{id}")
    public ResponseEntity<Proposal> getProposal(@PathVariable Long id) {
        log.debug("REST request to get Proposal : {}", id);
        Optional<Proposal> proposal = proposalService.findOne(id);
        Optional<Long> userId = SecurityUtils.getCurrentUserId();
        if (proposal.isPresent() && userId.isPresent()) {
            setLikedAttribute(proposal.get(), userId.get());
        }
        return ResponseUtil.wrapOrNotFound(proposal);
    }

    /**
     * {@code DELETE  /proposals/:id} : delete the "id" proposal.
     *
     * @param id the id of the proposal to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/proposals/{id}")
    public ResponseEntity<Void> deleteProposal(@PathVariable Long id) {
        log.debug("REST request to delete Proposal : {}", id);
        proposalService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }

    /**
     * {@code SEARCH  /_search/proposals?query=:query} : search for the proposal corresponding
     * to the query.
     *
     * @param query the query of the proposal search.
     * @param pageable the pagination information.
     * @param queryParams a {@link MultiValueMap} query parameters.
     * @param uriBuilder a {@link UriComponentsBuilder} URI builder.
     * @return the result of the search.
     */
    @GetMapping("/_search/proposals")
    public ResponseEntity<List<Proposal>> searchProposals(@RequestParam String query, Pageable pageable, @RequestParam MultiValueMap<String, String> queryParams, UriComponentsBuilder uriBuilder) {
        log.debug("REST request to search for a page of Proposals for query {}", query);
        // TODO: to support eager relationship retrieval
        Page<Proposal> page = proposalService.search(query, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(uriBuilder.queryParams(queryParams), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

}
