<template>
    <div class="row justify-content-center">
        <div class="col-8">
            <div v-if="quotes">
                <h2 class="jh-entity-heading"><span v-text="$t('proposalApp.quotes.detail.title')">QuotesProp</span> {{quotes.id}}</h2>
                <dl class="row jh-entity-details">
                    <dt>
                        <span v-text="$t('proposalApp.quotes.text')">Text</span>
                    </dt>
                    <dd>
                        <span>{{quotes.text}}</span>
                    </dd>
                    <dt>
                        <span v-text="$t('proposalApp.quotes.author')">Author</span>
                    </dt>
                    <dd>
                        <span>{{quotes.author}}</span>
                    </dd>
                    <dt>
                        <span v-text="$t('proposalApp.quotes.category')">Category</span>
                    </dt>
                    <dd>
                        <span>{{quotes.category}}</span>
                    </dd>
                </dl>
                <button type="submit"
                        v-on:click.prevent="previousState()"
                        class="btn btn-info">
                    <font-awesome-icon icon="arrow-left"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.back')"> Back</span>
                </button>
                <router-link v-if="quotes.id" :to="{name: 'QuotesPropEdit', params: {quotesId: quotes.id}}" tag="button" class="btn btn-primary">
                    <font-awesome-icon icon="pencil-alt"></font-awesome-icon>&nbsp;<span v-text="$t('entity.action.edit')"> Edit</span>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script lang="ts" src="./quotes-prop-details.component.ts">
</script>
