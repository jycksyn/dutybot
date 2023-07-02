<script>
	import { Plus } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
</script>

<header class="flex flex-row justify-between">
	<h2 class="h2 font-semibold">Groups</h2>
	<a class="btn variant-filled-primary" href="/dashboard/group/new">
		<Icon class="h-6 mr-2 -ml-2" src={Plus} />
		New Group
    </a>
</header>
