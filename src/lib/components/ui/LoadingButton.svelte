<script lang="ts">
    import Reload from "svelte-radix/Reload.svelte";
    import {Button} from "$lib/components/ui/button/index.js";

    export let onClick: () => void
    export let isLoading: boolean = false
</script>

<div class="my-5">
    <Button class="w-full" disabled={isLoading} on:click={onClick}>
        {#if isLoading}
            <Reload class="mr-2 h-4 w-4 animate-spin"/>
        {/if}
        Save
    </Button>
</div>