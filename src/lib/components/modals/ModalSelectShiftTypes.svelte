<script lang="ts">
	import type { selectShiftTypesSchema } from '$lib/selectShiftTypes';
	import type { ShiftType } from '@prisma/client';
	import { modalStore } from '@skeletonlabs/skeleton';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	export let selectShiftTypesForm: SuperForm<typeof selectShiftTypesSchema>;
	export let types: ShiftType[];

	const { enhance, form, message, allErrors, errors, constraints } = selectShiftTypesForm;
</script>

{#if $modalStore[0]}
	<div class="card p-4 w-modal shadow-xl space-y-4">
		<h2 class="text-2xl font-bold">Select Shift Types</h2>

		<form action="?/selectShiftTypes" method="post" use:enhance class="space-y-4">
			{#each types as type, i (type.id)}
				<label class="flex items-center space-x-2">
					<input value={type.id} name="types" class="checkbox" type="checkbox" bind:group={$form.types} />
					<p>{type.name}</p>
				</label>
				{#if $errors.types?.[i]}
					<small class="text-red-600">{$errors.types?.[i]}</small>
				{/if}
			{/each}

			{#if $message}
				<small class="text-red-600">{$message}</small>
			{/if}

			<div class="flex flex-row gap-2 justify-end w-auto">
				<button type="button" class="btn variant-ghost" on:click={modalStore.close}>Close</button>
				<button disabled={!!$allErrors.length} class="btn variant-filled-primary">Create</button>
			</div>
		</form>
	</div>
{/if}
