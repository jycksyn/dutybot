<script lang="ts">
	import type { shiftTypeSchema } from '$lib/forms';
	import { modalStore } from '@skeletonlabs/skeleton';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import TextField from '../ui/TextField.svelte';
	import { Repeat } from '@prisma/client';
	import { repeat } from 'lodash';
	import dayjs from 'dayjs';
	import timezone from 'dayjs/plugin/timezone';

	dayjs.extend(timezone)

	export let shiftTypeForm: SuperForm<typeof shiftTypeSchema>;

	const { enhance, form, errors, allErrors, constraints } = shiftTypeForm;
</script>

{#if $modalStore[0]}
	<div class="card p-4 w-modal shadow-xl space-y-4">
		<h2 class="text-2xl font-bold">New Shift Type</h2>

		<form action="?/newshifttype" method="post" use:enhance class="space-y-4">
			<TextField form={shiftTypeForm} field="name" />

			<label>
				Start Time
				<input
					bind:value={$form.start_time}
					type="time"
					name="start_time"
					class="input"
					{...$constraints.start_time}
				/>
			</label>

			<label>
				End Time
				<input
					bind:value={$form.end_time}
					name="end_time"
					type="time"
					class="input"
					{...$constraints.start_time}
				/>
			</label>

			<label>
				Repeat
				<select name="repeat" class="select capitalize" bind:value={$form.repeat} {...$constraints.repeat}>
					{#each Object.values(Repeat) as repeat}
						<!-- To title case -->
						<option value={repeat}>{repeat.toLowerCase()}</option>
					{/each}
				</select>
			</label>

			{#if $form.repeat == Repeat.WEEKLY}
				<div class="flex flex-row gap-2 justify-center">
					{#each 'SMTWTFS' as day, i}
						<label class="btn btn-sm" class:variant-filled-primary={$form.repeat_days?.includes(i)}>
							{day}
							<input name="repeat_days" type="checkbox" class="hidden" bind:group={$form.repeat_days} value={i} />
						</label>
					{/each}
				</div>
			{/if}

			<label>
				Start Date (optional)
				<input
					bind:value={$form.start_date}
					type="date"
					name="start_date"
					class="input"
					{...$constraints.start_date}
				/>
			</label>

			<label>
				End Date (optional)
				<input
					bind:value={$form.end_date}
					name="end_date"
					type="date"
					class="input"
					{...$constraints.end_date}
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
		<SuperDebug data={$allErrors} />
	</div>
{/if}
