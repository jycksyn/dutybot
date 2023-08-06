<script lang="ts">
	import type {Dayjs} from "dayjs";
	import DayWrapper from "./DayWrapper.svelte";
	import { Prisma, type Shift } from '@prisma/client';
	import dayjs from "$lib/dates";

	const shiftWithType = Prisma.validator<Prisma.ShiftArgs>()({
		include: { type: true }
	});

	export let shifts: Prisma.ShiftGetPayload<typeof shiftWithType>[];

    export let start: Dayjs;
    export let end: Dayjs;
</script>

<ul class="grid grid-cols-7 gap-1 font-bold ">
	{#each 'SMTWTFS' as day}
		<li class="flex items-center justify-center list-none">{day}</li>
	{/each}
</ul>

<ol class="grid grid-cols-7 gap-1">
    {#each ({length: end.diff(start, 'day') + 1}) as _, i}
        {@const date = start.add(i, 'day')}
        {@const day = date.day()}
        <li class="{i == 0 ? `col-start-${day+1} ` : ""}flex items-center justify-center list-none">
            <DayWrapper shifts={shifts.filter(d => dayjs(d.date).isSame(date, 'date'))} />
        </li>
    {/each}
</ol>