<script lang="ts">
	import Gravatar from '$lib/components/Gravatar.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import type { PageData } from './$types';
	import { userInfoSchema } from '$lib/forms';
	import TextField from '$lib/components/ui/TextField.svelte';

	export let data: PageData;

	const { form, enhance, errors } = superForm(data.form, {
		validators: userInfoSchema
	});
</script>

<!-- <SuperDebug data={{$form, $errors}} /> -->

<h2 class="h2">Complete your profile</h2>

<form use:enhance class="flex items-stretch justify-center flex-col gap-4" method="post">
	<TextField
		label="Name"
		placeholder="John Doe"
		bind:value={$form.name}
		bind:errors={$errors.name}
	/>

	<div class="grid grid-cols-4 items-center justify-items-stretch">
		<Gravatar class="col-span-1" email={$form.email} />
		<TextField
			label="Email"
			class="col-span-3"
			placeholder=""
			bind:value={$form.email}
			bind:errors={$errors.email}
		/>
	</div>

	<Button intent="secondary">Submit</Button>
</form>
