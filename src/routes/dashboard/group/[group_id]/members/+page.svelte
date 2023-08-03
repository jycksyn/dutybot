<script lang="ts">
	import Gravatar from '$lib/components/Gravatar.svelte';
	import { ChatBubbleBottomCenterText, Pencil, Star } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';

	export let data;

	$: ({
		originalMembers: { members },
        is_admin
	} = data);
</script>

<dl class="list-dl p-4">
	{#each members as member, i (member.email)}
		<div class="p-4 flex-wrap gap-4 [&>*]:!m-0">
			<Gravatar email={member.email} />
			<span class="flex-auto">
				<dt>
					{member.name}
				</dt>
				<dd class="text-sm text-gray-500">{member.email}</dd>
			</span>
			<div class="flex flex-row gap-2">
				{#if member.is_respondent}
					<span class="text-sm text-primary-700-200-token flex flex-row items-center">
						<Icon class="h-4 mr-2" src={ChatBubbleBottomCenterText} />
						Respondent
					</span>
				{/if}
				{#if member.is_admin}
					<span class="text-sm text-primary-700-200-token flex flex-row items-center">
						<Icon class="h-4 mr-2" src={Star} />
						Admin
					</span>
				{/if}
			</div>
		</div>
	{/each}
</dl>

{#if is_admin}
	<a href="./members/edit" class="btn bg-initial text-primary-500-400-token w-full">
		<span class="flex flex-row justify-center items-center">
			<Icon src={Pencil} class="h-4" />
			New Shift Type
		</span>
	</a>
{/if}
