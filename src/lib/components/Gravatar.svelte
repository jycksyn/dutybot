<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton';
	import md5 from 'md5';
	import type { ComponentProps } from "svelte";

    interface $$Props extends ComponentProps<Avatar> {
        class?: String,
        email: string | null | undefined
    };

    export let email: $$Props['email'] = "";

    $: src = email ? `https://www.gravatar.com/avatar/${md5(email.trim().toLowerCase())}` : "";
</script>

<Avatar {src} initials="?" {...$$props} />