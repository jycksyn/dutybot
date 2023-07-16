<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton';
	import { Eye, Plus, Star } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';

	export let data;

	const { memberOf } = data;
</script>

<header class="flex flex-row justify-between">
	<h2 class="h2 font-semibold">Groups</h2>
	<a class="btn variant-filled-primary" href="/dashboard/group/new">
		<Icon class="h-6 mr-2 -ml-2" src={Plus} />
		New Group
	</a>
</header>

<ul class="list m-8 flex flex-col gap-2">
	{#each memberOf as member (member.group.id)}
		{@const group = member.group}
		<li>
			<Avatar width="w-14" initials={group.emoji} />
			<div class="flex flex-col flex-auto">
				<span class="text-lg">{group.name}</span>
				{#if member.is_admin}
				<span class="flex flex-row items-center text-secondary-600-300-token"
					>
					<Icon src={Star} class="fill-current h-4 w-4 mr-1" />
					Admin</span
				>
				{/if}
			</div>
			<a href={`/dashboard/group/${group.id}`} class="btn btn-sm variant-soft-primary">
				<Icon class="h-6 mr-2 -ml-1" src={Eye} />
				Details
			</a>
		</li>
	{/each}
</ul>
