package com.tsystems.proposal.repository.search;

import com.tsystems.proposal.domain.Tag;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

/**
 * Spring Data Elasticsearch repository for the {@link Tag} entity.
 */
public interface TagSearchRepository extends ElasticsearchRepository<Tag, Long> {
}
