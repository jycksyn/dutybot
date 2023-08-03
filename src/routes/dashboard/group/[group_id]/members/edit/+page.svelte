<script>
	import UserPicker from '$lib/components/UserPicker.svelte';
	import { membersUpdateSchema } from '$lib/forms';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	export let data;
	import { isEqual } from 'lodash';
	import { redirect } from '@sveltejs/kit';
	import { goto } from '$app/navigation';

	const groupForm = superForm(data.groupForm, {
		validators: membersUpdateSchema,
		dataType: 'json'
	});

	const { enhance, allErrors, form } = groupForm;

	$: changed = !isEqual(data.originalMembers, $form);
</script>

<main class="m-8">
	<form method="post" use:enhance action="?/updategroup" class="flex flex-col gap-2">
		<UserPicker {data} form={groupForm} />
		<button disabled={!!$allErrors.length || !changed} class="btn variant-filled-primary w-full"
			>Update Group</button
		>
	</form>
</main>
