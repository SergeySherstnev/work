<template>
    <div class="row justify-content-center">
        <div class="col-8">
            <form name="editForm" role="form" novalidate v-on:submit.prevent="save()" >
                <h2 id="proposalApp.history.home.createOrEditLabel" v-text="$t('proposalApp.history.home.createOrEditLabel')">Create or edit a HistoryProp</h2>
                <div>
                    <div class="form-group" v-if="history.id">
                        <label for="id" v-text="$t('global.field.id')">ID</label>
                        <input type="text" class="form-control" id="id" name="id"
                               v-model="history.id" readonly />
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" v-text="$t('proposalApp.history.createdDate')" for="history-prop-createdDate">Created Date</label>
                        <div class="d-flex">
                            <input id="history-prop-createdDate" type="datetime-local" class="form-control" name="createdDate" :class="{'valid': !$v.history.createdDate.$invalid, 'invalid': $v.history.createdDate.$invalid }"
                             required
                            :value="convertDateTimeFromServer($v.history.createdDate.$model)"
                            @change="updateInstantField('createdDate', $event)"/>
                        </div>
                        <div v-if="$v.history.createdDate.$anyDirty && $v.history.createdDate.$invalid">
                            <small class="form-text text-danger" v-if="!$v.history.createdDate.required" v-text="$t('entity.validation.required')">
                                This field is required.
                            </small>
                            <small class="form-text text-danger" v-if="!$v.history.createdDate.ZonedDateTimelocal" v-text="$t('entity.validation.ZonedDateTimelocal')">
                                This field should be a date and time.
                            </small>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" v-text="$t('proposalApp.history.status')" for="history-prop-status">Status</label>
                        <select class="form-control" name="status" :class="{'valid': !$v.history.status.$invalid, 'invalid': $v.history.status.$invalid }" v-model="$v.history.status.$model" id="history-prop-status"  required>
                            <option value="NEW" v-bind:label="$t('proposalApp.Status.NEW')">NEW</option>
                            <option value="ACCEPTED" v-bind:label="$t('proposalApp.Status.ACCEPTED')">ACCEPTED</option>
                            <option value="REJECTED" v-bind:label="$t('proposalApp.Status.REJECTED')">REJECTED</option>
                            <option value="POSTPONED" v-bind:label="$t('proposalApp.Status.POSTPONED')">POSTPONED</option>
                            <option value="ASSIGNED" v-bind:label="$t('proposalApp.Status.ASSIGNED')">ASSIGNED</option>
                            <option value="RESOLVED" v-bind:label="$t('proposalApp.Status.RESOLVED')">RESOLVED</option>
                        </select>
                        <div v-if="$v.history.status.$anyDirty && $v.history.status.$invalid">
                            <small class="form-text text-danger" v-if="!$v.history.status.required" v-text="$t('entity.validation.required')">
                                This field is required.
                            </small>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" v-text="$t('proposalApp.history.comment')" for="history-prop-comment">Comment</label>
                        <input type="text" class="form-control" name="comment" id="history-prop-comment"
                            :class="{'valid': !$v.history.comment.$invalid, 'invalid': $v.history.comment.$invalid }" v-model="$v.history.comment.$model"  required/>
                        <div v-if="$v.history.comment.$anyDirty && $v.history.comment.$invalid">
                            <small class="form-text text-danger" v-if="!$v.history.comment.required" v-text="$t('entity.validation.required')">
                                This field is required.
                            </small>
                            <small class="form-text text-danger" v-if="!$v.history.comment.maxLength" v-bind:value="$t('entity.validation.maxlength')">
                                This field cannot be longer than 10000 characters.
                            </small>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" v-bind:value="$t('proposalApp.history.executive')" for="history-prop-executive">Executive</label>
                        <select class="form-control" id="history-prop-executive" name="executive" v-model="history.executive" required>
                            <option v-if="!history.executive" v-bind:value="null" selected></option>
                            <option v-bind:value="history.executive && userOption.id === history.executive.id ? history.executive : userOption" v-for="userOption in users" :key="userOption.id">{{userOption.login}}</option>
                        </select>
                    </div>
                    <div v-if="$v.history.executive.$anyDirty && $v.history.executive.$invalid">
                        <small class="form-text text-danger" v-if="!$v.history.executive.required" v-text="$t('entity.validation.required')">
                            This field is required.
                        </small>
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" v-bind:value="$t('proposalApp.history.assignee')" for="history-prop-assignee">Assignee</label>
                        <select class="form-control" id="history-prop-assignee" name="assignee" v-model="history.assignee">
                            <option v-bind:value="null"></option>
                            <option v-bind:value="history.assignee && userOption.id === history.assignee.id ? history.assignee : userOption" v-for="userOption in users" :key="userOption.id">{{userOption.login}}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" v-bind:value="$t('proposalApp.history.proposal')" for="history-prop-proposal">Proposal</label>
                        <select class="form-control" id="history-prop-proposal" name="proposal" v-model="history.proposal" required>
                            <option v-if="!history.proposal" v-bind:value="null" selected></option>
                            <option v-bind:value="history.proposal && proposalOption.id === history.proposal.id ? history.proposal : proposalOption" v-for="proposalOption in proposals" :key="proposalOption.id">{{proposalOption.caption}}</option>
                        </select>
                    </div>
                    <div v-if="$v.history.proposal.$anyDirty && $v.history.proposal.$invalid">
                        <small class="form-text text-danger" v-if="!$v.history.proposal.required" v-text="$t('entity.validation.required')">
                            This field is required.
                        </small>
                    </div>
                </div>
                <div>
                    <button type="button" id="cancel-save" class="btn btn-secondary" v-on:click="previousState()">
                        <font-awesome-icon icon="ban"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.cancel')">Cancel</span>
                    </button>
                    <button type="submit" id="save-entity" :disabled="$v.history.$invalid || isSaving" class="btn btn-primary">
                        <font-awesome-icon icon="save"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.save')">Save</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
<script lang="ts" src="./history-prop-update.component.ts">
</script>
