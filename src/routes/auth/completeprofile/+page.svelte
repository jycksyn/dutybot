<script lang="ts">
	import Gravatar from '$lib/components/Gravatar.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import type { PageData } from './$types';
	import { userInfoSchema } from '$lib/forms';
	import TextField from '$lib/components/ui/TextField.svelte';

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
		<TextField {form} field="email" class="col-span-3" />
	</div>

	<Button disabled={!!$allErrors.length} intent="secondary">Submit</Button>
	{#if $message}
		<small class="text-red-600">{$message}</small>
	{/if}
</form>
