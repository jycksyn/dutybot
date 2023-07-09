<script lang="ts">
	import BackButton from '$lib/components/BackButton.svelte';

    export let data;
    const {user, group} = data;
</script>

<header class="flex flex-row justify-start mb-4">
	<BackButton href="/dashboard/group" />
	<h2 class="h2 font-semibold">{group.name}</h2>
</header>