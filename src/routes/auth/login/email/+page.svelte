<script lang="ts">
	import Gravatar from '$lib/components/Gravatar.svelte';
	import TextField from '$lib/components/ui/TextField.svelte';
	import { emailUserLoginSchema } from '$lib/forms.js';
	import { superForm } from 'sveltekit-superforms/client';

    export let data;
    const form = superForm(data.form, {
        validators: emailUserLoginSchema
    });

    const {enhance, form: formStore, allErrors, message, errors} = form;
</script>

<h2 class="h2">Log In with Email</h2>

<form use:enhance class="flex items-stretch justify-center flex-col gap-4" method="post">
	<TextField {form} field="email" />

	<TextField {form} type="password" field="password" />

  {#if $errors._errors}<span class="text-red-600">{$errors._errors}</span>{/if}
  <button disabled={!!$allErrors.length} class="btn variant-filled-secondary">Sign Up</button>
	{#if $message}
		<small class="text-red-600">{$message}</small>
	{/if}
</form>

<p class="text-center">
    No account yet?
    <a class="anchor" href="/auth/signup"> Sign up now!</a>
</p>
