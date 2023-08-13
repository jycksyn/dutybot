<script>
	import { Avatar, ProgressRadial } from '@skeletonlabs/skeleton';
	import { Star } from '@steeze-ui/heroicons';
	import Icon from '$lib/components/Icon.svelte';
</script>

<h2 class="h2 font-semibold">Sessions</h2>

<ul class="list m-8">
	<li>
		<div class="relative">
			<Avatar class="absolute top-0 left-0" width="w-14" initials="A" />
			<ProgressRadial class="absolute z-2 top-0 left-0" width="w-14" value={50} />
		</div>
		<div class="flex flex-col flex-auto">
			<span class="font-bold">May 21 - June 21</span>
			<span class="flex flex-row items-center"
				><Icon src={Star} class="fill-current h-4 w-4 mr-2 text-secondary-500-400-token" /> Chandrum
				RAs</span
			>
		</div>
		<span>...</span>
	</li>
</ul>
