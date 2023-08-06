<script lang="ts">
	import type { newSessionSchema } from '$lib/forms';
	import { modalStore } from '@skeletonlabs/skeleton';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import dayjs, { prettyTime } from '$lib/dates';
	import { Prisma } from '@prisma/client';
	import { prettyDate } from '$lib/dates';

	type Dayjs = dayjs.Dayjs;

	const shiftWithType = Prisma.validator<Prisma.ShiftArgs>()({
		include: { type: true }
	});

	export let shifts: Prisma.ShiftGetPayload<typeof shiftWithType>[];
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
