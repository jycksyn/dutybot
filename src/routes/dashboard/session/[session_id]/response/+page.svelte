<script lang="ts">
	import RankingForm from "$lib/components/RankingForm.svelte";

    export let data;

    $: ({session, shiftRankingForm} = data);
    $: ({shifts} = session);
</script>

<RankingForm validated={shiftRankingForm} {shifts} />