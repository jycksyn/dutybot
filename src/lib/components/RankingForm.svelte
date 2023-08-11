<script lang="ts">
	import type { ShiftWithType } from '$lib/dbtypes';
	import type { shiftRankingSchema } from '$lib/forms';
	import { ArrowDown, ArrowUp } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import Calendar from './calendar/Calendar.svelte';
	import VotingDay from './calendar/VotingDay.svelte';

	export let shifts: ShiftWithType[];
	export let shiftRankingForm: SuperForm<typeof shiftRankingSchema>;

	$: ({ form, tainted, enhance } = shiftRankingForm);

	let rankingLastFirst = true;

	const handleSelect = ({ detail: { shift_id } }: VotingDay['$$events_def']['select']) => form.update($form => {
		if ($form.preferences[shift_id] != undefined) {
			let removed_ranking = $form.preferences[shift_id]!;
			delete $form.preferences[shift_id];
			for (let shift in $form.preferences) {
				const ranking = $form.preferences[shift];
				$form.preferences[shift] = rankingLastFirst
					? ranking < removed_ranking
						? ranking + 1
						: ranking
					: ranking > removed_ranking
					? ranking - 1
					: ranking;
			}
            return $form;
		}
		const ranking = rankingLastFirst
			? shifts.length - Object.keys($form.preferences).length - 1
			: Object.keys($form.preferences).length + 1;
		$form.preferences[shift_id] = ranking;
        return $form
	});
</script>

<form use:enhance method="post" class="flex flex-col justify-stretch gap-4">
	<label class:disabled={!!Object.keys($form.preferences).length} class="btn variant-filled-primary">
		<span class="flex flex-row justify-center items-center">
			{#if rankingLastFirst}
				<Icon class="h-4 mr-2" src={ArrowUp} /> Ranking last preferences first
			{:else}
				<Icon class="h-4 mr-2" src={ArrowDown} /> Ranking first preferences first
			{/if}
		</span>
		<input
			disabled={!!Object.keys($form.preferences).length}
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
			{date}
			shifts={dayShifts}
		/>
	</Calendar>
</form>

<SuperDebug data={$tainted} />
