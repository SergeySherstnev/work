package com.tsystems.proposal.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.time.Instant;

/**
 * A Alike.
 */
@Entity
@Table(name = "alike")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "alike")
public class Alike implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private Long id;

    @Size(max = 10)
    @Column(name = "text", length = 10)
    private String text;

    @NotNull
    @Column(name = "created_date", nullable = false)
    private Instant createdDate = Instant.now();

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("alikes")
    private User author;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("alikes")
    private Proposal proposal;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public Alike text(String text) {
        this.text = text;
        return this;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Instant getCreatedDate() {
        return createdDate;
    }

    public Alike createdDate(Instant createdDate) {
        this.createdDate = createdDate;
        return this;
    }

    public void setCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
    }

    public User getAuthor() {
        return author;
    }

    public Alike author(User user) {
        this.author = user;
        return this;
    }

    public void setAuthor(User user) {
        this.author = user;
    }

    public Proposal getProposal() {
        return proposal;
    }

    public Alike proposal(Proposal proposal) {
        this.proposal = proposal;
        return this;
    }

    public void setProposal(Proposal proposal) {
        this.proposal = proposal;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Alike)) {
            return false;
        }
        return id != null && id.equals(((Alike) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Alike{" +
            "id=" + getId() +
            ", text='" + getText() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            "}";
    }
}
