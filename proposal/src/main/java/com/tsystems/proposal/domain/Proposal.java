package com.tsystems.proposal.domain;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;

import org.springframework.data.elasticsearch.annotations.FieldType;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

import com.tsystems.proposal.domain.enumeration.Status;

/**
 * A Proposal.
 */
@Entity
@Table(name = "proposal")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@org.springframework.data.elasticsearch.annotations.Document(indexName = "proposal")
public class Proposal implements Serializable {

    private static final long serialVersionUID = 1L;

	/**
     * Is this Proposal was liked by current user ?
     */
    @Transient // Don't save to DB
    @JsonSerialize // But serialize to JSON
    private boolean liked;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @org.springframework.data.elasticsearch.annotations.Field(type = FieldType.Keyword)
    private Long id;

    @NotNull
    @Column(name = "caption", nullable = false)
    private String caption;

    @NotNull
    @Size(max = 10000)
    @Column(name = "description", length = 10000, nullable = false)
    private String description;

    @Min(value = 1)
    @Max(value = 3)
    @Column(name = "priority")
    private Integer priority;

    @Column(name = "alike_sum")
    private Long alikeSum;

    @Column(name = "comment_sum")
    private Long commentSum;

    @NotNull
    @Column(name = "created_date", nullable = false)
    private Instant createdDate;

    @NotNull
    @Column(name = "updated_date", nullable = false)
    private Instant updatedDate;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;

    @OneToMany(mappedBy = "proposal", cascade = CascadeType.REMOVE )
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Alike> alikes = new HashSet<>();

    @OneToMany(mappedBy = "proposal", cascade = {CascadeType.REMOVE, CascadeType.PERSIST})
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<History> histories = new HashSet<>();

    @OneToMany(mappedBy = "proposal", cascade = CascadeType.REMOVE)
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    private Set<Comment> comments = new HashSet<>();

    @ManyToOne(optional = false)
    @NotNull
    @JsonIgnoreProperties("proposals")
    private User author;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @JoinTable(name = "proposal_tag",
               joinColumns = @JoinColumn(name = "proposal_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "tag_id", referencedColumnName = "id"))
    private Set<Tag> tags = new HashSet<>();

	public boolean isLiked() {
        return this.liked;
    }

    public void setLiked(boolean liked) {
        this.liked = liked;
    }
    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCaption() {
        return caption;
    }

    public Proposal caption(String caption) {
        this.caption = caption;
        return this;
    }

    public void setCaption(String caption) {
        this.caption = caption;
    }

    public String getDescription() {
        return description;
    }

    public Proposal description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getPriority() {
        return priority;
    }

    public Proposal priority(Integer priority) {
        this.priority = priority;
        return this;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    public Long getAlikeSum() {
        return alikeSum;
    }

    public Proposal alikeSum(Long alikeSum) {
        this.alikeSum = alikeSum;
        return this;
    }

    public void setAlikeSum(Long alikeSum) {
        this.alikeSum = alikeSum;
    }

    public Long getCommentSum() {
        return commentSum;
    }

    public Proposal commentSum(Long commentSum) {
        this.commentSum = commentSum;
        return this;
    }

    public void setCommentSum(Long commentSum) {
        this.commentSum = commentSum;
    }

    public Instant getCreatedDate() {
        return createdDate;
    }

    public Proposal createdDate(Instant createdDate) {
        this.createdDate = createdDate;
        return this;
    }

    public void setCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
    }

    public Instant getUpdatedDate() {
        return updatedDate;
    }

    public Proposal updatedDate(Instant updatedDate) {
        this.updatedDate = updatedDate;
        return this;
    }

    public void setUpdatedDate(Instant updatedDate) {
        this.updatedDate = updatedDate;
    }

    public Status getStatus() {
        return status;
    }

    public Proposal status(Status status) {
        this.status = status;
        return this;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Set<Alike> getAlikes() {
        return alikes;
    }

    public Proposal alikes(Set<Alike> alikes) {
        this.alikes = alikes;
        return this;
    }

    public Proposal addAlike(Alike alike) {
        this.alikes.add(alike);
        alike.setProposal(this);
        return this;
    }

    public Proposal removeAlike(Alike alike) {
        this.alikes.remove(alike);
        alike.setProposal(null);
        return this;
    }

    public void setAlikes(Set<Alike> alikes) {
        this.alikes = alikes;
    }

    public Set<History> getHistories() {
        return histories;
    }

    public Proposal histories(Set<History> histories) {
        this.histories = histories;
        return this;
    }

    public Proposal addHistory(History history) {
        this.histories.add(history);
        history.setProposal(this);
        return this;
    }

    public Proposal removeHistory(History history) {
        this.histories.remove(history);
        history.setProposal(null);
        return this;
    }

    public void setHistories(Set<History> histories) {
        this.histories = histories;
    }

    public Set<Comment> getComments() {
        return comments;
    }

    public Proposal comments(Set<Comment> comments) {
        this.comments = comments;
        return this;
    }

    public Proposal addComment(Comment comment) {
        this.comments.add(comment);
        comment.setProposal(this);
        return this;
    }

    public Proposal removeComment(Comment comment) {
        this.comments.remove(comment);
        comment.setProposal(null);
        return this;
    }

    public void setComments(Set<Comment> comments) {
        this.comments = comments;
    }

    public User getAuthor() {
        return author;
    }

    public Proposal author(User user) {
        this.author = user;
        return this;
    }

    public void setAuthor(User user) {
        this.author = user;
    }

    public Set<Tag> getTags() {
        return tags;
    }

    public Proposal tags(Set<Tag> tags) {
        this.tags = tags;
        return this;
    }

    public Proposal addTag(Tag tag) {
        this.tags.add(tag);
        tag.getProposals().add(this);
        return this;
    }

    public Proposal removeTag(Tag tag) {
        this.tags.remove(tag);
        tag.getProposals().remove(this);
        return this;
    }

    public void setTags(Set<Tag> tags) {
        this.tags = tags;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Proposal)) {
            return false;
        }
        return id != null && id.equals(((Proposal) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Proposal{" +
            "id=" + getId() +
            ", caption='" + getCaption() + "'" +
            ", description='" + getDescription() + "'" +
            ", priority=" + getPriority() +
            ", alikeSum=" + getAlikeSum() +
            ", commentSum=" + getCommentSum() +
            ", createdDate='" + getCreatedDate() + "'" +
            ", updatedDate='" + getUpdatedDate() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
