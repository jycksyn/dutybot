<script lang="ts">
	import Gravatar from '$lib/components/Gravatar.svelte';
	import LoadingButtonText from '$lib/components/LoadingButtonText.svelte';
	import TextField from '$lib/components/ui/TextField.svelte';
	import { emailUserSignupSchema } from '$lib/forms.js';
	import { superForm } from 'sveltekit-superforms/client';

    export let data;
    const form = superForm(data.form, {
        validators: emailUserSignupSchema
    });

    const {enhance, form: formStore, allErrors, message, errors, delayed} = form;
</script>

<h2 class="h2">Sign up with Email</h2>

<form use:enhance class="flex items-stretch justify-center flex-col gap-4" method="post">
	<TextField {form} field="name" />

	<div class="grid grid-cols-4 items-center justify-items-stretch">
		<Gravatar class="col-span-1" email={$formStore.email} />
		<TextField {form} field="email" class="col-span-3" />
	</div>

	<TextField {form} type="password" field="password" />
	<TextField label="Confirm Password" {form} type="password" field="confirmPassword" />

  {#if $errors._errors}<span class="text-red-600">{$errors._errors}</span>{/if}
  <button disabled={!!$allErrors.length} class="btn variant-filled-secondary">
	<LoadingButtonText d={$delayed}>Sign Up</LoadingButtonText>
  </button>
	{#if $message}
		<small class="text-red-600">{$message}</small>
	{/if}
</form>