<script lang="ts">
	import { page } from "$app/stores";
	import BackButton from '$lib/components/BackButton.svelte';
	import UserPicker from '$lib/components/UserPicker.svelte';
	import TextField from '$lib/components/ui/TextField.svelte';
	import { groupSchema } from '$lib/forms';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';

	export let data: PageData;

	const groupForm = superForm(data.groupForm, {
		validators: groupSchema,
        dataType: 'json'
	});

	const { 
		enhance, 
		allErrors, 
		message
	} = groupForm;
</script>

<header class="flex flex-row justify-start mb-4">
	<BackButton href="/dashboard/group" />
	<h2 class="h2 font-semibold">New Group</h2>
</header>

<form
	action="?/newgroup"
	use:enhance
	class="flex items-stretch justify-center flex-col gap-4"
	method="post"
>
	<TextField form={groupForm} field="name" placeholder="Choose a name for the group" />
	<TextField form={groupForm} field="emoji" />
    <UserPicker form={groupForm} {data} />
    <button type="submit" disabled={!!$allErrors?.length} class="btn variant-filled-secondary">Submit</button>
</form>

{#if $message}
  <div class:text-success-500-400-token={$page.status == 200} class:text-error-500-400-token={$page.status >= 400}>
    {$message}
  </div>
{/if}