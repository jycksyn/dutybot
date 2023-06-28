<script lang="ts">
    import type { HTMLButtonAttributes, HTMLAnchorAttributes } from "svelte/elements";
	import { cva, type VariantProps } from 'class-variance-authority';

	const button = cva('btn', {
		variants: {
			intent: {
				primary: [],
				secondary: [],
				tertiary: []
			},
			disabled: {
				true: 'disabled'
			},
			fullWidth: {
				true: 'self-stretch w-auto'
			},
			ghost: {
				true: []
			}
		},
		compoundVariants: [
			{
				intent: "primary",
				ghost: true,
				class: "variant-ghost-primary"
			},
			{
				intent: "secondary",
				ghost: true,
				class: "variant-ghost-secondary"
			},
			{
				intent: "tertiary",
				ghost: true,
				class: "variant-ghost-tertiary"
			},
			{
				intent: "primary",
				ghost: false,
				class: "variant-filled-primary"
			},
			{
				intent: "secondary",
				ghost: false,
				class: "variant-filled-secondary"
			},
			{
				intent: "tertiary",
				ghost: false,
				class: "variant-filled-tertiary"
			},
		]
	});

	type $$Props = (HTMLButtonAttributes | HTMLAnchorAttributes) & VariantProps<typeof button>;

	export let intent: $$Props['intent'] = 'primary';
	export let disabled: $$Props['disabled'] = false;
	export let fullWidth: $$Props['fullWidth'] = false;
	export let ghost: $$Props['ghost'] = false;

	$: className = button({ ghost, intent, disabled, fullWidth, class: $$props.class });
</script>

{#if $$props.href}
<a href={disabled ? '#' : $$props.href} {...$$props} class={className}>
	<slot />
</a>
{:else}
<button on:click {disabled} {...$$props} class={className}>
	<slot />
</button>
{/if}
