<script lang="ts">
	import BackButton from "$lib/components/BackButton.svelte";
	import { prettyDate } from "$lib/dates";

    export let data;

    const {session} = data;
</script>

<header class="flex flex-row justify-start mb-4">
	<BackButton />
	<h2 class="h2 font-semibold">Session Details</h2>
</header>

<h4 class="h4 mt-4">{session.group.name}</h4>
<h3 class="h3 mb-4 font-bold">{prettyDate(session.start)} - {prettyDate(session.end)}</h3>

<slot />