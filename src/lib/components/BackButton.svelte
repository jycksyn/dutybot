<script lang="ts">
	import { ArrowLeft } from "@steeze-ui/heroicons";


	import { Icon } from "@steeze-ui/svelte-icon";

    export let href: string;
</script>
<a class="btn-icon bg-initial mr-4" {href}>
    <Icon class="h-6 text-gray-500 font-bold" src={ArrowLeft} />
</a>