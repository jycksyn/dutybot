<script lang="ts">
	import { cva, type VariantProps } from 'class-variance-authority';

	const button = cva('rounded-lg border-0 p-0 cursor-pointer outline-offset-1', {
		variants: {
			intent: {
				primary: 'bg-primary-950',
				secondary: 'bg-secondary-700',
				tertiary: 'bg-tertiary-950'
			}
		}
	});

    const inner = cva("block py-2 px-8 rounded-lg text-xl text-white -translate-y-1.5 active:-translate-y-1 focus:[&>:not(focus-visible)]:outline-none transition transform duration-150 hover:-translate-y-2 ease-cy", {
		variants: {
			intent: {
				primary: 'bg-primary-800',
				secondary: 'bg-secondary-500',
				tertiary: 'bg-tertiary-800'
			}
		}
	});

	interface $$Props extends VariantProps<typeof button> {}

	export let intent: $$Props['intent'] = 'primary';
</script>

<button {...$$props} class={button({intent, class: $$props.class})}>
	<span
		class={inner({intent})}
	>
		<slot />
	</span>
</button>
