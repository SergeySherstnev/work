package com.tsystems.proposal.repository.search;

import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Configuration;

/**
 * Configure a Mock version of {@link QuotesSearchRepository} to test the
 * application without starting Elasticsearch.
 */
@Configuration
public class QuotesSearchRepositoryMockConfiguration {

    @MockBean
    private QuotesSearchRepository mockQuotesSearchRepository;

}
