<script lang="ts">
	import { miniDate } from '$lib/dates';
	import type { ShiftWithType } from '$lib/dbtypes';
	import type { shiftTypeSchema } from '$lib/forms';
	import { modalStore } from '@skeletonlabs/skeleton';
	import { groupBy } from 'lodash';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	export let shifts: ShiftWithType[];
	export let queue: string[][];
	export let preferences: Record<string, number>;
	export let rankingLastFirst: boolean;

	$: groupedShifts = groupBy(shifts, (s) => s.id);
</script>

{#if $modalStore[0]}
	<div class="card p-4 w-modal shadow-xl space-y-4">
		<h2 class="text-2xl font-bold">Confirm Ranking</h2>

		<div class="flex flex-wrap flex-row gap-2 items-center font-bold">
            <span class="rounded py-1 px-2 bg-primary-300-600-token">
				{#if rankingLastFirst}
                    Least Preferred:
                {:else}
                    Most Preferred:
                {/if}
            </span>
			{#each queue as grp, i}
					{#each grp as shift_id, j (shift_id)}
						{@const [shift] = groupedShifts[shift_id]}
						<span style:--tw-ring-color={
                            `hsl(${120 * (1 - preferences[shift_id] / shifts.length)}deg, 60%, 60%)`
                        } class="ring-2 rounded p-1 rankring">{miniDate(shift.date)}</span>
                        {#if j + 1 != grp.length}
                            <span class="text-gray-400">=</span>
                        {/if}
					{/each}
				{#if i + 1 != queue.length}
					{#if rankingLastFirst}
						{'<'}
					{:else}
						{'>'}
					{/if}
				{/if}
			{/each}
		</div>

		<div class="flex flex-row gap-2 justify-end w-auto">
			<button
				type="button"
				class="btn variant-ghost"
				on:click={() => $modalStore?.[0]?.response?.(false)}>Close</button
			>
			<button
				type="button"
				class="btn variant-filled-primary"
				on:click={() => $modalStore?.[0]?.response?.(true)}>Create</button
			>
		</div>
	</div>
{/if}