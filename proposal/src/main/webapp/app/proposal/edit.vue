<template>
    <div class="row justify-content-center">
        <div class="col-8">
            <form name="editForm" role="form" novalidate>
                <h2 id="proposalApp.proposal.home.createOrEditLabel"
                    v-text="$t('proposalApp.proposal.home.createOrEditLabel')">Create or edit a ProposalProp</h2>
                <div>
                    <div class="form-group" v-if="proposal.id">
                        <label for="id" v-text="$t('global.field.id')">ID</label>
                        <input type="text" class="form-control" id="id" name="id"
                               v-model="proposal.id" readonly/>
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" v-text="$t('proposalApp.proposal.caption')"
                               for="proposal-prop-caption">Caption</label>
                        <input type="text" class="form-control" name="caption" id="proposal-prop-caption"
                               :class="{'valid': !$v.proposal.caption.$invalid, 'invalid': $v.proposal.caption.$invalid }"
                               v-model="$v.proposal.caption.$model" required/>
                        <div v-if="$v.proposal.caption.$anyDirty && $v.proposal.caption.$invalid">
                            <small class="form-text text-danger" v-if="!$v.proposal.caption.required"
                                   v-text="$t('entity.validation.required')">
                                This field is required.
                            </small>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" v-text="$t('proposalApp.proposal.description')" for="proposal-description">Description</label>

                        <div>
                            <vue-editor
                                id="proposal-description"
                                name="description"
                                placeholder="Description"
                                :class="{'valid': !$v.proposal.description.$invalid, 'invalid': $v.proposal.description.$invalid }"
                                v-model="$v.proposal.description.$model"
                                :editorToolbar="customToolbar"
                                required>
                            </vue-editor>
                        </div>

                        <div v-if="$v.proposal.description.$anyDirty && $v.proposal.description.$invalid">
                            <small class="form-text text-danger" v-if="!$v.proposal.description.required"
                                   v-text="$t('entity.validation.required')">
                                This field is required.
                            </small>
                        </div>
                    </div>
                    <div class="form-group">
                        <label v-text="$t('proposalApp.proposal.tag')">Tags</label>
                        <taginput v-model="proposal.tags" :existingTags="tags"/>
                    </div>
                    <!--<div class="form-group">-->
                    <!--<label v-text="$t('proposalApp.proposal.tag')" for="proposal-prop-tag">Tags</label>-->
                    <!--<select class="form-control" id="proposal-prop-tag" multiple name="tag" v-model="proposal.tags">-->
                    <!--<option v-bind:value="getSelected(proposal.tags, tagOption)" v-for="tagOption in tags" :key="tagOption.id">{{tagOption.name}}</option>-->
                    <!--</select>-->
                    <!--</div>-->
                </div>
                <div>
                    <button type="button" id="cancel-save" class="btn btn-secondary" v-on:click="previousState()">
                        <font-awesome-icon icon="ban"></font-awesome-icon>&nbsp;<span
                        v-text="$t('entity.action.cancel')">Cancel</span>
                    </button>
                    <button type="button" id="save-entity" :disabled="$v.proposal.$invalid || isSaving"
                            class="btn btn-primary" v-on:click="save()">
                        <font-awesome-icon icon="save"></font-awesome-icon>&nbsp;<span
                        v-text="$t('entity.action.save')">Save</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
<script lang="ts" src="./edit.component.ts">
</script>
