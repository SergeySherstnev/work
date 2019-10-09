<template>
    <div class="row justify-content-center">
        <div class="col-8">
            <div v-if="history">
                <h2 class="jh-entity-heading"><span v-text="$t('proposalApp.history.detail.title')">HistoryProp</span> {{history.id}}</h2>
                <dl class="row jh-entity-details">
                    <dt>
                        <span v-text="$t('proposalApp.history.createdDate')">Created Date</span>
                    </dt>
                    <dd>
                        <span>{{history.createdDate | formatDate}}</span>
                    </dd>
                    <dt>
                        <span v-text="$t('proposalApp.history.status')">Status</span>
                    </dt>
                    <dd>
                        <span v-text="$t('proposalApp.Status.' + history.status)">{{history.status}}</span>
                    </dd>
                    <dt>
                        <span v-text="$t('proposalApp.history.comment')">Comment</span>
                    </dt>
                    <dd>
                        <span>{{history.comment}}</span>
                    </dd>
                    <dt>
                        <span v-text="$t('proposalApp.history.executive')">Executive</span>
                    </dt>
                    <dd>
                        {{history.executive ? history.executive.login : ''}}
                    </dd>
                    <dt>
                        <span v-text="$t('proposalApp.history.assignee')">Assignee</span>
                    </dt>
                    <dd>
                        {{history.assignee ? history.assignee.login : ''}}
                    </dd>
                    <dt>
                        <span v-text="$t('proposalApp.history.proposal')">Proposal</span>
                    </dt>
                    <dd>
                        <div v-if="history.proposal">
                            <router-link :to="{name: 'ProposalPropView', params: {proposalId: history.proposal.id}}">{{history.proposal.caption}}</router-link>
                        </div>
                    </dd>
                </dl>
                <button type="submit"
                        v-on:click.prevent="previousState()"
                        class="btn btn-info">
                    <font-awesome-icon icon="arrow-left"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.back')"> Back</span>
                </button>
                <router-link v-if="history.id" :to="{name: 'HistoryPropEdit', params: {historyId: history.id}}" tag="button" class="btn btn-primary">
                    <font-awesome-icon icon="pencil-alt"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.edit')"> Edit</span>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script lang="ts" src="./history-prop-details.component.ts">
</script>
