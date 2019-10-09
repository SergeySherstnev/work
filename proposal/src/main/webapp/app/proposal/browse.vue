<template>
    <div>
        <h2 id="page-heading">
            <span v-text="$t('proposalApp.proposal.home.title')" id="proposal-prop-heading">Proposals</span>
            <router-link :to="{name: 'NewProposal'}"
                         tag="button"
                         id="jh-create-entity"
                         class="btn btn-primary float-right jh-create-entity create-proposal-prop"
                         v-if="hasAnyAuthority('ROLE_USER')">
                <font-awesome-icon icon="plus"></font-awesome-icon>
                <span  v-text="$t('proposalApp.proposal.home.createLabel')">
                    Add new Proposal
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

                        <span  class="ml-1"/>

                        <button type="button" id="order-likes"
                                class="btn btn-danger" v-on:click="changeOrder('alikeSum')"
                                data-toggle="tooltip" title="Order by number of likes">
                            <font-awesome-icon icon="thumbs-up"/>
                            <font-awesome-icon icon="angle-up" v-if="(propOrder=='alikeSum') && reverse"/>
                            <font-awesome-icon icon="angle-down" v-if="(propOrder=='alikeSum') && !reverse"/>
                        </button>

                        <button type="button" id="order-comments"
                                class="btn btn-success" v-on:click="changeOrder('commentSum')"
                                data-toggle="tooltip" title="Order by number of comments">
                            <font-awesome-icon icon="comment"/>
                            <font-awesome-icon icon="angle-up" v-if="(propOrder=='commentSum') && reverse"/>
                            <font-awesome-icon icon="angle-down" v-if="(propOrder=='commentSum') && !reverse"/>
                        </button>

                        <button type="button" id="order-date"
                                class="btn btn-primary" v-on:click="changeOrder('createdDate')"
                                data-toggle="tooltip" title="Order by creation date">
                            <font-awesome-icon icon="clock"/>
                            <font-awesome-icon icon="angle-up" v-if="(propOrder=='createdDate') && reverse"/>
                            <font-awesome-icon icon="angle-down" v-if="(propOrder=='createdDate') && !reverse"/>
                        </button>

                    </div>
                </form>
            </div>
        </div>
        <br/>
        <div class="alert alert-warning" v-if="!isFetching && proposals && proposals.length === 0">
            <span v-text="$t('proposalApp.proposal.home.notFound')">No proposals found</span>
        </div>


        <div v-if="proposals && proposals.length > 0">
            <b-card
                v-for="proposal of orderBy(proposals, propOrder, reverse === true ? 1 : -1)"
                :key="proposal.id"
                header-tag="header"
                footer-tag="footer"
                border-variant="secondary"
                header-border-variant="secondary"
                tag="article"
                class="mb-5">

                <div slot="header" class="mb-0">
                    <router-link :to="{name: 'ViewProposal', params: {proposalId: proposal.id}}">
                        <h3>
                            <span>{{proposal.caption}}</span>
                            <span class="float-right">{{proposal.createdDate | formatDate}}</span>
                        </h3>
                    </router-link>

                    <b-badge v-for="tag of proposal.tags" :key="tag.id"
                             pill variant="light"
                             v-on:click="search('tag=' + tag.name)">
                        {{tag.name}}
                    </b-badge>

                    <b-button variant="light" class="float-right"
                              v-on:click="search('status=' + proposal.status)"
                              v-text="$t('proposalApp.Status.' + proposal.status)">
                        {{proposal.status}}
                    </b-button>
                </div>

                <div class="card-text" v-html="proposal.description"></div>

                <div slot="footer" class="mb-0">
                    <b-button variant="light" v-on:click="search('author=' + proposal.author.lastName)">
                        {{(proposal && proposal.author) ? proposal.author.firstName + ' ' + proposal.author.lastName: 'undefined'}}
                    </b-button>
                    <b-button
                        :variant="proposal.liked? 'danger': 'outline-danger'"
                        v-on:click="toggleLike(proposal)"
                        :disabled="likeSubmitting">
                        <font-awesome-icon icon="thumbs-up"/>
                        <b-badge variant="danger">{{proposal.alikeSum}}</b-badge>
                    </b-button>
                    <b-button variant="outline-success" :to="{name: 'ViewProposal', params: {proposalId: proposal.id}}">
                        <font-awesome-icon icon="comment"/>
                        <b-badge variant="success">{{proposal.commentSum}}</b-badge>
                    </b-button><br/>

                </div>
            </b-card>
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
    </div>
</template>

<script lang="ts" src="./browse.component.ts"/>
