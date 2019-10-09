<template>
    <div class="row justify-content-center">
        <div class="col-8">
            <div v-if="alike">
                <h2 class="jh-entity-heading"><span v-text="$t('proposalApp.alike.detail.title')">AlikeProp</span> {{alike.id}}</h2>
                <dl class="row jh-entity-details">
                    <dt>
                        <span v-text="$t('proposalApp.alike.text')">Text</span>
                    </dt>
                    <dd>
                        <span>{{alike.text}}</span>
                    </dd>
                    <dt>
                        <span v-text="$t('proposalApp.alike.createdDate')">Created Date</span>
                    </dt>
                    <dd>
                        <span>{{alike.createdDate | formatDate}}</span>
                    </dd>
                    <dt>
                        <span v-text="$t('proposalApp.alike.author')">Author</span>
                    </dt>
                    <dd>
                        {{alike.author ? alike.author.login : ''}}
                    </dd>
                    <dt>
                        <span v-text="$t('proposalApp.alike.proposal')">Proposal</span>
                    </dt>
                    <dd>
                        <div v-if="alike.proposal">
                            <router-link :to="{name: 'ProposalPropView', params: {proposalId: alike.proposal.id}}">{{alike.proposal.caption}}</router-link>
                        </div>
                    </dd>
                </dl>
                <button type="submit"
                        v-on:click.prevent="previousState()"
                        class="btn btn-info">
                    <font-awesome-icon icon="arrow-left"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.back')"> Back</span>
                </button>
                <router-link v-if="alike.id" :to="{name: 'AlikePropEdit', params: {alikeId: alike.id}}" tag="button" class="btn btn-primary">
                    <font-awesome-icon icon="pencil-alt"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.edit')"> Edit</span>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script lang="ts" src="./alike-prop-details.component.ts">
</script>
