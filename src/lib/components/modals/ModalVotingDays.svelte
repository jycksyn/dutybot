<script lang="ts">
	import dayjs, { prettyDate, prettyTime } from '$lib/dates';
	import type { ShiftWithType } from '$lib/dbtypes';
	import { modalStore } from '@skeletonlabs/skeleton';
	import ShiftVotingCard from '../calendar/ShiftVotingCard.svelte';

	type Dayjs = dayjs.Dayjs;

	export let shifts: ShiftWithType[];
	export let date: Dayjs;
	export let preferences: Record<string, number>;
	export let total: number;
	export let group: string[] | undefined;
</script>

{#if $modalStore[0]}
	<div class="card p-4 w-modal shadow-xl space-y-4">
		<h2 class="text-2xl font-bold">{prettyDate(date)}</h2>

		<ul>
			{#each shifts as shift, i (shift.id)}
			{@const pref = preferences[shift.id]}
			<ShiftVotingCard
				--hue={pref ? `${120*(1-pref/total)}deg` : undefined}
				{shift}
				inGroup={group?.includes(shift.id)}
				on:click={() => $modalStore[0].response?.(shift.id)} />
			{/each}
		</ul>
	</div>
{/if}
