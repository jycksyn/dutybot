<script lang="ts">
	import ModalSignOut from '$lib/components/ModalSignOut.svelte';
	import { modalStore } from '@skeletonlabs/skeleton';

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
	<button on:click={openSignOut} class="btn variant-filled-secondary">Sign Out</button>
</div>
