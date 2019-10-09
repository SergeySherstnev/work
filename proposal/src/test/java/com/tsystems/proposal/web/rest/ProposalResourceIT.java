package com.tsystems.proposal.web.rest;

import com.tsystems.proposal.ProposalApp;
import com.tsystems.proposal.domain.Proposal;
import com.tsystems.proposal.domain.User;
import com.tsystems.proposal.repository.ProposalRepository;
import com.tsystems.proposal.repository.search.ProposalSearchRepository;
import com.tsystems.proposal.service.AlikeService;
import com.tsystems.proposal.service.CommentService;
import com.tsystems.proposal.service.ProposalService;
import com.tsystems.proposal.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
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
import java.util.ArrayList;
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
 * Integration tests for the {@Link ProposalResource} REST controller.
 */
@SpringBootTest(classes = ProposalApp.class)
public class ProposalResourceIT {

    private static final String DEFAULT_CAPTION = "AAAAAAAAAA";
    private static final String UPDATED_CAPTION = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Integer DEFAULT_PRIORITY = 1;
    private static final Integer UPDATED_PRIORITY = 2;

    private static final Long DEFAULT_ALIKE_SUM = 1L;
    private static final Long UPDATED_ALIKE_SUM = 2L;

    private static final Long DEFAULT_COMMENT_SUM = 1L;
    private static final Long UPDATED_COMMENT_SUM = 2L;

    private static final Instant DEFAULT_CREATED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_UPDATED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_UPDATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Status DEFAULT_STATUS = Status.NEW;
    private static final Status UPDATED_STATUS = Status.ACCEPTED;

    @Autowired
    private ProposalRepository proposalRepository;

    @Mock
    private ProposalRepository proposalRepositoryMock;

    @Mock
    private ProposalService proposalServiceMock;

    @Mock
    private AlikeService alikeServiceMock;


    @Autowired
    private ProposalService proposalService;

    /**
     * This repository is mocked in the com.tsystems.proposal.repository.search test package.
     *
     * @see com.tsystems.proposal.repository.search.ProposalSearchRepositoryMockConfiguration
     */
    @Autowired
    private ProposalSearchRepository mockProposalSearchRepository;

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

    private MockMvc restProposalMockMvc;

    private Proposal proposal;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final ProposalResource proposalResource = new ProposalResource(proposalService, alikeServiceMock);
        this.restProposalMockMvc = MockMvcBuilders.standaloneSetup(proposalResource)
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
    public static Proposal createEntity(EntityManager em) {
        Proposal proposal = new Proposal()
            .caption(DEFAULT_CAPTION)
            .description(DEFAULT_DESCRIPTION)
            .priority(DEFAULT_PRIORITY)
            .alikeSum(DEFAULT_ALIKE_SUM)
            .commentSum(DEFAULT_COMMENT_SUM)
            .createdDate(DEFAULT_CREATED_DATE)
            .updatedDate(DEFAULT_UPDATED_DATE)
            .status(DEFAULT_STATUS);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        proposal.setAuthor(user);
        return proposal;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Proposal createUpdatedEntity(EntityManager em) {
        Proposal proposal = new Proposal()
            .caption(UPDATED_CAPTION)
            .description(UPDATED_DESCRIPTION)
            .priority(UPDATED_PRIORITY)
            .alikeSum(UPDATED_ALIKE_SUM)
            .commentSum(UPDATED_COMMENT_SUM)
            .createdDate(UPDATED_CREATED_DATE)
            .updatedDate(UPDATED_UPDATED_DATE)
            .status(UPDATED_STATUS);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        proposal.setAuthor(user);
        return proposal;
    }

    @BeforeEach
    public void initTest() {
        proposal = createEntity(em);
    }

    @Test
    @Transactional
    public void createProposal() throws Exception {
        int databaseSizeBeforeCreate = proposalRepository.findAll().size();

        // Create the Proposal
        restProposalMockMvc.perform(post("/api/proposals")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(proposal)))
            .andExpect(status().isCreated());

        // Validate the Proposal in the database
        List<Proposal> proposalList = proposalRepository.findAll();
        assertThat(proposalList).hasSize(databaseSizeBeforeCreate + 1);
        Proposal testProposal = proposalList.get(proposalList.size() - 1);
        assertThat(testProposal.getCaption()).isEqualTo(DEFAULT_CAPTION);
        assertThat(testProposal.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testProposal.getPriority()).isEqualTo(DEFAULT_PRIORITY);
        assertThat(testProposal.getAlikeSum()).isEqualTo(DEFAULT_ALIKE_SUM);
        assertThat(testProposal.getCommentSum()).isEqualTo(DEFAULT_COMMENT_SUM);
        assertThat(testProposal.getCreatedDate()).isEqualTo(DEFAULT_CREATED_DATE);
        assertThat(testProposal.getUpdatedDate()).isEqualTo(DEFAULT_UPDATED_DATE);
        assertThat(testProposal.getStatus()).isEqualTo(DEFAULT_STATUS);

        // Validate the Proposal in Elasticsearch
        verify(mockProposalSearchRepository, times(1)).save(testProposal);
    }

