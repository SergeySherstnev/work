package com.tsystems.proposal.web.rest;

import com.tsystems.proposal.ProposalApp;
import com.tsystems.proposal.domain.Alike;
import com.tsystems.proposal.domain.User;
import com.tsystems.proposal.domain.Proposal;
import com.tsystems.proposal.repository.AlikeRepository;
import com.tsystems.proposal.repository.search.AlikeSearchRepository;
import com.tsystems.proposal.service.AlikeService;
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

/**
 * Integration tests for the {@Link AlikeResource} REST controller.
 */
@SpringBootTest(classes = ProposalApp.class)
public class AlikeResourceIT {

    private static final String DEFAULT_TEXT = "AAAAAAAAAA";
    private static final String UPDATED_TEXT = "BBBBBBBBBB";

    private static final Instant DEFAULT_CREATED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    @Autowired
    private AlikeRepository alikeRepository;

    @Autowired
    private AlikeService alikeService;

    /**
     * This repository is mocked in the com.tsystems.proposal.repository.search test package.
     *
     * @see com.tsystems.proposal.repository.search.AlikeSearchRepositoryMockConfiguration
     */
    @Autowired
    private AlikeSearchRepository mockAlikeSearchRepository;

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

    private MockMvc restAlikeMockMvc;

    private Alike alike;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final AlikeResource alikeResource = new AlikeResource(alikeService);
        this.restAlikeMockMvc = MockMvcBuilders.standaloneSetup(alikeResource)
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
    public static Alike createEntity(EntityManager em) {
        Alike alike = new Alike()
            .text(DEFAULT_TEXT)
            .createdDate(DEFAULT_CREATED_DATE);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        alike.setAuthor(user);
        // Add required entity
        Proposal proposal;
        if (TestUtil.findAll(em, Proposal.class).isEmpty()) {
            proposal = ProposalResourceIT.createEntity(em);
            em.persist(proposal);
            em.flush();
        } else {
            proposal = TestUtil.findAll(em, Proposal.class).get(0);
        }
        alike.setProposal(proposal);
        return alike;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Alike createUpdatedEntity(EntityManager em) {
        Alike alike = new Alike()
            .text(UPDATED_TEXT)
            .createdDate(UPDATED_CREATED_DATE);
        // Add required entity
        User user = UserResourceIT.createEntity(em);
        em.persist(user);
        em.flush();
        alike.setAuthor(user);
        // Add required entity
        Proposal proposal;
        if (TestUtil.findAll(em, Proposal.class).isEmpty()) {
            proposal = ProposalResourceIT.createUpdatedEntity(em);
            em.persist(proposal);
            em.flush();
        } else {
            proposal = TestUtil.findAll(em, Proposal.class).get(0);
        }
        alike.setProposal(proposal);
        return alike;
    }

    @BeforeEach
    public void initTest() {
        alike = createEntity(em);
    }

    @Test
    @Transactional
    public void createAlike() throws Exception {
        int databaseSizeBeforeCreate = alikeRepository.findAll().size();

        // Create the Alike
        restAlikeMockMvc.perform(post("/api/alikes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(alike)))
            .andExpect(status().isCreated());

        // Validate the Alike in the database
        List<Alike> alikeList = alikeRepository.findAll();
        assertThat(alikeList).hasSize(databaseSizeBeforeCreate + 1);
        Alike testAlike = alikeList.get(alikeList.size() - 1);
        assertThat(testAlike.getText()).isEqualTo(DEFAULT_TEXT);
        assertThat(testAlike.getCreatedDate()).isEqualTo(DEFAULT_CREATED_DATE);

        // Validate the Alike in Elasticsearch
        verify(mockAlikeSearchRepository, times(1)).save(testAlike);
    }

    @Test
    @Transactional
    public void createAlikeWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = alikeRepository.findAll().size();

        // Create the Alike with an existing ID
        alike.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restAlikeMockMvc.perform(post("/api/alikes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(alike)))
            .andExpect(status().isBadRequest());

        // Validate the Alike in the database
        List<Alike> alikeList = alikeRepository.findAll();
        assertThat(alikeList).hasSize(databaseSizeBeforeCreate);

        // Validate the Alike in Elasticsearch
        verify(mockAlikeSearchRepository, times(0)).save(alike);
    }


    @Test
    @Transactional
    public void checkCreatedDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = alikeRepository.findAll().size();
        // set the field null
        alike.setCreatedDate(null);

        // Create the Alike, which fails.

        restAlikeMockMvc.perform(post("/api/alikes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(alike)))
            .andExpect(status().isBadRequest());

        List<Alike> alikeList = alikeRepository.findAll();
        assertThat(alikeList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllAlikes() throws Exception {
        // Initialize the database
        alikeRepository.saveAndFlush(alike);

        // Get all the alikeList
        restAlikeMockMvc.perform(get("/api/alikes?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(alike.getId().intValue())))
            .andExpect(jsonPath("$.[*].text").value(hasItem(DEFAULT_TEXT.toString())))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())));
    }
    
    @Test
    @Transactional
    public void getAlike() throws Exception {
        // Initialize the database
        alikeRepository.saveAndFlush(alike);

        // Get the alike
        restAlikeMockMvc.perform(get("/api/alikes/{id}", alike.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(alike.getId().intValue()))
            .andExpect(jsonPath("$.text").value(DEFAULT_TEXT.toString()))
            .andExpect(jsonPath("$.createdDate").value(DEFAULT_CREATED_DATE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingAlike() throws Exception {
        // Get the alike
        restAlikeMockMvc.perform(get("/api/alikes/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateAlike() throws Exception {
        // Initialize the database
        alikeService.save(alike);
        // As the test used the service layer, reset the Elasticsearch mock repository
        reset(mockAlikeSearchRepository);

        int databaseSizeBeforeUpdate = alikeRepository.findAll().size();

        // Update the alike
        Alike updatedAlike = alikeRepository.findById(alike.getId()).get();
        // Disconnect from session so that the updates on updatedAlike are not directly saved in db
        em.detach(updatedAlike);
        updatedAlike
            .text(UPDATED_TEXT)
            .createdDate(UPDATED_CREATED_DATE);

        restAlikeMockMvc.perform(put("/api/alikes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedAlike)))
            .andExpect(status().isOk());

        // Validate the Alike in the database
        List<Alike> alikeList = alikeRepository.findAll();
        assertThat(alikeList).hasSize(databaseSizeBeforeUpdate);
        Alike testAlike = alikeList.get(alikeList.size() - 1);
        assertThat(testAlike.getText()).isEqualTo(UPDATED_TEXT);
        assertThat(testAlike.getCreatedDate()).isEqualTo(UPDATED_CREATED_DATE);

        // Validate the Alike in Elasticsearch
        verify(mockAlikeSearchRepository, times(1)).save(testAlike);
    }

    @Test
    @Transactional
    public void updateNonExistingAlike() throws Exception {
        int databaseSizeBeforeUpdate = alikeRepository.findAll().size();

        // Create the Alike

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAlikeMockMvc.perform(put("/api/alikes")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(alike)))
            .andExpect(status().isBadRequest());

        // Validate the Alike in the database
        List<Alike> alikeList = alikeRepository.findAll();
        assertThat(alikeList).hasSize(databaseSizeBeforeUpdate);

        // Validate the Alike in Elasticsearch
        verify(mockAlikeSearchRepository, times(0)).save(alike);
    }

    @Test
    @Transactional
    public void deleteAlike() throws Exception {
        // Initialize the database
        alikeService.save(alike);

        int databaseSizeBeforeDelete = alikeRepository.findAll().size();

        // Delete the alike
        restAlikeMockMvc.perform(delete("/api/alikes/{id}", alike.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Alike> alikeList = alikeRepository.findAll();
        assertThat(alikeList).hasSize(databaseSizeBeforeDelete - 1);

        // Validate the Alike in Elasticsearch
        verify(mockAlikeSearchRepository, times(1)).deleteById(alike.getId());
    }

    @Test
    @Transactional
    public void searchAlike() throws Exception {
        // Initialize the database
        alikeService.save(alike);
        when(mockAlikeSearchRepository.search(queryStringQuery("id:" + alike.getId()), PageRequest.of(0, 20)))
            .thenReturn(new PageImpl<>(Collections.singletonList(alike), PageRequest.of(0, 1), 1));
        // Search the alike
        restAlikeMockMvc.perform(get("/api/_search/alikes?query=id:" + alike.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(alike.getId().intValue())))
            .andExpect(jsonPath("$.[*].text").value(hasItem(DEFAULT_TEXT)))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())));
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Alike.class);
        Alike alike1 = new Alike();
        alike1.setId(1L);
        Alike alike2 = new Alike();
        alike2.setId(alike1.getId());
        assertThat(alike1).isEqualTo(alike2);
        alike2.setId(2L);
        assertThat(alike1).isNotEqualTo(alike2);
        alike1.setId(null);
        assertThat(alike1).isNotEqualTo(alike2);
    }
}
