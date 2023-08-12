<script lang="ts">
	import dayjs, { prettyTime } from '$lib/dates';
	import type { ShiftWithType } from '$lib/dbtypes';
	import { modalStore } from '@skeletonlabs/skeleton';
	import type { Dayjs } from 'dayjs';
	import { createEventDispatcher } from 'svelte';
	import ModalVotingDays from '../modals/ModalVotingDays.svelte';
	import ShiftVotingCard from './ShiftVotingCard.svelte';

	export let shifts: ShiftWithType[];
	export let date: Dayjs;
	export let preferences: Record<string, number>;
	export let total: number;
	export let group: string[] | undefined;

	const dispatch = createEventDispatcher<{
		select: {shift_id: string}
	}>();

	const openModal = () => {
		modalStore.trigger({
			type: 'component',
			component: {
				ref: ModalVotingDays,
				props: {
					date,
					shifts,
					preferences,
					total
				}
			},
			response: (shift_id: string) => {
				dispatch('select', {shift_id})
				modalStore.close()
			}
		});
	};

	$: firstPref = shifts[0] ? preferences[shifts[0].id] : undefined;

	$: styles = {
		'hue': firstPref != null ? `${120*(1 - firstPref/total)}deg` : undefined
	};
</script>

{#if shifts.length}
	<div class="hidden md:flex flex-col">
		{#each shifts as shift (shift.id)}
			{@const pref = preferences[shift.id]}
			<ShiftVotingCard
				--hue={pref != null ? `${120*(1 - pref/total)}deg` : undefined}
				inGroup={group?.includes(shift.id)}
				{shift}
				on:click={() => dispatch('select', {shift_id: shift.id})} />
			<input type="hidden" value={pref} />
		{/each}
	</div>

	<button type="button" style:--hue={styles.hue} on:click={openModal} class="btn btn-icon flex md:hidden bg-surface-400-500-token">
		{date.date()}
	</button>
{/if}

<style>
    button {
        background-color: hsl(var(--hue, 264deg), 70%, 80%);
    }
</style>