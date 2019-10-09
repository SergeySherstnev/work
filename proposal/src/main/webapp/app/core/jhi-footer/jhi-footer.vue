<template>
    <div id="footer" class="footer">
        <p>{{quote}}</p>
    </div>
</template>

<script lang="ts" src="./jhi-footer.component.ts">
</script>

<style scoped>
    .footer {
        text-align: left;

/*      See: https://medium.com/web-standards/sticky-bc7ff7088693
        position: sticky;
        bottom: 0;
*/
        z-index: 200;
    }
</style>
