<template>
    <div>
        <h2 id="page-heading">
            <span v-text="$t('proposalApp.alike.home.title')" id="alike-prop-heading">Alikes</span>
            <router-link :to="{name: 'AlikePropCreate'}" tag="button" id="jh-create-entity" class="btn btn-primary float-right jh-create-entity create-alike-prop">
                <font-awesome-icon icon="plus"></font-awesome-icon>
                <span  v-text="$t('proposalApp.alike.home.createLabel')">
                    Create new AlikeProp
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
                            v-bind:placeholder="$t('proposalApp.alike.home.search')"
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
        <div class="alert alert-warning" v-if="!isFetching && alikes && alikes.length === 0">
            <span v-text="$t('proposalApp.alike.home.notFound')">No alikes found</span>
        </div>
        <div class="table-responsive" v-if="alikes && alikes.length > 0">
            <table class="table table-striped">
                <thead>
                <tr>
                    <th v-on:click="changeOrder('id')"><span v-text="$t('global.field.id')">ID</span> <font-awesome-icon icon="sort"></font-awesome-icon></th>
                    <th v-on:click="changeOrder('text')"><span v-text="$t('proposalApp.alike.text')">Text</span> <font-awesome-icon icon="sort"></font-awesome-icon></th>
                    <th v-on:click="changeOrder('createdDate')"><span v-text="$t('proposalApp.alike.createdDate')">Created Date</span> <font-awesome-icon icon="sort"></font-awesome-icon></th>
                    <th v-on:click="changeOrder('author.login')"><span v-text="$t('proposalApp.alike.author')">Author</span> <font-awesome-icon icon="sort"></font-awesome-icon></th>
                    <th v-on:click="changeOrder('proposal.caption')"><span v-text="$t('proposalApp.alike.proposal')">Proposal</span> <font-awesome-icon icon="sort"></font-awesome-icon></th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="alike of orderBy(alikes, propOrder, reverse === true ? 1 : -1)"
                    :key="alike.id">
                    <td>
                        <router-link :to="{name: 'AlikePropView', params: {alikeId: alike.id}}">{{alike.id}}</router-link>
                    </td>
                    <td>{{alike.text}}</td>
                    <td>{{alike.createdDate | formatDate}}</td>
                    <td>
                        {{alike.author ? alike.author.login : ''}}
                    </td>
                    <td>
                        <div v-if="alike.proposal">
                            <router-link :to="{name: 'ProposalPropView', params: {proposalId: alike.proposal.id}}">{{alike.proposal.caption}}</router-link>
                        </div>
                    </td>
                    <td class="text-right">
                        <div class="btn-group flex-btn-group-container">
                            <router-link :to="{name: 'AlikePropView', params: {alikeId: alike.id}}" tag="button" class="btn btn-info btn-sm details">
                                <font-awesome-icon icon="eye"></font-awesome-icon>
                                <span class="d-none d-md-inline" v-text="$t('entity.action.view')">View</span>
                            </router-link>
                            <router-link :to="{name: 'AlikePropEdit', params: {alikeId: alike.id}}"  tag="button" class="btn btn-primary btn-sm edit">
                                <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                                <span class="d-none d-md-inline" v-text="$t('entity.action.edit')">Edit</span>
                            </router-link>
                            <b-button v-on:click="prepareRemove(alike)"
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
            <span slot="modal-title"><span id="proposalApp.alike.delete.question" v-text="$t('entity.delete.title')">Confirm delete operation</span></span>
            <div class="modal-body">
                <p id="jhi-delete-alike-heading" v-bind:title="$t('proposalApp.alike.delete.question')">Are you sure you want to delete this Alike?</p>
            </div>
            <div slot="modal-footer">
                <button type="button" class="btn btn-secondary" v-text="$t('entity.action.cancel')" v-on:click="closeDialog()">Cancel</button>
                <button type="button" class="btn btn-primary" id="jhi-confirm-delete-alike" v-text="$t('entity.action.delete')" v-on:click="removeAlikeProp()">Delete</button>
            </div>
        </b-modal>
        <div v-if="alikes && alikes.length">
            <div class="row justify-content-center">
                <jhi-item-count :page="page" :total="queryCount" :itemsPerPage="itemsPerPage"></jhi-item-count>
            </div>
            <div class="row justify-content-center">
                <b-pagination size="md" :total-rows="totalItems" v-model="page" :per-page="itemsPerPage" :change="loadPage(page)"></b-pagination>
            </div>
        </div>
    </div>
</template>

<script lang="ts" src="./alike-prop.component.ts">
</script>
