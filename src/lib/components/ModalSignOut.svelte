<script lang="ts">
	import { modalStore } from '@skeletonlabs/skeleton';
	import Button from './ui/Button.svelte';
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class="card p-4 w-modal shadow-xl space-y-4">
		<h2 class="text-2xl font-bold">Sign Out</h2>
		<p class="text-lg">Are you sure you want to sign out?</p>
		<div class="flex flex-row gap-2 justify-end w-auto">
			<Button ghost on:click={modalStore.close}>Close</Button>
			<Button href='/api/signout'>Confirm</Button>
		</div>
	</div>
{/if}
