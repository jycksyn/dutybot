<script lang="ts">
	import ModalNewSession from '$lib/components/ModalNewSession.svelte';
	import { sessionName } from '$lib/dates.js';
	import { newSessionSchema } from '$lib/forms.js';
	import { modalStore } from '@skeletonlabs/skeleton';
	import { Eye, Plus } from '@steeze-ui/heroicons';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { superForm } from 'sveltekit-superforms/client';

	export let data;

	const sessionForm = superForm(data.sessionForm, {
		validators: newSessionSchema,
		invalidateAll: false
	});

	$: ({ sessions, is_admin } = data);

	const openNewSession = () => {
		modalStore.trigger({
			type: 'component',
			component: {
				ref: ModalNewSession,
				props: {
					sessionForm
				}
			}
		});
	};
</script>

<ul class="list m-8 flex flex-col gap-2">
	{#each sessions as session (session.id)}
		<li>
			<div class="flex flex-col flex-auto">
				<span class="text-lg">{sessionName(session)}</span>
			</div>
			<a href={`/dashboard/session/${session.id}`} class="btn btn-sm variant-soft-primary">
				<Icon class="h-6 mr-2 -ml-1" src={Eye} />
				Details
			</a>
		</li>
	{/each}
</ul>

{#if is_admin}
	<button on:click={openNewSession} class="btn bg-initial text-primary-500-400-token w-full">
		<span class="flex flex-row justify-center items-center">
			<Icon src={Plus} class="h-4" />
			New Session
		</span>
	</button>
{/if}
