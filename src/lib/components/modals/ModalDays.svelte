<script lang="ts">
	import dayjs, { prettyDate, prettyTime } from '$lib/dates';
	import type { ShiftWithType } from '$lib/dbtypes';
	import { modalStore } from '@skeletonlabs/skeleton';

	type Dayjs = dayjs.Dayjs;

	export let shifts: ShiftWithType[];
	export let date: Dayjs;
</script>

{#if $modalStore[0]}
	<div class="card p-4 w-modal shadow-xl space-y-4">
		<h2 class="text-2xl font-bold">{prettyDate(date)}</h2>

		<ul>
			{#each shifts as shift}
				<li class="card bg-surface-300-600-token text-sm p-1">
					<p>
						<span class="font-bold"> {dayjs(shift.date).date()}</span>
						{shift.type.name}
					</p>
					<p>{prettyTime(shift.start)} - {prettyTime(shift.end)}</p>
				</li>
			{/each}
		</ul>
	</div>
{/if}
