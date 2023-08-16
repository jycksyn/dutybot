<script lang="ts">
	import { cva } from 'class-variance-authority';

	import type { z, AnyZodObject } from 'zod';
	import type { ZodValidation, FormPathLeaves } from 'sveltekit-superforms';
	import { formFieldProxy, type SuperForm } from 'sveltekit-superforms/client';

	type T = $$Generic<AnyZodObject>;

	export let form: SuperForm<ZodValidation<T>, unknown>;
	export let field: FormPathLeaves<z.infer<T>>;
	export let label: string | undefined = undefined;
  export let placeholder: string = '';

	const { value, errors, constraints } = formFieldProxy(form, field);
</script>

<label class={cva('label flex flex-col items-stretch')({ class: $$restProps.class })}>
    <span class="capitalize">{label ?? field}</span>
    <input
      {placeholder}
      name={field}
      type="text"
      aria-invalid={$errors ? 'true' : undefined}
      bind:value={$value}
      {...$constraints}
      {...$$restProps}
      class:opacity-50={$$restProps.readonly}
      class="input"
  />
  {#if $errors}<span class="text-red-600">{$errors}</span>{/if}
  </label>