<script lang="ts">
	import { modalStore } from '@skeletonlabs/skeleton';
	import Button from './ui/Button.svelte';
	import LinkButton from './ui/LinkButton.svelte';
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class="card p-4 w-modal shadow-xl space-y-4">
		<h2 class="text-xl font-bold">Sign out</h2>
		<p class="text-lg">Are you sure you want to sign out?</p>
		<div class="flex flex-row gap-2 justify-end w-auto">
			<Button on:click={modalStore.close}>Close</Button>
			<LinkButton href='/api/signout'>Confirm</LinkButton>
		</div>
	</div>
{/if}
