package com.tsystems.proposal.repository.search;

import com.tsystems.proposal.domain.Alike;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Alike} entity.
 */
public interface AlikeSearchRepository extends ElasticsearchRepository<Alike, Long> {
}
