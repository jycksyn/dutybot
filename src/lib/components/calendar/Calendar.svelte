<script lang="ts">
	import type {Dayjs} from "dayjs";

    export let start: Dayjs;
    export let end: Dayjs;
</script>

<ul class="grid grid-cols-7 gap-4 font-bold ">
	{#each 'SMTWTFS' as day, i}
		<li class="flex items-center justify-center list-none">{day}</li>
	{/each}
</ul>

<ol class="grid grid-cols-7 gap-4">
    {#each ({length: end.diff(start, 'day') + 1}) as _, i}
        {@const date = start.add(i, 'day')}
        {@const day = date.day()}
        <li class="{i == 0 ? `col-start-${day+1} ` : ""}flex items-center justify-center list-none">
            {date.date()}
        </li>
    {/each}
</ol>