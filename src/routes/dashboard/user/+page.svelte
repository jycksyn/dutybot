<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import ModalSignOut from '$lib/components/ModalSignOut.svelte';
	import { modalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';

	const openSignOut = () => {
		modalStore.trigger({
			type: 'component',
			component: {
				ref: ModalSignOut
			}
		});
	};

    const test: ModalSettings = {
			type: 'confirm',
			// Data
			title: 'Please Confirm',
			body: 'Are you sure you wish to proceed?',
			// TRUE if confirm pressed, FALSE if cancel pressed
			response: (r: boolean) => console.log('response:', r)
		};

	const openTest = () => {
		modalStore.trigger(test);
	};
</script>

<div class="flex flex-col gap-4">
	<h2 class="h2 font-semibold">Profile</h2>

	<form>
		<Button on:click={openTest} intent="secondary" fullWidth>Sign Out</Button>
		<Button on:click={openSignOut} intent="secondary" fullWidth>Sign Out</Button>
	</form>
</div>
