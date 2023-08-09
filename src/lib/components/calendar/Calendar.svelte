<script lang="ts">
	import dayjs from '$lib/dates';
	import { Prisma } from '@prisma/client';
	import type { Dayjs } from 'dayjs';

	const shiftWithType = Prisma.validator<Prisma.ShiftArgs>()({
		include: { type: true }
	});

	type ShiftWithType = Prisma.ShiftGetPayload<typeof shiftWithType>;

	export let shifts: ShiftWithType[];

	let shiftsByDay: Map<string, ShiftWithType[]>;
	let start: Dayjs;
	let end:Dayjs;

	$: {
		shiftsByDay = new Map();
		start = dayjs(shifts?.[0].date);
		end = dayjs(shifts?.[0].date)
		for (let shift of shifts) {
			const date = dayjs(shift.date);
			const iso = date.toISOString();
			const dayShifts = shiftsByDay.get(iso) ?? [];
			dayShifts.push(shift);
			shiftsByDay.set(iso, dayShifts);
			
			if (date.isBefore(start)) {
				start = date
			}
			if (date.isAfter(end)) {
				end = date
			}
		}
	}

	let selectedDate: Dayjs | undefined = undefined;
</script>

<div>
	<ul class="grid grid-cols-7 gap-1 font-bold">
		{#each 'SMTWTFS' as day}
			<li class="flex items-center justify-center list-none">{day}</li>
		{/each}
	</ul>

	<ol class="grid grid-cols-7 gap-y-2 gap-x-1">
		{#each { length: end.diff(start, 'day') + 1 } as _, i}
			{@const date = start.add(i, 'day')}
			{@const day = date.day()}

			<li class="{i == 0 ? `col-start-${day + 1} ` : ''}flex items-start justify-center list-none">
				<slot {date} dayShifts={shiftsByDay.get(date.toISOString()) ?? []} />
			</li>
		{/each}
	</ol>

</div>
