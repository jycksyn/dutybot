<script>
	import { setContext } from 'svelte';
	import "../app.css"
	import "../theme.css"

	// Your selected Skeleton theme:
	// import '@skeletonlabs/skeleton/themes/theme-gold-nouveau.css';

	// This contains the bulk of Skeletons required styles:
	import '@skeletonlabs/skeleton/styles/skeleton.css';
	import { Modal } from '@skeletonlabs/skeleton';

	// Finally, your application's global stylesheet (sometimes labeled 'app.css')
	// import '../app.postcss';

	export let data;

	setContext('seed', data.seed);
</script>

<Modal />

<slot />
