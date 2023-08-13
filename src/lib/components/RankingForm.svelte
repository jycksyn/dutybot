<script lang="ts">
	import type { ShiftWithType } from '$lib/dbtypes';
	import type { shiftRankingSchema } from '$lib/forms';
	import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { ArrowDown, ArrowUp, RectangleGroup, XCircle } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { groupBy, isEqual } from 'lodash';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import type { z } from 'zod';
	import Calendar from './calendar/Calendar.svelte';
	import VotingDay from './calendar/VotingDay.svelte';

	export let shifts: ShiftWithType[];
	export let shiftRankingForm: SuperForm<typeof shiftRankingSchema>;
    export let original: z.infer<typeof shiftRankingSchema>;

	$: ({ form, enhance, allErrors } = shiftRankingForm);

	let rankingLastFirst = true;

	let queue: string[][] = [...Object.entries(
        groupBy(Object.keys(original.preferences), pref => original.preferences[pref])
    )].sort(
        ([r1], [r2]) => parseFloat(r2) - parseFloat(r1)
    ).map(([r, p]) => p);

	$: {
		form.update(($form) => {
			const preferences: Record<string, number> = {};
			let lastRank = rankingLastFirst ? shifts.length : -1;
			const u = rankingLastFirst ? -1 : 1;
			for (let group of queue) {
				const ranking = (2 * lastRank + u * (group.length + 1)) / 2;
				for (let shift_id of group) {
					preferences[shift_id] = ranking;
				}
				lastRank = lastRank + u * group.length;
			}
			return { ...$form, preferences };
		});
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
	};

	const confirmClear: ModalSettings = {
		type: 'confirm',
		// Data
		title: 'Confirm Clear',
		body: 'Are you sure you want to clear your ranked preferences?',
		response: (r: boolean) => {
            if (!r) return
			queue = [];
			$form.preferences = {};
		}
	};

	const handleClear = () => modalStore.trigger(confirmClear);

	const handleSelect = ({ detail: { shift_id } }: VotingDay['$$events_def']['select']) => {
		if ($form.preferences[shift_id] == undefined) {
			if (shouldGroup) {
				const group = [...(queue[queue.length - 1] ?? []), shift_id];
				return (queue = [...queue.slice(0, -1), group]);
			}
			return (queue = [...queue, [shift_id]]);
		}
        shouldGroup = false;
		queue = queue
			.map((group) => group.filter((id) => id != shift_id))
			.filter((group) => group.length);
	};

	$: canChangeOrdering = [0, shifts.length].includes(Object.keys($form.preferences).length);

	const handleChangeOrdering = () => {
		rankingLastFirst = !rankingLastFirst;
        queue = [...queue.reverse()];
	};

    $: changed = !isEqual(original.preferences, $form.preferences);
</script>

<form
	action="?/submitpreferences"
	use:enhance
	method="post"
	class="flex flex-col justify-stretch gap-4"
>
	<button on:click={handleChangeOrdering} disabled={!canChangeOrdering} class="btn variant-filled-primary">
		<span class="flex flex-row justify-center items-center">
			{#if rankingLastFirst}
				<Icon class="h-4 mr-2" src={ArrowUp} /> Ranking last preferences first
			{:else}
				<Icon class="h-4 mr-2" src={ArrowDown} /> Ranking first preferences first
			{/if}
		</span>
	</button>

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

	<button
		on:click={handleGroup}
		type="button"
		class="btn"
		class:variant-soft-primary={!shouldGroup}
		class:variant-soft-secondary={shouldGroup}
	>
		<span class="flex flex-row justify-center items-center">
			{#if shouldGroup}
				<Icon class="h-4 mr-2" src={RectangleGroup} /> Finish Grouping
			{:else}
				<Icon class="h-4 mr-2" src={RectangleGroup} /> Group Equal Preferences
			{/if}
		</span>
	</button>

	<button on:click={handleClear} type="button" class="btn variant-soft-tertiary">
		<span class="flex flex-row justify-center items-center">
			<Icon class="h-4 mr-2" src={XCircle} /> Clear Ranking
		</span>
	</button>

	<button
		disabled={!!$allErrors.length || Object.keys($form.preferences).length != shifts.length || !changed}
		type="submit"
		class="btn variant-filled-primary"
	>
		Submit Preferences
	</button>
</form>