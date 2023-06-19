<script lang="ts">
    import { cva, type VariantProps } from 'class-variance-authority';
    import type { HTMLInputAttributes } from "svelte/elements";
    import {omit} from "lodash";

	interface $$Props extends HTMLInputAttributes {
        label: string,
        errors?: string[],
        class?: string
    }

    export let label: $$Props['label'];
    export let errors: $$Props['errors'] = undefined;
    export let value = "";
</script>


<label class={cva("label flex flex-col items-stretch")({ class: $$restProps.class })}>
	<span>{label}</span>
	<input {...$$restProps} bind:value class:input-error={errors?.length} type="text" class="input"/>
	{#each errors ?? [] as error} 
        <small class="text-red-600">{error}</small>
    {/each}
</label>