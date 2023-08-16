<script lang="ts">
	import { dueDateSchema } from '$lib/forms';
	import type { SuperValidated } from 'sveltekit-superforms';

	import { SlideToggle } from '@skeletonlabs/skeleton';
	import { isEqual } from 'lodash';
	import { superForm } from 'sveltekit-superforms/client';

	export let data: {
		dueDateForm: SuperValidated<typeof dueDateSchema>;
	};

	export let dueDateForm = superForm(data.dueDateForm, {
		validators: dueDateSchema
	});

	$: ({ form, constraints, enhance, allErrors } = dueDateForm);

	
	$: original = data.dueDateForm.data;
	$: changed = !isEqual(original, $form);
</script>

<form use:enhance method="POST" action="?/updateSessionSettings" class="flex flex-col gap-4">
	<fieldset class="flex flex-row justify-center">
		<SlideToggle bind:checked={$form.openForResponses} name="openForResponses">
			<p>
				{#if $form.openForResponses}
					<span class="font-bold"> This session is open for responses. </span>
				{:else}
					This session is not accepting responses.
				{/if}
			</p>
		</SlideToggle>
	</fieldset>

	<label for="dueDate">
		Due Date
		<input
			bind:value={$form.dueDate}
			id="dueDate"
			name="dueDate"
			type="date"
			class="input col-span-5"
			{...$constraints.dueDate}
		/>
	</label>

	<button disabled={!changed || !!$allErrors.length} class="btn variant-filled-primary">
		<span class="flex flex-row justify-center items-center">
			Save Changes
		</span>
	</button>
</form>
