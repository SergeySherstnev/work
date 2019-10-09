<template>
    <div class="row justify-content-center">
        <div class="col-8">
            <form name="editForm" role="form" novalidate v-on:submit.prevent="save()" >
                <h2 id="proposalApp.quotes.home.createOrEditLabel" v-text="$t('proposalApp.quotes.home.createOrEditLabel')">Create or edit a QuotesProp</h2>
                <div>
                    <div class="form-group" v-if="quotes.id">
                        <label for="id" v-text="$t('global.field.id')">ID</label>
                        <input type="text" class="form-control" id="id" name="id"
                               v-model="quotes.id" readonly />
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" v-text="$t('proposalApp.quotes.text')" for="quotes-prop-text">Text</label>
                        <input type="text" class="form-control" name="text" id="quotes-prop-text"
                            :class="{'valid': !$v.quotes.text.$invalid, 'invalid': $v.quotes.text.$invalid }" v-model="$v.quotes.text.$model"  required/>
                        <div v-if="$v.quotes.text.$anyDirty && $v.quotes.text.$invalid">
                            <small class="form-text text-danger" v-if="!$v.quotes.text.required" v-text="$t('entity.validation.required')">
                                This field is required.
                            </small>
                            <small class="form-text text-danger" v-if="!$v.quotes.text.maxLength" v-bind:value="$t('entity.validation.maxlength')">
                                This field cannot be longer than 1000 characters.
                            </small>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" v-text="$t('proposalApp.quotes.author')" for="quotes-prop-author">Author</label>
                        <input type="text" class="form-control" name="author" id="quotes-prop-author"
                            :class="{'valid': !$v.quotes.author.$invalid, 'invalid': $v.quotes.author.$invalid }" v-model="$v.quotes.author.$model"  required/>
                        <div v-if="$v.quotes.author.$anyDirty && $v.quotes.author.$invalid">
                            <small class="form-text text-danger" v-if="!$v.quotes.author.required" v-text="$t('entity.validation.required')">
                                This field is required.
                            </small>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-control-label" v-text="$t('proposalApp.quotes.category')" for="quotes-prop-category">Category</label>
                        <input type="text" class="form-control" name="category" id="quotes-prop-category"
                            :class="{'valid': !$v.quotes.category.$invalid, 'invalid': $v.quotes.category.$invalid }" v-model="$v.quotes.category.$model"  required/>
                        <div v-if="$v.quotes.category.$anyDirty && $v.quotes.category.$invalid">
                            <small class="form-text text-danger" v-if="!$v.quotes.category.required" v-text="$t('entity.validation.required')">
                                This field is required.
                            </small>
                        </div>
                    </div>
                </div>
                <div>
                    <button type="button" id="cancel-save" class="btn btn-secondary" v-on:click="previousState()">
                        <font-awesome-icon icon="ban"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.cancel')">Cancel</span>
                    </button>
                    <button type="submit" id="save-entity" :disabled="$v.quotes.$invalid || isSaving" class="btn btn-primary">
                        <font-awesome-icon icon="save"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.save')">Save</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
<script lang="ts" src="./quotes-prop-update.component.ts">
</script>
