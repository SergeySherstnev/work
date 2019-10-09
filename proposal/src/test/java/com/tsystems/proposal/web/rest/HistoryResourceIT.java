package com.tsystems.proposal.web.rest;

import com.tsystems.proposal.ProposalApp;
import com.tsystems.proposal.domain.History;
import com.tsystems.proposal.domain.User;
import com.tsystems.proposal.domain.Proposal;
import com.tsystems.proposal.repository.HistoryRepository;
import com.tsystems.proposal.repository.search.HistorySearchRepository;
import com.tsystems.proposal.service.HistoryService;
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
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.List;

import static com.tsystems.proposal.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.tsystems.proposal.domain.enumeration.Status;
/**
 * Integration tests for the {@Link HistoryResource} REST controller.
 */
@SpringBootTest(classes = ProposalApp.class)
public class HistoryResourceIT {

    private static final Instant DEFAULT_CREATED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Status DEFAULT_STATUS = Status.NEW;
    private static final Status UPDATED_STATUS = Status.ACCEPTED;

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    @Autowired
    private HistoryRepository historyRepository;

    @Autowired
    private HistoryService historyService;

    /**
     * This repository is mocked in the com.tsystems.proposal.repository.search test package.
     *
     * @see com.tsystems.proposal.repository.search.HistorySearchRepositoryMockConfiguration
     */
    @Autowired
    private HistorySearchRepository mockHistorySearchRepository;

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

    private MockMvc restHistoryMockMvc;

