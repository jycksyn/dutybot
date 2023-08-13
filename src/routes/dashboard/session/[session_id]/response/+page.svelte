<script lang="ts">
	import RankingForm from "$lib/components/RankingForm.svelte";
	import { shiftRankingSchema } from "$lib/forms.js";
	import { superForm } from "sveltekit-superforms/client";

    export let data;

    const {session} = data;
    const {shifts} = session;

	const shiftRankingForm = superForm(data.shiftRankingForm, {
		validators: shiftRankingSchema,
		dataType: 'json',
        onResult(event) {
            console.log(event.result)
        },
	});
</script>

<RankingForm original={data.shiftRankingForm.data} {shiftRankingForm} {shifts} />