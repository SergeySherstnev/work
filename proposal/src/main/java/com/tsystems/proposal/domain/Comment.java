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
 * A Comment.
 */
@Entity
@Table(name = "comment")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "comment")
public class Comment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private Long id;

    @NotNull
    @Size(max = 10000)
    @Column(name = "text", length = 10000, nullable = false)
    private String text;

    @NotNull
    @Column(name = "created_date", nullable = false)
    private Instant createdDate = Instant.now();

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("comments")
    private User author;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("comments")
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

    public Comment text(String text) {
        this.text = text;
        return this;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Instant getCreatedDate() {
        return createdDate;
    }

    public Comment createdDate(Instant createdDate) {
        this.createdDate = createdDate;
        return this;
    }

    public void setCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
    }

    public User getAuthor() {
        return author;
    }

    public Comment author(User user) {
        this.author = user;
        return this;
    }

    public void setAuthor(User user) {
        this.author = user;
    }

    public Proposal getProposal() {
        return proposal;
    }

    public Comment proposal(Proposal proposal) {
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
        if (!(o instanceof Comment)) {
            return false;
        }
        return id != null && id.equals(((Comment) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Comment{" +
            "id=" + getId() +
            ", text='" + getText() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            "}";
    }
}
