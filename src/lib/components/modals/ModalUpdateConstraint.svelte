<script lang="ts">
	import type { GroupMemberWithUser } from '$lib/dbtypes';
	import type { updateConstraintSchema } from '$lib/forms';
	import type { ShiftType } from '@prisma/client';
	import {
		ListBox,
		ListBoxItem,
		modalStore,
		popup,
		type PopupSettings
	} from '@skeletonlabs/skeleton';
	import { ChevronDown } from '@steeze-ui/heroicons';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import Icon from '../Icon.svelte';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import LoadingButtonText from '../LoadingButtonText.svelte';

	// export let constraint: ConstraintWithMembers;
	export let members: GroupMemberWithUser[];
	export let shiftTypes: ShiftType[];
	export let constraintForm: SuperForm<typeof updateConstraintSchema>;

	const popupShiftType: PopupSettings = {
		event: 'click',
		target: 'popupShiftType',
		placement: 'bottom'
	};

	const popupMembers: PopupSettings = {
		event: 'click',
		target: 'popupMembers',
		placement: 'bottom'
	};

	$: ({ constraints, form, enhance, errors, allErrors, delayed } = constraintForm);

	let displayMembers: string;

	$: {
		const selected = members.filter(({ user_id }) => $form.members.includes(user_id));
		displayMembers =
			selected.length == 0
				? 'Applies to everyone'
				: selected.length == 1
				? selected[0].user.name ?? 'Unknown User'
				: selected[0].user.name + ' and others...';
	}

	let confirmDelete = false;
</script>

{#if $modalStore[0]}
	<div class="card p-4 w-modal shadow-xl space-y-4">
		<h2 class="text-2xl font-bold flex flex-row items-center gap-2">Edit Constraint <LoadingButtonText d={$delayed} /> </h2>

		<form action="?/updateconstraint" method="post" use:enhance class="flex flex-col gap-4">
			{#if $form.id}
				<input name="id" hidden value={$form.id} />
			{/if}

			<label>
				Shift Type
				<button
					type="button"
					use:popup={popupShiftType}
					class="btn variant-ghost-surface w-full justify-between px-3"
				>
					{shiftTypes.find(({ id }) => id == $form.type_id)?.name ?? 'Select a shift type...'}
					<Icon class="w-4" src={ChevronDown} />
				</button>
			</label>

			<div class="card p-4 w-72 shadow-xl max-h-60 overflow-scroll" data-popup="popupShiftType">
				<ListBox>
					{#each shiftTypes as shiftType (shiftType.id)}
						<ListBoxItem bind:group={$form.type_id} name="type_id" value={shiftType.id}>
							{shiftType.name}
						</ListBoxItem>
					{/each}
				</ListBox>
			</div>

			<label>
				Members
				<button
					type="button"
					use:popup={popupMembers}
					class="btn variant-ghost-surface w-full justify-between px-3"
				>
					{displayMembers}
					<Icon class="w-4" src={ChevronDown} />
				</button>
			</label>

			<div class="card p-4 w-72 shadow-xl max-h-60 overflow-scroll" data-popup="popupMembers">
				<ListBox multiple>
					{#each members as member (member.user_id)}
						<ListBoxItem bind:group={$form.members} name="members" value={member.user_id}>
							{member.user.name}
						</ListBoxItem>
					{/each}
				</ListBox>
			</div>

			<label>
				Minimum Number of Shifts
				<input
					bind:value={$form.min}
					name="min"
					type="number"
					class="input"
					{...$constraints.min}
				/>
			</label>

			<label>
				Maximum Number of Shifts
				<input
					bind:value={$form.max}
					name="max"
					type="number"
					class="input"
					{...$constraints.max}
				/>
			</label>

			{#if $errors._errors}
				<small class="text-sm text-error-500-400-token">
					{$errors._errors}
				</small>
			{/if}

			<div class="flex flex-row gap-2 justify-end w-auto">
				{#if $form.id}
					{#if confirmDelete}
						<button type="submit" formaction="?/deleteconstraint" class="btn variant-ghost-error">
							Confirm Delete
						</button>
					{:else}
						<button type="button" on:click={() => confirmDelete = true} class="btn variant-filled-error">
							Delete Constraint
						</button>
					{/if}
				{/if}
				<button type="button" class="btn variant-ghost" on:click={modalStore.close}>Close</button>
				<button type="submit" disabled={!!$allErrors.length} class="btn variant-filled-primary">
					{#if $form.id}
						Update
					{:else}
						Create
					{/if}
				</button>
			</div>
		</form>
	</div>
{/if}
