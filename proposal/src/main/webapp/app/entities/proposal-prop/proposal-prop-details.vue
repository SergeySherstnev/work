<template>
    <div class="row justify-content-center">
        <div class="col-8">
            <div v-if="proposal">
                <h2 class="jh-entity-heading"><span v-text="$t('proposalApp.proposal.detail.title')">ProposalProp</span> {{proposal.id}}</h2>
                <dl class="row jh-entity-details">
                    <dt>
                        <span v-text="$t('proposalApp.proposal.caption')">Caption</span>
                    </dt>
                    <dd>
                        <span>{{proposal.caption}}</span>
                    </dd>
                    <dt>
                        <span v-text="$t('proposalApp.proposal.description')">Description</span>
                    </dt>
                    <dd>
                        <span>{{proposal.description}}</span>
                    </dd>
                    <dt>
                        <span v-text="$t('proposalApp.proposal.priority')">Priority</span>
                    </dt>
                    <dd>
                        <span>{{proposal.priority}}</span>
                    </dd>
                    <dt>
                        <span v-text="$t('proposalApp.proposal.alikeSum')">Alike Sum</span>
                    </dt>
                    <dd>
                        <span>{{proposal.alikeSum}}</span>
                    </dd>
                    <dt>
                        <span v-text="$t('proposalApp.proposal.commentSum')">Comment Sum</span>
                    </dt>
                    <dd>
                        <span>{{proposal.commentSum}}</span>
                    </dd>
                    <dt>
                        <span v-text="$t('proposalApp.proposal.createdDate')">Created Date</span>
                    </dt>
                    <dd>
                        <span>{{proposal.createdDate | formatDate}}</span>
                    </dd>
                    <dt>
                        <span v-text="$t('proposalApp.proposal.updatedDate')">Updated Date</span>
                    </dt>
                    <dd>
                        <span>{{proposal.updatedDate | formatDate}}</span>
                    </dd>
                    <dt>
                        <span v-text="$t('proposalApp.proposal.status')">Status</span>
                    </dt>
                    <dd>
                        <span v-text="$t('proposalApp.Status.' + proposal.status)">{{proposal.status}}</span>
                    </dd>
                    <dt>
                        <span v-text="$t('proposalApp.proposal.author')">Author</span>
                    </dt>
                    <dd>
                        {{proposal.author ? proposal.author.login : ''}}
                    </dd>
                    <dt>
                        <span v-text="$t('proposalApp.proposal.tag')">Tag</span>
                    </dt>
                    <dd>
                        <span v-for="(tag, i) in proposal.tags" :key="tag.id">{{i > 0 ? ', ' : ''}}
                            <router-link :to="{name: 'TagPropView', params: {tagId: tag.id}}">{{tag.name}}</router-link>
                        </span>
                    </dd>
                </dl>
                <button type="submit"
                        v-on:click.prevent="previousState()"
                        class="btn btn-info">
                    <font-awesome-icon icon="arrow-left"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.back')"> Back</span>
                </button>
                <router-link v-if="proposal.id" :to="{name: 'ProposalPropEdit', params: {proposalId: proposal.id}}" tag="button" class="btn btn-primary">
                    <font-awesome-icon icon="pencil-alt"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.edit')"> Edit</span>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script lang="ts" src="./proposal-prop-details.component.ts">
</script>
