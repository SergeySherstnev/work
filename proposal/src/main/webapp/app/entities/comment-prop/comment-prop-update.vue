<template>
    <div class="row justify-content-center">
        <div class="col-8">
            <form name="editForm" role="form" novalidate v-on:submit.prevent="save()" >
                <h2 id="proposalApp.comment.home.createOrEditLabel" v-text="$t('proposalApp.comment.home.createOrEditLabel')">Create or edit a CommentProp</h2>
                <div>
                    <div class="form-group" v-if="comment.id">
                        <label for="id" v-text="$t('global.field.id')">ID</label>
                        <input type="text" class="form-control" id="id" name="id"
                               v-model="comment.id" readonly />
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" v-text="$t('proposalApp.comment.text')" for="comment-prop-text">Text</label>
                        <input type="text" class="form-control" name="text" id="comment-prop-text"
                            :class="{'valid': !$v.comment.text.$invalid, 'invalid': $v.comment.text.$invalid }" v-model="$v.comment.text.$model"  required/>
                        <div v-if="$v.comment.text.$anyDirty && $v.comment.text.$invalid">
                            <small class="form-text text-danger" v-if="!$v.comment.text.required" v-text="$t('entity.validation.required')">
                                This field is required.
                            </small>
                            <small class="form-text text-danger" v-if="!$v.comment.text.maxLength" v-bind:value="$t('entity.validation.maxlength')">
                                This field cannot be longer than 10000 characters.
                            </small>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" v-text="$t('proposalApp.comment.createdDate')" for="comment-prop-createdDate">Created Date</label>
                        <div class="d-flex">
                            <input id="comment-prop-createdDate" type="datetime-local" class="form-control" name="createdDate" :class="{'valid': !$v.comment.createdDate.$invalid, 'invalid': $v.comment.createdDate.$invalid }"
                             required
                            :value="convertDateTimeFromServer($v.comment.createdDate.$model)"
                            @change="updateInstantField('createdDate', $event)"/>
                        </div>
                        <div v-if="$v.comment.createdDate.$anyDirty && $v.comment.createdDate.$invalid">
                            <small class="form-text text-danger" v-if="!$v.comment.createdDate.required" v-text="$t('entity.validation.required')">
                                This field is required.
                            </small>
                            <small class="form-text text-danger" v-if="!$v.comment.createdDate.ZonedDateTimelocal" v-text="$t('entity.validation.ZonedDateTimelocal')">
                                This field should be a date and time.
                            </small>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" v-bind:value="$t('proposalApp.comment.author')" for="comment-prop-author">Author</label>
                        <select class="form-control" id="comment-prop-author" name="author" v-model="comment.author" required>
                            <option v-if="!comment.author" v-bind:value="null" selected></option>
                            <option v-bind:value="comment.author && userOption.id === comment.author.id ? comment.author : userOption" v-for="userOption in users" :key="userOption.id">{{userOption.login}}</option>
                        </select>
                    </div>
                    <div v-if="$v.comment.author.$anyDirty && $v.comment.author.$invalid">
                        <small class="form-text text-danger" v-if="!$v.comment.author.required" v-text="$t('entity.validation.required')">
                            This field is required.
                        </small>
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" v-bind:value="$t('proposalApp.comment.proposal')" for="comment-prop-proposal">Proposal</label>
                        <select class="form-control" id="comment-prop-proposal" name="proposal" v-model="comment.proposal" required>
                            <option v-if="!comment.proposal" v-bind:value="null" selected></option>
                            <option v-bind:value="comment.proposal && proposalOption.id === comment.proposal.id ? comment.proposal : proposalOption" v-for="proposalOption in proposals" :key="proposalOption.id">{{proposalOption.caption}}</option>
                        </select>
                    </div>
                    <div v-if="$v.comment.proposal.$anyDirty && $v.comment.proposal.$invalid">
                        <small class="form-text text-danger" v-if="!$v.comment.proposal.required" v-text="$t('entity.validation.required')">
                            This field is required.
                        </small>
                    </div>
                </div>
                <div>
                    <button type="button" id="cancel-save" class="btn btn-secondary" v-on:click="previousState()">
                        <font-awesome-icon icon="ban"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.cancel')">Cancel</span>
                    </button>
                    <button type="submit" id="save-entity" :disabled="$v.comment.$invalid || isSaving" class="btn btn-primary">
                        <font-awesome-icon icon="save"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.save')">Save</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
<script lang="ts" src="./comment-prop-update.component.ts">
</script>
