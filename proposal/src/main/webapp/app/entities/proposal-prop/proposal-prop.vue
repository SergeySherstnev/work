<template>
    <div>
        <h2 id="page-heading">
            <span v-text="$t('proposalApp.proposal.home.title')" id="proposal-prop-heading">Proposals</span>
            <router-link :to="{name: 'ProposalPropCreate'}" tag="button" id="jh-create-entity" class="btn btn-primary float-right jh-create-entity create-proposal-prop">
                <font-awesome-icon icon="plus"></font-awesome-icon>
                <span  v-text="$t('proposalApp.proposal.home.createLabel')">
                    Create new ProposalProp
                </span>
            </router-link>
        </h2>
        <b-alert :show="dismissCountDown"
            dismissible
            :variant="alertType"
            @dismissed="dismissCountDown=0"
            @dismiss-count-down="countDownChanged">
            {{alertMessage}}
        </b-alert>
        <div class="row">
            <div class="col-sm-12">
                <form name="searchForm" class="form-inline" v-on:submit.prevent="search(currentSearch)">
                    <div class="input-group w-100 mt-3">
                        <input type="text" class="form-control" name="currentSearch" id="currentSearch"
                            v-bind:placeholder="$t('proposalApp.proposal.home.search')"
                            v-model="currentSearch" />
                        <button type="button" id="launch-search" class="btn btn-primary" v-on:click="search(currentSearch)">
                            <font-awesome-icon icon="search"></font-awesome-icon>
                        </button>
                        <button type="button" id="clear-search" class="btn btn-secondary" v-on:click="clear()"
                            v-if="currentSearch">
                            <font-awesome-icon icon="trash"></font-awesome-icon>
                        </button>
                    </div>
                </form>
            </div>
        </div>
        <br/>
        <div class="alert alert-warning" v-if="!isFetching && proposals && proposals.length === 0">
            <span v-text="$t('proposalApp.proposal.home.notFound')">No proposals found</span>
        </div>
        <div class="table-responsive" v-if="proposals && proposals.length > 0">
            <table class="table table-striped">
                <thead>
                <tr>
                    <th v-on:click="changeOrder('id')"><span v-text="$t('global.field.id')">ID</span> <font-awesome-icon icon="sort"></font-awesome-icon></th>
                    <th v-on:click="changeOrder('caption')"><span v-text="$t('proposalApp.proposal.caption')">Caption</span> <font-awesome-icon icon="sort"></font-awesome-icon></th>
                    <th v-on:click="changeOrder('description')"><span v-text="$t('proposalApp.proposal.description')">Description</span> <font-awesome-icon icon="sort"></font-awesome-icon></th>
                    <th v-on:click="changeOrder('priority')"><span v-text="$t('proposalApp.proposal.priority')">Priority</span> <font-awesome-icon icon="sort"></font-awesome-icon></th>
                    <th v-on:click="changeOrder('alikeSum')"><span v-text="$t('proposalApp.proposal.alikeSum')">Alike Sum</span> <font-awesome-icon icon="sort"></font-awesome-icon></th>
                    <th v-on:click="changeOrder('commentSum')"><span v-text="$t('proposalApp.proposal.commentSum')">Comment Sum</span> <font-awesome-icon icon="sort"></font-awesome-icon></th>
                    <th v-on:click="changeOrder('createdDate')"><span v-text="$t('proposalApp.proposal.createdDate')">Created Date</span> <font-awesome-icon icon="sort"></font-awesome-icon></th>
                    <th v-on:click="changeOrder('updatedDate')"><span v-text="$t('proposalApp.proposal.updatedDate')">Updated Date</span> <font-awesome-icon icon="sort"></font-awesome-icon></th>
                    <th v-on:click="changeOrder('status')"><span v-text="$t('proposalApp.proposal.status')">Status</span> <font-awesome-icon icon="sort"></font-awesome-icon></th>
                    <th v-on:click="changeOrder('author.login')"><span v-text="$t('proposalApp.proposal.author')">Author</span> <font-awesome-icon icon="sort"></font-awesome-icon></th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="proposal of orderBy(proposals, propOrder, reverse === true ? 1 : -1)"
                    :key="proposal.id">
                    <td>
                        <router-link :to="{name: 'ProposalPropView', params: {proposalId: proposal.id}}">{{proposal.id}}</router-link>
                    </td>
                    <td>{{proposal.caption}}</td>
                    <td>{{proposal.description}}</td>
                    <td>{{proposal.priority}}</td>
                    <td>{{proposal.alikeSum}}</td>
                    <td>{{proposal.commentSum}}</td>
                    <td>{{proposal.createdDate | formatDate}}</td>
                    <td>{{proposal.updatedDate | formatDate}}</td>
                    <td v-text="$t('proposalApp.Status.' + proposal.status)">{{proposal.status}}</td>
                    <td>
                        {{proposal.author ? proposal.author.login : ''}}
                    </td>
                    <td class="text-right">
                        <div class="btn-group flex-btn-group-container">
                            <router-link :to="{name: 'ProposalPropView', params: {proposalId: proposal.id}}" tag="button" class="btn btn-info btn-sm details">
                                <font-awesome-icon icon="eye"></font-awesome-icon>
                                <span class="d-none d-md-inline" v-text="$t('entity.action.view')">View</span>
                            </router-link>
                            <router-link :to="{name: 'ProposalPropEdit', params: {proposalId: proposal.id}}"  tag="button" class="btn btn-primary btn-sm edit">
                                <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                                <span class="d-none d-md-inline" v-text="$t('entity.action.edit')">Edit</span>
                            </router-link>
                            <b-button v-on:click="prepareRemove(proposal)"
                                   variant="danger"
                                   class="btn btn-sm"
                                   v-b-modal.removeEntity>
                                <font-awesome-icon icon="times"></font-awesome-icon>
                                <span class="d-none d-md-inline" v-text="$t('entity.action.delete')">Delete</span>
                            </b-button>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
        <b-modal ref="removeEntity" id="removeEntity" >
            <span slot="modal-title"><span id="proposalApp.proposal.delete.question" v-text="$t('entity.delete.title')">Confirm delete operation</span></span>
            <div class="modal-body">
                <p id="jhi-delete-proposal-heading" v-bind:title="$t('proposalApp.proposal.delete.question')">Are you sure you want to delete this Proposal?</p>
            </div>
            <div slot="modal-footer">
                <button type="button" class="btn btn-secondary" v-text="$t('entity.action.cancel')" v-on:click="closeDialog()">Cancel</button>
                <button type="button" class="btn btn-primary" id="jhi-confirm-delete-proposal" v-text="$t('entity.action.delete')" v-on:click="removeProposalProp()">Delete</button>
            </div>
        </b-modal>
        <div v-if="proposals && proposals.length">
            <div class="row justify-content-center">
                <jhi-item-count :page="page" :total="queryCount" :itemsPerPage="itemsPerPage"></jhi-item-count>
            </div>
            <div class="row justify-content-center">
                <b-pagination size="md" :total-rows="totalItems" v-model="page" :per-page="itemsPerPage" :change="loadPage(page)"></b-pagination>
            </div>
        </div>
    </div>
</template>

<script lang="ts" src="./proposal-prop.component.ts">
</script>
