package com.tsystems.proposal.web.rest;

import com.tsystems.proposal.ProposalApp;
import com.tsystems.proposal.domain.Quotes;
import com.tsystems.proposal.repository.QuotesRepository;
import com.tsystems.proposal.repository.search.QuotesSearchRepository;
import com.tsystems.proposal.service.QuotesService;
import com.tsystems.proposal.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.Collections;
import java.util.List;

import static com.tsystems.proposal.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@Link QuotesResource} REST controller.
 */
@SpringBootTest(classes = ProposalApp.class)
public class QuotesResourceIT {

    private static final String DEFAULT_TEXT = "AAAAAAAAAA";
    private static final String UPDATED_TEXT = "BBBBBBBBBB";

    private static final String DEFAULT_AUTHOR = "AAAAAAAAAA";
    private static final String UPDATED_AUTHOR = "BBBBBBBBBB";

    private static final String DEFAULT_CATEGORY = "AAAAAAAAAA";
    private static final String UPDATED_CATEGORY = "BBBBBBBBBB";

    @Autowired
    private QuotesRepository quotesRepository;

    @Autowired
    private QuotesService quotesService;

    /**
     * This repository is mocked in the com.tsystems.proposal.repository.search test package.
     *
     * @see com.tsystems.proposal.repository.search.QuotesSearchRepositoryMockConfiguration
     */
    @Autowired
    private QuotesSearchRepository mockQuotesSearchRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restQuotesMockMvc;

