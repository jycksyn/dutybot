<script lang="ts">
	import type { ShiftWithType } from '$lib/dbtypes';
	import type { shiftRankingSchema } from '$lib/forms';
	import { ArrowDown, ArrowUp, RectangleGroup } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import Calendar from './calendar/Calendar.svelte';
	import VotingDay from './calendar/VotingDay.svelte';

	export let shifts: ShiftWithType[];
	export let shiftRankingForm: SuperForm<typeof shiftRankingSchema>;

	$: ({ form, tainted, enhance } = shiftRankingForm);

	let rankingLastFirst = true;

    let queue: string[][] = [];

    $: {
        form.update(($form) => {
            const preferences: Record<string, number> = {};
            let lastRank = rankingLastFirst ? shifts.length : 0;
            const u = rankingLastFirst ? -1 : 1;
            for (let group of queue) {
                const ranking = (2 * lastRank + u * (group.length + 1)) / 2;
                for (let shift_id of group) {
                    preferences[shift_id] = ranking;
                }
                lastRank = lastRank + u * group.length;
            }
            return {...$form, preferences};
        })
    }

    let shouldGroup = false;

    const handleGroup = () => { 
        if (shouldGroup) {
            shouldGroup = false;
        } else {
            shouldGroup = true;
            if (queue[queue.length - 1]?.length) {
                queue = [...queue, []];
            }
        }
    }

	const handleSelect = ({ detail: { shift_id } }: VotingDay['$$events_def']['select']) => {
        if ($form.preferences[shift_id] == undefined) {
            if (shouldGroup) {
                const group = [...(queue[queue.length - 1] ?? []), shift_id];
                return queue = [...queue.slice(0, -1), group];
            }
            return queue = [...queue, [shift_id]];
        }
        console.log(shouldGroup, $form.preferences[shift_id], "hi")
        queue = queue.map(group => group.filter(id => id != shift_id)).filter((group) => group.length);
    }

	$: rankedShiftsExist = !!Object.keys($form.preferences).length;
</script>

<form use:enhance method="post" class="flex flex-col justify-stretch gap-4">
	<label class:opacity-50={rankedShiftsExist} class="btn variant-filled-primary">
		<span class="flex flex-row justify-center items-center">
			{#if rankingLastFirst}
				<Icon class="h-4 mr-2" src={ArrowUp} /> Ranking last preferences first
			{:else}
				<Icon class="h-4 mr-2" src={ArrowDown} /> Ranking first preferences first
			{/if}
		</span>
		<input
			disabled={rankedShiftsExist}
			class="hidden"
			type="checkbox"
			bind:checked={rankingLastFirst}
		/>
	</label>

	<Calendar let:date let:dayShifts {shifts}>
		<VotingDay
			total={shifts.length}
			on:select={handleSelect}
			preferences={$form.preferences}
            group={shouldGroup ? queue[queue.length - 1] : undefined}
			{date}
			shifts={dayShifts}
		/>
	</Calendar>

	<button on:click={handleGroup} type="button" class="btn" class:variant-soft-primary={!shouldGroup} class:variant-soft-tertiary={shouldGroup}>
		<span class="flex flex-row justify-center items-center">
		{#if shouldGroup}
			<Icon class="h-4 mr-2" src={RectangleGroup} /> Finish Grouping
		{:else}
			<Icon class="h-4 mr-2" src={RectangleGroup} /> Group Equal Preferences
		{/if}
        </span>
	</button>
</form>
