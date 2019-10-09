<template>
  <div id="app">
    <ribbon></ribbon>
    <div id="app-header" style="position: sticky; top: 0; z-index: 200; "> <!-- Sticky header. See https://medium.com/web-standards/sticky-bc7ff7088693 -->
      <jhi-navbar></jhi-navbar>
    </div>
    <div class="container-fluid">
      <div class="card jh-card">
        <router-view></router-view>
      </div>
      <b-modal id="login-page" hide-footer lazy>
        <span slot="modal-title" id="login-title" v-text="$t('login.title')">Sign in</span>
        <login-form></login-form>
      </b-modal>

      <jhi-footer></jhi-footer>
    </div>
  </div>
</template>

<script lang="ts" src="./app.component.ts">
</script>
