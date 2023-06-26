<script lang="ts">
    import type { HTMLButtonAttributes, HTMLAnchorAttributes } from "svelte/elements";
	import { cva, type VariantProps } from 'class-variance-authority';

	const button = cva('btn text-primary-50-900-token', {
		variants: {
			intent: {
				primary: 'bg-primary-700-200-token',
				secondary: 'bg-secondary-700-200-token',
				tertiary: 'bg-tertiary-700-200-token',
				success: 'bg-success-700-200-token',
			},
			disabled: {
				true: 'disabled'
			},
			fullWidth: {
				true: 'self-stretch w-auto'
			}
		}
	});

	interface $$Props extends HTMLAnchorAttributes, VariantProps<typeof button> {}

	export let intent: $$Props['intent'] = 'primary';
	export let disabled: $$Props['disabled'] = false;
	export let fullWidth: $$Props['fullWidth'] = false;
</script>

<button on:click {disabled} {...$$props} class={button({ intent, disabled, fullWidth, class: $$props.class })}>
	<slot />
</button>
