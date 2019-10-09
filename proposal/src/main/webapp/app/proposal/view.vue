<template>
    <div class="row justify-content-center">
        <div class="col-7">
            <div v-if="proposal">
                <h2 class="jh-entity-heading">{{proposal.caption}}</h2>
                <dl class="row jh-entity-details">
                    <dt>
                        <span v-text="$t('proposalApp.proposal.tag')">Tags</span>
                    </dt>
                    <dd>
                        <b-badge v-for="tag of proposal.tags" :key="tag.id" pill variant="secondary">
                            {{tag.name}}
                        </b-badge>
                    </dd>
                    <dt>
                        <span v-text="$t('proposalApp.proposal.author')">Author</span>
                    </dt>
                    <dd>
                        {{ !proposal.author ? undefined: proposal.author.firstName + ' ' + proposal.author.lastName}}
                    </dd>
                    <dt>
                        <span v-text="$t('proposalApp.proposal.status')">Status</span>
                    </dt>
                    <dd>
                        <span v-text="$t('proposalApp.Status.' + proposal.status)">{{proposal.status}}</span>
                    </dd>
                    <dt>
                        <span v-text="$t('proposalApp.proposal.priority')">Priority</span>
                    </dt>
                    <dd>
                        <span>{{proposal.priority}}</span>
                    </dd>
                    <dt>
                        <span v-text="$t('proposalApp.proposal.alikeSum')">Likes</span>
                    </dt>
                    <dd>
                        <b-button
                            :variant="proposal.liked? 'danger': 'outline-danger'"
                            v-on:click="toggleLike()"
                            :disabled="likeSubmitting">
                            <font-awesome-icon icon="thumbs-up"/>
                            <b-badge variant="danger">{{proposal.alikeSum}}</b-badge>
                        </b-button>
                    </dd>

                </dl>


                <p v-html="proposal.description"></p>

                <button type="submit"
                        v-on:click.prevent="previousState()"
                        class="btn btn-info">
                    <font-awesome-icon icon="arrow-left"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.back')"> Back</span>
                </button>
                <router-link
                    v-if="proposal.id && (proposal.author.id == userId)"
                    :to="{name: 'EditProposal', params: {proposalId: proposal.id}}"
                    tag="button"
                    class="btn btn-primary">
                    <font-awesome-icon icon="pencil-alt"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.edit')"> Edit</span>
                </router-link>
                <b-button v-on:click="prepareRemove(proposal)"
                          v-if="proposal.id && (proposal.author.id == userId)"
                          variant="danger"
                          class="btn btn-primary"
                          v-b-modal.removeEntity>
                    <font-awesome-icon icon="times"></font-awesome-icon>
                    <span class="d-none d-md-inline" v-text="$t('entity.action.delete')">Delete</span>
                </b-button>

                <br/>
                <hr/>

                <h3 class="jh-entity-heading">Comments({{proposal.commentSum}})</h3>
                <div v-if="comments && comments.length > 0">
                    <b-card
                        v-for="comment of orderBy(comments, 'createdDate', 1)"
                        :key="comment.id"
                        header-tag="header"
                        tag="article"
                        class="mb-2">

                        <div slot="header" class="mb-0">
                            <span>{{ !comment.author ? undefined: comment.author.firstName + ' ' + comment.author.lastName}}</span>
                            <span class="float-right">{{comment.createdDate | formatDate}}</span>
                        </div>

                        <div class="card-text">
                            {{comment.text}}
                        </div>
                    </b-card>
                </div>
                <div v-else>
                    There is no comments yet.
                </div>

                <!-- Create new comment -->
                <div  class="row" style="position: sticky; bottom: 0; z-index: 200; ">
                    <div class="col-sm-12">
                        <form name="addCommentForm" class="form-inline" v-on:submit.prevent="addComment(currentComment)">
                            <div class="input-group w-100 mt-3">
                                <input type="text" class="form-control" name="currentComment" id="currentComment"
                                       placeholder="Add comment"
                                       v-model="currentComment" />
                                <button type="button" id="add-comment" class="btn btn-success"
                                        v-on:click="addComment(currentComment)"
                                        :disabled="commentSubmitting">
                                    <font-awesome-icon icon="comment"></font-awesome-icon>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </div>


        <div id="history-panel" class="col-3 bg-secondary text-white">
            <h3>Actions</h3>

            <div v-if="hasAnyAuthority('ROLE_MANAGER')">
                <h4>Add action</h4>

                <form name="addHistoryForm" v-on:submit.prevent="addHistory()">
                    <dl class="jh-entity-details">
                        <dt>
                            <label class="form-control-label" v-text="$t('proposalApp.history.status')" for="history-status">Status</label>
                        </dt>
                        <dd>
                            <select class="form-control" name="status"
                                v-model="history.status" id="history-status"  required>
                                <option value="NEW" v-bind:label="$t('proposalApp.Status.NEW')">NEW</option>
                                <option value="ACCEPTED" v-bind:label="$t('proposalApp.Status.ACCEPTED')">ACCEPTED</option>
                                <option value="REJECTED" v-bind:label="$t('proposalApp.Status.REJECTED')">REJECTED</option>
                                <option value="POSTPONED" v-bind:label="$t('proposalApp.Status.POSTPONED')">POSTPONED</option>
                                <option value="ASSIGNED" v-bind:label="$t('proposalApp.Status.ASSIGNED')">ASSIGNED</option>
                                <option value="RESOLVED" v-bind:label="$t('proposalApp.Status.RESOLVED')">RESOLVED</option>
                            </select>
                        </dd>

                        <dt>
                            <label class="form-control-label" v-bind:value="$t('proposalApp.history.assignee')" for="history-assignee">Assignee</label>
                        </dt>
                        <dd>
                            <select class="form-control" id="history-assignee" name="assignee" v-model="history.assignee">
                                <option v-bind:value="null"></option>
                                <option v-bind:value="history.assignee && userOption.id === history.assignee.id ? history.assignee : userOption"
                                        v-for="userOption in managers" :key="userOption.id">
                                    {{userOption.login}}
                                </option>
                            </select>
                        </dd>

                        <dt>
                            <label class="form-control-label" v-text="$t('proposalApp.history.comment')" for="history-comment">Comment</label>
                        </dt>
                        <dd>
                            <input type="text" class="form-control" name="comment" id="history-comment"
                               v-model="history.comment"  required/>
                        </dd>
                    </dl>
                    <button type="submit" id="add-history" :disabled="historySubmitting" class="btn btn-primary">
                        <font-awesome-icon icon="save"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.save')">Add</span>
                    </button>
                </form>

                <br/>
                <h4>Actions history</h4>

            </div>

            <div v-if="histories && histories.length > 0">
                <b-card
                    v-for="history of orderBy(histories, 'createdDate', -1)"
                    :key="history.id"
                    bg-variant="light"
                    text-variant="dark"
                    header-tag="header"
                    tag="article"
                    class="mb-2">

                    <div slot="header" class="mb-0">
                        <span v-text="$t('proposalApp.Status.' + history.status)">{{proposal.status}}</span>
                        <span class="float-right">{{history.createdDate | formatDate}}</span>
                    </div>

                    <div class="card-text">
                        <div>{{ !history.executive ? undefined: history.executive.firstName + ' ' + history.executive.lastName}}</div>
                        <div>{{history.comment}}</div>
                    </div>
                </b-card>
            </div>
            <div v-else>
                There is no actions yet.
            </div>
        </div>


        <b-modal ref="removeEntity" id="removeEntity" >
            <span slot="modal-title"><span id="proposalApp.proposal.delete.question" v-text="$t('entity.delete.title')">Confirm delete operation</span></span>
            <div class="modal-body">
                <p id="jhi-delete-proposal-heading" v-bind:title="$t('proposalApp.proposal.delete.question')">Are you sure you want to delete this Proposal?</p>
            </div>
            <div slot="modal-footer">
                <button type="button" class="btn btn-secondary" v-text="$t('entity.action.cancel')" v-on:click="closeDialog()">Cancel</button>
                <button type="button" class="btn btn-primary" id="jhi-confirm-delete-proposal" v-text="$t('entity.action.delete')" v-on:click="deleteProposal()">Delete</button>
            </div>
        </b-modal>


    </div>
</template>

<script lang="ts" src="./view.component.ts"/>
