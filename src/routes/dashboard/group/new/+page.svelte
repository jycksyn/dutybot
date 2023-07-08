<script lang="ts">
	import BackButton from '$lib/components/BackButton.svelte';
	import TextField from '$lib/components/ui/TextField.svelte';
	import { groupSchema, searchUsersSchema } from '$lib/forms';
	import { superForm } from 'sveltekit-superforms/client';
	import type { PageData } from './$types';
	import UserPicker from '$lib/components/UserPicker.svelte';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	export let data: PageData;

	const groupForm = superForm(data.groupForm, {
		validators: groupSchema,
        dataType: 'json'
	});

	const { enhance: groupEnhance, allErrors, errors, form } = groupForm;
</script>

<header class="flex flex-row justify-start mb-4">
	<BackButton href="/dashboard/group" />
	<h2 class="h2 font-semibold">New Group</h2>
</header>

<form
	action="?/newgroup"
	use:groupEnhance
	class="flex items-stretch justify-center flex-col gap-4"
	method="post"
>
	<TextField form={groupForm} field="name" placeholder="Choose a name for the group" />
	<TextField form={groupForm} field="emoji" />
    <UserPicker form={groupForm} {data} />
    <button disabled={!!$allErrors?.length} class="btn variant-filled-secondary">Submit</button>
</form>