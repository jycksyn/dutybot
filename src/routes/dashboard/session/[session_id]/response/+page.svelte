<script lang="ts">
	import RankingForm from "$lib/components/RankingForm.svelte";
	import { shiftRankingSchema } from "$lib/forms.js";
	import { superForm } from "sveltekit-superforms/client";

    export let data;

    const {session} = data;
    const {shifts} = session;

	const shiftRankingForm = superForm(data.shiftRankingForm, {
		validators: shiftRankingSchema,
		dataType: 'json'
	});
    
    export const {capture, restore} = shiftRankingForm;

    export const snapshot = {capture, restore};
</script>

<RankingForm {shiftRankingForm} {shifts} />