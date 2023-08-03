<script lang="ts">
	import type { newSessionSchema } from '$lib/forms';
	import { modalStore } from '@skeletonlabs/skeleton';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	export let sessionForm: SuperForm<typeof newSessionSchema>;

	const { enhance, form, errors, allErrors, constraints } = sessionForm;
</script>

{#if $modalStore[0]}
	<div class="card p-4 w-modal shadow-xl space-y-4">

		<h2 class="text-2xl font-bold">New Session</h2>

		<form action="?/newsession" method="post" use:enhance class="space-y-4">
			
			<label>
				Start
				<input 
					bind:value={$form.start} 
					type="date"
					name="start"
					class="input"
					{...$constraints.start}
				 />
			</label>

			<label>
				End
				<input
					bind:value={$form.end}
					name="end"
					type="date"
					class="input"
					{...$constraints.end}
					/>
			</label>

			{#if $errors._errors}
				<small class="text-sm text-error-500-400-token">
					{$errors._errors}
				</small>
			{/if}

			
			<div class="flex flex-row gap-2 justify-end w-auto">
				<button type="button" class="btn variant-ghost" on:click={modalStore.close}>Close</button>
				<button disabled={!!$allErrors.length} class="btn variant-filled-primary">Create</button>
			</div>
		</form>

	</div>
{/if}
