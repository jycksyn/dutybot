<script lang="ts">
	import BackButton from '$lib/components/BackButton.svelte';
	import { TabGroup, TabAnchor } from '@skeletonlabs/skeleton';
	import { Icon } from '@steeze-ui/svelte-icon';
	import {page} from '$app/stores';

    export let data;
    const {user, group} = data;

	const SUBPAGES = [
		['Sessions', `/dashboard/group/${group.id}/sessions`],
		['Members', `/dashboard/group/${group.id}/members`],
	]
</script>

<header class="flex flex-row justify-start mb-4">
	<BackButton href="/dashboard/group" />
	<h2 class="h2 font-semibold">Group Details</h2>
</header>

<h3 class="h3 mb-4">{group.emoji} {group.name}</h3>

<TabGroup justify="justify-center">
	{#each SUBPAGES as [title, href]}
		<TabAnchor {href} selected={$page.url.pathname.slice(0, href.length) === href}>
			{title}
		</TabAnchor>
	{/each}
</TabGroup>