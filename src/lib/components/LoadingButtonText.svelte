<script lang="ts">

	import { ProgressRadial } from "@skeletonlabs/skeleton";
	import type { Readable } from "svelte/store";

    export let d: boolean;

</script>

{#if d}
    <ProgressRadial meter="stroke-white" stroke={125} width="w-4" />
{:else}
    <slot />
{/if}