<template>
    <div class="row justify-content-center">
        <div class="col-8">
            <form name="editForm" role="form" novalidate v-on:submit.prevent="save()" >
                <h2 id="proposalApp.tag.home.createOrEditLabel" v-text="$t('proposalApp.tag.home.createOrEditLabel')">Create or edit a TagProp</h2>
                <div>
                    <div class="form-group" v-if="tag.id">
                        <label for="id" v-text="$t('global.field.id')">ID</label>
                        <input type="text" class="form-control" id="id" name="id"
                               v-model="tag.id" readonly />
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" v-text="$t('proposalApp.tag.name')" for="tag-prop-name">Name</label>
                        <input type="text" class="form-control" name="name" id="tag-prop-name"
                            :class="{'valid': !$v.tag.name.$invalid, 'invalid': $v.tag.name.$invalid }" v-model="$v.tag.name.$model"  required/>
                        <div v-if="$v.tag.name.$anyDirty && $v.tag.name.$invalid">
                            <small class="form-text text-danger" v-if="!$v.tag.name.required" v-text="$t('entity.validation.required')">
                                This field is required.
                            </small>
                            <small class="form-text text-danger" v-if="!$v.tag.name.maxLength" v-bind:value="$t('entity.validation.maxlength')">
                                This field cannot be longer than 50 characters.
                            </small>
                        </div>
                    </div>
                </div>
                <div>
                    <button type="button" id="cancel-save" class="btn btn-secondary" v-on:click="previousState()">
                        <font-awesome-icon icon="ban"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.cancel')">Cancel</span>
                    </button>
                    <button type="submit" id="save-entity" :disabled="$v.tag.$invalid || isSaving" class="btn btn-primary">
                        <font-awesome-icon icon="save"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.save')">Save</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
<script lang="ts" src="./tag-prop-update.component.ts">
</script>
