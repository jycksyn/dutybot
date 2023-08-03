<script lang="ts">
	import type { newSessionSchema } from '$lib/forms';
	import { modalStore } from '@skeletonlabs/skeleton';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	export let sessionForm: SuperForm<typeof newSessionSchema>;

	const { enhance, form, errors, allErrors, constraints } = sessionForm;
</script>

{#if $modalStore[0]}
	<div class="card p-4 w-modal shadow-xl space-y-4">

		<h2 class="text-2xl font-bold">New Session</h2>

		<form action="?/newsession" method="post" use:enhance class="space-y-4">
			
		</form>

	</div>
{/if}