    private Quotes quotes;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final QuotesResource quotesResource = new QuotesResource(quotesService);
        this.restQuotesMockMvc = MockMvcBuilders.standaloneSetup(quotesResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Quotes createEntity(EntityManager em) {
        Quotes quotes = new Quotes()
            .text(DEFAULT_TEXT)
            .author(DEFAULT_AUTHOR)
            .category(DEFAULT_CATEGORY);
        return quotes;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Quotes createUpdatedEntity(EntityManager em) {
        Quotes quotes = new Quotes()
            .text(UPDATED_TEXT)
            .author(UPDATED_AUTHOR)
            .category(UPDATED_CATEGORY);
        return quotes;
    }

    @BeforeEach
    public void initTest() {
        quotes = createEntity(em);
    }

    @Test
    @Transactional
    public void createQuotes() throws Exception {
        int databaseSizeBeforeCreate = quotesRepository.findAll().size();

        // Create the Quotes
        restQuotesMockMvc.perform(post("/api/quotes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(quotes)))
            .andExpect(status().isCreated());

        // Validate the Quotes in the database
        List<Quotes> quotesList = quotesRepository.findAll();
        assertThat(quotesList).hasSize(databaseSizeBeforeCreate + 1);
        Quotes testQuotes = quotesList.get(quotesList.size() - 1);
        assertThat(testQuotes.getText()).isEqualTo(DEFAULT_TEXT);
        assertThat(testQuotes.getAuthor()).isEqualTo(DEFAULT_AUTHOR);
        assertThat(testQuotes.getCategory()).isEqualTo(DEFAULT_CATEGORY);

        // Validate the Quotes in Elasticsearch
        verify(mockQuotesSearchRepository, times(1)).save(testQuotes);
    }

    @Test
    @Transactional
    public void createQuotesWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = quotesRepository.findAll().size();

        // Create the Quotes with an existing ID
        quotes.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restQuotesMockMvc.perform(post("/api/quotes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(quotes)))
            .andExpect(status().isBadRequest());

        // Validate the Quotes in the database
        List<Quotes> quotesList = quotesRepository.findAll();
        assertThat(quotesList).hasSize(databaseSizeBeforeCreate);

        // Validate the Quotes in Elasticsearch
        verify(mockQuotesSearchRepository, times(0)).save(quotes);
    }


    @Test
    @Transactional
    public void checkTextIsRequired() throws Exception {
        int databaseSizeBeforeTest = quotesRepository.findAll().size();
        // set the field null
        quotes.setText(null);

        // Create the Quotes, which fails.

        restQuotesMockMvc.perform(post("/api/quotes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(quotes)))
            .andExpect(status().isBadRequest());

        List<Quotes> quotesList = quotesRepository.findAll();
        assertThat(quotesList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkAuthorIsRequired() throws Exception {
        int databaseSizeBeforeTest = quotesRepository.findAll().size();
        // set the field null
        quotes.setAuthor(null);

        // Create the Quotes, which fails.

        restQuotesMockMvc.perform(post("/api/quotes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(quotes)))
            .andExpect(status().isBadRequest());

        List<Quotes> quotesList = quotesRepository.findAll();
        assertThat(quotesList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkCategoryIsRequired() throws Exception {
        int databaseSizeBeforeTest = quotesRepository.findAll().size();
        // set the field null
        quotes.setCategory(null);

        // Create the Quotes, which fails.

        restQuotesMockMvc.perform(post("/api/quotes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(quotes)))
            .andExpect(status().isBadRequest());

        List<Quotes> quotesList = quotesRepository.findAll();
        assertThat(quotesList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllQuotes() throws Exception {
        // Initialize the database
        quotesRepository.saveAndFlush(quotes);

        // Get all the quotesList
        restQuotesMockMvc.perform(get("/api/quotes?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(quotes.getId().intValue())))
            .andExpect(jsonPath("$.[*].text").value(hasItem(DEFAULT_TEXT.toString())))
            .andExpect(jsonPath("$.[*].author").value(hasItem(DEFAULT_AUTHOR.toString())))
            .andExpect(jsonPath("$.[*].category").value(hasItem(DEFAULT_CATEGORY.toString())));
    }
    
    @Test
    @Transactional
    public void getQuotes() throws Exception {
        // Initialize the database
        quotesRepository.saveAndFlush(quotes);

        // Get the quotes
        restQuotesMockMvc.perform(get("/api/quotes/{id}", quotes.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(quotes.getId().intValue()))
            .andExpect(jsonPath("$.text").value(DEFAULT_TEXT.toString()))
            .andExpect(jsonPath("$.author").value(DEFAULT_AUTHOR.toString()))
            .andExpect(jsonPath("$.category").value(DEFAULT_CATEGORY.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingQuotes() throws Exception {
        // Get the quotes
        restQuotesMockMvc.perform(get("/api/quotes/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateQuotes() throws Exception {
        // Initialize the database
        quotesService.save(quotes);
        // As the test used the service layer, reset the Elasticsearch mock repository
        reset(mockQuotesSearchRepository);

        int databaseSizeBeforeUpdate = quotesRepository.findAll().size();

        // Update the quotes
        Quotes updatedQuotes = quotesRepository.findById(quotes.getId()).get();
        // Disconnect from session so that the updates on updatedQuotes are not directly saved in db
        em.detach(updatedQuotes);
        updatedQuotes
            .text(UPDATED_TEXT)
            .author(UPDATED_AUTHOR)
            .category(UPDATED_CATEGORY);

        restQuotesMockMvc.perform(put("/api/quotes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedQuotes)))
            .andExpect(status().isOk());

        // Validate the Quotes in the database
        List<Quotes> quotesList = quotesRepository.findAll();
        assertThat(quotesList).hasSize(databaseSizeBeforeUpdate);
        Quotes testQuotes = quotesList.get(quotesList.size() - 1);
        assertThat(testQuotes.getText()).isEqualTo(UPDATED_TEXT);
        assertThat(testQuotes.getAuthor()).isEqualTo(UPDATED_AUTHOR);
        assertThat(testQuotes.getCategory()).isEqualTo(UPDATED_CATEGORY);

        // Validate the Quotes in Elasticsearch
        verify(mockQuotesSearchRepository, times(1)).save(testQuotes);
    }

    @Test
    @Transactional
    public void updateNonExistingQuotes() throws Exception {
        int databaseSizeBeforeUpdate = quotesRepository.findAll().size();

        // Create the Quotes

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restQuotesMockMvc.perform(put("/api/quotes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(quotes)))
            .andExpect(status().isBadRequest());

        // Validate the Quotes in the database
        List<Quotes> quotesList = quotesRepository.findAll();
        assertThat(quotesList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Quotes in Elasticsearch
        verify(mockQuotesSearchRepository, times(0)).save(quotes);
    }

    @Test
    @Transactional
    public void deleteQuotes() throws Exception {
        // Initialize the database
        quotesService.save(quotes);

        int databaseSizeBeforeDelete = quotesRepository.findAll().size();

        // Delete the quotes
        restQuotesMockMvc.perform(delete("/api/quotes/{id}", quotes.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Quotes> quotesList = quotesRepository.findAll();
        assertThat(quotesList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Quotes in Elasticsearch
        verify(mockQuotesSearchRepository, times(1)).deleteById(quotes.getId());
    }

    @Test
    @Transactional
    public void searchQuotes() throws Exception {
        // Initialize the database
        quotesService.save(quotes);
        when(mockQuotesSearchRepository.search(queryStringQuery("id:" + quotes.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(quotes), PageRequest.of(0, 1), 1));
        // Search the quotes
        restQuotesMockMvc.perform(get("/api/_search/quotes?query=id:" + quotes.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(quotes.getId().intValue())))
            .andExpect(jsonPath("$.[*].text").value(hasItem(DEFAULT_TEXT)))
            .andExpect(jsonPath("$.[*].author").value(hasItem(DEFAULT_AUTHOR)))
            .andExpect(jsonPath("$.[*].category").value(hasItem(DEFAULT_CATEGORY)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Quotes.class);
        Quotes quotes1 = new Quotes();
        quotes1.setId(1L);
        Quotes quotes2 = new Quotes();
        quotes2.setId(quotes1.getId());
        assertThat(quotes1).isEqualTo(quotes2);
        quotes2.setId(2L);
        assertThat(quotes1).isNotEqualTo(quotes2);
        quotes1.setId(null);
        assertThat(quotes1).isNotEqualTo(quotes2);
    }
}