    @Test
    @Transactional
    public void createProposalWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = proposalRepository.findAll().size();

        // Create the Proposal with an existing ID
        proposal.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restProposalMockMvc.perform(post("/api/proposals")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(proposal)))
            .andExpect(status().isBadRequest());

        // Validate the Proposal in the database
        List<Proposal> proposalList = proposalRepository.findAll();
        assertThat(proposalList).hasSize(databaseSizeBeforeCreate);

        // Validate the Proposal in Elasticsearch
        verify(mockProposalSearchRepository, times(0)).save(proposal);
    }


    @Test
    @Transactional
    public void checkCaptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = proposalRepository.findAll().size();
        // set the field null
        proposal.setCaption(null);

        // Create the Proposal, which fails.

        restProposalMockMvc.perform(post("/api/proposals")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(proposal)))
            .andExpect(status().isBadRequest());

        List<Proposal> proposalList = proposalRepository.findAll();
        assertThat(proposalList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = proposalRepository.findAll().size();
        // set the field null
        proposal.setDescription(null);

        // Create the Proposal, which fails.

        restProposalMockMvc.perform(post("/api/proposals")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(proposal)))
            .andExpect(status().isBadRequest());

        List<Proposal> proposalList = proposalRepository.findAll();
        assertThat(proposalList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkCreatedDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = proposalRepository.findAll().size();
        // set the field null
        proposal.setCreatedDate(null);

        // Create the Proposal, which fails.

        restProposalMockMvc.perform(post("/api/proposals")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(proposal)))
            .andExpect(status().isBadRequest());

        List<Proposal> proposalList = proposalRepository.findAll();
        assertThat(proposalList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkUpdatedDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = proposalRepository.findAll().size();
        // set the field null
        proposal.setUpdatedDate(null);

        // Create the Proposal, which fails.

        restProposalMockMvc.perform(post("/api/proposals")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(proposal)))
            .andExpect(status().isBadRequest());

        List<Proposal> proposalList = proposalRepository.findAll();
        assertThat(proposalList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkStatusIsRequired() throws Exception {
        int databaseSizeBeforeTest = proposalRepository.findAll().size();
        // set the field null
        proposal.setStatus(null);

        // Create the Proposal, which fails.

        restProposalMockMvc.perform(post("/api/proposals")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(proposal)))
            .andExpect(status().isBadRequest());

        List<Proposal> proposalList = proposalRepository.findAll();
        assertThat(proposalList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllProposals() throws Exception {
        // Initialize the database
        proposalRepository.saveAndFlush(proposal);

        // Get all the proposalList
        restProposalMockMvc.perform(get("/api/proposals?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(proposal.getId().intValue())))
            .andExpect(jsonPath("$.[*].caption").value(hasItem(DEFAULT_CAPTION.toString())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION.toString())))
            .andExpect(jsonPath("$.[*].priority").value(hasItem(DEFAULT_PRIORITY)))
            .andExpect(jsonPath("$.[*].alikeSum").value(hasItem(DEFAULT_ALIKE_SUM.intValue())))
            .andExpect(jsonPath("$.[*].commentSum").value(hasItem(DEFAULT_COMMENT_SUM.intValue())))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())))
            .andExpect(jsonPath("$.[*].updatedDate").value(hasItem(DEFAULT_UPDATED_DATE.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }

    @SuppressWarnings({"unchecked"})
    public void getAllProposalsWithEagerRelationshipsIsEnabled() throws Exception {
            ProposalResource proposalResource = new ProposalResource(proposalServiceMock, alikeServiceMock);
        when(proposalServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        MockMvc restProposalMockMvc = MockMvcBuilders.standaloneSetup(proposalResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restProposalMockMvc.perform(get("/api/proposals?eagerload=true"))
        .andExpect(status().isOk());

        verify(proposalServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({"unchecked"})
    public void getAllProposalsWithEagerRelationshipsIsNotEnabled() throws Exception {
        ProposalResource proposalResource = new ProposalResource(proposalServiceMock, alikeServiceMock);
            when(proposalServiceMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));
            MockMvc restProposalMockMvc = MockMvcBuilders.standaloneSetup(proposalResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();

        restProposalMockMvc.perform(get("/api/proposals?eagerload=true"))
        .andExpect(status().isOk());

            verify(proposalServiceMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    public void getProposal() throws Exception {
        // Initialize the database
        proposalRepository.saveAndFlush(proposal);

        // Get the proposal
        restProposalMockMvc.perform(get("/api/proposals/{id}", proposal.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(proposal.getId().intValue()))
            .andExpect(jsonPath("$.caption").value(DEFAULT_CAPTION.toString()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION.toString()))
            .andExpect(jsonPath("$.priority").value(DEFAULT_PRIORITY))
            .andExpect(jsonPath("$.alikeSum").value(DEFAULT_ALIKE_SUM.intValue()))
            .andExpect(jsonPath("$.commentSum").value(DEFAULT_COMMENT_SUM.intValue()))
            .andExpect(jsonPath("$.createdDate").value(DEFAULT_CREATED_DATE.toString()))
            .andExpect(jsonPath("$.updatedDate").value(DEFAULT_UPDATED_DATE.toString()))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingProposal() throws Exception {
        // Get the proposal
        restProposalMockMvc.perform(get("/api/proposals/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateProposal() throws Exception {
        // Initialize the database
        proposalService.save(proposal);
        // As the test used the service layer, reset the Elasticsearch mock repository
        reset(mockProposalSearchRepository);

        int databaseSizeBeforeUpdate = proposalRepository.findAll().size();

        // Update the proposal
        Proposal updatedProposal = proposalRepository.findById(proposal.getId()).get();
        // Disconnect from session so that the updates on updatedProposal are not directly saved in db
        em.detach(updatedProposal);
        updatedProposal
            .caption(UPDATED_CAPTION)
            .description(UPDATED_DESCRIPTION)
            .priority(UPDATED_PRIORITY)
            .alikeSum(UPDATED_ALIKE_SUM)
            .commentSum(UPDATED_COMMENT_SUM)
            .createdDate(UPDATED_CREATED_DATE)
            .updatedDate(UPDATED_UPDATED_DATE)
            .status(UPDATED_STATUS);

        restProposalMockMvc.perform(put("/api/proposals")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedProposal)))
            .andExpect(status().isOk());

        // Validate the Proposal in the database
        List<Proposal> proposalList = proposalRepository.findAll();
        assertThat(proposalList).hasSize(databaseSizeBeforeUpdate);
        Proposal testProposal = proposalList.get(proposalList.size() - 1);
        assertThat(testProposal.getCaption()).isEqualTo(UPDATED_CAPTION);
        assertThat(testProposal.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testProposal.getPriority()).isEqualTo(UPDATED_PRIORITY);
        assertThat(testProposal.getAlikeSum()).isEqualTo(UPDATED_ALIKE_SUM);
        assertThat(testProposal.getCommentSum()).isEqualTo(UPDATED_COMMENT_SUM);
        assertThat(testProposal.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);
        assertThat(testProposal.getUpdatedDate()).isEqualTo(UPDATED_UPDATED_DATE);
        assertThat(testProposal.getStatus()).isEqualTo(UPDATED_STATUS);

        // Validate the Proposal in Elasticsearch
        verify(mockProposalSearchRepository, times(1)).save(testProposal);
    }

    @Test
    @Transactional
    public void updateNonExistingProposal() throws Exception {
        int databaseSizeBeforeUpdate = proposalRepository.findAll().size();

        // Create the Proposal

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProposalMockMvc.perform(put("/api/proposals")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(proposal)))
            .andExpect(status().isBadRequest());

        // Validate the Proposal in the database
        List<Proposal> proposalList = proposalRepository.findAll();
        assertThat(proposalList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Proposal in Elasticsearch
        verify(mockProposalSearchRepository, times(0)).save(proposal);
    }

    @Test
    @Transactional
    public void deleteProposal() throws Exception {
        // Initialize the database
        proposalService.save(proposal);

        int databaseSizeBeforeDelete = proposalRepository.findAll().size();

        // Delete the proposal
        restProposalMockMvc.perform(delete("/api/proposals/{id}", proposal.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Proposal> proposalList = proposalRepository.findAll();
        assertThat(proposalList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Proposal in Elasticsearch
        verify(mockProposalSearchRepository, times(1)).deleteById(proposal.getId());
    }

    @Test
    @Transactional
    public void searchProposal() throws Exception {
        // Initialize the database
        proposalService.save(proposal);
        when(mockProposalSearchRepository.search(queryStringQuery("id:" + proposal.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(proposal), PageRequest.of(0, 1), 1));
        // Search the proposal
        restProposalMockMvc.perform(get("/api/_search/proposals?query=id:" + proposal.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(proposal.getId().intValue())))
            .andExpect(jsonPath("$.[*].caption").value(hasItem(DEFAULT_CAPTION)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].priority").value(hasItem(DEFAULT_PRIORITY)))
            .andExpect(jsonPath("$.[*].alikeSum").value(hasItem(DEFAULT_ALIKE_SUM.intValue())))
            .andExpect(jsonPath("$.[*].commentSum").value(hasItem(DEFAULT_COMMENT_SUM.intValue())))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())))
            .andExpect(jsonPath("$.[*].updatedDate").value(hasItem(DEFAULT_UPDATED_DATE.toString())))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Proposal.class);
        Proposal proposal1 = new Proposal();
        proposal1.setId(1L);
        Proposal proposal2 = new Proposal();
        proposal2.setId(proposal1.getId());
        assertThat(proposal1).isEqualTo(proposal2);
        proposal2.setId(2L);
        assertThat(proposal1).isNotEqualTo(proposal2);
        proposal1.setId(null);
        assertThat(proposal1).isNotEqualTo(proposal2);
    }
}
