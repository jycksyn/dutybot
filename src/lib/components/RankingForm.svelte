<script lang="ts">
	import type { ShiftWithType } from '$lib/dbtypes';
	import { ArrowDown, ArrowUp } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import Calendar from './calendar/Calendar.svelte';
	import VotingDay from './calendar/VotingDay.svelte';
	import { shiftRankingSchema } from '$lib/forms';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';
	import type { enumUtil } from 'zod/lib/helpers/enumUtil';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	export let shifts: ShiftWithType[];
	export let validated: SuperValidated<typeof shiftRankingSchema>;

	$: shiftRankingForm = superForm(validated, {
		validators: shiftRankingSchema,
		dataType: 'json'
	});

	$: ({ form } = shiftRankingForm);

	let rankingLastFirst = true;

	const handleSelect = ({ detail: { shift_id } }: VotingDay['$$events_def']['select']) => {
		if ($form.preferences.has(shift_id)) {
			let removed_ranking = $form.preferences.get(shift_id)!;
			$form.preferences = new Map(
				[...$form.preferences.entries()]
					.filter(([shift, ranking]) => shift != shift_id)
					.map(([shift, ranking]) => [
						shift,
						rankingLastFirst
							? ranking < removed_ranking
								? ranking + 1
								: ranking
							: ranking > removed_ranking
							? ranking - 1
							: ranking
					])
			);
			return;
		}
		const ranking = rankingLastFirst
			? shifts.length - $form.preferences.size - 1
			: $form.preferences.size + 1;
		$form.preferences.set(shift_id, ranking);
		$form.preferences = new Map($form.preferences.entries());
	};
</script>

<form class="flex flex-col justify-stretch">
	<label class:disabled={!!$form.preferences.size} class="btn variant-filled-primary">
		<span class="flex flex-row justify-center items-center">
			{#if rankingLastFirst}
				<Icon class="h-4 mr-2" src={ArrowUp} /> Ranking last preferences first
			{:else}
				<Icon class="h-4 mr-2" src={ArrowDown} /> Ranking first preferences first
			{/if}
		</span>
		<input
			disabled={!!$form.preferences.size}
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
