<script>
	import UserPicker from "$lib/components/UserPicker.svelte";
	import { membersUpdateSchema } from "$lib/forms";
	import { superForm } from "sveltekit-superforms/client";
    export let data;

    const groupForm = superForm(data.groupForm, {
        validators: membersUpdateSchema,
        dataType: 'json'
    });

    const { 
        enhance, 
        allErrors, 
        message
    } = groupForm;

</script>

<main class="m-8">
<UserPicker {data} form={groupForm} />
</main>