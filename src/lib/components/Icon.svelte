<script lang="ts">
	import { Icon } from "@steeze-ui/svelte-icon";
	import type { ComponentProps } from "svelte";
	import type { SVGAttributes } from "svelte/elements";

    interface $$Props extends ComponentProps<Icon>, SVGAttributes<SVGElement> {};

    const {...restProps} = $$props as $$Props;
</script>

<Icon height="auto" width="auto" {...restProps} />