<script lang="ts">
	import { invalidate, invalidateAll } from '$app/navigation';
	import ModalNewShiftType from '$lib/components/modals/ModalNewShiftType.svelte';
	import { prettyAbstractTime, prettyTime } from '$lib/dates.js';
	import { shiftTypeSchema } from '$lib/forms.js';
	import { modalStore } from '@skeletonlabs/skeleton';
	import { Plus } from '@steeze-ui/heroicons';
	import Icon from '$lib/components/Icon.svelte';
	import { superForm } from 'sveltekit-superforms/client';

	export let data;

	const shiftTypeForm = superForm(data.shiftTypeForm, {
		validators: shiftTypeSchema,
		invalidateAll: true,
		async onUpdated({ form }) {
			if (form.valid) {
				modalStore.clear();
			}
		}
	});

	$: ({ types, group, is_admin } = data);

	const openNewSession = () => {
		modalStore.trigger({
			type: 'component',
			component: {
				ref: ModalNewShiftType,
				props: {
					shiftTypeForm
				}
			}
		});
	};
</script>

{#if types.length}
	<ul class="list m-8 flex flex-col gap-2">
		{#each types as type (type.id)}
			<li>
				<div class="flex flex-col flex-auto">
					<span class="text-lg">{type.name}</span>
					<span class="text-sm">{prettyAbstractTime(type.start_time)} - {prettyAbstractTime(type.end_time)}</span>
				</div>
			</li>
		{/each}
	</ul>
{:else}
	<p class="mt-4 text-center text-gray-400">No shift types have been created yet.</p>
{/if}

{#if is_admin}
	<button on:click={openNewSession} class="btn bg-initial text-primary-500-400-token w-full">
		<span class="flex flex-row justify-center items-center">
			<Icon src={Plus} class="h-4" />
			New Shift Type
		</span>
	</button>
{/if}
