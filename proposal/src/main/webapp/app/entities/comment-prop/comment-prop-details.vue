<template>
    <div class="row justify-content-center">
        <div class="col-8">
            <div v-if="comment">
                <h2 class="jh-entity-heading"><span v-text="$t('proposalApp.comment.detail.title')">CommentProp</span> {{comment.id}}</h2>
                <dl class="row jh-entity-details">
                    <dt>
                        <span v-text="$t('proposalApp.comment.text')">Text</span>
                    </dt>
                    <dd>
                        <span>{{comment.text}}</span>
                    </dd>
                    <dt>
                        <span v-text="$t('proposalApp.comment.createdDate')">Created Date</span>
                    </dt>
                    <dd>
                        <span>{{comment.createdDate | formatDate}}</span>
                    </dd>
                    <dt>
                        <span v-text="$t('proposalApp.comment.author')">Author</span>
                    </dt>
                    <dd>
                        {{comment.author ? comment.author.login : ''}}
                    </dd>
                    <dt>
                        <span v-text="$t('proposalApp.comment.proposal')">Proposal</span>
                    </dt>
                    <dd>
                        <div v-if="comment.proposal">
                            <router-link :to="{name: 'ProposalPropView', params: {proposalId: comment.proposal.id}}">{{comment.proposal.caption}}</router-link>
                        </div>
                    </dd>
                </dl>
                <button type="submit"
                        v-on:click.prevent="previousState()"
                        class="btn btn-info">
                    <font-awesome-icon icon="arrow-left"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.back')"> Back</span>
                </button>
                <router-link v-if="comment.id" :to="{name: 'CommentPropEdit', params: {commentId: comment.id}}" tag="button" class="btn btn-primary">
                    <font-awesome-icon icon="pencil-alt"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.edit')"> Edit</span>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script lang="ts" src="./comment-prop-details.component.ts">
</script>
