package com.tsystems.proposal.repository.search;

import com.tsystems.proposal.domain.Proposal;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Proposal} entity.
 */
public interface ProposalSearchRepository extends ElasticsearchRepository<Proposal, Long> {
}
