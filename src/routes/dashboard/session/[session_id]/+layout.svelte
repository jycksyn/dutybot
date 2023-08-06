<script lang="ts">
	import BackButton from '$lib/components/BackButton.svelte';
	import { prettyDate } from '$lib/dates';
	import { TabAnchor } from '@skeletonlabs/skeleton';
	import { TabGroup } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { UserGroup } from '@steeze-ui/heroicons';

	export let data;

	const { session } = data;

	const SUBPAGES = [['Calendar', `/dashboard/session/${session.id}/calendar`]];
</script>

<div class="flex flex-col gap-4">
	<header class="flex flex-row justify-start">
		<BackButton />
		<h2 class="h2 font-semibold">Session Details</h2>
	</header>

	<section>
		<h4 class="h4 mt-4">
			<a href="/dashboard/group/{session.group_id}/sessions">
				<Icon class="h-6 w-6 inline stroke-gray-500" src={UserGroup} />
				{session.group.name}
			</a>
		</h4>
		<h3 class="h3 mb-4 font-bold">{prettyDate(session.start)} - {prettyDate(session.end)}</h3>
	</section>

	<TabGroup justify="justify-center">
		{#each SUBPAGES as [title, href]}
			<TabAnchor {href} selected={$page.url.pathname.slice(0, href.length) === href}>
				{title}
			</TabAnchor>
		{/each}
	</TabGroup>

	<slot />
</div>
