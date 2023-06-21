<script lang="ts">
    import { cva, type VariantProps } from 'class-variance-authority';
    import type { HTMLAnchorAttributes } from "svelte/elements";

	const button = cva('btn variant-filled text-primary-50-900-token', {
		variants: {
			intent: {
				primary: 'bg-primary-700-200-token',
				secondary: 'bg-secondary-700-200-token',
				tertiary: 'bg-tertiary-700-200-token',
				success: 'bg-success-700-200-token',
			},
			disabled: {
				true: 'disabled'
			}
		}
	});

	interface $$Props extends HTMLAnchorAttributes, VariantProps<typeof button> {}

	export let intent: $$Props['intent'] = 'primary';
	export let disabled: $$Props['disabled'] = false;
</script>

<a href={disabled ? '#' : $$props.href} {...$$props} class={button({ intent, class: $$props.class })}>
	<slot />
</a>
