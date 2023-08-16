<script>
	import SessionConstraintsTable from '$lib/components/SessionConstraintsTable.svelte';
import SessionSettingsForm from '$lib/components/SessionSettingsForm.svelte';
	import { SlideToggle } from '@skeletonlabs/skeleton';

	export let data;
</script>

<SessionSettingsForm {data} />