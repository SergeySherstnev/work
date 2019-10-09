<template>
    <div class="home row">
        <div class="col-md-3">
            <span class="img-fluid rounded">
                <img v-bind:src="hipsterPicture" v-on:click="randomizeHipster()">
            </span>
        </div>
        <div class="col-md-9">
            <h1 class="display-4">
                <span v-text="$t('home.title')">Welcome to </span>
                <span v-text="$t('global.title')">Proposal!</span>
                <span>!</span>
            </h1>
            <p class="lead" v-text="$t('home.subtitle')">This is your homepage</p>

            <div>
                <div class="alert alert-success" v-if="authenticated">
                    <span v-if="username" v-text="$t('home.logged.message', { 'username': username})">You are logged in as user "{{username}}"</span>
                </div>

                <div class="alert alert-warning" v-if="!authenticated">
                    <span v-text="$t('global.messages.info.authenticated.prefix')">If you want to </span>
                    <a class="alert-link" v-on:click="openLogin()" v-text="$t('global.messages.info.authenticated.link')">sign in</a><span
                    v-html="$t('global.messages.info.authenticated.suffix')">, use your domain login and password.</span>
                </div>
            </div>

            <b-card-group deck>
            <b-card
                header-tag="header"
                tag="span"
                style="max-width: 30rem;"
                class="mb-2">
                <h2 slot="header" class="mb-0">
                    <font-awesome-icon icon="book-reader" size="lg"/>
                    Browse Proposals
                </h2>

                <div class="card-text">
                    Here you can search and view created Proposals. Add comments and likes if you wish.
                </div>

                <br/>

                <b-button :to="{name: 'BrowseProposal'}" variant="primary" block>Go</b-button>
            </b-card>

            <b-card
                v-if="hasAnyAuthority('ROLE_USER')"
                header-tag="header"
                tag="span"
                style="max-width: 30rem;"
                class="mb-2">
                <h2 slot="header" class="mb-0">
                    <font-awesome-icon icon="edit" size="lg"/>
                    Add Proposals
                </h2>

                <div class="card-text">
                    Have an idea how improve anything in you work and live? Add new Proposal here.
                </div>

                <br/>

                <b-button :to="{name: 'NewProposal'}" variant="primary" block>Add</b-button>
            </b-card>
            </b-card-group>


            <p v-text="$t('home.question')">
                If you have any question:
            </p>

            <ul>
                <li><a href="http://projects.t-systems.ru/asatarov/proposal/wiki/_pages" target="_blank" rel="noopener" v-text="$t('home.link.homepage')">Homepage</a></li>
                <li><a href="http://projects.t-systems.ru/asatarov/proposal/issues" target="_blank" rel="noopener" v-text="$t('home.link.bugtracker')">Bug tracker</a></li>
            </ul>

        </div>
    </div>
</template>

<script lang="ts" src="./home.component.ts">
</script>

