<script lang="ts">

	import { AppRailAnchor } from "@skeletonlabs/skeleton";
	import { Icon } from "@steeze-ui/svelte-icon";
    import type { IconSource } from "@steeze-ui/heroicons/types";
    import { page } from "$app/stores";

    export let icon: IconSource;
    export let href: string;

    $: selected = $page.url.pathname.slice(0, href.length) === href;
</script>

<AppRailAnchor {href} {selected}>
    <svelte:fragment slot="lead">
        <Icon class="h-6" src={icon} />
    </svelte:fragment>
    <span>
        <slot />
    </span>
</AppRailAnchor>