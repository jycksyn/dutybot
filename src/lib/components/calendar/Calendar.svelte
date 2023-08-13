<script lang="ts">
	import dayjs from '$lib/dates';
	import type { ShiftWithType } from '$lib/dbtypes';
	import { Prisma } from '@prisma/client';
	import type { Dayjs } from 'dayjs';
	import { groupBy } from 'lodash';

	export let shifts: ShiftWithType[];

	let shiftsByDay: Map<string, ShiftWithType[]>;
	let start: Dayjs | undefined;
	let end:Dayjs | undefined;

	$: {
		shiftsByDay = new Map(Object.entries(groupBy(shifts, shift => shift.date.toISOString())));
		start = [...shiftsByDay.keys()].reduce<Dayjs | undefined>((p,c) => p && p.isBefore(dayjs(c)) ? p : dayjs(c), undefined);
		end = [...shiftsByDay.keys()].reduce<Dayjs | undefined>((p,c) => p && p.isAfter(dayjs(c)) ? p : dayjs(c), undefined);
	}

	let selectedDate: Dayjs | undefined = undefined;
</script>

<div>
	<ul class="grid grid-cols-7 gap-1 font-bold">
		{#each 'SMTWTFS' as day}
			<li class="flex items-center justify-center list-none">{day}</li>
		{/each}
	</ul>

	{#if start && end}
		<ol class="grid grid-cols-7 gap-y-2 gap-x-1">
			{#each { length: end.diff(start, 'day') + 1 } as _, i}
				{@const date = start.add(i, 'day')}
				{@const day = date.day()}

				<li class="{i == 0 ? `col-start-${day + 1} ` : ''}flex items-start justify-center list-none">
					<slot {date} dayShifts={shiftsByDay.get(date.toISOString()) ?? []} />
				</li>
			{/each}
		</ol>
	{/if}

</div>
