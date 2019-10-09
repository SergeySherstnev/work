package com.tsystems.proposal.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.time.Instant;

import com.tsystems.proposal.domain.enumeration.Status;

/**
 * A History.
 */
@Entity
@Table(name = "history")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "history")
public class History implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private Long id;

    @NotNull
    @Column(name = "created_date", nullable = false)
    private Instant createdDate = Instant.now();

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;

    @NotNull
    @Size(max = 10000)
    @Column(name = "comment", length = 10000, nullable = false)
    private String comment;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("histories")
    private User executive;

    @ManyToOne
    @JsonIgnoreProperties("histories")
    private User assignee;

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties(value={ "histories", "alikes", "comments"})
    private Proposal proposal;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getCreatedDate() {
        return createdDate;
    }

    public History createdDate(Instant createdDate) {
        this.createdDate = createdDate;
        return this;
    }

    public void setCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
    }

    public Status getStatus() {
        return status;
    }

    public History status(Status status) {
        this.status = status;
        return this;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getComment() {
        return comment;
    }

    public History comment(String comment) {
        this.comment = comment;
        return this;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public User getExecutive() {
        return executive;
    }

    public History executive(User user) {
        this.executive = user;
        return this;
    }

    public void setExecutive(User user) {
        this.executive = user;
    }

    public User getAssignee() {
        return assignee;
    }

    public History assignee(User user) {
        this.assignee = user;
        return this;
    }

    public void setAssignee(User user) {
        this.assignee = user;
    }

    public Proposal getProposal() {
        return proposal;
    }

    public History proposal(Proposal proposal) {
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
        if (!(o instanceof History)) {
            return false;
        }
        return id != null && id.equals(((History) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "History{" +
            "id=" + getId() +
            ", createdDate='" + getCreatedDate() + "'" +
            ", status='" + getStatus() + "'" +
            ", comment='" + getComment() + "'" +
            "}";
    }
}
