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
</script>

<div class="flex flex-col gap-4">
	<h2 class="h2 font-semibold">Profile</h2>
	<Button on:click={openSignOut} intent="secondary" fullWidth>Sign Out</Button>
</div>
