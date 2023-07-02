<script lang="ts">
	import { modalStore } from '@skeletonlabs/skeleton';
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class="card p-4 w-modal shadow-xl space-y-4">
		<h2 class="text-2xl font-bold">Sign Out</h2>
		<p class="text-lg">Are you sure you want to sign out?</p>
		<div class="flex flex-row gap-2 justify-end w-auto">
			<button class="btn variant-ghost" on:click={modalStore.close}>Close</button>
			<a class="btn variant-filled" href='/api/signout'>Confirm</a>
		</div>
	</div>
{/if}
