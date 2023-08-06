<script lang="ts">
	import dayjs, { prettyTime } from '$lib/dates';
	import { Prisma, type Shift } from '@prisma/client';

	const shiftWithType = Prisma.validator<Prisma.ShiftArgs>()({
		include: { type: true }
	});

	export let shifts: Prisma.ShiftGetPayload<typeof shiftWithType>[];
</script>

<div>
    {#each shifts as shift (shift.id)}
        <div class="card bg-surface-300-600-token text-sm p-1">
            <p>
                <span class="font-bold">
                    {dayjs(shift.date).date()}</span> {shift.type.name}
            </p>
            <p>{prettyTime(shift.start)} - {prettyTime(shift.end)}</p>
        </div>
    {/each}
</div>