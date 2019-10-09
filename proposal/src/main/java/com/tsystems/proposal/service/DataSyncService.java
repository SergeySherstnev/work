package com.tsystems.proposal.service;

import com.tsystems.proposal.domain.Proposal;
import com.tsystems.proposal.service.impl.ProposalServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Data synchronization.
 *
 * For performance reason there are some redundant data fields in DB.
 *
 * E.g. alikeSum and commentSum in Proposal entity.
 *
 * Even so most updates, inserts should update this redundant data fields, data out of sync is possible.
 *
 * This service has a several scheduled jobs which calculate and update mentioned data fields in DB.
 *
 * This service also update Elasticsearch indexes.
 */
@Service
public class DataSyncService {

    private final Logger log = LoggerFactory.getLogger(DataSyncService.class);

    private final ProposalService proposalService;;

    @Autowired
    public DataSyncService(ProposalService proposalService) {
        this.proposalService = proposalService;
    }

    /**
     * This job update Proposal.updatedDate  and Proposal.status according to the last History entity of each proposal.
     *
     * First run after 40 minutes after application start.
     * Then run after one hour after previous finish.
     *
     */
    @Scheduled(fixedDelay = 60 * 60 * 1000 /*, initialDelay = 40 * 60 * 1000 */)
    public void updateProposalStatus() {
        log.info("Start updating Proposal.updatedDate  and Proposal.status according to the last History entity of each proposal ...");
        int start = 0;
        final int pageSize = 20;
        int totalPages = 0;

        do {
            Pageable pageable = PageRequest.of(start, pageSize);
            Page<Proposal> page = proposalService.findAll(pageable);
            for (Proposal prop : page.getContent()) {
                proposalService.updateStatus(prop);
            }
            start++;
            totalPages = page.getTotalPages();
        } while (start < totalPages);

        log.info("Finished updating Proposal.updatedDate and Proposal.status. ~{} proposal updated.", start*pageSize);
    }

    /**
     * This job update Proposal.alikeSum  and Proposal.commentSum according to number of comment and number of likes in each proposal.
     *
     * First run after 30 minutes after application start.
     * Then run after one hour after previous finish.
     *
     */
    @Scheduled(fixedDelay = 60 * 60 * 1000, initialDelay = 30 * 60 * 1000)
    public void updateProposalCounters() {
        log.info("Start updating Proposal.alikeSum and Proposal.commentSum according to number of comment and number of likes in each proposal. ...");

        int start = 0;
        final int pageSize = 20;
        int totalPages = 0;

        do {
            Pageable pageable = PageRequest.of(start, pageSize);
            Page<Proposal> page = proposalService.findAll(pageable);
            for (Proposal prop : page.getContent()) {
                proposalService.updateLikeSum(prop);
                proposalService.updateCommentSum(prop);
            }
            start++;
            totalPages = page.getTotalPages();
        } while (start < totalPages);

        log.info("Finished updating Proposal.alikeSum and Proposal.commentSum. ~{} proposal updated.", start*pageSize);
    }

    /**
     * This job update elasticsearch index of Proposals.
     *
     * First run after 10 minutes after application start.
     * Then run after one hour after previous finish.
     *
     */
    @Scheduled(fixedDelay = 60 * 60 * 1000, initialDelay = 10 * 60 * 1000)
    public void updateProposalSearchIndex() {
        log.info("Start updating Elasticsearch index of Proposals ...");

        int start = 0;
        final int pageSize = 20;
        int totalPages = 0;

        do {
            Pageable pageable = PageRequest.of(start, pageSize);
            Page<Proposal> page = proposalService.findAllWithEagerRelationships(pageable);
            for (Proposal prop : page.getContent()) {
                proposalService.saveOrUpdateSearchIndex(prop);
            }
            start++;
            totalPages = page.getTotalPages();
        } while (start < totalPages);

        log.info("Finished updating Elasticsearch index of Proposals. ~{} proposal updated.", start*pageSize);
    }

}
