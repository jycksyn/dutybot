<script>

	import Calendar from "$lib/components/calendar/Calendar.svelte";
	import ModalSelectShiftTypes from "$lib/components/modals/ModalSelectShiftTypes.svelte";
	import { selectShiftTypesSchema } from "$lib/selectShiftTypes";
	import { modalStore } from "@skeletonlabs/skeleton";
	import dayjs from "$lib/dates";
	import { superForm } from "sveltekit-superforms/client";

    export let data;

    
	const selectShiftTypesForm = superForm(data.selectShiftTypesForm, {
		validators: selectShiftTypesSchema,
		invalidateAll: true,
		async onUpdated({ form }) {
			if (form.valid) {
				modalStore.clear();
			}
		}
	});

    $: ({session, is_admin} = data);

	const openSelectShiftTypes = () => {
		modalStore.trigger({
			type: 'component',
			component: {
				ref: ModalSelectShiftTypes,
				props: {
					selectShiftTypesForm,
                    types: session.group.shiftTypes
				}
			}
		});
	};

    $: start = dayjs.tz(session.start, session.group.timezone);
    $: end = dayjs.tz(session.end, session.group.timezone);
</script>

{#if is_admin}
	<button on:click={openSelectShiftTypes} class="btn variant-filled-secondary w-full">
		<span class="flex flex-row justify-center items-center">
			Select Shift Types
		</span>
	</button>
{/if}

<Calendar {start} {end} shifts={session.shifts} />