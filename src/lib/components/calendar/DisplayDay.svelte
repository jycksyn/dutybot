<script lang="ts">
	import dayjs, { prettyTime } from '$lib/dates';
	import { Prisma } from '@prisma/client';
	import { modalStore } from '@skeletonlabs/skeleton';
	import type { Dayjs } from 'dayjs';
	import ModalDays from '../modals/ModalDays.svelte';
	import type { ShiftWithType } from '$lib/dbtypes';

	export let shifts: ShiftWithType[];
	export let date: Dayjs;

	const openModal = () => {
		modalStore.trigger({
			type: 'component',
			component: {
				ref: ModalDays,
				props: {
					date,
					shifts
				}
			}
		});
	};
</script>

{#if shifts.length}
	<div class="hidden md:flex flex-col">
		{#each shifts as shift (shift.id)}
			<div class="card bg-surface-300-600-token text-sm p-1">
				<p>
					<span class="font-bold"> {dayjs(shift.date).date()}</span>
					{shift.type.name}
				</p>
				<p>{prettyTime(shift.start)} - {prettyTime(shift.end)}</p>
			</div>
		{/each}
	</div>

	<button on:click={openModal} class="btn btn-icon flex md:hidden bg-surface-400-500-token">
		{date.date()}
	</button>
{/if}
