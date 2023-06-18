<script lang="ts">
    import type { HTMLButtonAttributes, HTMLAnchorAttributes } from "svelte/elements";
	import { cva, type VariantProps } from 'class-variance-authority';

	const button = cva('btn variant-filled text-primary-50-900-token ring-2 ring-white', {
		variants: {
			intent: {
				primary: 'bg-primary-700-200-token',
				secondary: 'bg-secondary-700-200-token',
				tertiary: 'bg-tertiary-700-200-token',
				success: 'bg-success-700-200-token',
			},
		}
	});

	interface $$Props extends HTMLAnchorAttributes, VariantProps<typeof button> {}

	export let intent: $$Props['intent'] = 'primary';
</script>

<a href={$$props.href} {...$$props} class={button({ intent, class: $$props.class })}>
	<slot />
</a>
