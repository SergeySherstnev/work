package com.tsystems.proposal.repository.search;

import com.tsystems.proposal.domain.History;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link History} entity.
 */
public interface HistorySearchRepository extends ElasticsearchRepository<History, Long> {
}
