<template>
    <div class="row justify-content-center">
        <div class="col-8">
            <form name="editForm" role="form" novalidate v-on:submit.prevent="save()" >
                <h2 id="proposalApp.proposal.home.createOrEditLabel" v-text="$t('proposalApp.proposal.home.createOrEditLabel')">Create or edit a ProposalProp</h2>
                <div>
                    <div class="form-group" v-if="proposal.id">
                        <label for="id" v-text="$t('global.field.id')">ID</label>
                        <input type="text" class="form-control" id="id" name="id"
                               v-model="proposal.id" readonly />
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" v-text="$t('proposalApp.proposal.caption')" for="proposal-prop-caption">Caption</label>
                        <input type="text" class="form-control" name="caption" id="proposal-prop-caption"
                            :class="{'valid': !$v.proposal.caption.$invalid, 'invalid': $v.proposal.caption.$invalid }" v-model="$v.proposal.caption.$model"  required/>
                        <div v-if="$v.proposal.caption.$anyDirty && $v.proposal.caption.$invalid">
                            <small class="form-text text-danger" v-if="!$v.proposal.caption.required" v-text="$t('entity.validation.required')">
                                This field is required.
                            </small>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" v-text="$t('proposalApp.proposal.description')" for="proposal-prop-description">Description</label>
                        <input type="text" class="form-control" name="description" id="proposal-prop-description"
                            :class="{'valid': !$v.proposal.description.$invalid, 'invalid': $v.proposal.description.$invalid }" v-model="$v.proposal.description.$model"  required/>
                        <div v-if="$v.proposal.description.$anyDirty && $v.proposal.description.$invalid">
                            <small class="form-text text-danger" v-if="!$v.proposal.description.required" v-text="$t('entity.validation.required')">
                                This field is required.
                            </small>
                            <small class="form-text text-danger" v-if="!$v.proposal.description.maxLength" v-bind:value="$t('entity.validation.maxlength')">
                                This field cannot be longer than 10000 characters.
                            </small>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" v-text="$t('proposalApp.proposal.priority')" for="proposal-prop-priority">Priority</label>
                        <input type="number" class="form-control" name="priority" id="proposal-prop-priority"
                            :class="{'valid': !$v.proposal.priority.$invalid, 'invalid': $v.proposal.priority.$invalid }" v-model.number="$v.proposal.priority.$model" />
                        <div v-if="$v.proposal.priority.$anyDirty && $v.proposal.priority.$invalid">
                            <small class="form-text text-danger" v-if="!$v.proposal.priority.minLength" v-bind:value="$t('entity.validation.min')">
                                This field should be at least 1 characters.
                            </small>
                            <small class="form-text text-danger" v-if="!$v.proposal.priority.maxLength" v-bind:value="$t('entity.validation.max')">
                                This field cannot be longer than 3 characters.
                            </small>
                            <small class="form-text text-danger" v-if="!$v.proposal.priority.number" v-text="$t('entity.validation.number')">
                                This field should be a number.
                            </small>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" v-text="$t('proposalApp.proposal.alikeSum')" for="proposal-prop-alikeSum">Alike Sum</label>
                        <input type="number" class="form-control" name="alikeSum" id="proposal-prop-alikeSum"
                            :class="{'valid': !$v.proposal.alikeSum.$invalid, 'invalid': $v.proposal.alikeSum.$invalid }" v-model.number="$v.proposal.alikeSum.$model" />
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" v-text="$t('proposalApp.proposal.commentSum')" for="proposal-prop-commentSum">Comment Sum</label>
                        <input type="number" class="form-control" name="commentSum" id="proposal-prop-commentSum"
                            :class="{'valid': !$v.proposal.commentSum.$invalid, 'invalid': $v.proposal.commentSum.$invalid }" v-model.number="$v.proposal.commentSum.$model" />
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" v-text="$t('proposalApp.proposal.createdDate')" for="proposal-prop-createdDate">Created Date</label>
                        <div class="d-flex">
                            <input id="proposal-prop-createdDate" type="datetime-local" class="form-control" name="createdDate" :class="{'valid': !$v.proposal.createdDate.$invalid, 'invalid': $v.proposal.createdDate.$invalid }"
                             required
                            :value="convertDateTimeFromServer($v.proposal.createdDate.$model)"
                            @change="updateInstantField('createdDate', $event)"/>
                        </div>
                        <div v-if="$v.proposal.createdDate.$anyDirty && $v.proposal.createdDate.$invalid">
                            <small class="form-text text-danger" v-if="!$v.proposal.createdDate.required" v-text="$t('entity.validation.required')">
                                This field is required.
                            </small>
                            <small class="form-text text-danger" v-if="!$v.proposal.createdDate.ZonedDateTimelocal" v-text="$t('entity.validation.ZonedDateTimelocal')">
                                This field should be a date and time.
                            </small>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" v-text="$t('proposalApp.proposal.updatedDate')" for="proposal-prop-updatedDate">Updated Date</label>
                        <div class="d-flex">
                            <input id="proposal-prop-updatedDate" type="datetime-local" class="form-control" name="updatedDate" :class="{'valid': !$v.proposal.updatedDate.$invalid, 'invalid': $v.proposal.updatedDate.$invalid }"
                             required
                            :value="convertDateTimeFromServer($v.proposal.updatedDate.$model)"
                            @change="updateInstantField('updatedDate', $event)"/>
                        </div>
                        <div v-if="$v.proposal.updatedDate.$anyDirty && $v.proposal.updatedDate.$invalid">
                            <small class="form-text text-danger" v-if="!$v.proposal.updatedDate.required" v-text="$t('entity.validation.required')">
                                This field is required.
                            </small>
                            <small class="form-text text-danger" v-if="!$v.proposal.updatedDate.ZonedDateTimelocal" v-text="$t('entity.validation.ZonedDateTimelocal')">
                                This field should be a date and time.
                            </small>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" v-text="$t('proposalApp.proposal.status')" for="proposal-prop-status">Status</label>
                        <select class="form-control" name="status" :class="{'valid': !$v.proposal.status.$invalid, 'invalid': $v.proposal.status.$invalid }" v-model="$v.proposal.status.$model" id="proposal-prop-status"  required>
                            <option value="NEW" v-bind:label="$t('proposalApp.Status.NEW')">NEW</option>
                            <option value="ACCEPTED" v-bind:label="$t('proposalApp.Status.ACCEPTED')">ACCEPTED</option>
                            <option value="REJECTED" v-bind:label="$t('proposalApp.Status.REJECTED')">REJECTED</option>
                            <option value="POSTPONED" v-bind:label="$t('proposalApp.Status.POSTPONED')">POSTPONED</option>
                            <option value="ASSIGNED" v-bind:label="$t('proposalApp.Status.ASSIGNED')">ASSIGNED</option>
                            <option value="RESOLVED" v-bind:label="$t('proposalApp.Status.RESOLVED')">RESOLVED</option>
                        </select>
                        <div v-if="$v.proposal.status.$anyDirty && $v.proposal.status.$invalid">
                            <small class="form-text text-danger" v-if="!$v.proposal.status.required" v-text="$t('entity.validation.required')">
                                This field is required.
                            </small>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" v-bind:value="$t('proposalApp.proposal.author')" for="proposal-prop-author">Author</label>
                        <select class="form-control" id="proposal-prop-author" name="author" v-model="proposal.author" required>
                            <option v-if="!proposal.author" v-bind:value="null" selected></option>
                            <option v-bind:value="proposal.author && userOption.id === proposal.author.id ? proposal.author : userOption" v-for="userOption in users" :key="userOption.id">{{userOption.login}}</option>
                        </select>
                    </div>
                    <div v-if="$v.proposal.author.$anyDirty && $v.proposal.author.$invalid">
                        <small class="form-text text-danger" v-if="!$v.proposal.author.required" v-text="$t('entity.validation.required')">
                            This field is required.
                        </small>
                    </div>
                    <div class="form-group">
                        <label v-text="$t('proposalApp.proposal.tag')" for="proposal-prop-tag">Tag</label>
                        <select class="form-control" id="proposal-prop-tag" multiple name="tag" v-model="proposal.tags">
                            <option v-bind:value="getSelected(proposal.tags, tagOption)" v-for="tagOption in tags" :key="tagOption.id">{{tagOption.name}}</option>
                        </select>
                    </div>
                </div>
                <div>
                    <button type="button" id="cancel-save" class="btn btn-secondary" v-on:click="previousState()">
                        <font-awesome-icon icon="ban"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.cancel')">Cancel</span>
                    </button>
                    <button type="submit" id="save-entity" :disabled="$v.proposal.$invalid || isSaving" class="btn btn-primary">
                        <font-awesome-icon icon="save"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.save')">Save</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
<script lang="ts" src="./proposal-prop-update.component.ts">
</script>
