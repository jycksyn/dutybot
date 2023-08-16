<script lang="ts">
	import Gravatar from '$lib/components/Gravatar.svelte';
	import TextField from '$lib/components/ui/TextField.svelte';
	import { userInfoSchema } from '$lib/forms';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	const form = superForm(data.form, {
		validators: userInfoSchema
	});

	const {enhance, form: formStore, allErrors, message} = form;
</script>

<SuperDebug data={$formStore} />

<h2 class="h2">Complete your profile</h2>

<form use:enhance class="flex items-stretch justify-center flex-col gap-4" method="post">
	<TextField {form} field="name" />

	<div class="grid grid-cols-4 items-center justify-items-stretch">
		<Gravatar class="col-span-1" email={$formStore.email} />
		<TextField readonly {form} field="email" class="col-span-3" />
	</div>

	<button disabled={!!$allErrors.length} class="btn variant-filled-secondary">Submit</button>
	{#if $message}
		<small class="text-red-600">{$message}</small>
	{/if}
</form>