    private History history;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final HistoryResource historyResource = new HistoryResource(historyService);
        this.restHistoryMockMvc = MockMvcBuilders.standaloneSetup(historyResource)
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
    public static History createEntity(EntityManager em) {
        History history = new History()
            .createdDate(DEFAULT_CREATED_DATE)
            .status(DEFAULT_STATUS)
            .comment(DEFAULT_COMMENT);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        history.setExecutive(user);
        // Add required entity
        Proposal proposal;
        if (TestUtil.findAll(em, Proposal.class).isEmpty()) {
            proposal = ProposalResourceIT.createEntity(em);
            em.persist(proposal);
            em.flush();
        } else {
            proposal = TestUtil.findAll(em, Proposal.class).get(0);
        }
        history.setProposal(proposal);
        return history;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static History createUpdatedEntity(EntityManager em) {
        History history = new History()
            .createdDate(UPDATED_CREATED_DATE)
            .status(UPDATED_STATUS)
            .comment(UPDATED_COMMENT);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        history.setExecutive(user);
        // Add required entity
        Proposal proposal;
        if (TestUtil.findAll(em, Proposal.class).isEmpty()) {
            proposal = ProposalResourceIT.createUpdatedEntity(em);
            em.persist(proposal);
            em.flush();
        } else {
            proposal = TestUtil.findAll(em, Proposal.class).get(0);
        }
        history.setProposal(proposal);
        return history;
    }

    @BeforeEach
    public void initTest() {
        history = createEntity(em);
    }

    @Test
    @Transactional
    public void createHistory() throws Exception {
        int databaseSizeBeforeCreate = historyRepository.findAll().size();

        // Create the History
        restHistoryMockMvc.perform(post("/api/histories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(history)))
            .andExpect(status().isCreated());

        // Validate the History in the database
        List<History> historyList = historyRepository.findAll();
        assertThat(historyList).hasSize(databaseSizeBeforeCreate + 1);
        History testHistory = historyList.get(historyList.size() - 1);
        assertThat(testHistory.getCreatedDate()).isEqualTo(DEFAULT_CREATED_DATE);
        assertThat(testHistory.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testHistory.getComment()).isEqualTo(DEFAULT_COMMENT);

        // Validate the History in Elasticsearch
        verify(mockHistorySearchRepository, times(1)).save(testHistory);
    }

    @Test
    @Transactional
    public void createHistoryWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = historyRepository.findAll().size();

        // Create the History with an existing ID
        history.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restHistoryMockMvc.perform(post("/api/histories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(history)))
            .andExpect(status().isBadRequest());

        // Validate the History in the database
        List<History> historyList = historyRepository.findAll();
        assertThat(historyList).hasSize(databaseSizeBeforeCreate);

        // Validate the History in Elasticsearch
        verify(mockHistorySearchRepository, times(0)).save(history);
    }


    @Test
    @Transactional
    public void checkCreatedDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = historyRepository.findAll().size();
        // set the field null
        history.setCreatedDate(null);

        // Create the History, which fails.

        restHistoryMockMvc.perform(post("/api/histories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(history)))
            .andExpect(status().isBadRequest());

        List<History> historyList = historyRepository.findAll();
        assertThat(historyList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkStatusIsRequired() throws Exception {
        int databaseSizeBeforeTest = historyRepository.findAll().size();
        // set the field null
        history.setStatus(null);

        // Create the History, which fails.

        restHistoryMockMvc.perform(post("/api/histories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(history)))
            .andExpect(status().isBadRequest());

        List<History> historyList = historyRepository.findAll();
        assertThat(historyList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkCommentIsRequired() throws Exception {
        int databaseSizeBeforeTest = historyRepository.findAll().size();
        // set the field null
        history.setComment(null);

        // Create the History, which fails.

        restHistoryMockMvc.perform(post("/api/histories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(history)))
            .andExpect(status().isBadRequest());

        List<History> historyList = historyRepository.findAll();
        assertThat(historyList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllHistories() throws Exception {
        // Initialize the database
        historyRepository.saveAndFlush(history);

        // Get all the historyList
        restHistoryMockMvc.perform(get("/api/histories?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(history.getId().intValue())))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT.toString())));
    }
    
    @Test
    @Transactional
    public void getHistory() throws Exception {
        // Initialize the database
        historyRepository.saveAndFlush(history);

        // Get the history
        restHistoryMockMvc.perform(get("/api/histories/{id}", history.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(history.getId().intValue()))
            .andExpect(jsonPath("$.createdDate").value(DEFAULT_CREATED_DATE.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingHistory() throws Exception {
        // Get the history
        restHistoryMockMvc.perform(get("/api/histories/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateHistory() throws Exception {
        // Initialize the database
        historyService.save(history);
        // As the test used the service layer, reset the Elasticsearch mock repository
        reset(mockHistorySearchRepository);

        int databaseSizeBeforeUpdate = historyRepository.findAll().size();

        // Update the history
        History updatedHistory = historyRepository.findById(history.getId()).get();
        // Disconnect from session so that the updates on updatedHistory are not directly saved in db
        em.detach(updatedHistory);
        updatedHistory
            .createdDate(UPDATED_CREATED_DATE)
            .status(UPDATED_STATUS)
            .comment(UPDATED_COMMENT);

        restHistoryMockMvc.perform(put("/api/histories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedHistory)))
            .andExpect(status().isOk());

        // Validate the History in the database
        List<History> historyList = historyRepository.findAll();
        assertThat(historyList).hasSize(databaseSizeBeforeUpdate);
        History testHistory = historyList.get(historyList.size() - 1);
        assertThat(testHistory.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
        assertThat(testHistory.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testHistory.getComment()).isEqualTo(UPDATED_COMMENT);

        // Validate the History in Elasticsearch
        verify(mockHistorySearchRepository, times(1)).save(testHistory);
    }

    @Test
    @Transactional
    public void updateNonExistingHistory() throws Exception {
        int databaseSizeBeforeUpdate = historyRepository.findAll().size();

        // Create the History

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHistoryMockMvc.perform(put("/api/histories")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(history)))
            .andExpect(status().isBadRequest());

        // Validate the History in the database
        List<History> historyList = historyRepository.findAll();
        assertThat(historyList).hasSize(databaseSizeBeforeUpdate);

        // Validate the History in Elasticsearch
        verify(mockHistorySearchRepository, times(0)).save(history);
    }

    @Test
    @Transactional
    public void deleteHistory() throws Exception {
        // Initialize the database
        historyService.save(history);

        int databaseSizeBeforeDelete = historyRepository.findAll().size();

        // Delete the history
        restHistoryMockMvc.perform(delete("/api/histories/{id}", history.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<History> historyList = historyRepository.findAll();
        assertThat(historyList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the History in Elasticsearch
        verify(mockHistorySearchRepository, times(1)).deleteById(history.getId());
    }

    @Test
    @Transactional
    public void searchHistory() throws Exception {
        // Initialize the database
        historyService.save(history);
        when(mockHistorySearchRepository.search(queryStringQuery("id:" + history.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(history), PageRequest.of(0, 1), 1));
        // Search the history
        restHistoryMockMvc.perform(get("/api/_search/histories?query=id:" + history.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(history.getId().intValue())))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT)));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(History.class);
        History history1 = new History();
        history1.setId(1L);
        History history2 = new History();
        history2.setId(history1.getId());
        assertThat(history1).isEqualTo(history2);
        history2.setId(2L);
        assertThat(history1).isNotEqualTo(history2);
        history1.setId(null);
        assertThat(history1).isNotEqualTo(history2);
    }
}
