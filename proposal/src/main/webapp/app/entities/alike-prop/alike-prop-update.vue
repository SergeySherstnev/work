<template>
    <div class="row justify-content-center">
        <div class="col-8">
            <form name="editForm" role="form" novalidate v-on:submit.prevent="save()" >
                <h2 id="proposalApp.alike.home.createOrEditLabel" v-text="$t('proposalApp.alike.home.createOrEditLabel')">Create or edit a AlikeProp</h2>
                <div>
                    <div class="form-group" v-if="alike.id">
                        <label for="id" v-text="$t('global.field.id')">ID</label>
                        <input type="text" class="form-control" id="id" name="id"
                               v-model="alike.id" readonly />
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" v-text="$t('proposalApp.alike.text')" for="alike-prop-text">Text</label>
                        <input type="text" class="form-control" name="text" id="alike-prop-text"
                            :class="{'valid': !$v.alike.text.$invalid, 'invalid': $v.alike.text.$invalid }" v-model="$v.alike.text.$model" />
                        <div v-if="$v.alike.text.$anyDirty && $v.alike.text.$invalid">
                            <small class="form-text text-danger" v-if="!$v.alike.text.maxLength" v-bind:value="$t('entity.validation.maxlength')">
                                This field cannot be longer than 10 characters.
                            </small>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" v-text="$t('proposalApp.alike.createdDate')" for="alike-prop-createdDate">Created Date</label>
                        <div class="d-flex">
                            <input id="alike-prop-createdDate" type="datetime-local" class="form-control" name="createdDate" :class="{'valid': !$v.alike.createdDate.$invalid, 'invalid': $v.alike.createdDate.$invalid }"
                             required
                            :value="convertDateTimeFromServer($v.alike.createdDate.$model)"
                            @change="updateInstantField('createdDate', $event)"/>
                        </div>
                        <div v-if="$v.alike.createdDate.$anyDirty && $v.alike.createdDate.$invalid">
                            <small class="form-text text-danger" v-if="!$v.alike.createdDate.required" v-text="$t('entity.validation.required')">
                                This field is required.
                            </small>
                            <small class="form-text text-danger" v-if="!$v.alike.createdDate.ZonedDateTimelocal" v-text="$t('entity.validation.ZonedDateTimelocal')">
                                This field should be a date and time.
                            </small>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" v-bind:value="$t('proposalApp.alike.author')" for="alike-prop-author">Author</label>
                        <select class="form-control" id="alike-prop-author" name="author" v-model="alike.author" required>
                            <option v-if="!alike.author" v-bind:value="null" selected></option>
                            <option v-bind:value="alike.author && userOption.id === alike.author.id ? alike.author : userOption" v-for="userOption in users" :key="userOption.id">{{userOption.login}}</option>
                        </select>
                    </div>
                    <div v-if="$v.alike.author.$anyDirty && $v.alike.author.$invalid">
                        <small class="form-text text-danger" v-if="!$v.alike.author.required" v-text="$t('entity.validation.required')">
                            This field is required.
                        </small>
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" v-bind:value="$t('proposalApp.alike.proposal')" for="alike-prop-proposal">Proposal</label>
                        <select class="form-control" id="alike-prop-proposal" name="proposal" v-model="alike.proposal" required>
                            <option v-if="!alike.proposal" v-bind:value="null" selected></option>
                            <option v-bind:value="alike.proposal && proposalOption.id === alike.proposal.id ? alike.proposal : proposalOption" v-for="proposalOption in proposals" :key="proposalOption.id">{{proposalOption.caption}}</option>
                        </select>
                    </div>
                    <div v-if="$v.alike.proposal.$anyDirty && $v.alike.proposal.$invalid">
                        <small class="form-text text-danger" v-if="!$v.alike.proposal.required" v-text="$t('entity.validation.required')">
                            This field is required.
                        </small>
                    </div>
                </div>
                <div>
                    <button type="button" id="cancel-save" class="btn btn-secondary" v-on:click="previousState()">
                        <font-awesome-icon icon="ban"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.cancel')">Cancel</span>
                    </button>
                    <button type="submit" id="save-entity" :disabled="$v.alike.$invalid || isSaving" class="btn btn-primary">
                        <font-awesome-icon icon="save"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.save')">Save</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
<script lang="ts" src="./alike-prop-update.component.ts">
</script>
