<script lang="ts">
	import type { ShiftWithType } from "$lib/dbtypes";
    import dayjs, { prettyTime } from '$lib/dates';

    export let shift: ShiftWithType;
    export let inGroup: boolean | undefined;
</script>

<button
    type="button"
    on:click
    class="card text-left w-full bg-surface-300-600-token text-sm p-1 ring-primary-400-500-token ring-2"
    class:ring-2={inGroup}
    class:ring-0={!inGroup}>
    <p>
        <span class="font-bold"> {dayjs(shift.date).date()}</span>
        {shift.type.name}
    </p>
    <p>{prettyTime(shift.start)} - {prettyTime(shift.end)}</p>
</button>

<style>
    button {
        background-color: hsl(var(--hue, 264deg), 70%, 70%);
    }
</style>