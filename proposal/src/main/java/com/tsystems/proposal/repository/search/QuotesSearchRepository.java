package com.tsystems.proposal.repository.search;

import com.tsystems.proposal.domain.Quotes;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Quotes} entity.
 */
public interface QuotesSearchRepository extends ElasticsearchRepository<Quotes, Long> {
}
